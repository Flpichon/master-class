const server = require('./server');
const ds = server.dataSources.db;
const lbTables = ['user', 'AccessToken', 'ACL', 'RoleMapping', 'Role', 'document', 'project', 'userRole', 'conference', 'article'];
ds.autoupdate(lbTables, function(er, result) {
if (er) throw er;
console.log('Loopback tables [' - lbTables - '] created in ', ds.adapter.name);
ds.disconnect();
});