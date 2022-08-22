import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import CheckBox from '@react-native-community/checkbox';
import { useFocusEffect } from '@react-navigation/native';
import globStyles from './Styles';
import { getTodos } from './HandleTodo';


const Todos = ({ navigation }) => {
    const [checked, setChecked] = useState([]); // initialize state to the number of todos retreived
    const [todos, setTodos] = useState([]);

    useFocusEffect(
        React.useCallback(() => {            
            let isActive = true;
            const fetchTodos = async () => {
                try {
                    const response = await getTodos();
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

    const CustCheckBox = ({ index }) => {
        return (
            <View style={styles.checkboxContainer}>
                <CheckBox
                    value={checked[index]}
                    onValueChange={() => {
                        let updatedList = [...checked];
                        if (!checked[index]) {
                            updatedList[index] = true
                        } else {
                            updatedList[index] = false
                        }
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
            <View>
                <FlatList
                    data={todos}
                    renderItem={renderTodo}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <TouchableOpacity
                style={globStyles.button}
                onPress={() => navigation.navigate('AddTodo', {itemId: todos[todos.length - 1].id + 1})}
            >
                <Text style={globStyles.buttonText}>New</Text>
            </TouchableOpacity>
        </View>

    )
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
});

export default Todos;
