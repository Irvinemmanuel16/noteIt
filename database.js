const mongoose = require('mongoose');
const { URI } = require('./config');

mongoose.connect(URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => console.log('Database is connected')).catch(error => console.error(error));