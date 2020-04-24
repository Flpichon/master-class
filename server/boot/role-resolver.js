module.exports = function(app) {
    const remote = app.remotes();
    remote.before('**', function(ctx, next) {
        if (ctx.method.name !== 'logout' && ctx.method.name !== 'login') {
            if (typeof ctx.args.options !== 'undefined') {
                if (typeof ctx.args.options.accessToken !== 'undefined' && ctx.args.options.accessToken !== null) {
                    const tokenId = ctx.args.options.accessToken.id;
                    app.models.AccessToken.resolve(tokenId, (err, token) => {
                        if (!err && token) {
                            token.created = new Date();
                            token.ttl = 900;
                            token.save(next);
                        }
                    });
                } else {
                    next();
                }
            } else {
                next();
            }
        } else {
            next();
        }
    });
        const Role = app.models.Role;
        Role.registerResolver('conferenceManager', function(role, context, cb) {
          // Q: Is the current request accessing a conference?
            if (context.modelName !== 'conference') {
            // A: No. This role is only for conferences: callback with FALSE
            return process.nextTick(() => cb(null, false));
            }
          //Q: Is the user logged in? (there will be an accessToken with an ID if so)
            const userId = context.accessToken.userId;
            if (!userId) {
            //A: No, user is NOT logged in: callback with FALSE
            return process.nextTick(() => cb(null, false));
            }
          // Q: Is the current logged-in user associated with this conference?
          // Step 1: lookup the requested conference
            context.model.findById(context.modelId, function(err, conference) {
                // A: The datastore produced an error! Pass error to callback
                if(err) return cb(err);
                // A: There's no conference by this ID! Pass error to callback
                if(!conference) return cb(new Error("conference not found"));
        
                // Step 2: check if User is part of the Team associated with this conference
                // (using count() because we only want to know if such a record exists)
                const conf = app.models.Team;
                conf.count({
                ownerId: conference.ownerId,
                memberId: userId
                }, function(err, count) {
                // A: The datastore produced an error! Pass error to callback
                if (err) return cb(err);
        
                if(count > 0){
                    // A: YES. At least one Team associated with this User AND conference
                    // callback with TRUE, user is role:`teamMember`
                    return cb(null, true);
                }
        
                else{
                    // A: NO, User is not in this conference's Team
                    // callback with FALSE, user is NOT role:`teamMember`
                    return cb(null, false);
                }
                });
            });
            });
}