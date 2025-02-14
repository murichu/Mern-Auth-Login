export const BASE_STYLES = `
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', Arial, sans-serif;
      background: #E5E5E5;
    }
    table, td {
      border-collapse: collapse;
    }
    .container {
      width: 100%;
      max-width: 500px;
      margin: 70px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
    .main-content {
      padding: 48px 30px;
      color: #000000;
    }
    .button {
      display: inline-block;
      width: 100%;
      background: #22D172;
      text-decoration: none;
      padding: 12px 0;
      color: #ffffff;
      font-size: 16px;
      text-align: center;
      font-weight: bold;
      border-radius: 5px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888888;
      padding: 20px;
    }
    @media only screen and (max-width: 480px) {
      .container {
        width: 90%;
      }
      .button {
        width: 100%;
      }
    }
  </style>
`;

export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Email Verification</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  ${BASE_STYLES}
</head>
<body>
  <table width="100%" bgcolor="#F6FAFB" cellspacing="0" cellpadding="0" border="0" align="center">
    <tr>
      <td align="center">
        <table class="container">
          <tr>
            <td class="main-content">
              <h2 style="margin-bottom: 20px; font-size: 24px; line-height: 1.5; font-weight: bold;">Verify Your Email</h2>
              <p style="margin-bottom: 15px; font-size: 14px; line-height: 1.5;">
                You're just one step away from verifying your account for this email: 
                <strong style="color: #4C83EE;">{{email}}</strong>.
              </p>
              <p style="margin-bottom: 15px; font-size: 14px; line-height: 1.5;">
                Use the OTP below to complete verification. This OTP is valid for 24 hours.
              </p>
              <p class="button">{{otp}}</p>
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p>&copy; 2025 Your Company. All rights reserved.</p>
              <p>
                <a href="https://yourwebsite.com" style="color: #4C83EE;">Visit our website</a> | 
                <a href="https://yourwebsite.com/unsubscribe" style="color: #4C83EE;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Password Reset</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  ${BASE_STYLES}
</head>
<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#F6FAFB">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <tr>
                <td class="main-content">
                  <table width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                      <tr>
                        <td style="padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold;">
                          Forgot your password?
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          We received a password reset request for your account: <span style="color: #4C83EE;">{{email}}</span>.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 16px; font-size: 14px; line-height: 150%; font-weight: 700;">
                          Use the OTP below to reset the password.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 24px;">
                          <p class="button">{{otp}}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          The password reset OTP is only valid for the next 15 minutes.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td class="footer">
                  <p>&copy; 2025 Your Company. All rights reserved.</p>
                  <p><a href="https://yourwebsite.com" style="color: #4C83EE;">Visit our website</a> | <a href="https://yourwebsite.com/unsubscribe" style="color: #4C83EE;">Unsubscribe</a></p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`;

export const USER_EMAIL_SIGNUP = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Email Verification</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  ${BASE_STYLES}
</head>
<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#F6FAFB">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <tr>
                <td class="main-content">
                  <h1 style="font-size: 24px; margin-bottom: 16px;">Welcome to Our Platform</h1>
                  <p style="font-size: 14px; margin-bottom: 16px;">
                    Hello <strong>{{name}}</strong>, welcome to our platform! Your account has been created successfully with the email: <strong>{{email}}</strong>.
                  </p>
                  <p style="font-size: 14px; margin-bottom: 24px;">
                    Welcome aboard! 🎉 We’re thrilled to have you as part of our community.
                  </p>
                  <a href="https://yourwebsite.com/verify" class="button">Verify Your Email</a>
                </td>
              </tr>
              <tr>
                <td class="footer">
                  <p>&copy; 2025 Your Company. All rights reserved.</p>
                  <p>
                    <a href="https://yourwebsite.com">Visit our website</a> |
                    <a href="https://yourwebsite.com/unsubscribe">Unsubscribe</a>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`;