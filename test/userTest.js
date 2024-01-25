// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const mongoose = require('mongoose');
// const app = require('./../app');
// const BugFixes = require('./../models/bugFixesModel');

// const { expect } = chai;

// chai.use(chaiHttp);

// describe('BugFix Controller', () => {
//   before(done => {
//     // Connect to the test database
//     mongoose.connect('mongodb://localhost:27017/testdb', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//     mongoose.connection.once('open', () => {
//       console.log('Connected to the test database');
//       done();
//     });
//   });

//   after(done => {
//     // Close the connection after tests
//     mongoose.connection.close(() => {
//       console.log('Connection closed');
//       done();
//     });
//   });

//   it('should create a new BugFix without id', done => {
//     chai
//       .request(app)
//       .post('/bugfixes')
//       .send({
//         solution: 'Test Solution',
//         description: 'Test Description',
//         result: 'Test Result',
//         user: 'Test User',
//         bugReport: 'Test Bug Report',
//         frameworkVersions: ['v1.0', 'v2.0']
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(201);
//         expect(res.body).to.be.an('object');
//         expect(res.body.status).to.equal('success');
//         expect(res.body.data).to.have.property('solution');
//         done();
//       });
//   });

//   it('should update BugFix with id', done => {
//     const bugFix = new BugFixes({
//       solution: 'Existing Solution',
//       description: 'Existing Description',
//       result: 'Existing Result',
//       user: 'Existing User',
//       bugReport: 'Existing Bug Report',
//       frameworkVersions: ['v1.0']
//     });

//     bugFix.save((err, savedBugFix) => {
//       chai
//         .request(app)
//         .post(`/bugfixes/${savedBugFix._id}`)
//         .send({ user: 'New Contributor' })
//         .end((err, res) => {
//           expect(res).to.have.status(201);
//           expect(res.body).to.be.an('object');
//           expect(res.body.status).to.equal('success');
//           expect(res.body.data).to.have.property('contributors');
//           expect(res.body.data.contributors).to.include('New Contributor');
//           done();
//         });
//     });
//   });
// });
