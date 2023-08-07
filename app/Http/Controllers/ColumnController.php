<?php

namespace App\Http\Controllers;

use App\Models\Column;
use App\Http\Controllers\Controller;
use App\Models\Item;

class ColumnController extends Controller
{
    // /**
    //  * Display a listing of the resource.
    //  */
    // public function index()
    // {
    //     //
    // }

    // /**
    //  * Store a newly created resource in storage.
    //  */
    // public function store(StoreColumnRequest $request)
    // {
    //     //
    // }

    // /**
    //  * Display the specified resource.
    //  */
    // public function show(Column $column)
    // {
    //     //
    // }

    // /**
    //  * Update the specified resource in storage.
    //  */
    // public function update(UpdateColumnRequest $request, Column $column)
    // {
    //     //
    // }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $column = Column::where('user_id', auth()->id())->where('id', $id)->first();

        if (!$column) {
            return response()->json(['message' => 'Item(s) to be deleted not found'], 404);
        }

        $taskIds = $column->task_ids;
        Item::whereIn('id', $taskIds)->delete();

        $column->task_ids = [];
        $column->save();

        return response()->json(['message' => 'Column items deleted successfully'], 200);
    }
}
