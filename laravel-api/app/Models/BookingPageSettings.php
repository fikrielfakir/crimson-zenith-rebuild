<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingPageSettings extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = [
        'id','title','subtitle','header_background_image','footer_text','contact_email','contact_phone',
        'enable_reviews','enable_similar_events','enable_image_gallery','max_participants',
        'minimum_booking_hours','custom_css','seo_title','seo_description',
    ];
    protected $casts = ['enable_reviews' => 'boolean', 'enable_similar_events' => 'boolean', 'enable_image_gallery' => 'boolean'];
}
