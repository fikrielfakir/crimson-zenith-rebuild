<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Verify your email</title>
<style>
  body { margin: 0; padding: 0; background: #f4f4f5; font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; }
  .wrapper { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #112250 0%, #1a3366 100%); padding: 48px 32px; text-align: center; }
  .header h1 { color: #ffffff; margin: 0 0 8px; font-size: 26px; font-weight: 800; }
  .header p { color: #D8C18D; margin: 0; font-size: 14px; }
  .body { padding: 36px 32px; }
  .greeting { font-size: 20px; font-weight: 700; margin: 0 0 12px; }
  .intro { font-size: 15px; line-height: 1.7; color: #4b5563; margin: 0 0 28px; }
  .cta-block { text-align: center; margin: 0 0 28px; }
  .cta { display: inline-block; background: #112250; color: #ffffff !important; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; }
  .expire-note { text-align: center; font-size: 13px; color: #9ca3af; margin: 0 0 24px; }
  .url-box { background: #f3f4f6; border-radius: 6px; padding: 12px 16px; font-size: 12px; color: #6b7280; word-break: break-all; margin: 0 0 24px; }
  .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
  .footer { background: #f9fafb; padding: 20px 32px; border-top: 1px solid #e5e7eb; text-align: center; }
  .footer p { margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.7; }
  .footer a { color: #4f6ef7; text-decoration: none; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>The Journey Association</h1>
    <p>Please verify your email address</p>
  </div>
  <div class="body">
    <p class="greeting">Hello, {{ $firstName }}!</p>
    <p class="intro">
      Thank you for creating an account. To complete your registration and access all features,
      please verify your email address by clicking the button below.
    </p>
    <div class="cta-block">
      <a class="cta" href="{{ $verifyUrl }}">Verify Email Address →</a>
    </div>
    <p class="expire-note">This link expires in 24 hours.</p>
    <p style="font-size:13px;color:#6b7280;line-height:1.6;margin:0 0 8px;">
      If the button above doesn't work, copy and paste this URL into your browser:
    </p>
    <div class="url-box">{{ $verifyUrl }}</div>
    <hr class="divider" />
    <p style="font-size:13px;color:#6b7280;line-height:1.6;margin:0;">
      If you did not create an account, you can safely ignore this email.
    </p>
  </div>
  <div class="footer">
    <p>The Journey Association &bull; Morocco<br />
    <a href="{{ config('app.url') }}/privacy-policy">Privacy Policy</a> &bull;
    <a href="{{ config('app.url') }}/contact">Contact Us</a></p>
  </div>
</div>
</body>
</html>
