package com.todoapp;

import com.facebook.react.bridge.ReadableMap;

public class Todo {
    private String title;
    private String description;
    private String due;
    private int id;

    public Todo(String title, String description, String due, int id) {
        this.title = title;
        this.description = description;
        this.due = due;
        this.id = id;
    }

    public Todo(ReadableMap map) {
        this.title = map.getString("title");
        this.description = map.getString("description");
        this.due = map.getString("due");
        this.id = map.getInt("id");
    }

    public int getId() { return id; }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDue() {
        return due;
    }

    public void setDue(String due) {
        this.due = due;
    }




    @Override
    public String toString() {
        return '\'' + title + "' |" + description;
    }
}
