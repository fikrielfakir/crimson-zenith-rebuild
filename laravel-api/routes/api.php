<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\AdminAuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Health check
|--------------------------------------------------------------------------
*/
Route::get('/health', fn () => response()->json([
    'status'    => 'ok',
    'service'   => 'The Journey Association API',
    'timestamp' => now()->toISOString(),
]));


/*
|--------------------------------------------------------------------------
| Authentication routes (public)
|--------------------------------------------------------------------------
*/
Route::post('/register',         [AuthController::class, 'register']);
Route::post('/login',            [AuthController::class, 'login']);
Route::post('/logout',           [AuthController::class, 'logout']);
Route::post('/forgot-password',  [AuthController::class, 'forgotPassword']);

Route::post('/admin/login',  [AdminAuthController::class, 'login']);
Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->middleware('auth');

/*
|--------------------------------------------------------------------------
| Authenticated user routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/user',                          [AuthController::class, 'user']);
    Route::get('/auth/user',                     [AuthController::class, 'user']);
    Route::put('/auth/user',                     [AuthController::class, 'updateProfile']);
    Route::post('/auth/upload-profile-image',    [AuthController::class, 'uploadProfileImage']);
});

/*
|--------------------------------------------------------------------------
| Clubs (public + auth)
|--------------------------------------------------------------------------
*/
Route::get('/clubs',                   [\App\Http\Controllers\ClubController::class, 'index']);
Route::get('/clubs/slug/{slug}',       [\App\Http\Controllers\ClubController::class, 'showBySlug']);
Route::get('/clubs/{id}',              [\App\Http\Controllers\ClubController::class, 'show']);
Route::get('/clubs/{id}/events',       [\App\Http\Controllers\ClubController::class, 'events']);

Route::middleware('auth')->group(function () {
    Route::post('/clubs/{id}/join',    [\App\Http\Controllers\ClubController::class, 'join']);
    Route::post('/clubs/{id}/leave',   [\App\Http\Controllers\ClubController::class, 'leave']);
    Route::get('/user/clubs',          [\App\Http\Controllers\ClubController::class, 'myClubs']);
});

/*
|--------------------------------------------------------------------------
| Booking Events (public)
|--------------------------------------------------------------------------
*/
Route::get('/booking/events',                [\App\Http\Controllers\BookingEventController::class, 'index']);
Route::get('/booking/events/{id}',           [\App\Http\Controllers\BookingEventController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Booking Tickets
|--------------------------------------------------------------------------
*/
Route::post('/booking/tickets',              [\App\Http\Controllers\BookingTicketController::class, 'store']);
Route::get('/booking/tickets/{ref}',         [\App\Http\Controllers\BookingTicketController::class, 'show']);
// Both URL patterns used in frontend
Route::get('/booking/check/{eventId}',       [\App\Http\Controllers\BookingTicketController::class, 'checkEvent']);
Route::get('/booking/check-event/{eventId}', [\App\Http\Controllers\BookingTicketController::class, 'checkEvent']);

Route::middleware('auth')->group(function () {
    Route::get('/booking/my-tickets',                        [\App\Http\Controllers\BookingTicketController::class, 'myTickets']);
    Route::post('/booking/my-tickets/{ref}/cancel',          [\App\Http\Controllers\BookingTicketController::class, 'cancelByRef']);
    Route::put('/booking/my-tickets/{ref}/update',           [\App\Http\Controllers\BookingTicketController::class, 'updateByRef']);
    Route::post('/booking/tickets/{id}/cancel',              [\App\Http\Controllers\BookingTicketController::class, 'cancel']);
});

Route::get('/booking/page-settings', [\App\Http\Controllers\BookingPageSettingsController::class, 'show']);

/*
|--------------------------------------------------------------------------
| CMS (public read)
|--------------------------------------------------------------------------
*/
Route::prefix('cms')->group(function () {
    Route::get('/hero',              [\App\Http\Controllers\CmsController::class, 'hero']);
    Route::get('/theme',             [\App\Http\Controllers\CmsController::class, 'theme']);
    Route::get('/navbar',            [\App\Http\Controllers\CmsController::class, 'navbar']);
    Route::get('/president-message', [\App\Http\Controllers\CmsController::class, 'presidentMessage']);
    Route::get('/footer',            [\App\Http\Controllers\CmsController::class, 'footer']);
    Route::get('/contact',           [\App\Http\Controllers\CmsController::class, 'contact']);
    Route::get('/seo',               [\App\Http\Controllers\CmsController::class, 'seo']);
    Route::get('/about',             [\App\Http\Controllers\CmsController::class, 'about']);
    Route::get('/focus-items',       [\App\Http\Controllers\CmsController::class, 'focusItems']);
    Route::get('/team-members',      [\App\Http\Controllers\CmsController::class, 'teamMembers']);
    Route::get('/testimonials',      [\App\Http\Controllers\CmsController::class, 'testimonials']);
    Route::get('/stats',             [\App\Http\Controllers\CmsController::class, 'stats']);
    Route::get('/media/{id}',        [\App\Http\Controllers\CmsController::class, 'media']);
});

Route::get('/landing', [\App\Http\Controllers\LandingController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Blog / News (public)
|--------------------------------------------------------------------------
*/
Route::get('/news',       [\App\Http\Controllers\BlogController::class, 'index']);
Route::get('/news/{slug}',[\App\Http\Controllers\BlogController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Contact / Applications / Payments (public + optional auth)
|--------------------------------------------------------------------------
*/
Route::post('/contact',                [\App\Http\Controllers\ContactController::class, 'store']);
Route::post('/applications',           [\App\Http\Controllers\ApplicationController::class, 'store']);
Route::post('/payments/stripe/intent', [\App\Http\Controllers\PaymentController::class, 'createPaymentIntent']);
Route::post('/payments/paypal/order',  [\App\Http\Controllers\PaymentController::class, 'createPaypalOrder']);

/*
|--------------------------------------------------------------------------
| Placeholder images (SVG)
|--------------------------------------------------------------------------
*/
Route::get('/placeholder/{width}/{height}', function ($width, $height) {
    $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="'.$width.'" height="'.$height.'">'
         . '<rect width="100%" height="100%" fill="#e5e7eb"/>'
         . '<text x="50%" y="50%" font-size="14" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">'
         . $width.'×'.$height.'</text></svg>';
    return response($svg, 200)->header('Content-Type', 'image/svg+xml');
});

/*
|--------------------------------------------------------------------------
| Admin routes (auth + admin middleware)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {

    // Dashboard & Stats
    Route::get('/stats',           [\App\Http\Controllers\Admin\StatsController::class, 'stats']);
    Route::get('/activity',        [\App\Http\Controllers\Admin\StatsController::class, 'activity']);
    Route::get('/upcoming-events', [\App\Http\Controllers\Admin\StatsController::class, 'upcomingEvents']);
    Route::get('/charts',          [\App\Http\Controllers\Admin\StatsController::class, 'charts']);
    Route::get('/dashboard-stats', [\App\Http\Controllers\Admin\StatsController::class, 'dashboardStats']);

    // Analytics
    Route::get('/analytics', [\App\Http\Controllers\Admin\AnalyticsController::class, 'index']);

    // Users
    Route::get('/users',                       [\App\Http\Controllers\Admin\UserController::class, 'index']);
    Route::post('/users',                      [\App\Http\Controllers\Admin\UserController::class, 'store']);
    Route::put('/users/{id}',                  [\App\Http\Controllers\Admin\UserController::class, 'update']);
    Route::delete('/users/{id}',               [\App\Http\Controllers\Admin\UserController::class, 'destroy']);
    Route::post('/users/{id}/toggle-admin',    [\App\Http\Controllers\Admin\UserController::class, 'toggleAdmin']);
    Route::post('/users/{id}/toggle-active',   [\App\Http\Controllers\Admin\UserController::class, 'toggleActive']);
    Route::post('/users/{id}/reset-password',  [\App\Http\Controllers\Admin\UserController::class, 'resetPassword']);

    // Clubs
    Route::get('/clubs',                       [\App\Http\Controllers\Admin\ClubController::class, 'index']);
    Route::post('/clubs/upload-image',         [\App\Http\Controllers\Admin\ClubController::class, 'uploadImage']);
    Route::get('/clubs/{id}',                  [\App\Http\Controllers\Admin\ClubController::class, 'show']);
    Route::post('/clubs',                      [\App\Http\Controllers\Admin\ClubController::class, 'store']);
    Route::put('/clubs/{id}',                  [\App\Http\Controllers\Admin\ClubController::class, 'update']);
    Route::delete('/clubs/{id}',               [\App\Http\Controllers\Admin\ClubController::class, 'destroy']);
    Route::post('/clubs/{id}/approve',         [\App\Http\Controllers\Admin\ClubController::class, 'approve']);
    Route::post('/clubs/{id}/reject',          [\App\Http\Controllers\Admin\ClubController::class, 'reject']);
    Route::post('/clubs/{id}/feature',         [\App\Http\Controllers\Admin\ClubController::class, 'feature']);

    // Journey Events (admin) — also aliased as /events for frontend compatibility
    Route::get('/events',                      [\App\Http\Controllers\Admin\BookingEventAdminController::class, 'index']);
    Route::post('/events',                     [\App\Http\Controllers\Admin\BookingEventAdminController::class, 'store']);
    Route::put('/events/{id}',                 [\App\Http\Controllers\Admin\BookingEventAdminController::class, 'update']);
    Route::delete('/events/{id}',              [\App\Http\Controllers\Admin\BookingEventAdminController::class, 'destroy']);
    Route::get('/booking-events',              [\App\Http\Controllers\Admin\BookingEventAdminController::class, 'index']);
    Route::post('/booking-events',             [\App\Http\Controllers\Admin\BookingEventAdminController::class, 'store']);
    Route::put('/booking-events/{id}',         [\App\Http\Controllers\Admin\BookingEventAdminController::class, 'update']);
    Route::delete('/booking-events/{id}',      [\App\Http\Controllers\Admin\BookingEventAdminController::class, 'destroy']);

    // Bookings
    Route::get('/bookings',                    [\App\Http\Controllers\Admin\BookingController::class, 'index']);
    Route::get('/bookings/{ref}',              [\App\Http\Controllers\Admin\BookingController::class, 'showByRef']);
    Route::put('/bookings/{identifier}/status',    [\App\Http\Controllers\Admin\BookingController::class, 'updateStatus']);
    Route::delete('/bookings/{identifier}',        [\App\Http\Controllers\Admin\BookingController::class, 'destroy']);

    // News / Blog
    Route::get('/news',                        [\App\Http\Controllers\Admin\NewsController::class, 'index']);
    Route::post('/news',                       [\App\Http\Controllers\Admin\NewsController::class, 'store']);
    Route::put('/news/{id}',                   [\App\Http\Controllers\Admin\NewsController::class, 'update']);
    Route::delete('/news/{id}',                [\App\Http\Controllers\Admin\NewsController::class, 'destroy']);

    // Media
    Route::get('/media',                       [\App\Http\Controllers\Admin\MediaController::class, 'index']);
    Route::post('/media',                      [\App\Http\Controllers\Admin\MediaController::class, 'store']);
    Route::delete('/media/{id}',               [\App\Http\Controllers\Admin\MediaController::class, 'destroy']);

    // Settings & SEO
    Route::get('/settings',                    [\App\Http\Controllers\Admin\SettingsController::class, 'show']);
    Route::put('/settings/seo',                [\App\Http\Controllers\Admin\SettingsController::class, 'updateSeo']);
    Route::put('/settings/contact',            [\App\Http\Controllers\Admin\SettingsController::class, 'updateContact']);

    // CMS (admin write)
    Route::put('/cms/hero',                    [\App\Http\Controllers\Admin\CmsAdminController::class, 'updateHero']);
    Route::put('/cms/theme',                   [\App\Http\Controllers\Admin\CmsAdminController::class, 'updateTheme']);
    Route::put('/cms/navbar',                  [\App\Http\Controllers\Admin\CmsAdminController::class, 'updateNavbar']);
    Route::put('/cms/footer',                  [\App\Http\Controllers\Admin\CmsAdminController::class, 'updateFooter']);
    Route::put('/cms/president-message',       [\App\Http\Controllers\Admin\CmsAdminController::class, 'updatePresidentMessage']);
    Route::put('/cms/about',                   [\App\Http\Controllers\Admin\CmsAdminController::class, 'updateAbout']);
    Route::post('/cms/media',                  [\App\Http\Controllers\Admin\CmsAdminController::class, 'uploadMedia']);

    // CMS focus items (dedicated CRUD used by FocusAreasManagement page)
    Route::get('/cms/focus-items',                  [\App\Http\Controllers\Admin\FocusItemController::class, 'index']);
    Route::post('/cms/focus-items',                 [\App\Http\Controllers\Admin\FocusItemController::class, 'store']);
    Route::post('/cms/focus-items/bulk-reorder',    [\App\Http\Controllers\Admin\FocusItemController::class, 'bulkReorder']);
    Route::put('/cms/focus-items/{id}',             [\App\Http\Controllers\Admin\FocusItemController::class, 'update']);
    Route::delete('/cms/focus-items/{id}',          [\App\Http\Controllers\Admin\FocusItemController::class, 'destroy']);

    // CMS bulk-update collections (focus, team, testimonials, stats, partners)
    Route::get('/cms/stats',                   [\App\Http\Controllers\Admin\CmsAdminController::class, 'getCmsStat']);
    Route::post('/cms/stats',                  [\App\Http\Controllers\Admin\CmsAdminController::class, 'updateCmsStat']);
    Route::delete('/cms/stats/{type}/{id}',    [\App\Http\Controllers\Admin\CmsAdminController::class, 'deleteCmsStat']);

    // Membership applications
    Route::get('/applications',                [\App\Http\Controllers\Admin\ApplicationAdminController::class, 'index']);
    Route::put('/applications/{id}',           [\App\Http\Controllers\Admin\ApplicationAdminController::class, 'update']);
    Route::post('/applications/{id}/approve',  [\App\Http\Controllers\Admin\ApplicationAdminController::class, 'approve']);
    Route::post('/applications/{id}/reject',   [\App\Http\Controllers\Admin\ApplicationAdminController::class, 'reject']);
});
