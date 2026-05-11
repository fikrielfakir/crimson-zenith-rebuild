<?php

namespace App\Http\Controllers;

use App\Mail\ApplicationReceived;
use App\Models\MembershipApplication;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ApplicationController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'applicantName'   => 'required|string|max:255',
            'email'           => 'required|email',
            'phone'           => 'nullable|string',
            'password'        => 'nullable|string|min:8',
            'confirmPassword' => 'nullable|string',
            'motivation'      => 'nullable|string',
            'interests'       => 'nullable|array',
            'preferredClub'   => 'nullable|string',
        ]);

        // Validate password match when provided
        if (!empty($data['password']) && $data['password'] !== ($data['confirmPassword'] ?? '')) {
            return response()->json([
                'message' => 'Passwords do not match.',
                'errors'  => ['confirmPassword' => ['Passwords do not match.']],
            ], 422);
        }

        // Check for duplicate application
        $existingApp = MembershipApplication::where('email', $data['email'])
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existingApp) {
            $statusLabel = $existingApp->status === 'approved'
                ? 'already been approved'
                : 'already been submitted and is pending review';
            return response()->json([
                'message' => 'An application with this email address has ' . $statusLabel . '.',
                'errors'  => ['email' => ['This email address already has an application on file.']],
            ], 422);
        }

        // Attempt to create a user account if password provided
        $userId      = null;
        $accountCreated = false;
        $accountExists  = false;

        if (!empty($data['password'])) {
            $existingUser = User::where('email', $data['email'])->first();

            if ($existingUser) {
                $userId        = $existingUser->id;
                $accountExists = true;
            } else {
                // Split full name into first / last
                $nameParts = explode(' ', trim($data['applicantName']), 2);
                $firstName = $nameParts[0];
                $lastName  = $nameParts[1] ?? $nameParts[0];

                $userId = 'user_' . time() . '_' . Str::random(9);

                User::create([
                    'id'         => $userId,
                    'username'   => $data['email'],
                    'email'      => $data['email'],
                    'name'       => $data['applicantName'],
                    'first_name' => $firstName,
                    'last_name'  => $lastName,
                    'phone'      => $data['phone'] ?? null,
                    'password'   => Hash::make($data['password']),
                    'role'       => 'user',
                    'is_admin'   => false,
                    'is_active'  => true,
                    'interests'  => $data['interests'] ?? [],
                ]);

                $accountCreated = true;
            }
        }

        // Create the application
        $application = MembershipApplication::create([
            'user_id'        => $userId ?? 'guest',
            'applicant_name' => $data['applicantName'],
            'email'          => $data['email'],
            'phone'          => $data['phone'] ?? null,
            'motivation'     => $data['motivation'] ?? null,
            'interests'      => $data['interests'] ?? [],
            'preferred_club' => $data['preferredClub'] ?? null,
            'status'         => 'pending',
        ]);

        // Notify admin (non-fatal)
        try {
            $adminEmail = config('mail.from.address', 'admin@thejourney-ma.org');
            Mail::to($adminEmail)->send(new ApplicationReceived($application));
        } catch (\Throwable $e) {
            \Log::warning('Application notification email failed: ' . $e->getMessage());
        }

        return response()->json([
            'message'        => 'Application submitted successfully',
            'application'    => $application,
            'accountCreated' => $accountCreated,
            'accountExists'  => $accountExists,
        ], 201);
    }
}
