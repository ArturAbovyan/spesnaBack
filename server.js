import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import EmailSender from "./sendEmail.js";
import bodyParser from "body-parser"
import path from "path"

import multer from 'multer';
import fs from 'fs'


var __dirname = path.resolve()

dotenv.config();
const app = express();
app.use( bodyParser.json() );  // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());
app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
const port = process.env.PORT || 5000;


//attachments

const storage = multer.diskStorage({
  destination : function (req, file, cb){
    if(!fs.existsSync(__dirname + '/temp')){
      fs.mkdirSync(__dirname + '/temp')
    }

    cb(null, './temp')
  },
  filename :function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({storage : storage})

// ****** SEND API
app.post("/send", upload.any() , async (req, res) => {
  try {
    let attachments = [];
    for(let i = 0; i < req.files.length; i++){
      let fileDetailes = {
        filename : req.files[i].filename,
        path: req.files[i].path
      }
      attachments.push(fileDetailes)
    }
      const firstName = req.body.user_first_name;
      const lastName = req.body.user_last_name;
      const email = req.body.user_email;
      const message = req.body.message;
      EmailSender({firstName, lastName, email, message, attachments})
      res.json({ msg: "Your message sent successfully" });
    } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "Error ❌" });
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});