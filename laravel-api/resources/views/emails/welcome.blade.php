<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Welcome to The Journey Association</title>
<style>
  body { margin: 0; padding: 0; background: #f4f4f5; font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; }
  .wrapper { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #112250 0%, #1a3366 100%); padding: 48px 32px; text-align: center; }
  .header h1 { color: #ffffff; margin: 0 0 8px; font-size: 28px; font-weight: 800; }
  .header p { color: #D8C18D; margin: 0; font-size: 15px; }
  .body { padding: 36px 32px; }
  .greeting { font-size: 20px; font-weight: 700; margin: 0 0 12px; }
  .intro { font-size: 15px; line-height: 1.7; color: #4b5563; margin: 0 0 28px; }
  .features { list-style: none; padding: 0; margin: 0 0 32px; }
  .features li { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; font-size: 14px; color: #374151; line-height: 1.5; }
  .features li::before { content: "✓"; background: #112250; color: #D8C18D; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
  .cta-block { text-align: center; margin: 0 0 28px; }
  .cta { display: inline-block; background: #112250; color: #ffffff; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; }
  .divider { border: none; border-top: 1px solid #e5e7eb; margin: 28px 0; }
  .footer { background: #f9fafb; padding: 20px 32px; border-top: 1px solid #e5e7eb; text-align: center; }
  .footer p { margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.7; }
  .footer a { color: #4f6ef7; text-decoration: none; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>Welcome to The Journey Association</h1>
    <p>Morocco's club community & sustainable tourism platform</p>
  </div>

  <div class="body">
    <p class="greeting">Hello, {{ $firstName }}! 👋</p>
    <p class="intro">
      Your account has been created successfully. We're thrilled to have you join our community
      of explorers, volunteers, and culture enthusiasts across Morocco.
    </p>

    <ul class="features">
      <li>Discover and join clubs that match your interests</li>
      <li>Browse and book upcoming events and activities</li>
      <li>Connect with volunteers and experts in your region</li>
      <li>Contribute to sustainable tourism and community projects</li>
    </ul>

    <div class="cta-block">
      <a class="cta" href="{{ config('app.url') }}">Explore Now →</a>
    </div>

    <hr class="divider" />

    <p style="font-size:13px;color:#6b7280;line-height:1.6;">
      Your registered email is <strong>{{ $email }}</strong>.
      If you did not create this account, please
      <a href="{{ config('app.url') }}/contact" style="color:#4f6ef7;">contact us</a> immediately.
    </p>
  </div>

  <div class="footer">
    <p>The Journey Association &bull; Morocco<br />
    <a href="{{ config('app.url') }}/privacy-policy">Privacy Policy</a> &bull;
    <a href="{{ config('app.url') }}/terms-of-service">Terms of Service</a></p>
  </div>
</div>
</body>
</html>
