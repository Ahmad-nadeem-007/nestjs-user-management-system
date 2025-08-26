export const getOtpEmailTemplate = (otp: string): string => `
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
    .otp-code {
      font-size: 32px;
      font-weight: bold;
      color: #28a745;
      letter-spacing: 5px;
      text-align: center;
      padding: 20px;
      margin: 20px 0;
      background-color: #f8f9fa;
      border-radius: 5px;
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
    <h1>Your One-Time Password</h1>
    <p>Here is your one-time password (OTP) for verification:</p>
    <div class="otp-code">${otp}</div>
    <p><strong>This code will expire in 5 minutes.</strong></p>
    <p>Please enter this code in the application to complete your verification.</p>
    <div class="footer">
      <p>If you didn't request this code, please ignore this email or contact support if you have concerns.</p>
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;
