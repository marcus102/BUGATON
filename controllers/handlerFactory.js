const mongoose = require('mongoose');
const fs = require('fs');
const APIFeatures = require('./../utils/apiFeatures');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(appError('No document found with that ID! ', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      return next(appError('No document found with that ID!', 404));
    }
    res.status(200).json({
      status: 'success',
      data: doc
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: doc
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) {
      if (Array.isArray(populateOptions)) {
        populateOptions.forEach(option => {
          query = query.populate(option);
        });
      } else {
        query = query.populate(populateOptions);
      }
    }

    const doc = await query;

    if (!doc) {
      return next(appError('No document found with that ID! ', 404));
    }

    res.status(200).json({
      status: 'success',
      requested_at: req.requestTime,
      data: doc
    });
  });

exports.getAll = (Model, excludedIdsParam) =>
  catchAsync(async (req, res, next) => {
    let filter = null;
    const excludedIds = req.body[excludedIdsParam];

    if (excludedIds && excludedIds.length > 0) {
      filter = {
        user: { $nin: excludedIds }
      };
    }

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE

    res.status(200).json({
      status: 'success',
      requested_at: req.requestTime,
      result: doc.length,
      data: doc
    });
  });

exports.blocksHandler = (Model, target) =>
  catchAsync(async (req, res, next) => {
    const blockers = await Model.aggregate([
      {
        $match: {
          blockedUser: new mongoose.Types.ObjectId(req.user.id)
        }
      }
    ]);

    const blocked = await Model.aggregate([
      {
        $match: {
          blockedBy: new mongoose.Types.ObjectId(req.user.id)
        }
      }
    ]);

    if ((blockers.length || blocked.length) === 0) {
      return next();
    }

    const blockersIds = blockers.reduce((acc, doc) => {
      if (doc.blockedBy) {
        acc.push(doc.blockedBy.valueOf());
      }
      return acc;
    }, []);

    const blokedIds = blocked.reduce((acc, doc) => {
      if (doc.blockedUser) {
        acc.push(doc.blockedUser.valueOf());
      }
      return acc;
    }, []);

    req.body[target] = [...blockersIds, ...blokedIds];

    next();
  });

exports.handleBugAssignment = (operation, userDB, bugReportDB) =>
  catchAsync(async (req, res, next) => {
    const { assigneeId, id } = req.params;
    const bug = await bugReportDB.findById(id);
    const userExist = await userDB.findById(assigneeId);

    if (!(bug && userExist)) {
      return next(appError('Document not found', 404));
    }

    const { assignedTo } = bug;

    if (operation === 'assign') {
      if (assignedTo) {
        const assignedToIds = assignedTo.map(user => user._id.toString());
        if (assignedToIds.includes(assigneeId)) {
          return next(appError('Bug already assigned to user', 409));
        }
      }

      await bugReportDB.updateOne({ _id: id }, { $push: { assignedTo: assigneeId } });
    } else if (operation === 'deassign') {
      if (!assignedTo) {
        return next(appError('Bug has not been assigned to a user yet!', 404));
      }

      const assignedToIds = assignedTo.map(user => user._id.toString());
      if (!assignedToIds.includes(assigneeId)) {
        return next(appError('Bug already deassigned from user', 404));
      }

      await bugReportDB.updateOne({ _id: id }, { $pull: { assignedTo: assigneeId } });
    }

    const updatedBug = await bugReportDB.findById(id);

    res.status(200).json({
      status: 'success',
      data: updatedBug
    });
  });

exports.deleteMany = (Model, field, setIds, UserModel) =>
  catchAsync(async (req, res, next) => {
    if (!req.params.id) {
      return next(appError('Something went wrong! ID not found!', 404));
    }

    const docToDelete = await Model.aggregate([
      {
        $match: {
          [field]: new mongoose.Types.ObjectId(req.params.id)
        }
      }
    ]);

    if (docToDelete.length === 0) {
      return next();
    }

    const deletedCount = docToDelete.length;

    if (setIds && setIds === true) {
      const bugFixIds = docToDelete.reduce((acc, doc) => {
        if (doc._id) {
          acc.push(doc._id);
        }
        return acc;
      }, []);

      req.body.ids = bugFixIds;
    }

    const docIdsToDelete = docToDelete.map(doc => doc._id);

    const deletionResult = await Model.deleteMany({
      _id: { $in: docIdsToDelete }
    });

    if (!deletionResult.deletedCount > 0) {
      return next(appError('Failed to delete documents!', 500));
    }

    let fieldCount;
    if (field === 'bugReport') {
      fieldCount = 'bugReportCount';
    } else if (field === 'bugFix') {
      fieldCount = 'bugFixesCount';
    } else if (field === 'reusableCode') {
      fieldCount = 'reusableCodeCount';
    }

    if (UserModel === true) {
      await User.findByIdAndUpdate(req.user.id, { $inc: { [fieldCount]: -deletedCount } });
    }

    next();
  });

exports.deleteManyImages = (Model, field) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
      return next(appError('Something went wrong! ID not found!', 404));
    }

    const imagesToDelete = await Model.aggregate([
      {
        $match: {
          [field]: new mongoose.Types.ObjectId(id)
        }
      }
    ]);

    if (imagesToDelete.length === 0) {
      return next();
    }

    try {
      await Promise.all(
        imagesToDelete.map(async image => {
          await fs.unlink(image.imageUrl, err => {
            if (err) throw err;
          });
          await Model.findByIdAndDelete(image._id);
        })
      );
    } catch (error) {
      return next(appError('Failed to delete images!', 500));
    }

    next();
  });

exports.deleteArray = (Model, field) =>
  catchAsync(async (req, res, next) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return next(appError('Invalid or empty array of IDs provided!', 400));
    }

    const docToDelete = await Model.aggregate([
      {
        $match: {
          [field]: { $in: ids.map(id => new mongoose.Types.ObjectId(id)) }
        }
      }
    ]);

    if (docToDelete.length === 0) {
      return next();
    }

    const docIdsToDelete = docToDelete.map(doc => doc._id);

    const deletionResult = await Model.deleteMany({
      _id: { $in: docIdsToDelete }
    });

    if (!deletionResult.deletedCount > 0) {
      return next(appError('Failed to delete documents!', 500));
    }

    next();
  });

exports.deleteArrayImages = (Model, field) =>
  catchAsync(async (req, res, next) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return next(appError('Invalid or empty array of IDs provided!', 400));
    }

    const imageToDelete = await Model.aggregate([
      {
        $match: {
          [field]: { $in: ids.map(id => new mongoose.Types.ObjectId(id)) }
        }
      }
    ]);

    if (imageToDelete.length === 0) {
      return next();
    }

    try {
      await Promise.all(
        imageToDelete.map(async image => {
          await fs.unlink(image.imageUrl, err => {
            if (err) throw err;
          });
          await Model.findByIdAndDelete(image._id);
        })
      );
    } catch (error) {
      return next(appError('Failed to delete images!', 500));
    }

    next();
  });

// const deleteArrayItems = (Model, field, additionalDeleteAction) =>
//   catchAsync(async (req, res, next) => {
//     const { ids } = req.body;

//     if (!ids || !Array.isArray(ids) || ids.length === 0) {
//       return next(appError('Invalid or empty array of IDs provided!', 400));
//     }

//     const itemsToDelete = await Model.aggregate([
//       {
//         $match: {
//           [field]: { $in: ids.map(id => new mongoose.Types.ObjectId(id)) }
//         }
//       }
//     ]);

//     if (itemsToDelete.length === 0) {
//       return next();
//     }

//     const itemIdsToDelete = itemsToDelete.map(item => item._id);

//     try {
//       if (additionalDeleteAction) {
//         await additionalDeleteAction(itemsToDelete);
//       }

//       const deletionResult = await Model.deleteMany({
//         _id: { $in: itemIdsToDelete }
//       });

//       if (!deletionResult.deletedCount > 0) {
//         return next(appError('Failed to delete documents!', 500));
//       }

//       next();
//     } catch (error) {
//       return next(appError('Failed to delete items!', 500));
//     }
//   });

// exports.deleteArray = (Model, field) => deleteArrayItems(Model, field, null);

// exports.deleteArrayImages = (Model, field) =>
//   deleteArrayItems(Model, field, async imageToDelete => {
//     await Promise.all(
//       imageToDelete.map(async image => {
//         await fs.unlink(image.imageUrl, err => {
//           if (err) throw err;
//         });
//         await Model.findByIdAndDelete(image._id);
//       })
//     );
//   });
