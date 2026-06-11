<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SmtpSettings;
use App\Models\EmailLog;
use Illuminate\Http\Request;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mime\Email;

class SmtpSettingsController extends Controller
{
    public function show()
    {
        $settings = SmtpSettings::firstOrCreate(
            ['id' => 'default'],
            [
                'id'      => 'default',
                'enabled' => false,
                'port'    => 587,
                'secure'  => false,
            ]
        );

        $data = $settings->toArray();
        $data['password'] = $settings->getRawOriginal('password')
            ? '••••••••'
            : '';

        return response()->json($data);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'enabled'    => 'nullable|boolean',
            'host'       => 'nullable|string|max:255',
            'port'       => 'nullable|integer|min:1|max:65535',
            'secure'     => 'nullable|boolean',
            'username'   => 'nullable|string|max:255',
            'password'   => 'nullable|string',
            'from_name'  => 'nullable|string|max:255',
            'from_email' => 'nullable|email|max:255',
        ]);

        $settings = SmtpSettings::firstOrCreate(['id' => 'default']);

        if (isset($validated['password']) && str_contains($validated['password'], '••')) {
            unset($validated['password']);
        }

        $validated['updated_by'] = $request->user()?->id ?? 'admin';
        $settings->update($validated);

        $fresh = $settings->fresh();
        $data  = $fresh->toArray();
        $data['password'] = $fresh->getRawOriginal('password') ? '••••••••' : '';

        return response()->json($data);
    }

    public function test(Request $request)
    {
        $request->validate(['to' => 'required|email']);

        $settings = SmtpSettings::firstOrCreate(['id' => 'default']);

        if (!$settings->enabled || !$settings->host) {
            return response()->json(['message' => 'SMTP is not configured or not enabled'], 400);
        }

        $to      = $request->input('to');
        $subject = 'Test Email — The Journey Association';
        $body    = 'This is a test email to confirm your SMTP configuration is working correctly.';

        try {
            $this->sendMail($settings, $to, $subject, $body);

            EmailLog::create([
                'to'       => $to,
                'subject'  => $subject,
                'body'     => $body,
                'status'   => 'sent',
                'type'     => 'test',
                'sent_by'  => $request->user()?->id,
            ]);

            return response()->json(['ok' => true]);
        } catch (\Throwable $e) {
            EmailLog::create([
                'to'            => $to,
                'subject'       => $subject,
                'body'          => $body,
                'status'        => 'failed',
                'error_message' => $e->getMessage(),
                'type'          => 'test',
                'sent_by'       => $request->user()?->id,
            ]);

            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function send(Request $request)
    {
        $request->validate([
            'to'      => 'required|email',
            'subject' => 'required|string|max:255',
            'body'    => 'required|string',
        ]);

        $settings = SmtpSettings::firstOrCreate(['id' => 'default']);

        if (!$settings->enabled || !$settings->host) {
            return response()->json(['message' => 'SMTP is not configured or not enabled'], 400);
        }

        $to      = $request->input('to');
        $subject = $request->input('subject');
        $body    = $request->input('body');

        try {
            $this->sendMail($settings, $to, $subject, $body);

            EmailLog::create([
                'to'      => $to,
                'subject' => $subject,
                'body'    => $body,
                'status'  => 'sent',
                'type'    => 'manual',
                'sent_by' => $request->user()?->id,
            ]);

            return response()->json(['ok' => true]);
        } catch (\Throwable $e) {
            EmailLog::create([
                'to'            => $to,
                'subject'       => $subject,
                'body'          => $body,
                'status'        => 'failed',
                'error_message' => $e->getMessage(),
                'type'          => 'manual',
                'sent_by'       => $request->user()?->id,
            ]);

            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function emailLog()
    {
        $logs = EmailLog::orderBy('created_at', 'desc')->limit(200)->get();

        return response()->json($logs->map(fn($l) => [
            'id'           => $l->id,
            'to'           => $l->to,
            'subject'      => $l->subject,
            'status'       => $l->status,
            'errorMessage' => $l->error_message,
            'type'         => $l->type,
            'sentBy'       => $l->sent_by,
            'createdAt'    => $l->created_at,
        ]));
    }

    private function sendMail(SmtpSettings $settings, string $to, string $subject, string $body): void
    {
        $encryption = $settings->secure ? 'ssl' : 'tls';
        $port       = $settings->port ?? 587;
        $host       = $settings->host;
        $username   = $settings->username ?? '';
        $password   = $settings->getRawOriginal('password') ?? '';

        $dsn = "smtp://{$username}:" . urlencode($password) . "@{$host}:{$port}?encryption={$encryption}";

        $transport = Transport::fromDsn($dsn);
        $mailer    = new Mailer($transport);

        $fromEmail = $settings->from_email ?: $username;
        $fromName  = $settings->from_name ?: 'The Journey Association';

        $email = (new Email())
            ->from("\"{$fromName}\" <{$fromEmail}>")
            ->to($to)
            ->subject($subject)
            ->text($body);

        $mailer->send($email);
    }
}
