import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  bookingReference: string;
  eventTitle: string;
  eventDate: Date;
  numberOfParticipants: number;
  totalPrice: number;
  paymentMethod: string;
  status: string;
  eventLocation?: string;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MAD',
  }).format(price);
}

function getConfirmedEmailTemplate(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #112250 0%, #1a3366 100%); padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Booking Confirmed!</h1>
              <p style="color: #D8C18D; margin: 10px 0 0 0; font-size: 16px;">The Journey Association</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="color: #333333; font-size: 16px; margin: 0 0 20px 0;">Dear ${data.customerName},</p>
              <p style="color: #333333; font-size: 16px; margin: 0 0 20px 0;">
                Thank you for your booking! We are pleased to confirm your reservation. Your payment has been successfully processed.
              </p>
              
              <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin: 25px 0;">
                <h2 style="color: #112250; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #D8C18D; padding-bottom: 10px;">Booking Details</h2>
                
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: #666666; font-size: 14px; width: 40%;">Booking Reference:</td>
                    <td style="color: #112250; font-size: 14px; font-weight: bold;">${data.bookingReference}</td>
                  </tr>
                  <tr>
                    <td style="color: #666666; font-size: 14px;">Event:</td>
                    <td style="color: #112250; font-size: 14px; font-weight: bold;">${data.eventTitle}</td>
                  </tr>
                  <tr>
                    <td style="color: #666666; font-size: 14px;">Date:</td>
                    <td style="color: #112250; font-size: 14px;">${formatDate(data.eventDate)}</td>
                  </tr>
                  ${data.eventLocation ? `
                  <tr>
                    <td style="color: #666666; font-size: 14px;">Location:</td>
                    <td style="color: #112250; font-size: 14px;">${data.eventLocation}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="color: #666666; font-size: 14px;">Number of Participants:</td>
                    <td style="color: #112250; font-size: 14px;">${data.numberOfParticipants}</td>
                  </tr>
                  <tr>
                    <td style="color: #666666; font-size: 14px;">Payment Method:</td>
                    <td style="color: #112250; font-size: 14px;">${data.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash'}</td>
                  </tr>
                  <tr>
                    <td style="color: #666666; font-size: 14px;">Total Amount:</td>
                    <td style="color: #112250; font-size: 18px; font-weight: bold;">${formatPrice(data.totalPrice)}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; margin: 25px 0;">
                <p style="color: #2e7d32; margin: 0; font-size: 14px;">
                  <strong>Status: Confirmed</strong><br>
                  Your booking is confirmed. We look forward to seeing you!
                </p>
              </div>
              
              <p style="color: #666666; font-size: 14px; margin: 25px 0;">
                If you have any questions about your booking, please don't hesitate to contact us.
              </p>
              
              <p style="color: #333333; font-size: 16px; margin: 25px 0 0 0;">
                Best regards,<br>
                <strong>The Journey Association Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #112250; padding: 20px; text-align: center;">
              <p style="color: #ffffff; margin: 0; font-size: 12px;">
                © ${new Date().getFullYear()} The Journey Association. All rights reserved.
              </p>
              <p style="color: #888888; margin: 10px 0 0 0; font-size: 11px;">
                This email was sent to ${data.customerEmail}
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
}

function getPendingEmailTemplate(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #112250 0%, #1a3366 100%); padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Booking Received</h1>
              <p style="color: #D8C18D; margin: 10px 0 0 0; font-size: 16px;">The Journey Association</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="color: #333333; font-size: 16px; margin: 0 0 20px 0;">Dear ${data.customerName},</p>
              <p style="color: #333333; font-size: 16px; margin: 0 0 20px 0;">
                Thank you for your booking request! We have received your reservation and it is currently pending confirmation.
              </p>
              
              <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin: 25px 0;">
                <h2 style="color: #112250; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #D8C18D; padding-bottom: 10px;">Booking Details</h2>
                
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: #666666; font-size: 14px; width: 40%;">Booking Reference:</td>
                    <td style="color: #112250; font-size: 14px; font-weight: bold;">${data.bookingReference}</td>
                  </tr>
                  <tr>
                    <td style="color: #666666; font-size: 14px;">Event:</td>
                    <td style="color: #112250; font-size: 14px; font-weight: bold;">${data.eventTitle}</td>
                  </tr>
                  <tr>
                    <td style="color: #666666; font-size: 14px;">Date:</td>
                    <td style="color: #112250; font-size: 14px;">${formatDate(data.eventDate)}</td>
                  </tr>
                  ${data.eventLocation ? `
                  <tr>
                    <td style="color: #666666; font-size: 14px;">Location:</td>
                    <td style="color: #112250; font-size: 14px;">${data.eventLocation}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="color: #666666; font-size: 14px;">Number of Participants:</td>
                    <td style="color: #112250; font-size: 14px;">${data.numberOfParticipants}</td>
                  </tr>
                  <tr>
                    <td style="color: #666666; font-size: 14px;">Payment Method:</td>
                    <td style="color: #112250; font-size: 14px;">Cash (Pay on arrival)</td>
                  </tr>
                  <tr>
                    <td style="color: #666666; font-size: 14px;">Total Amount:</td>
                    <td style="color: #112250; font-size: 18px; font-weight: bold;">${formatPrice(data.totalPrice)}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin: 25px 0;">
                <p style="color: #e65100; margin: 0; font-size: 14px;">
                  <strong>Status: Pending Confirmation</strong><br>
                  Your booking is awaiting admin approval. You will receive a confirmation email once approved.
                </p>
              </div>
              
              <p style="color: #666666; font-size: 14px; margin: 25px 0;">
                Please keep this email for your records. If you have any questions, feel free to contact us.
              </p>
              
              <p style="color: #333333; font-size: 16px; margin: 25px 0 0 0;">
                Best regards,<br>
                <strong>The Journey Association Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #112250; padding: 20px; text-align: center;">
              <p style="color: #ffffff; margin: 0; font-size: 12px;">
                © ${new Date().getFullYear()} The Journey Association. All rights reserved.
              </p>
              <p style="color: #888888; margin: 10px 0 0 0; font-size: 11px;">
                This email was sent to ${data.customerEmail}
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
}

export async function sendBookingConfirmationEmail(data: BookingEmailData): Promise<boolean> {
  try {
    const isConfirmed = data.status === 'accepted' || data.status === 'confirmed';
    const subject = isConfirmed 
      ? `Booking Confirmed - ${data.bookingReference}` 
      : `Booking Received - ${data.bookingReference}`;
    
    const html = isConfirmed 
      ? getConfirmedEmailTemplate(data) 
      : getPendingEmailTemplate(data);

    const mailOptions = {
      from: process.env.SMTP_FROM || 'The Journey Association <noreply@magneseo.com>',
      to: data.customerEmail,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${data.customerEmail} (${isConfirmed ? 'confirmed' : 'pending'})`);
    return true;
  } catch (error) {
    console.error('❌ Error sending booking email:', error);
    return false;
  }
}

export async function sendBookingApprovedEmail(data: BookingEmailData): Promise<boolean> {
  try {
    const updatedData = { ...data, status: 'accepted' };
    const subject = `Booking Confirmed - ${data.bookingReference}`;
    const html = getConfirmedEmailTemplate(updatedData);

    const mailOptions = {
      from: process.env.SMTP_FROM || 'The Journey Association <noreply@magneseo.com>',
      to: data.customerEmail,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Approval email sent successfully to ${data.customerEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending approval email:', error);
    return false;
  }
}

export async function verifyEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified');
    return true;
  } catch (error) {
    console.error('❌ SMTP connection failed:', error);
    return false;
  }
}
