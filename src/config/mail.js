const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT || 587),
  secure: Number(process.env.MAIL_PORT) === 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendEnquiryEmail = async ({
  firstName,
  lastName,
  phone,
  email,
  message,
}) => {
  const fullName = `${firstName} ${lastName}`.trim();

  await transporter.sendMail({
    from: `"Website Enquiry" <${process.env.MAIL_FROM}>`,
    to: process.env.ENQUIRY_RECEIVER,
    replyTo: email,
    subject: `New Website Enquiry - ${fullName}`,
    text: `
New website enquiry

Name: ${fullName}
Phone: ${phone}
Email: ${email}

Message:
${message}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>New Website Enquiry</h2>

        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>

        <h3>Message</h3>
        <p>${message.replace(/\n/g, "<br>")}</p>
      </div>
    `,
  });
};

module.exports = {
  transporter,
  sendEnquiryEmail,
};