<?php

namespace App\Http\Controllers;

use App\Mail\ApplicationReceived;
use App\Models\MembershipApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ApplicationController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'applicantName'  => 'required|string|max:255',
            'email'          => 'required|email',
            'phone'          => 'nullable|string',
            'motivation'     => 'nullable|string',
            'interests'      => 'nullable|array',
            'preferredClub'  => 'nullable|string',
        ]);

        $existing = MembershipApplication::where('email', $data['email'])
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existing) {
            $statusLabel = $existing->status === 'approved' ? 'already been approved' : 'already been submitted and is pending review';
            return response()->json([
                'message' => 'An application with this email address has ' . $statusLabel . '.',
                'errors'  => ['email' => ['This email address already has an application on file.']],
            ], 422);
        }

        $application = MembershipApplication::create([
            'user_id'        => $request->user()?->id ?? 'guest',
            'applicant_name' => $data['applicantName'],
            'email'          => $data['email'],
            'phone'          => $data['phone'] ?? null,
            'motivation'     => $data['motivation'] ?? null,
            'interests'      => $data['interests'] ?? [],
            'preferred_club' => $data['preferredClub'] ?? null,
            'status'         => 'pending',
        ]);

        // Notify admin of new application (non-fatal)
        try {
            $adminEmail = config('mail.from.address', 'admin@thejourney-ma.org');
            Mail::to($adminEmail)->send(new ApplicationReceived($application));
        } catch (\Throwable $e) {
            \Log::warning('Application notification email failed: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Application submitted successfully', 'application' => $application], 201);
    }
}
