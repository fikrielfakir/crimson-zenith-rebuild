<?php

namespace App\Http\Controllers;

use App\Models\BookingEvent;
use App\Models\EventReview;
use Illuminate\Http\Request;

class BookingEventController extends Controller
{
    private function mapOutput(BookingEvent $e): array
    {
        $toStr = function ($v): ?string {
            if (is_array($v)) return implode("\n", array_filter($v));
            return $v;
        };

        return [
            'id'                  => $e->id,
            'title'               => $e->title,
            'subtitle'            => $e->subtitle,
            'description'         => $e->description,
            'location'            => $e->location,
            'locationDetails'     => $e->location_details,
            'latitude'            => $e->latitude,
            'longitude'           => $e->longitude,
            'duration'            => $e->duration,
            'startDate'           => $e->start_date,
            'endDate'             => $e->end_date,
            'eventDate'           => $e->event_date,
            'price'               => $e->price,
            'originalPrice'       => $e->original_price,
            'rating'              => $e->rating,
            'reviewCount'         => $e->review_count,
            'category'            => $e->category,
            'languages'           => $e->languages ?? [],
            'ageRange'            => $e->age_range,
            'minAge'              => $e->min_age,
            'groupSize'           => $e->group_size,
            'maxPeople'           => $e->max_people,
            'maxParticipants'     => $e->max_participants,
            'currentParticipants' => $e->current_participants ?? 0,
            'image'               => $e->image,
            'images'              => $e->images ?? [],
            'highlights'          => $toStr($e->highlights),
            'included'            => $toStr($e->included),
            'notIncluded'         => $toStr($e->not_included),
            'importantInfo'       => $e->important_info,
            'status'              => $e->status,
            'isAssociationEvent'  => (bool) $e->is_association_event,
            'isActive'            => (bool) $e->is_active,
            'clubId'              => $e->club_id,
            'clubName'            => $e->club?->name,
            'createdAt'           => $e->created_at?->toISOString(),
            'updatedAt'           => $e->updated_at?->toISOString(),
        ];
    }

    public function index(Request $request)
    {
        $query = BookingEvent::query()
            ->where('is_active', true)
            ->where('status', '!=', 'cancelled');

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $events = $query
            ->orderBy('start_date', 'asc')
            ->get()
            ->map(fn($e) => $this->mapOutput($e));

        return response()->json(['events' => $events, 'total' => $events->count()]);
    }

    public function show($id)
    {
        $event = BookingEvent::where('id', $id)
            ->where('is_active', true)
            ->first();

        if (!$event) {
            $event = BookingEvent::where('status', '!=', 'cancelled')
                ->where('is_active', true)
                ->firstOrFail();
        }

        return response()->json(['event' => $this->mapOutput($event)]);
    }

    public function reviews($id)
    {
        $reviews = EventReview::where('event_id', $id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($r) => [
                'id'        => $r->id,
                'userName'  => $r->user_name ?? 'Anonymous',
                'rating'    => (int) $r->rating,
                'review'    => $r->review,
                'createdAt' => $r->created_at,
            ]);

        return response()->json(['reviews' => $reviews, 'total' => $reviews->count()]);
    }

    public function submitReview(Request $request, $id)
    {
        $request->validate([
            'rating'   => 'required|integer|min:1|max:5',
            'review'   => 'nullable|string|max:2000',
            'userName' => 'nullable|string|max:100',
        ]);

        $event = BookingEvent::where('id', $id)->firstOrFail();

        $review = EventReview::create([
            'event_id'  => $id,
            'user_name' => $request->input('userName', 'Anonymous'),
            'rating'    => $request->input('rating'),
            'review'    => $request->input('review'),
        ]);

        // Recompute average rating and review count
        $avg   = EventReview::where('event_id', $id)->avg('rating');
        $count = EventReview::where('event_id', $id)->count();

        $event->update([
            'rating'       => round($avg, 1),
            'review_count' => $count,
        ]);

        return response()->json([
            'message' => 'Review submitted successfully',
            'review'  => [
                'id'        => $review->id,
                'userName'  => $review->user_name,
                'rating'    => (int) $review->rating,
                'review'    => $review->review,
                'createdAt' => $review->created_at,
            ],
        ], 201);
    }
}
