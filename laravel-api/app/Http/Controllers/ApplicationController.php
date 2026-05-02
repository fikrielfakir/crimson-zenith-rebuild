<?php

namespace App\Http\Controllers;

use App\Models\MembershipApplication;
use Illuminate\Http\Request;

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

        return response()->json(['message' => 'Application submitted successfully', 'application' => $application], 201);
    }
}
