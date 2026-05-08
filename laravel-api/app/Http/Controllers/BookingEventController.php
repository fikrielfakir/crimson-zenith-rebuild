<?php

namespace App\Http\Controllers;

use App\Models\BookingEvent;
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
            ->with(['prices', 'gallery'])
            ->first();

        if (!$event) {
            $event = BookingEvent::where('status', '!=', 'cancelled')
                ->where('is_active', true)
                ->with(['prices', 'gallery'])
                ->firstOrFail();
        }

        return response()->json(['event' => $this->mapOutput($event)]);
    }
}
