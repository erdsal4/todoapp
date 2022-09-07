import React, { useState, useMemo } from 'react';
import { View } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { formatRelative, parseISO } from 'date-fns';
import {getCurrentTodos, markTodosComplete } from '../api/HandleTodo';
import { locale, dateToString } from '../locales/TodosLocale';
import { TodoList } from '../components/TodoList';
import { MarkCompleteButton, AddTodoButton } from '../components/Buttons';
import globStyles from '../Styles';
var _ = require('lodash');

export const CheckedContext = React.createContext();
const TodoListMemo = React.memo(TodoList);

const Todos = ({ navigation }) => {
    const [checkedTodos, setCheckedTodos] = useState([]);
    const [sections, setSections] = useState([]);
    const memoSections = useMemo(() => ({ sections: sections }), [sections]);
    console.log('todos rerenders');
    
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            if (isActive) fetchTodos();

            return () => {
                isActive = false;
            };
        }, [])
    );

    const fetchTodos = async () => {
        try {
            const response = await getCurrentTodos();
            const json = await JSON.parse(response);
            const todos = json.todos;
            // data processing for section list
            let sections = [];
            const groupedByDate = _.groupBy(todos, todo => dateToString(parseISO(todo.due)));
            for (const [key, value] of Object.entries(groupedByDate)) {
                sections.push({
                    title: formatRelative(new Date(key), new Date(), { locale }),
                    data: value,
                    date: key,
                    dateObj: new Date(key)
                });
            }
            sections = _.orderBy(sections, ['dateObj'], ['asc']);
            setSections(sections);
        } catch (err) {
            console.error(err);
        }
    }

    const addChecked = (todoId) => {
        console.log('checked todos', checkedTodos)
        let checked = [...checkedTodos, todoId];
        console.log('checked', checked);
        setCheckedTodos(checked);
    }

    const deleteChecked = (todoId) => {
        let checked = [...checkedTodos];
        checked.splice(checked.indexOf(todoId));
        console.log('checked', checked);
        setCheckedTodos(checked);
    }

    const handleMarkComplete = async function () {
        // send them to server
        try {
            const _ = await markTodosComplete(checkedTodos);
            console.log('update successful');
        } catch (err) {
            console.log(err);
        }
        // update todos on screen
        try {
            setCheckedTodos([]);
            await fetchTodos();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <View style= {globStyles.mainContainer}>
            {checkedTodos.length != 0 ? <MarkCompleteButton handleMarkComplete={handleMarkComplete} /> : ''}
            <CheckedContext.Provider value={{ addChecked: addChecked, deleteChecked: deleteChecked }}>
                <TodoListMemo memoSections={memoSections} navigation={navigation} />
            </CheckedContext.Provider>
            <AddTodoButton onPress={() => navigation.navigate('AddTodo')} title="New"/>
        </View>
    );
}

export default Todos;
