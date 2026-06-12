<?php

namespace App\Services;

use App\Models\SmtpSettings;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mailer\Mailer as SymfonyMailer;
use Symfony\Component\Mime\Email as SymfonyEmail;
use Symfony\Component\Mime\Address;

class SmtpMailService
{
    /**
     * Send a Mailable using DB SMTP settings when available,
     * otherwise fall through to the .env mail configuration.
     */
    public function send(string $to, Mailable $mailable): void
    {
        $smtp = SmtpSettings::find('default');

        if ($smtp && $smtp->enabled && $smtp->host && $smtp->username) {
            // Override the smtp mailer config with DB values AND switch the
            // default driver to 'smtp' so Mail::to()->send() actually uses it
            // (the .env MAIL_MAILER might be 'log' or something else entirely).
            config([
                'mail.default'                 => 'smtp',
                'mail.mailers.smtp.transport'  => 'smtp',
                'mail.mailers.smtp.host'       => $smtp->host,
                'mail.mailers.smtp.port'       => $smtp->port ?? 587,
                'mail.mailers.smtp.encryption' => $smtp->secure ? 'ssl' : 'tls',
                'mail.mailers.smtp.username'   => $smtp->username,
                'mail.mailers.smtp.password'   => $smtp->getRawOriginal('password') ?? '',
                'mail.from.address'            => $smtp->from_email ?: $smtp->username,
                'mail.from.name'               => $smtp->from_name ?: 'The Journey Association',
            ]);

            // Purge both the cached smtp mailer and the default mailer so
            // they pick up the new config on the very next send() call.
            app('mail.manager')->purge('smtp');
            app('mail.manager')->forgetMailers();
        } else {
            Log::warning('[SmtpMailService] DB SMTP not configured/enabled — falling back to .env mail config');
        }

        Mail::to($to)->send($mailable);
    }

    /**
     * Send a plain-text email directly via Symfony Mailer (no Mailable needed).
     * Used internally for simple transactional messages.
     */
    public function sendRaw(string $to, string $subject, string $htmlBody): void
    {
        $smtp = SmtpSettings::find('default');

        if (!$smtp || !$smtp->enabled || !$smtp->host) {
            Log::warning('[SmtpMailService] SMTP not configured — skipping raw send to ' . $to);
            return;
        }

        $encryption = $smtp->secure ? 'ssl' : 'tls';
        $port       = $smtp->port ?? 587;
        $username   = $smtp->username ?? '';
        $password   = $smtp->getRawOriginal('password') ?? '';

        $dsn = 'smtp://' . urlencode($username) . ':' . urlencode($password)
             . '@' . $smtp->host . ':' . $port . '?encryption=' . $encryption;

        $transport = Transport::fromDsn($dsn);
        $mailer    = new SymfonyMailer($transport);

        $fromEmail = $smtp->from_email ?: $username;
        $fromName  = $smtp->from_name  ?: 'The Journey Association';

        $email = (new SymfonyEmail())
            ->from(new Address($fromEmail, $fromName))
            ->to($to)
            ->subject($subject)
            ->html($htmlBody);

        $mailer->send($email);
    }
}
