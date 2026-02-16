<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ProjectController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth User
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Projects
    Route::apiResource('projects', ProjectController::class);

    // Submissions
    Route::post('/submissions', [App\Http\Controllers\SubmissionController::class, 'store']);
    Route::get('/submissions', [App\Http\Controllers\SubmissionController::class, 'index']);
    Route::get('/submissions/{submission}', [App\Http\Controllers\SubmissionController::class, 'show']);

    // Evaluation
    Route::post('/evaluations', [App\Http\Controllers\EvaluationController::class, 'store']);
    Route::get('/projects/{project}/evaluation', [App\Http\Controllers\EvaluationController::class, 'show']);
});
