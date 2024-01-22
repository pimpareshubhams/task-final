const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
const {MONGODB_URL} = require('./config')

mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

  app.listen(5000,()=>{
    console.log("Server started on 5000")
  })

  

  require('./models/admin_model')
  app.use(require('./routes/admin_route'))

 
