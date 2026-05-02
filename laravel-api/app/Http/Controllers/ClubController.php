<?php

namespace App\Http\Controllers;

use App\Models\Club;
use App\Models\ClubMembership;
use App\Models\BookingEvent;
use Illuminate\Http\Request;

class ClubController extends Controller
{
    public function index(Request $request)
    {
        $query = Club::query();
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(fn($q) => $q->where('name', 'like', "%$search%")->orWhere('location', 'like', "%$search%"));
        }
        if ($request->has('active')) {
            $query->where('is_active', true);
        }
        return response()->json($query->orderBy('name')->get());
    }

    public function show($id)
    {
        $club = Club::findOrFail($id);
        return response()->json($club);
    }

    public function showBySlug($slug)
    {
        $club = Club::where('slug', $slug)->firstOrFail();
        return response()->json($club);
    }

    public function events($id)
    {
        $events = BookingEvent::where('club_id', $id)->where('is_active', true)->orderBy('created_at', 'desc')->get();
        return response()->json($events);
    }

    public function join(Request $request, $id)
    {
        $userId = $request->user()->id;
        $exists = ClubMembership::where('club_id', $id)->where('user_id', $userId)->where('is_active', true)->exists();
        if ($exists) {
            return response()->json(['message' => 'Already a member'], 400);
        }
        ClubMembership::create(['club_id' => $id, 'user_id' => $userId, 'role' => 'member', 'is_active' => true]);
        Club::where('id', $id)->increment('member_count');
        return response()->json(['message' => 'Joined club successfully']);
    }

    public function leave(Request $request, $id)
    {
        $userId = $request->user()->id;
        ClubMembership::where('club_id', $id)->where('user_id', $userId)->update(['is_active' => false]);
        Club::where('id', $id)->decrement('member_count');
        return response()->json(['message' => 'Left club successfully']);
    }

    public function myClubs(Request $request)
    {
        $userId = $request->user()->id;
        $memberships = ClubMembership::where('user_id', $userId)->where('is_active', true)->with('club')->get();
        return response()->json($memberships->map(fn($m) => $m->club));
    }
}
