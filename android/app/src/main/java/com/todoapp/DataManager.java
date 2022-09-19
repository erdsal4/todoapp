package com.todoapp;

import com.facebook.react.bridge.ReadableArray;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class DataManager {
    private static DataManager ourInstance = null;
    private List<Section> mSections = new ArrayList<>();

    public static DataManager getInstance() {
        if(ourInstance == null) {
            ourInstance = new DataManager();
        }
        return ourInstance;
    }


    public List<Section> getSections() {
        return mSections;
    }


    public void writeSections(ReadableArray sections) {
        for (int i = 0; i < sections.size(); i++) {
            String date = sections.getMap(i).getString("date");
            List<Todo> todos = todosFromReadableArray(sections.getMap(i).getArray("data"));
            mSections.add(new Section(date,todos));
        }
    }

    private List<Todo> todosFromReadableArray(ReadableArray data) {
        List<Todo> todos = new ArrayList<>();
        for (int i = 0; i < data.size(); i++) {
            Todo todo = new Todo(data.getMap(i));
            todos.add(todo);
        }
        return todos;
    }

    public void clearInstance() {
        ourInstance = null;
    }
}
