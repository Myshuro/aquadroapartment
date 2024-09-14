`use strict`;

const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());

// Middleware pentru fisierele JSON
app.use(bodyParser.json());

// Endpoint pentru gestionarea trimiterea formulrului
app.post("/sendEmail", (req, res) => {
  // Extragerea datelor din request
  const {
    lastname,
    name,
    phone,
    email,
    people,
    apartment,
    checkin,
    checkout,
    message,
  } = req.body;

  // compunem mesajul
  const mailOptions = {
    from: "mihai.murg@demomailtrap.com", // Adresa de unde sosesc mesajele
    to: "myshu_m@yahoo.com", // Adresa unde sunt trimise mesajele
    subject: "Test Email",
    html: `
            <p><strong>Last Name:</strong> ${lastname}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Number of People:</strong> ${people}</p>
            <p><strong>Apartment:</strong> ${apartment}</p>
            <p><strong>Check-in Date:</strong> ${checkin}</p>
            <p><strong>Check-out Date:</strong> ${checkout}</p>
            <p><strong>Message/Special Requests:</strong> ${message}</p>
        `,
  };

  // Crearea unui transporter folosind credentialele Mailtrap
  var transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "api",
      pass: "7c017f52561cc586a2cc170080492ec1",
    },
  });

  // Trimitearea mesajului
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
