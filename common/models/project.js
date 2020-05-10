'use strict';

module.exports = function(Project) {

  Project.prototype.findAPiKey = async function() {
    return this.apiKey;
  };

  Project.remoteMethod('prototype.findAPiKey', {
      http: {verb: 'GET', path: '/apiKey'},
      returns: {arg: 'check', type: 'object', root: true}
  });

  Project.prototype.getAllConferences = async function() {
    let users = await Project.app.models.user.find({
      where: {
        projectId: this.id
      },
        include: 'conference'
    });
    let conferences = users.map(user => user.__data.conference).filter(Boolean);
    return conferences;
  };

  Project.remoteMethod('prototype.getAllConferences', {
    http: {verb: 'GET', path: '/allConferences'},
    returns: {arg: 'check', type: 'object', root: true}
  });

};
