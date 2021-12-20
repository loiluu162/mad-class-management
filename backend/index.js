process.env.NODE_ENV === 'dev'
  ? require('dotenv').config({ path: '.env.dev' })
  : require('dotenv').config({ path: '.env.prod' });

const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, function (err) {
  if (err) {
    throw err;
  }
  console.log(
    `server is listening on ${port} on ${process.env.NODE_ENV} environment`
  );
});
