<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClubReview extends Model
{
    public $timestamps = false;
    protected $fillable = ['club_id', 'user_id', 'rating', 'comment'];
    protected $casts = ['created_at' => 'datetime'];
    public function club() { return $this->belongsTo(Club::class, 'club_id'); }
    public function user() { return $this->belongsTo(User::class, 'user_id'); }
}
