<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Club;
use App\Models\MembershipApplication;
use Illuminate\Http\Request;

class ApplicationAdminController extends Controller
{
    public function index(Request $request)
    {
        $query = MembershipApplication::query();

        // Club managers only see applications addressed to their club
        $authUser = auth()->user();
        $managerClubName = null;
        if ($authUser && $authUser->role === 'club_manager') {
            $club = Club::where('owner_id', $authUser->id)->first();
            if ($club) {
                $managerClubName = $club->name;
                $query->where('preferred_club', $club->name);
            } else {
                // Manager has no club assigned — return empty result
                $query->whereRaw('1 = 0');
            }
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $s = $request->search;
            $query->where(fn($q) =>
                $q->where('applicant_name', 'like', "%$s%")
                  ->orWhere('email', 'like', "%$s%")
            );
        }

        $page  = max(1, (int)($request->page  ?? 1));
        $limit = max(1, min(100, (int)($request->limit ?? 50)));
        $total = $query->count();
        $apps  = $query->orderBy('created_at', 'desc')
                       ->skip(($page - 1) * $limit)
                       ->take($limit)
                       ->get();

        // Scope status counts to the same club filter
        $baseStats = MembershipApplication::query();
        if ($managerClubName) {
            $baseStats->where('preferred_club', $managerClubName);
        }
        $approvedCount = (clone $baseStats)->where('status', 'approved')->count();
        $rejectedCount = (clone $baseStats)->where('status', 'rejected')->count();
        $pendingCount  = (clone $baseStats)->where('status', 'pending')->count();

        return response()->json([
            'applications'  => $apps,
            'total'         => $total,
            'page'          => $page,
            'limit'         => $limit,
            'approvedCount' => $approvedCount,
            'rejectedCount' => $rejectedCount,
            'pendingCount'  => $pendingCount,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:pending,approved,rejected']);
        $app = MembershipApplication::findOrFail($id);
        $app->update([
            'status'       => $request->status,
            'reviewed_by'  => $request->user()->id,
            'reviewed_at'  => now(),
            'review_notes' => $request->notes ?? null,
        ]);
        return response()->json($app->fresh());
    }

    public function approve(Request $request, $id)
    {
        $app = MembershipApplication::findOrFail($id);
        $app->update([
            'status'      => 'approved',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);
        return response()->json($app->fresh());
    }

    public function reject(Request $request, $id)
    {
        $app = MembershipApplication::findOrFail($id);
        $app->update([
            'status'       => 'rejected',
            'reviewed_by'  => $request->user()->id,
            'reviewed_at'  => now(),
            'review_notes' => $request->reason ?? null,
        ]);
        return response()->json($app->fresh());
    }
}
