<?php

namespace App\Http\Controllers;

use App\Models\BookingEvent;
use Illuminate\Http\Request;

class BookingEventController extends Controller
{
    public function index(Request $request)
    {
        $query = BookingEvent::query()->where('is_active', true);
        if ($request->has('category')) $query->where('category', $request->category);
        if ($request->has('search'))   $query->where('title', 'like', '%' . $request->search . '%');
        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function show($id)
    {
        // Support both numeric ID and string slug
        if (is_numeric($id)) {
            $event = BookingEvent::where('id', $id)->where('is_active', true)->firstOrFail();
        } else {
            $event = BookingEvent::where('slug', $id)->where('is_active', true)->firstOrFail();
        }
        return response()->json($event->load(['prices', 'gallery']));
    }
}
