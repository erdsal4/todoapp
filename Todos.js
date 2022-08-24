import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from "react-native";
import CheckBox from '@react-native-community/checkbox';
import { useFocusEffect } from '@react-navigation/native';
import globStyles from './Styles';
import { getAllTodos, getCurrentTodos, markTodosComplete } from './HandleTodo';


const Todos = ({ navigation }) => {
    const [checked, setChecked] = useState([]); // initialize state to the number of todos retreived
    const [todos, setTodos] = useState([]);
    const [isMarkCompleteVisible, setMarkCompleteVisible] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            const fetchTodos = async () => {
                try {
                    const response = await getCurrentTodos();
                    const json = await JSON.parse(response);
                    if (isActive) {
                        setTodos(json.todos);
                        const checked = json.todos.map(_ => false);
                        setChecked(checked);
                    }
                } catch (err) {
                    console.error(err);
                }
            }

            fetchTodos();

            return () => {
                isActive = false;
            };
        }, [])
    );

    const handleMarkComplete = async function () {

        const todoIdsToBeMarkedComplete = checked
            .map((checked, idx) => checked ? idx : -1)
            .filter(i => i !== -1)
            .map((idx) => todos[idx].id);

        // send them to server
        try {
            const _ = await markTodosComplete(todoIdsToBeMarkedComplete);
            console.log('update successful');
        } catch (err) {
            console.log(err);
        }
        // update todos on screen
        try {
            const response = await getCurrentTodos();
            const json = await JSON.parse(response);
            setTodos(json.todos);
            const checked = json.todos.map(_ => false);
            setChecked(checked);
            setMarkCompleteVisible(false);
        } catch (err) {
            console.error(err);
        }
    }

    const CustCheckBox = ({ index }) => {
        return (
            <View style={styles.checkboxContainer}>
                <CheckBox
                    value={checked[index]}
                    tintColors={{ true: '#F15927' }}
                    onValueChange={() => {
                        let updatedList = [...checked];
                        updatedList[index] = !checked[index];
                        setMarkCompleteVisible(updatedList.includes(true));
                        setChecked(updatedList);
                    }}
                    style={[globStyles.text]}
                />
            </View>
        );
    }

    const renderTodo = ({ item: todo, index }) => (
        <View style={styles.todo}>
            <CustCheckBox index={index} />
            <Text style={[globStyles.text, styles.title]}>{todo.title}</Text>
        </View>
    );

    return (
        <View style={globStyles.container}>
            {isMarkCompleteVisible ?
                <View style={styles.markCompleteButton}>
                    <Button color="#696969" onPress={handleMarkComplete} title="Mark as Complete" />
                </View>
                : ''}
            <View>
                <FlatList
                    data={todos}
                    renderItem={renderTodo}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <TouchableOpacity
                style={globStyles.button}
                onPress={() => navigation.navigate('AddTodo')}
            >
                <Text style={globStyles.buttonText}>New</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    checkboxContainer: {
        paddingRight: 10
    },
    todo: {
        flexDirection: 'row',
        padding: 20,
    },
    title: {
        fontSize: 20,
    },
    markCompleteButton: {
        alignSelf: 'flex-end'
    }
});

export default Todos;
