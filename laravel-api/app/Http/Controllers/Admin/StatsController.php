<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Club;
use App\Models\BookingEvent;
use App\Models\BookingTicket;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function stats()
    {
        $now = now();
        $lastMonth = now()->subMonth();
        $lastWeek  = now()->subWeek();

        $totalUsers    = User::count();
        $lastMonthUsers = User::where('created_at', '<', $lastMonth)->count();
        $userGrowth    = $lastMonthUsers > 0 ? round((($totalUsers - $lastMonthUsers) / $lastMonthUsers) * 100, 1) : 0;

        $totalClubs    = Club::count();
        $activeClubs   = Club::where('is_active', true)->count();
        $newClubsThisMonth = Club::where('created_at', '>=', $lastMonth)->count();

        $totalEvents    = BookingEvent::count();
        $upcomingEvents = BookingEvent::where('is_active', true)->whereDate('start_date', '>=', $now)->count();
        $eventsThisWeek = BookingEvent::where('is_active', true)->whereDate('start_date', '>=', $now)->whereDate('start_date', '<=', now()->addWeek())->count();

        $totalRevenue     = (float) BookingTicket::where('payment_status', 'completed')->sum('total_price');
        $lastMonthRevenue = (float) BookingTicket::where('payment_status', 'completed')->where('created_at', '<', $lastMonth)->sum('total_price');
        $revenueGrowth    = $lastMonthRevenue > 0 ? round((($totalRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1) : 0;

        return response()->json([
            'totalUsers'          => $totalUsers,
            'userGrowth'          => $userGrowth,
            'totalClubs'          => $totalClubs,
            'activeClubs'         => $activeClubs,
            'newClubsThisMonth'   => $newClubsThisMonth,
            'totalEvents'         => $totalEvents,
            'upcomingEvents'      => $upcomingEvents,
            'eventsThisWeek'      => $eventsThisWeek,
            'totalBookings'       => BookingTicket::count(),
            'totalRevenue'        => $totalRevenue,
            'revenueGrowth'       => $revenueGrowth,
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
                'id'        => 'booking-' . $t->id,
                'type'      => 'booking',
                'description' => "{$t->customer_name} booked " . ($t->event?->title ?? 'an event'),
                'timestamp' => $t->created_at,
                'user'      => ['name' => $t->customer_name],
            ]);

        $recentUsers = User::orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($u) => [
                'id'          => 'user-' . $u->id,
                'type'        => 'user',
                'description' => "New user: {$u->first_name} {$u->last_name}",
                'timestamp'   => $u->created_at,
                'user'        => ['name' => "{$u->first_name} {$u->last_name}"],
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
            ->get()
            ->map(fn($e) => [
                'id'        => $e->id,
                'name'      => $e->title,
                'date'      => $e->start_date,
                'location'  => $e->location ?? '',
                'attendees' => $e->current_participants ?? 0,
            ]);

        return response()->json($events);
    }

    public function charts()
    {
        $driver = config('database.default');

        if ($driver === 'mysql') {
            $monthlyBookings = BookingTicket::selectRaw(
                'DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as users, SUM(total_price) as revenue'
            )
                ->where('created_at', '>=', now()->subMonths(6))
                ->groupBy('month')
                ->orderBy('month')
                ->get();
        } else {
            $monthlyBookings = BookingTicket::selectRaw(
                "TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as users, SUM(total_price) as revenue"
            )
                ->where('created_at', '>=', now()->subMonths(6))
                ->groupBy('month')
                ->orderBy('month')
                ->get();
        }

        return response()->json([
            'userGrowth'      => $monthlyBookings,
            'revenue'         => $monthlyBookings,
            'monthlyBookings' => $monthlyBookings,
        ]);
    }
}
