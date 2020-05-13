'use strict';

module.exports = function(User) {
    User.beforeRemote('login', (ctx, instance, next) => {
        ctx.req.body.ttl = 900000;
        next();
    });

    User.prototype.isValidToken = async function(tokenId) {
				return new Promise( async (resolve, reject) => {
                    const hasAccessToken = await User.app.models.accesstoken.count();
                    if (hasAccessToken) {
                        return User.app.models.accesstoken.resolve(tokenId, (err, token) => {
                            if (err || (typeof token === 'undefined' && typeof token === 'undefined')) {
                                resolve({token: false});
                            } else {
                                resolve({token: true});
                            }
                        })
                    } else {
                        resolve({token: false});
                    }
				})
    };

    User.remoteMethod('prototype.isValidToken', {
        http: {verb: 'GET', path: '/isValidToken/:fk'},
        accepts: [
            {arg: "fk", type: "string"}
        ],
        returns: {arg: 'check', type: 'object', root: true}
    });
};