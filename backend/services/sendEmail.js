require("dotenv").config({path:__dirname+"./../.env"});
const nodemailer = require('nodemailer');

async function sendEmail(email, title, body) {
    const SENDER_EMAIL = 'instileaksofficial@gmail.com';
    const APP_PASSWORD = process.env.email_password; 

    let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: SENDER_EMAIL,
    pass: APP_PASSWORD, 
  },
});

    let mailOptions = {
        from: SENDER_EMAIL,
        to: email,
        subject: title,
        html:body
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}
// (async () => {

//   const otp = 4234;
//   const rollNo = "25b0333";
//   const verifyUrl = "http://google.com";
//   const name = "Asad Noor";

//   const html = `
// <!DOCTYPE html>
// <html>
//   <body style="
//     margin:0;
//     padding:0;
//     background-color:#0f0f10;
//     font-family: Arial, sans-serif;
//     color:#f5f5f5;
//   ">

//     <div style="
//       max-width:480px;
//       margin:0 auto;
//       padding:24px 16px;
//     ">

//       <div style="
//         background-color:#16161a;
//         border-radius:16px;
//         border:1px solid #2b2b33;
//         padding:24px 20px;
//       ">

//         <div style="
//           text-align:center;
//           font-size:24px;
//           font-weight:800;
//           margin-bottom:6px;
//           color:#f5f5f5;
//         ">
//           insti<span style="color:#6a2bed;">Leaks</span>
//         </div>

//         <div style="
//           text-align:center;
//           font-size:12px;
//           color:#aaaaaa;
//           margin-bottom:20px;
//         ">
//           Verify your email to unlock the real insti feed.
//         </div>

//         <h1 style="
//           margin:0 0 12px;
//           font-size:20px;
//           font-weight:600;
//           color:#ffffff;
//         ">
//           Welcome${name ? " " + name : ""} 👋
//         </h1>

//         <p style="
//           font-size:14px;
//           line-height:1.6;
//           margin:0 0 12px;
//           color:#d3d3d3;
//         ">
//           Your OTP to verify your InstiLeaks account is:
//         </p>

//         <div style="
//           margin:18px 0 12px;
//           padding:14px 16px;
//           text-align:center;
//           border-radius:10px;
//           border:1px solid #6a2bed;
//           background-color:#121218;
//           font-size:24px;
//           letter-spacing:6px;
//           font-weight:700;
//           color:#ffdf6b;
//         ">
//           ${otp}
//         </div>

//         <p style="
//           font-size:14px;
//           line-height:1.6;
//           margin:0 0 14px;
//           color:#d3d3d3;
//         ">
//           Or tap the button below to verify your email instantly:
//         </p>

//         <div style="text-align:center; margin-bottom:14px;">
//           <a href="${verifyUrl}" target="_blank" rel="noopener noreferrer" style="
//             display:inline-block;
//             padding:10px 24px;
//             border-radius:999px;
//             background:#6a2bed;
//             color:#ffffff;
//             text-decoration:none;
//             font-size:14px;
//             font-weight:600;
//           ">
//             Verify my email
//           </a>
//         </div>

//         <div style="
//           font-size:12px;
//           color:#a0a0aa;
//           word-break:break-all;
//           margin-bottom:12px;
//         ">
//           Or copy & paste this link into your browser:<br />
//           ${verifyUrl}
//         </div>

//         <p style="
//           font-size:12px;
//           color:#8d8d95;
//           margin-bottom:8px;
//         ">
//           This link will expire in <span style="color:#6a2bed;font-weight:600;">60 minutes</span>.  
//           If you didn’t try to sign up, you can ignore this message.
//         </p>

//         <div style="
//           margin-top:18px;
//           font-size:11px;
//           color:#777777;
//           border-top:1px solid #25252d;
//           padding-top:10px;
//         ">
//           Sent by InstiLeaks — unofficial campus chaos layer.<br />
//           Please don’t share this link with anyone.
//         </div>

//       </div>
//     </div>
//   </body>
// </html>
// `;

//   await sendEmail(
//     `${rollNo}@iitb.ac.in`,
//     "InstiLeaks – Verify your email to continue",
//     html
//   );

// })();

module.exports = {sendEmail};
