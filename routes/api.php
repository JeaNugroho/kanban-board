<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ColumnController;
use App\Http\Controllers\ItemController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/items', [ItemController::class, 'index']);
    Route::post('/items', [ItemController::class, 'store']);
    Route::prefix('/items')->group(function() {
        Route::get('/{id}', [ItemController::class, 'show']);
        Route::put('/{id}', [ItemController::class, 'update']);
        Route::delete('/{id}', [ItemController::class, 'destroy']);
    });

    // Route::put('/item/switch-in', [ItemController::class, 'switchInColumn']);
    // Route::put('/item/switch-between', [ItemController::class, 'switchBetweenColumns']);
    Route::put('/item/basic-switch', [ItemController::class, 'basicSwitch']);

    Route::delete('columns/{id}', [ColumnController::class, 'destroy']);

    Route::post('/logout', [AuthController::class, 'logout']);
});


Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

