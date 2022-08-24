import React , {useState} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import globStyles from './Styles';
import {getCompletedTodos } from './HandleTodo';

const CompletedTodos = ({navigation}) => {
    const [todos, setTodos] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            const fetchCompletedTodos = async () => {
                try {
                    const response = await getCompletedTodos();
                    const json = await JSON.parse(response);
                    if (isActive) {
                        setTodos(json.todos);
                    }
                } catch (err) {
                    console.error(err);
                }
            }

            fetchCompletedTodos();

            return () => {
                isActive = false;
            };
        }, [])
    );

    const renderTodo = ({ item: todo }) => (
        <View style={styles.todo}>
            <TouchableOpacity
                onPress={() => navigation.navigate('TodoDetail', {"todoId": todo.id})}
            >
                <Text style={[globStyles.text, styles.title]}>{todo.title}</Text>
            </TouchableOpacity>
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
        </View>
    )
}

const styles = StyleSheet.create({
    todo: {
        flexDirection: 'row',
        padding: 20,
    },
    title: {
        fontSize: 20,
    }
});

export default CompletedTodos;