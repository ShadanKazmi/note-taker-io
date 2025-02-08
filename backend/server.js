require("dotenv").config();
const express = require("express")
const mongoose = require("mongoose")
const userRoute = require("./routes/user")
const noteRoute = require("./routes/note")

const app = express();
const PORT = process.env.PORT || 8000;
const cors = require('cors');
const corsOptions = {
    credentials: true,
  };

app.use(express.json());
app.use(express.urlencoded({extended:false,useNewUrlParser: true, useUnifiedTopology: true}))
app.use(cors(corsOptions));


mongoose.connect(process.env.MONGO_URL)
.then(e => console.log("MongoDB Connected"));

app.use('/user',userRoute)
app.use('/notes',noteRoute)

app.listen(PORT, () => {
    console.log('Server is running on port',PORT);
  });