To run:
DEBUG=darby:* & npm start

To initialize model:
node_modules/.bin/sequelize init

To Migrate:
./node_modules/.bin/sequelize db:migrate

To Create model:
node_modules/.bin/sequelize model:create --name Address --attributes address:string

