<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\BookingTicket;
use App\Models\Club;
use App\Models\BookingEvent;

class AnalyticsController extends Controller
{
    public function index()
    {
        $totalRevenue  = (float) BookingTicket::where('payment_status', 'completed')->sum('total_price');
        $totalBookings = BookingTicket::count();
        $avgOrderValue = $totalBookings > 0 ? round($totalRevenue / $totalBookings, 2) : 0;

        $topEvents = BookingTicket::selectRaw('event_id, COUNT(*) as bookings, SUM(total_price) as revenue')
            ->with('event:id,title')
            ->groupBy('event_id')
            ->orderByDesc('bookings')
            ->limit(5)
            ->get();

        $userGrowth = User::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json([
            'totalRevenue'  => $totalRevenue,
            'totalBookings' => $totalBookings,
            'avgOrderValue' => $avgOrderValue,
            'topEvents'     => $topEvents,
            'userGrowth'    => $userGrowth,
        ]);
    }
}
