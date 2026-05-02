<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MembershipApplication extends Model
{
    protected $fillable = [
        'user_id', 'applicant_name', 'email', 'phone', 'motivation',
        'interests', 'preferred_club', 'status', 'reviewed_by',
        'reviewed_at', 'review_notes',
    ];

    protected $casts = [
        'interests'   => 'array',
        'reviewed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
