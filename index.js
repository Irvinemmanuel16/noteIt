require('./database');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const app = express();
const path = require('path');

app.use(cors());
require('./config/passport')(passport);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());

app.use('/api/notes', require('./routes/notes.routes'));
app.use('/api', require('./routes/users.routes'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

app.listen(process.env.PORT, () => console.log('Server running'));