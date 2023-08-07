<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'content'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function column() {
        return $this->belongsTo(Column::class);
    }
}
