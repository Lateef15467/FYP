// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

// export const sendEmail = async (to, subject, html) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: `"ShopNow" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     });

//     console.log("✅ Email sent to:", to);
//   } catch (error) {
//     console.error("❌ Email send failed:", error);
//   }
// };
// from here now added with template
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

// Looking to send emails in production? Check out our Email API/SMTP product!
const transportor = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const __dirname = path.resolve(); // works in ES modules too

const handlebarOptions = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: path.join(__dirname, "/view/"), // partials (if used)
    defaultLayout: false,
  },
  viewPath: path.join(__dirname, "/view/"), // main templates
  extName: ".hbs",
};

// Attach handlebars plugin to nodemailer
transportor.use("compile", hbs(handlebarOptions));

let sendEMail = async (params) => {
  try {
    const message = await transportor.sendMail({
      from: '"noreply. Sending ShopNow Ecommerce plateform" <maddison53@ethereal.email>',
      to: params.to,
      subject: params.subject,
      // html: params.html
      template: "email", // name of the template file i.e email.handlebars
      context: {
        name: params.name,
        otp: params.otp,
      },
    });
    console.log("✅ Message sent for user to register: %s", message.messageId);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};

export { sendEMail };
