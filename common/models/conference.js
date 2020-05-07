'use strict';

module.exports = function(Conference) {

  Conference.beforeRemote('prototype.__create__articles', (ctx, instance, next) => {
    if (parseInt(ctx.args.data.authorId) 
      === parseInt(ctx.instance.userId) && parseInt(ctx.args.data.authorId) 
      === parseInt(ctx.ctorArgs.options.accessToken.userId)) {
        next();
      } else {
        const error = new Error('wrong user');
        error.status = 422;
        return next(error);
      }
  });
};
