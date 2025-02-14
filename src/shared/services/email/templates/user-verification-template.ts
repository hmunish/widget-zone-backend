export const userVerificationTemplate = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Account</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f7fc;
        color: #333;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .header h1 {
        color: #333;
      }
      .content {
        text-align: center;
        font-size: 16px;
        line-height: 1.5;
      }
      .content p {
        margin-bottom: 20px;
      }
      .btn {
        display: inline-block;
        padding: 12px 20px;
        background-color: #007bff;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        text-decoration: none;
        border-radius: 4px;
        margin-top: 20px;
      }
      .footer {
        text-align: center;
        font-size: 14px;
        color: #777;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Verify Your Account</h1>
      </div>
      <div class="content">
        <p>Hello,</p>
        <p>
          Thank you for registering with us. Please verify your account by
          clicking the button below.
        </p>
        <!-- Button with dynamic activation link -->
        <a href="{{activationLink}}" class="btn">Verify Your Account</a>
        <p>If you didn't register for an account, please ignore this email.</p>
      </div>
      <div class="footer">
        <p>Thank you for choosing our service!</p>
        <p>&copy; 2024 Our Company. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`