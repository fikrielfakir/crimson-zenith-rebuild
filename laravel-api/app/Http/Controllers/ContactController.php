<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\ContactSettings;

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
            $to = $settings?->email ?? config('mail.from.address');

            Mail::raw(
                "Name: {$data['name']}\nEmail: {$data['email']}\n\nMessage:\n{$data['message']}",
                fn($msg) => $msg->to($to)->subject($data['subject'] ?? 'Contact Form Submission')
            );
        } catch (\Throwable $e) {
            \Log::warning('Contact email failed: '.$e->getMessage());
        }

        return response()->json(['message' => 'Message sent successfully']);
    }
}
