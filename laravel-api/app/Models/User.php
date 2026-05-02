<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'username', 'password', 'email', 'first_name', 'last_name',
        'profile_image_url', 'bio', 'phone', 'location', 'interests',
        'role', 'is_admin', 'is_active', 'email_verified',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'interests'      => 'array',
        'is_admin'       => 'boolean',
        'is_active'      => 'boolean',
        'email_verified' => 'boolean',
    ];

    public function clubs()
    {
        return $this->hasMany(Club::class, 'owner_id');
    }

    public function memberships()
    {
        return $this->hasMany(ClubMembership::class, 'user_id');
    }

    public function bookingTickets()
    {
        return $this->hasMany(BookingTicket::class, 'user_id');
    }
}
