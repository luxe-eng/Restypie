'use strict';

module.exports = function (options) {

  const api = options.api;

  return class UsersResource extends options.resource {
    get path() { return '/users'; }
    get maxLimit() { return 50; }
    get upsertPaths() { return [['email']]; }
    get routes() {
      return [
        Restypie.BasicRoutes.PostRoute,
        Restypie.BasicRoutes.GetSingleRoute,
        Restypie.BasicRoutes.GetManyRoute,
        Restypie.BasicRoutes.PatchSingleRoute,
        Restypie.BasicRoutes.DeleteSingleRoute,
        Restypie.BasicRoutes.PatchManyRoute,
        Restypie.BasicRoutes.PutSingleRoute
      ];
    }

    get schema() {
      return {
        theId: { type: 'int', path: 'id', isPrimaryKey: true, isFilterable: true, isWritable: true },
        firstName: { path: 'fName', type: String, isRequired: true, isFilterable: true },
        lastName: { path: 'lName', type: String, isRequired: true, isFilterable: true },
        email: { type: String, isRequired: true, isFilterable: true },
        yearOfBirth: {
          path: 'year',
          type: 'int',
          min: 1900,
          max: new Date().getFullYear(),
          isRequired: true,
          isFilterable: true
        },
        password: {
          path: 'pw',
          type: String,
          pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,12}$/,
          isWritableOnce: true
        },
        hasSubscribedEmails: { path: 'emails', type: Boolean, isRequired: true, isFilterable: true },
        job: {
          type: 'int',
          isWritable: true,
          isFilterable: true,
          to() { return api.resources.jobs; },
          fromKey: 'job'
        },
        otherJobPopulation: {
          type: Restypie.Fields.ToOneField,
          isReadable: true,
          to() { return api.resources.jobs; },
          fromKey: 'job'
        },
        profilePicture: {
          path: 'pic',
          type: Restypie.Fields.FileField,
          maxSize: 8000,
          isWritable: true,
          isReadable: true
        },
        createdOn: { type: Date, isFilterable: true },
        gender: { type: String, enum: ['male', 'female'], isRequired: true, isFilterable: true },
        luckyNumber: { type: 'int', range: [0, 9], default: 7, isWritable: true, isFilterable: true },
        readOnly: { type: 'int', isReadable: true },
        slackTeams: {
          type: Restypie.Fields.ToManyField,
          to() { return api.resources.slackTeams; },
          isFilterable: true,
          through() { return api.resources.userSlackTeams; },
          throughKey: 'user',
          otherThroughKey: 'slackTeam'
        }
      };
    }
  }
  
};