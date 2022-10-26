Run `npm install`.
`npm install -g nodemon`
`npm start`

To migrate tables:
1. check the parameters of your local database in .env file
2. generate client using "npm run prisma:generate"
3. migrate all tables using "npm run prisma:migrate"
4. in case the commands will not work, check the package.json file and change the "scripts"