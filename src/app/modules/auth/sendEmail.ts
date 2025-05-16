import nodemailer from "nodemailer";


const emailSender = async (
    email: string,
    html: string,

) =>{
    
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 25,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'omar.lu86@gmail.com', 
      pass:'rbpp yjra goui hcxe'
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  
  // async..await is not allowed in global scope, must use a wrapper

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Heatlh care", <omar.lu86@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Reste passowr link", // Subject line
    //   text: "Hello world?", // plain text body
      html,

    });
  
   console.log(info, "emailInfo")
}

export default emailSender;