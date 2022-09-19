package com.todoapp;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class ChildRecyclerViewAdapter extends RecyclerView.Adapter<ChildRecyclerViewAdapter.ViewHolder>{

    private static final int MAX_VISIBLE_TITLE_LENGTH = 10;
    private final LayoutInflater mInflater;
    private final Section mSection;
    private ItemClickListener mItemClickListener;

    ChildRecyclerViewAdapter(Context context, Section data) {
        this.mInflater = LayoutInflater.from(context);
        this.mSection = data;
    }

    @NonNull
    @Override
    public ChildRecyclerViewAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = mInflater.inflate(R.layout.todo_row, parent, false);
        return new ChildRecyclerViewAdapter.ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ChildRecyclerViewAdapter.ViewHolder holder, int position) {
        Todo todo = mSection.todos.get(position);
        holder.bind(todo);
    }

    @Override
    public int getItemCount() {
        return mSection.todos.size();
    }

    public void setClickListener(ItemClickListener itemClickListener) {
        this.mItemClickListener = itemClickListener;
    }

    public interface ItemClickListener {
        void onItemClick(int todoId);
    }

    public class ViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener{
        int todoId;
        TextView todoTitle;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            itemView.setOnClickListener(this);
        }

        public void bind(Todo todo) {
            todoId = todo.getId();
            todoTitle = itemView.findViewById(R.id.todo_title);
            String title = todo.getTitle();
            if(title.length() > MAX_VISIBLE_TITLE_LENGTH){
                title = title.substring(0,MAX_VISIBLE_TITLE_LENGTH) + "...";
            }
            todoTitle.setText(title);
        }

        @Override
        public void onClick(View view) {
            Log.d("CHILDRECYCLERVIEW", "todo " + todoId + " is pressed");
            if (mItemClickListener != null) mItemClickListener.onItemClick(todoId);
        }
    }
}
