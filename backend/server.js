const { configDotenv } = require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const { sequelize } = require('./models');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

configDotenv()

app.use(express.json())
app.use(cookieParser())
port = process.env.PORT || 5000;


app.use('/auth', authRoutes)
app.use('/api', userRoutes)


sequelize.sync()
.then(() => {
    app.listen(port, () => {
      console.log('Server is running on port ', port);
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });