export const getVerificationEmailTemplate = (verificationLink: string): string => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Verify Your Email Address</h1>
    <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
    <a href="${verificationLink}" class="button">Verify Email</a>
    <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
    <p>${verificationLink}</p>
    <div class="footer">
      <p>If you didn't create an account with us, please ignore this email.</p>
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;
