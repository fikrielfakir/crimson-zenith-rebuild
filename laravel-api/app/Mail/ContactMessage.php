<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMessage extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $senderName,
        public string $senderEmail,
        public string $subject,
        public string $body,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Contact Form: ' . $this->subject,
            replyTo: [new \Illuminate\Mail\Mailables\Address($this->senderEmail, $this->senderName)],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact',
        );
    }
}
