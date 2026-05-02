<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Club;
use App\Models\BookingEvent;
use App\Models\BookingTicket;
use App\Models\BlogPost;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function stats()
    {
        return response()->json([
            'totalUsers'    => User::count(),
            'totalClubs'    => Club::count(),
            'totalEvents'   => BookingEvent::count(),
            'totalBookings' => BookingTicket::count(),
            'totalRevenue'  => (float) BookingTicket::where('payment_status', 'completed')->sum('total_price'),
            'pendingApplications' => \App\Models\MembershipApplication::where('status', 'pending')->count(),
        ]);
    }

    public function dashboardStats()
    {
        return $this->stats();
    }

    public function activity()
    {
        $recentBookings = BookingTicket::with('event')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(fn($t) => [
                'type'      => 'booking',
                'message'   => "{$t->customer_name} booked " . ($t->event?->title ?? 'an event'),
                'timestamp' => $t->created_at,
            ]);

        $recentUsers = User::orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($u) => [
                'type'      => 'user',
                'message'   => "New user: {$u->first_name} {$u->last_name}",
                'timestamp' => $u->created_at,
            ]);

        $activity = $recentBookings->merge($recentUsers)
            ->sortByDesc('timestamp')
            ->values();

        return response()->json($activity);
    }

    public function upcomingEvents()
    {
        $events = BookingEvent::where('is_active', true)
            ->whereDate('start_date', '>=', now())
            ->orderBy('start_date')
            ->limit(5)
            ->get();

        return response()->json($events);
    }

    public function charts()
    {
        $monthlyBookings = BookingTicket::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count, SUM(total_price) as revenue')
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json([
            'monthlyBookings' => $monthlyBookings,
        ]);
    }
}
