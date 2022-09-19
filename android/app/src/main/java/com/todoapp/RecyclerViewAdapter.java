package com.todoapp;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class RecyclerViewAdapter extends RecyclerView.Adapter<RecyclerViewAdapter.ViewHolder> {

    private List<Section> mSections;
    private LayoutInflater mInflater;
    private ChildRecyclerViewAdapter.ItemClickListener mItemClickListener;

    // data is passed into the constructor
    RecyclerViewAdapter(Context context, List<Section> sections) {
        this.mInflater = LayoutInflater.from(context);
        this.mSections = sections;
    }

    // inflates the row layout from xml when needed
    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = mInflater.inflate(R.layout.recycler_column, parent, false);
        return new ViewHolder(view);
    }

    // binds the data to the TextView in each row
    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        Section todoList = mSections.get(position);
        holder.bind(todoList);
    }

    // total number of columns
    @Override
    public int getItemCount() {
        return mSections.size();
    }

    public void setChildClickListener(ChildRecyclerViewAdapter.ItemClickListener itemClickListener) {
        this.mItemClickListener = itemClickListener;
    }


    // stores and recycles views as they are scrolled off screen
    public class ViewHolder extends RecyclerView.ViewHolder {
        TextView calendarDay;
        RecyclerView todosOnDay;
        ChildRecyclerViewAdapter recyclerViewAdapter;
        Button addButton;

        ViewHolder(View itemView) {
            super(itemView);
            calendarDay = itemView.findViewById(R.id.todo_title);
            todosOnDay = itemView.findViewById(R.id.todos_on_day);
            addButton = itemView.findViewById(R.id.add_button);
        }

        public void bind(Section section) {
            calendarDay.setText(section.date);
            recyclerViewAdapter = new ChildRecyclerViewAdapter(itemView.getContext(), section);
            recyclerViewAdapter.setClickListener(mItemClickListener);
            todosOnDay.setLayoutManager(new LinearLayoutManager(itemView.getContext(), LinearLayoutManager.VERTICAL,false));
            todosOnDay.setAdapter(recyclerViewAdapter);
        }
    }

}
