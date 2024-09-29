import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import transporter from "./mailer/transporter.js";
import { registrationConfirm } from "./data.js";

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Allowlist of allowed origins
const allowlist = [process.env.CORS_URL_1, process.env.CORS_URL_2];

const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

// Enable CORS with allowlist
app.use(cors(corsOptionsDelegate));

app.post("/sendMail", (req, res) => {
  // const { name, event, trans_id, link, sendTo } = req.body;
  const { type, event, sendto } = req.body;

  let emailContent = null;
  let subject = null;
  if (type == "payment") {
    emailContent = registrationConfirm(req.body);
  } else if (type == "registration") {
    emailContent = registrationConfirm(req.body);
  } else if (type == "event") {
    emailContent = registrationConfirm(req.body);
  }

  // Mail options
  // email label
  // attachment
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: sendto,
    // cc: process.env.EMAIL_CC,
    subject: `Registration Confirmation for ${event}`,
    html: emailContent,
  };

  // Sending the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
      return res.status(500).send("Failed");
    } else {
      console.log(info);
      const logMessage = `${sendto} |  ${info.messageSize} |  ${info.response}\n`;
      console.log(logMessage);
      res.status(200).send("Success");

      fs.appendFile("log.txt", logMessage, (err) => {
        if (err) {
          console.error("Error writing to log file: ", err);
        } else {
          console.log("Log updated successfully.");
        }
      });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
