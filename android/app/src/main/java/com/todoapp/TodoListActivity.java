package com.todoapp;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class TodoListActivity extends AppCompatActivity  implements ChildRecyclerViewAdapter.ItemClickListener {

    RecyclerViewAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_todo_list);
        initializeListContent();
    }

    private void initializeListContent() {
        // get todos
        DataManager dm = DataManager.getInstance();
        List<Section> todos = dm.getSections();

        // add notes to scroll_todo
        RecyclerView rollTodo = findViewById(R.id.recycler_todos);
        rollTodo.setLayoutManager(new GridLayoutManager(this, 7,GridLayoutManager.VERTICAL,false));
        adapter = new RecyclerViewAdapter(this, todos);
        adapter.setChildClickListener(this);
        rollTodo.setAdapter(adapter);
    }

    @Override
    protected void onResume() {
        super.onResume();
        adapter.notifyDataSetChanged();
    }

    @Override
    public void onItemClick(int todoId) {
        Intent intent = new Intent();
        intent.putExtra("todoId", todoId);
        setResult(Activity.RESULT_OK, intent);
        finish();
    }
}