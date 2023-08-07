<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Column extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'task_ids'];

    protected $casts = [
        'name' => 'string',
        'task_ids' => 'json'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function items() {
        return $this->hasMany(Item::class);
    }
}
