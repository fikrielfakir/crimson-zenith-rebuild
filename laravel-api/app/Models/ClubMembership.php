<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClubMembership extends Model
{
    public $timestamps = false;

    protected $fillable = ['user_id', 'club_id', 'role', 'joined_at', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
        'joined_at' => 'datetime',
    ];

    public function user()   { return $this->belongsTo(User::class, 'user_id'); }
    public function club()   { return $this->belongsTo(Club::class, 'club_id'); }
}
