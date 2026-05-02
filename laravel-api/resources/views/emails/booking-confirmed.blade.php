<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Booking Confirmed</title>
<style>
  body { margin: 0; padding: 0; background: #f4f4f5; font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; }
  .wrapper { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #112250 0%, #1a3366 100%); padding: 40px 32px; text-align: center; }
  .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
  .header p { color: #D8C18D; margin: 8px 0 0; font-size: 14px; }
  .badge { display: inline-block; background: #22c55e; color: #fff; border-radius: 20px; padding: 4px 14px; font-size: 13px; font-weight: 600; margin-top: 12px; }
  .body { padding: 32px; }
  .greeting { font-size: 17px; font-weight: 600; margin: 0 0 8px; }
  .intro { color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0 0 24px; }
  .ref-box { background: #f0f4ff; border: 2px dashed #4f6ef7; border-radius: 8px; padding: 16px 24px; text-align: center; margin: 0 0 28px; }
  .ref-box .label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.8px; }
  .ref-box .ref { font-size: 24px; font-weight: 800; color: #112250; letter-spacing: 2px; margin-top: 4px; }
  .details-table { width: 100%; border-collapse: collapse; margin: 0 0 28px; }
  .details-table td { padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
  .details-table td:first-child { color: #6b7280; width: 45%; }
  .details-table td:last-child { font-weight: 600; color: #111827; }
  .note { background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 12px 16px; font-size: 13px; color: #92400e; line-height: 1.5; margin: 0 0 24px; }
  .footer { background: #f9fafb; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb; }
  .footer p { margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.6; }
  .footer a { color: #4f6ef7; text-decoration: none; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>The Journey Association</h1>
    <p>Your booking is confirmed</p>
    <span class="badge">✓ Confirmed</span>
  </div>

  <div class="body">
    <p class="greeting">Hello, {{ $ticket->customer_name }}!</p>
    <p class="intro">
      Thank you for booking with us. Your reservation has been received and is confirmed.
      Please keep your booking reference safe — you will need it to check in.
    </p>

    <div class="ref-box">
      <div class="label">Booking Reference</div>
      <div class="ref">{{ $ticket->booking_reference }}</div>
    </div>

    <table class="details-table">
      <tr>
        <td>Event</td>
        <td>{{ $ticket->event?->title ?? 'N/A' }}</td>
      </tr>
      <tr>
        <td>Date</td>
        <td>{{ \Carbon\Carbon::parse($ticket->event_date)->format('D, d M Y') }}</td>
      </tr>
      @if($ticket->event?->location)
      <tr>
        <td>Location</td>
        <td>{{ $ticket->event->location }}</td>
      </tr>
      @endif
      <tr>
        <td>Participants</td>
        <td>{{ $ticket->number_of_participants }}</td>
      </tr>
      <tr>
        <td>Total Price</td>
        <td>{{ number_format($ticket->total_price, 2) }} MAD</td>
      </tr>
      <tr>
        <td>Payment</td>
        <td>{{ ucfirst($ticket->payment_method ?? 'Pending') }}</td>
      </tr>
      @if($ticket->special_requests)
      <tr>
        <td>Special Requests</td>
        <td>{{ $ticket->special_requests }}</td>
      </tr>
      @endif
    </table>

    @if($ticket->payment_status === 'pending')
    <div class="note">
      <strong>Payment pending:</strong> Your booking is reserved but payment has not been confirmed yet.
      Please complete your payment to secure your spot.
    </div>
    @endif

    <p style="font-size:13px;color:#6b7280;line-height:1.6;">
      Questions? Reply to this email or visit
      <a href="{{ config('app.url') }}" style="color:#4f6ef7;">thejourney-ma.org</a>
      to manage your bookings.
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
