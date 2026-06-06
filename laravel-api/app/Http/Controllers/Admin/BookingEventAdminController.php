<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BookingEvent;
use App\Models\EventTranslation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BookingEventAdminController extends Controller
{
    // ------------------------------------------------------------------ //
    // Helpers
    // ------------------------------------------------------------------ //

    private function toArray(mixed $value): array
    {
        if (is_array($value)) return array_values(array_filter($value));
        if (!$value) return [];
        return array_values(array_filter(array_map('trim', explode("\n", (string) $value))));
    }

    private function mapInput(Request $request): array
    {
        $r = $request;

        return array_filter([
            'club_id'              => $r->input('clubId'),
            'is_association_event' => (bool) $r->input('isAssociationEvent', false),
            'title'                => $r->input('title'),
            'description'          => $r->input('description'),
            'location'             => $r->input('location'),
            'location_details'     => $r->input('locationDetails'),
            'duration'             => $r->input('duration'),
            'start_date'           => $r->input('startDate') ? date('Y-m-d', strtotime($r->input('startDate'))) : null,
            'end_date'             => $r->input('endDate')   ? date('Y-m-d', strtotime($r->input('endDate')))   : null,
            'event_date'           => $r->input('startDate') ? date('Y-m-d H:i:s', strtotime($r->input('startDate'))) : null,
            'price'                => $r->input('price') !== null ? (int) $r->input('price') : 0,
            'category'             => $r->input('category'),
            'languages'            => $this->toArray($r->input('languages')),
            'min_age'              => $r->input('minAge') !== null ? (int) $r->input('minAge') : null,
            'max_people'           => $r->input('maxPeople') !== null ? (int) $r->input('maxPeople') : null,
            'max_participants'     => $r->input('maxAttendees') !== null ? (int) $r->input('maxAttendees') : null,
            'image'                => $r->input('image'),
            'highlights'           => $this->toArray($r->input('highlights')),
            'included'             => $this->toArray($r->input('included')),
            'not_included'         => $this->toArray($r->input('notIncluded')),
            'important_info'       => $r->input('importantInfo'),
            'status'               => $r->input('status', 'upcoming'),
            'is_active'            => true,
            'images'               => [],
            'schedule'             => [],
        ], fn($v) => $v !== null);
    }

    /** Save / update translations for a given event ID. */
    private function saveTranslations(string $eventId, array $translations): void
    {
        $locales = ['fr', 'ar', 'es'];
        foreach ($locales as $locale) {
            $data = $translations[$locale] ?? [];
            if (empty(array_filter($data))) continue;

            EventTranslation::updateOrCreate(
                ['event_id' => $eventId, 'locale' => $locale],
                [
                    'title'            => $data['title']           ?? null,
                    'description'      => $data['description']     ?? null,
                    'location'         => $data['location']        ?? null,
                    'location_details' => $data['locationDetails'] ?? null,
                    'highlights'       => $data['highlights']      ? $this->toArray($data['highlights']) : null,
                    'included'         => $data['included']        ? $this->toArray($data['included'])   : null,
                    'not_included'     => $data['notIncluded']     ? $this->toArray($data['notIncluded']): null,
                    'important_info'   => $data['importantInfo']   ?? null,
                ]
            );
        }
    }

    private function mapOutput(BookingEvent $event): array
    {
        $translations = EventTranslation::where('event_id', $event->id)
            ->get()
            ->keyBy('locale')
            ->map(fn($t) => [
                'title'           => $t->title,
                'description'     => $t->description,
                'location'        => $t->location,
                'locationDetails' => $t->location_details,
                'highlights'      => is_array($t->highlights) ? implode("\n", $t->highlights) : ($t->highlights ?? ''),
                'included'        => is_array($t->included)   ? implode("\n", $t->included)   : ($t->included   ?? ''),
                'notIncluded'     => is_array($t->not_included) ? implode("\n", $t->not_included) : ($t->not_included ?? ''),
                'importantInfo'   => $t->important_info,
            ])
            ->toArray();

        return [
            'id'                 => $event->id,
            'title'              => $event->title,
            'description'        => $event->description,
            'location'           => $event->location,
            'locationDetails'    => $event->location_details,
            'duration'           => $event->duration,
            'startDate'          => $event->start_date,
            'endDate'            => $event->end_date,
            'eventDate'          => $event->event_date,
            'price'              => $event->price,
            'category'           => $event->category,
            'languages'          => $event->languages ?? [],
            'minAge'             => $event->min_age,
            'maxPeople'          => $event->max_people,
            'maxAttendees'       => $event->max_participants,
            'attendees'          => $event->current_participants ?? 0,
            'image'              => $event->image,
            'highlights'         => is_array($event->highlights) ? implode("\n", $event->highlights) : ($event->highlights ?? ''),
            'included'           => is_array($event->included)   ? implode("\n", $event->included)   : ($event->included   ?? ''),
            'notIncluded'        => is_array($event->not_included) ? implode("\n", $event->not_included) : ($event->not_included ?? ''),
            'importantInfo'      => $event->important_info,
            'status'             => $event->status,
            'isAssociationEvent' => (bool) $event->is_association_event,
            'clubId'             => $event->club_id,
            'isActive'           => (bool) $event->is_active,
            'createdAt'          => $event->created_at,
            'updatedAt'          => $event->updated_at,
            'translations'       => $translations,
        ];
    }

    // ------------------------------------------------------------------ //
    // CRUD
    // ------------------------------------------------------------------ //

    public function index(Request $request)
    {
        $query = BookingEvent::query();

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $page  = max(1, (int) ($request->page  ?? 1));
        $limit = max(1, min(100, (int) ($request->limit ?? 20)));
        $total = $query->count();

        $events = $query->orderBy('created_at', 'desc')
                        ->skip(($page - 1) * $limit)
                        ->take($limit)
                        ->get()
                        ->map(fn($e) => $this->mapOutput($e));

        return response()->json([
            'events' => $events,
            'total'  => $total,
            'page'   => $page,
            'limit'  => $limit,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'    => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'category' => 'required|string|max:100',
        ]);

        $data       = $this->mapInput($request);
        $data['id'] = Str::uuid()->toString();

        $event = BookingEvent::create($data);

        if ($request->has('translations')) {
            $this->saveTranslations($event->id, $request->input('translations', []));
        }

        return response()->json($this->mapOutput($event->fresh()), 201);
    }

    public function update(Request $request, $id)
    {
        $event = BookingEvent::findOrFail($id);

        $data = $this->mapInput($request);
        unset($data['id']);

        $event->update($data);

        if ($request->has('translations')) {
            $this->saveTranslations($event->id, $request->input('translations', []));
        }

        return response()->json($this->mapOutput($event->fresh()));
    }

    public function destroy($id)
    {
        BookingEvent::findOrFail($id)->delete();
        return response()->json(['message' => 'Event deleted']);
    }
}
