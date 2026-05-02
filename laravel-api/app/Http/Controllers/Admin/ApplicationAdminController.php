<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MembershipApplication;
use Illuminate\Http\Request;

class ApplicationAdminController extends Controller
{
    public function index(Request $request)
    {
        $query = MembershipApplication::query();
        if ($request->has('status')) $query->where('status', $request->status);
        if ($request->has('search')) {
            $s = $request->search;
            $query->where(fn($q) => $q->where('applicant_name', 'like', "%$s%")->orWhere('email', 'like', "%$s%"));
        }
        $page  = max(1, (int)($request->page ?? 1));
        $limit = max(1, min(100, (int)($request->limit ?? 20)));
        $total = $query->count();
        $apps  = $query->orderBy('created_at', 'desc')->skip(($page-1)*$limit)->take($limit)->get();
        return response()->json(['applications' => $apps, 'total' => $total, 'page' => $page, 'limit' => $limit]);
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
        $app->update(['status' => 'approved', 'reviewed_by' => $request->user()->id, 'reviewed_at' => now()]);
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
