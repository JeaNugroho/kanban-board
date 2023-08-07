<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\Column;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function signup(SignupRequest $request) {
        $data = $request->validated();
        if (User::where('email', $data['email'])->exists()) {
            return response()->json(['error' => 'User with this email already exists'], 409);
        }
        
        /** @var User $user */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password'])
        ]);


        // Columns exist
        $todoColumn = new Column([
            'name' => 'To do',
            'task_ids' => []
        ]);
        // $todoColumn->name = 'To do';
        // $todoColumn->tasks = [];
        $user->columns()->save($todoColumn);
        // $todoColumn->user()->associate(auth()->user());
        // $todoColumn->save();

        $inProgressColumn = new Column([
            'name' => 'In progress',
            'task_ids' => []
        ]);
        // $inProgressColumn->name = 'In Progress';
        // $inProgressColumn->tasks = [];
        $user->columns()->save($inProgressColumn);
        // $inProgressColumn->user()->associate(auth()->user());
        // $inProgressColumn->save();

        $doneColumn = new Column([
            'name' => 'Done',
            'task_ids' => []
        ]);
        // $doneColumn->name = 'Done';
        // $doneColumn->tasks = [];
        $user->columns()->save($doneColumn);
        // $doneColumn->user()->associate(auth()->user());
        // $doneColumn->save();


        $token = $user->createToken('main')->plainTextToken;

        return response(compact('user', 'token'));
    }

    public function login(LoginRequest $request) {
        $creds = $request->validated();
        if (!Auth::attempt($creds)) {
            return response([
                'message' => 'Provided email address or password is incorrect'
            ], 422);
        }

        /** @var User $user */
        $user = Auth::user();
        $expiresAt = now()->addMinutes(1);
        $token = $user->createToken('main', ['expires_in' => $expiresAt])->plainTextToken;
        return response(compact('user', 'token'));
    }

    public function logout(Request $request) {
        /** @var User $user */
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response('', 204);
    }
}
