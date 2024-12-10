<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['message' => 'Laravel is working!'];
});

Route::get('/test', function () {
    return ['message' => 'Test route is working!'];
});
