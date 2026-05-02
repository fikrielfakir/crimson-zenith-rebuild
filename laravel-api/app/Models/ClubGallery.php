<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClubGallery extends Model
{
    public $timestamps = false;
    protected $fillable = ['club_id', 'image_url', 'caption', 'uploaded_by'];
    public function club() { return $this->belongsTo(Club::class, 'club_id'); }
}
