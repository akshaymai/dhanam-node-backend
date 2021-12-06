const express = require("express");
const nodemailer = require("nodemailer");
const { User } = require("../Model/index");
const router = express.Router();

router.post("/post/user", async (req, res) => {
  const checkmail = await User.findOne({ email: req.body.email });
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${process.env.GMAILUSER}`,
      pass: `${process.env.GMAILPASSWORD}`,
    },
  });

  if (checkmail) {
    return res.status(400).send({
      error: "user already registerd",
    });
  }
  try {
    const user = new User({ ...req.body });
    const token = await user.genarateAuthToken();
    await user.save();

    let mailOptions = {
      from: "akshay.maity76@gmail.com",
      to: `${req.body.email}`,
      subject: "Registration Message",
      text: `
      Welcome !!!
      `,
    };

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log("Err", err);
        return res.json({ message: "Error occured for send email" });
      }
      return res.json({ message: "check your email" });
    });
    res.status(201).send({
      user,
      token,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
