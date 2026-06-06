<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessage;
use App\Models\ContactSettings;
use App\Models\ContactSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email',
            'phone'   => 'nullable|string|max:50',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        // Save submission to database
        ContactSubmission::create([
            'name'    => $data['name'],
            'email'   => $data['email'],
            'phone'   => $data['phone'] ?? null,
            'subject' => $data['subject'] ?? 'Contact Form Submission',
            'message' => $data['message'],
            'status'  => 'new',
        ]);

        // Attempt to send email (failure is non-fatal)
        try {
            $settings = ContactSettings::find('default');
            $to = $settings?->email ?? config('mail.from.address', 'admin@thejourney-ma.org');

            Mail::to($to)->send(new ContactMessage(
                senderName:     $data['name'],
                senderEmail:    $data['email'],
                messageSubject: $data['subject'] ?? 'Contact Form Submission',
                body:           $data['message'],
            ));
        } catch (\Throwable $e) {
            \Log::warning('Contact email failed: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Message sent successfully']);
    }

    // Admin: list all submissions
    public function index(Request $request)
    {
        $query = ContactSubmission::latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $q = $request->search;
            $query->where(fn($qb) => $qb
                ->where('name', 'like', "%{$q}%")
                ->orWhere('email', 'like', "%{$q}%")
                ->orWhere('message', 'like', "%{$q}%")
            );
        }

        $submissions = $query->paginate(20);

        return response()->json($submissions);
    }

    // Admin: get single submission and mark as read
    public function show(ContactSubmission $contactSubmission)
    {
        if ($contactSubmission->status === 'new') {
            $contactSubmission->update(['status' => 'read', 'read_at' => now()]);
        }

        return response()->json($contactSubmission);
    }

    // Admin: update status / notes
    public function update(Request $request, ContactSubmission $contactSubmission)
    {
        $data = $request->validate([
            'status'      => 'sometimes|in:new,read,replied,archived',
            'admin_notes' => 'sometimes|nullable|string',
        ]);

        $contactSubmission->update($data);

        return response()->json($contactSubmission->fresh());
    }

    // Admin: delete submission
    public function destroy(ContactSubmission $contactSubmission)
    {
        $contactSubmission->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // Admin: count unread
    public function unreadCount()
    {
        return response()->json(['count' => ContactSubmission::where('status', 'new')->count()]);
    }
}
