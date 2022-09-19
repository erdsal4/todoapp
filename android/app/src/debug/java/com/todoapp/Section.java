package com.todoapp;

import java.util.List;

public class Section {
    public String date;
    public List<Todo> todos;

    public Section(String date, List<Todo> todos) {
        this.date = date;
        this.todos = todos;
    }
}
