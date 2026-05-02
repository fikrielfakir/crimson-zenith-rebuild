<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Contact Form Message</title>
<style>
  body { margin: 0; padding: 0; background: #f4f4f5; font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; }
  .wrapper { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #112250 0%, #1a3366 100%); padding: 28px 32px; }
  .header h1 { color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; }
  .header p { color: #D8C18D; margin: 6px 0 0; font-size: 13px; }
  .body { padding: 32px; }
  .meta { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 0 0 24px; }
  .meta-row { display: flex; gap: 8px; margin-bottom: 8px; font-size: 14px; }
  .meta-row:last-child { margin-bottom: 0; }
  .meta-label { color: #6b7280; font-weight: 600; min-width: 70px; }
  .meta-value { color: #111827; }
  .subject-line { font-size: 16px; font-weight: 700; margin: 0 0 16px; }
  .message-body { background: #f9fafb; border-left: 4px solid #112250; border-radius: 4px; padding: 16px 20px; font-size: 14px; line-height: 1.7; color: #374151; white-space: pre-wrap; margin: 0 0 24px; }
  .reply-cta { font-size: 13px; color: #6b7280; }
  .reply-cta a { color: #4f6ef7; font-weight: 600; }
  .footer { background: #f9fafb; padding: 16px 32px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>New Contact Form Message</h1>
    <p>Received at {{ now()->format('D, d M Y H:i') }}</p>
  </div>

  <div class="body">
    <div class="meta">
      <div class="meta-row">
        <span class="meta-label">From:</span>
        <span class="meta-value">{{ $senderName }} &lt;<a href="mailto:{{ $senderEmail }}">{{ $senderEmail }}</a>&gt;</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Subject:</span>
        <span class="meta-value">{{ $subject }}</span>
      </div>
    </div>

    <p class="subject-line">{{ $subject }}</p>

    <div class="message-body">{{ $body }}</div>

    <p class="reply-cta">
      Reply directly to this email or click
      <a href="mailto:{{ $senderEmail }}">{{ $senderEmail }}</a>
      to respond to {{ $senderName }}.
    </p>
  </div>

  <div class="footer">
    This message was submitted via the contact form at thejourney-ma.org
  </div>
</div>
</body>
</html>
