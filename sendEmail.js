import nodemailer from 'nodemailer';
import multer from 'multer';
import fs from 'fs'

const storage = multer.diskStorage({
  destination : function (req, file, cb){
    if(!fs.existsSync(__dirname + './temp')){
      fs.mkdirSync(__dirname + './temp')
    } 

    cb(null, './temp')
  },
  filename :function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({storage : storage})


const Email = (options) => {
  let transpoter = nodemailer.createTransport({
    service: 'gmail', //i use outlook
    auth: {
      user: process.env.USER, // email
      pass: process.env.PASSWORD, //password
    },
  });
  transpoter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
  });
};

// send email
const EmailSender = ({firstName, lastName, email, message, attachments }) => {
  const options = {
    from: `Spesna <${process.env.USER}>`,
    to: process.env.SEND_TO,
    subject: 'Message From Spesna Web Page',
    html: `
        <div style="width: 100%; background-color: gray; padding: 5rem 0">
        <div style="max-width: 700px; background-color: white; margin: 0 auto">
          <div style="width: 100%; gap: 10px; padding: 30px 0; display: grid">
            <h1 style="color: gray; padding: 0 30px">
              From Spesna Web Page
            </h1>
            <div style="font-size: .8rem; margin: 0 30px">
              <p>Full Name: <b>${firstName}</b>  <b>${lastName}</b></p>
              <p>Email: <b>${email}</b></p>
              <p>Message: <br/> <i style="margin-left: 30px">${message}</i></p>
            </div>
          </div>
        </div>
      </div>
        `,
    attachments: attachments
  };

  Email(options)
};

export default EmailSender