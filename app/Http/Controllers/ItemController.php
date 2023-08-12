<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\BasicSwitchRequest;
use App\Http\Requests\StoreRequest;
use App\Http\Requests\SwitchBetweenColumnsRequest;
use App\Http\Requests\SwitchInColumnRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Models\Column;
use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Columns exist
        // $columns = Column::where('user_id', auth()->user()->id)->with('tasks')->get();
        // $columns = Column::where('user_id', auth()->id())->with('tasks')->get();
        $columns = Column::where('user_id', auth()->id())->select('id', 'name', 'task_ids')->get();

        foreach ($columns as $column) {
            $taskIds = $column->task_ids;
            // $tasks = Item::whereIn('id', $taskIds)->orderByRaw("FIELD(id,".implode(",", $taskIds).")")->select('id', 'title', 'description', 'column_id')->get();
            $tasks = Item::whereIn('id', $taskIds)->select('id', 'title', 'description', 'column_id')->get();
            $column->tasks = $tasks;
        }
        
        return response()->json($columns, 200);
        

        // Before columns exist
        // $items = Item::where('user_id', auth()->user()->id)->get();
        // return response()->json($items, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $data = $request->validated();

        $newItem = new Item([
            'title' => $data['title'],
            'description' => $data['description'],
            'content' => $data['content'],
        ]);
        
        $newItem->user()->associate(auth()->user());
        $newItem->column_id = $data['column_id'];
        $newItem->save();

        // $column = Column::find($data['column_id']);
        $column = Column::where('user_id', auth()->id())->where('id', $data['column_id'])->first();
        if (!$column) {
            return response()->json(['message' => 'Column not found'], 404);
        }
        $columnTaskIds = $column->task_ids;
        // array_push($columnTasks, $newItem->id);
        $columnTaskIds[] = $newItem->id;
        $column->task_ids = $columnTaskIds;
        $column->save();

        return response()->json(['message' => 'Item created successfully'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Find the item by ID and ensure it belongs to the currently authenticated user
        // $item = Item::where('id', $id)->where('user_id', auth()->user()->id)->first();
        $item = Item::where('user_id', auth()->id())->where('id', $id)->select('id', 'title', 'description', 'content')->first();

        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        return response()->json($item, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateItemRequest $request, string $id)
    {
        // Find the item by ID and ensure it belongs to the currently authenticated user
        $item = Item::where('user_id', auth()->id())->where('id', $id)->first();

        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $data = $request->validated();

        // Update the item attributes from the request data
        // $item->update($request->all());

        // if (array_key_exists('title', $data)) {
            $item->title = $data['title'];
        // }
        // if (array_key_exists('description', $data)) {
            $item->description = $data['description'];
        // }
        // if (array_key_exists('content', $data)) {
            $item->content = $data['content'];
        // }
        $item->save();



        // if ($request->has('title')) {
        //     $item->name = $request->input('title');
        // }
        // if ($request->has('description')) {
        //     $item->description = $request->input('description');
        // }
        // if ($request->has('content')) {
        //     $item->content = $request->input('content');
        // }
        // $item->save();

        return response()->json(['message' => 'Item updated successfully'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Find the item by ID and ensure it belongs to the currently authenticated user
        $item = Item::where('user_id', auth()->id())->where('id', $id)->first();

        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        // Delete item ID from column
        $columnId = $item->column_id;
        // $column = Column::find($columnId);
        $column = Column::where('user_id', auth()->id())->where('id', $columnId)->first();
        if (!$column) {
            return response()->json(['message' => 'Column not found'], 404);
        }

        $taskIds = $column->task_ids;
        $taskIdIdx = array_search($id, $taskIds);
        if ($taskIdIdx !== false) {
            unset($taskIds[$taskIdIdx]);
        }
        $column->task_ids = array_values($taskIds);
        $column->save();

        // Delete the item
        $item->delete();

        return response()->json(['message' => 'Item deleted successfully'], 200);
    }

    // public function switchInColumn(SwitchInColumnRequest $request) {
    //     $data = $request->validated();
    //     // $task = Item::find($data['task_id']);
    //     $task = Item::where('user_id', auth()->id())->where('id', $data['task_id'])->first();
    //     if (!$task || $task->column_id !== $data['column_id']) {
    //         return response()->json(['message' => 'Item not found'], 404);
    //     }

    //     $startIdx = $data['start_idx'];
    //     $destinationIdx = $data['destination_idx'];
    //     // $column = Column::find($data['column_id']);
    //     $column = Column::where('user_id', auth()->id())->where('id', $data['column_id'])->first();
    //     if (!$column) {
    //         return response()->json(['message' => 'Column not found'], 404);
    //     }

    //     $taskIds = $column->task_ids;
    //     $taskIdIdx = array_search($data['task_id'], $taskIds);
    //     if ($taskIdIdx === false || $taskIdIdx !== $startIdx) {
    //         return response()->json(['message' => 'Item not found'], 404);
    //     }

    //     $removedTaskId = array_splice($taskIds, $startIdx, 1)[0];
    //     $taskIds = array_values($taskIds);

    //     array_splice($taskIds, $destinationIdx, 0, $removedTaskId);
    //     $taskIds = array_values($taskIds);

    //     $column->task_ids = $taskIds;
    //     $column->save();

    //     return response()->json(['message' => 'Item relocated successfully'], 200);
    // }

    // public function switchBetweenColumns(SwitchBetweenColumnsRequest $request) {
    //     $data = $request->validated();
    //     // $task = Item::find($data['task_id']);
    //     $task = Item::where('user_id', auth()->id())->where('id', $data['task_id'])->first();
    //     if (!$task || $task->column_id !== $data['start_column_id']) {
    //         return response()->json(['message' => 'Item not found'], 404);
    //     }

    //     $startColumn = Column::where('user_id', auth()->id())->where('id', $data['start_column_id'])->first();
    //     $destinationColumn = Column::where('user_id', auth()->id())->where('id', $data['destination_column_id'])->first();
    //     if (!$startColumn || !$destinationColumn) {
    //         return response()->json(['message' => 'Column not found'], 404);
    //     }
    //     $startTaskIds = $startColumn->task_ids;
    //     $destinationTaskIds = $destinationColumn->task_ids;
    //     $startRowIdx = $data['start_row_idx'];
    //     $destinationRowIdx = $data['destination_row_idx'];

    //     $taskIdIdx = array_search($data['task_id'], $startTaskIds);
    //     if ($taskIdIdx === false || $taskIdIdx !== $startRowIdx) {
    //         return response()->json(['message' => 'Item not found'], 404);
    //     }

    //     $removedTaskId = array_splice($startTaskIds, $startRowIdx, 1)[0];
    //     $startColumn->task_ids = array_values($startTaskIds);
    //     $startColumn->save();

    //     array_splice($destinationTaskIds, $destinationRowIdx, 0, $removedTaskId);
    //     $destinationColumn->task_ids = array_values($destinationTaskIds);
    //     $destinationColumn->save();

    //     $task->column_id = $destinationColumn->id;
    //     $task->save();

    //     return response()->json(['message' => 'Item relocated successfully'], 200);
    // }

    public function basicSwitch(BasicSwitchRequest $request) {
        $data = $request->validated();
        
        $task = Item::where('user_id', auth()->id())->where('id', $data['task_id'])->first();
        if (!$task || $task->column_id !== $data['start_column_id']) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $startColumn = Column::where('user_id', auth()->id())->where('id', $data['start_column_id'])->first();
        $destinationColumn = Column::where('user_id', auth()->id())->where('id', $data['destination_column_id'])->first();
        if (!$startColumn || !$destinationColumn) {
            return response()->json(['message' => 'Column not found'], 404);
        }
        $startTaskIds = $startColumn->task_ids;
        $destinationTaskIds = $destinationColumn->task_ids;

        $taskIdIdx = array_search($data['task_id'], $startTaskIds);
        if ($taskIdIdx === false) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $removedTaskId = array_splice($startTaskIds, $taskIdIdx, 1)[0];
        $startColumn->task_ids = array_values($startTaskIds);
        $startColumn->save();

        array_push($destinationTaskIds, $removedTaskId);
        $destinationColumn->task_ids = $destinationTaskIds;
        $destinationColumn->save();

        $task->column_id = $destinationColumn->id;
        $task->save();

        return response()->json(['message' => 'Item relocated successfully'], 200);
    }
}
