<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>New Membership Application</title>
<style>
  body { margin: 0; padding: 0; background: #f4f4f5; font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; }
  .wrapper { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #112250 0%, #1a3366 100%); padding: 32px; }
  .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; }
  .header p { color: #D8C18D; margin: 6px 0 0; font-size: 13px; }
  .body { padding: 32px; }
  .alert { background: #f0f9ff; border-left: 4px solid #0ea5e9; border-radius: 4px; padding: 12px 16px; font-size: 14px; color: #0369a1; margin: 0 0 24px; }
  .details-table { width: 100%; border-collapse: collapse; margin: 0 0 24px; }
  .details-table tr:nth-child(even) td { background: #f9fafb; }
  .details-table td { padding: 10px 12px; font-size: 14px; border: 1px solid #e5e7eb; }
  .details-table td:first-child { color: #6b7280; font-weight: 600; width: 35%; background: #f9fafb; }
  .cta { display: inline-block; background: #112250; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 8px 0 24px; }
  .footer { background: #f9fafb; padding: 16px 32px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>New Membership Application</h1>
    <p>Received at {{ now()->format('D, d M Y H:i') }}</p>
  </div>

  <div class="body">
    <div class="alert">
      A new membership application has been submitted and is awaiting your review.
    </div>

    <table class="details-table">
      <tr><td>Name</td><td>{{ $application->applicant_name }}</td></tr>
      <tr><td>Email</td><td><a href="mailto:{{ $application->email }}">{{ $application->email }}</a></td></tr>
      @if($application->phone)
      <tr><td>Phone</td><td>{{ $application->phone }}</td></tr>
      @endif
      @if($application->preferred_club)
      <tr><td>Preferred Club</td><td>{{ $application->preferred_club }}</td></tr>
      @endif
      @if($application->interests && count($application->interests))
      <tr><td>Interests</td><td>{{ implode(', ', $application->interests) }}</td></tr>
      @endif
      @if($application->motivation)
      <tr><td>Motivation</td><td>{{ $application->motivation }}</td></tr>
      @endif
      <tr><td>Status</td><td>Pending Review</td></tr>
    </table>

    <a class="cta" href="{{ config('app.url') }}/admin/applications">
      Review in Admin Panel →
    </a>
  </div>

  <div class="footer">
    This is an automated notification from The Journey Association admin system.
  </div>
</div>
</body>
</html>
