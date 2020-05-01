while true; do
 read -p "Corriste  este bash como . ./setup-loopback-mysql?(y/n)" yn
 case $yn in
  [Yy]* ) echo chevere; break;;
  [Nn]* ) echo "el . aparte corre el programa como source"; exit 1; exit;;
  * ) echo "Sí o no cavza";;
  esac
done
if [ `npm list -g | grep -c loopback-cli` -eq 0 ]; then
    npm install -g loopback-cli
else
   lb
   LASTDIR=$(ls -td */ | head -1)
   cd $LASTDIR
   npm install loopback-connector-mysql
   cd server
   sed -i '2,5d' datasources.json
   cd ..
   lb datasource db
   cd server
   exec 3<> create-lb-tables.js
    echo "var server = require('./server');" >&3
    echo "var ds = server.dataSources.db;" >&3
    echo "var lbTables = ['User','AccessToken','ACL','RoleMapping','Role'];" >&3
    echo "ds.automigrate(lbTables, function(er){" >&3
    echo "if(er) throw er;" >&3
    echo "console.log('Loopback tables ['-lbTables-'] created in ',ds.adapter.name);" >&3
    echo "ds.disconnect();" >&3
    echo "});" >&3
   exec 3>&-
   node create-lb-tables.js
fi