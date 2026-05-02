<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BookingEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BookingEventAdminController extends Controller
{
    public function index(Request $request)
    {
        $query = BookingEvent::query();
        if ($request->has('search')) $query->where('title', 'like', '%'.$request->search.'%');
        $page  = max(1, (int)($request->page ?? 1));
        $limit = max(1, min(100, (int)($request->limit ?? 20)));
        $total = $query->count();
        $events = $query->orderBy('created_at', 'desc')->skip(($page-1)*$limit)->take($limit)->get();
        return response()->json(['events' => $events, 'total' => $total, 'page' => $page, 'limit' => $limit]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id'          => 'nullable|string',
            'title'       => 'required|string',
            'description' => 'nullable|string',
            'location'    => 'nullable|string',
            'price'       => 'nullable|numeric',
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date',
        ]);
        $data['id']        = $data['id'] ?? Str::slug($data['title']);
        $data['is_active'] = true;
        $data['images']    = $data['images'] ?? [];
        $data['highlights']    = $data['highlights'] ?? [];
        $data['included']      = $data['included'] ?? [];
        $data['not_included']  = $data['not_included'] ?? [];
        $data['schedule']      = $data['schedule'] ?? [];
        $data['languages']     = $data['languages'] ?? [];
        $event = BookingEvent::create($data);
        return response()->json($event, 201);
    }

    public function update(Request $request, $id)
    {
        $event = BookingEvent::findOrFail($id);
        $event->update($request->except(['id']));
        return response()->json($event->fresh());
    }

    public function destroy($id)
    {
        BookingEvent::findOrFail($id)->delete();
        return response()->json(['message' => 'Event deleted']);
    }
}
