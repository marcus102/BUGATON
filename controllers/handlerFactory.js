const APIFeatures = require('./../utils/apiFeatures');
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
      return next(appError('No document found with that ID! ', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
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
      data: {
        data: doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // for nested get reviews
    // let filter = {};
    // if (req.params.id) {
    //   filter = { tour: req.params.id };
    // }
    const features = new APIFeatures(Model.find(), req.query)
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
      data: {
        data: doc
      }
    });
  });

exports.handleAssignment = (operation, userDB, bugReportDB) =>
  catchAsync(async (req, res, next) => {
    const bugId = req.body.bugReport;
    const { assigneeId } = req.params;
    const bug = await bugReportDB.findById(bugId);

    if (!bug) {
      return next(appError('Document not found', 404));
    }

    const userExists = await userDB.findById(assigneeId);

    if (!userExists) {
      return next(appError('User not found', 404));
    }

    if (operation === 'assign') {
      if (bug.assignedTo) {
        const assignedToIds = bug.assignedTo.map(user => user._id.toString());
        if (assignedToIds.includes(assigneeId)) {
          return next(appError('Bug already assigned to user', 409));
        }
      }

      await bugReportDB.updateOne(
        { _id: bugId },
        { $push: { assignedTo: assigneeId } }
      );
    } else if (operation === 'deassign') {
      if (!bug.assignedTo) {
        return next(appError('Bug has not been assigned to a user yet!', 404));
      }

      const assignedToIds = bug.assignedTo.map(user => user._id.toString());
      if (!assignedToIds.includes(assigneeId)) {
        return next(appError('Bug already deassigned from user', 404));
      }

      await bugReportDB.updateOne(
        { _id: bugId },
        { $pull: { assignedTo: assigneeId } }
      );
    }

    const updatedBug = await bugReportDB.findById(bugId);

    res.status(200).json({
      status: 'success',
      data: updatedBug
    });
  });
