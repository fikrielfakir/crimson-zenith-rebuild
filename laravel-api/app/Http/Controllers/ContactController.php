<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessage;
use App\Models\ContactSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        try {
            $settings = ContactSettings::find('default');
            $to = $settings?->email ?? config('mail.from.address', 'admin@thejourney-ma.org');

            Mail::to($to)->send(new ContactMessage(
                senderName:  $data['name'],
                senderEmail: $data['email'],
                subject:     $data['subject'] ?? 'Contact Form Submission',
                body:        $data['message'],
            ));
        } catch (\Throwable $e) {
            \Log::warning('Contact email failed: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Message sent successfully']);
    }
}
