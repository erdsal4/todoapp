import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from "react-native";
import globStyles from '../Styles';
import { useFocusEffect } from '@react-navigation/native';
import { getTodoDetails, updateTodo, deleteTodo } from '../api/HandleTodo';
import CheckBox from '@react-native-community/checkbox';

const dateOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
}

const TodoDetail = ({navigation, route}) => {
    const [todo, setTodo] = useState({});
    const [updatedTodo, setUpdatedTodo] = useState({});
    const [isUpdateVisible, setUpdateVisible] = useState(false);
    

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            const fetchTodo = async () => {
                try {
                    const response = await getTodoDetails(route.params.todoId);
                    const json = await JSON.parse(response);
                    if (isActive) {
                        console.log(json);
                        setTodo(json[0]);
                        setUpdatedTodo(json[0]); 
                    }
                } catch (err) {
                    console.error(err);
                }
            }
            fetchTodo();

            return () => {
                isActive = false;
            };
        }, [])
    );

    const handleUpdate = async function () {
        try {
            console.log(updatedTodo);
            const _ = await updateTodo(updatedTodo);
            console.log('update successful');
            setTodo(updatedTodo);
            setUpdateVisible(false);
        } catch (err) {
            console.log(err);
        }
    }

    const handleDelete = async function () {
        try {
            const _ = await deleteTodo(todo.id);
            console.log('delete successful');
            navigation.goBack();
        } catch (err) {
            console.log(err);
        }
    }

    const CustCheckBox = () => {
        return (
            <View style={styles.checkboxContainer}>
                <CheckBox
                    value={updatedTodo.completed ? updatedTodo.completed : false}
                    tintColors={{ true: '#F15927' }}
                    onValueChange={() => {
                        let temp = !updatedTodo.completed;
                        if (updatedTodo.completed){
                            setUpdatedTodo({...updatedTodo, "completed": !updatedTodo.completed});
                        } else {
                            setUpdatedTodo({...updatedTodo, "completed": true});
                        }
                        setUpdateVisible(todo.completed != temp);
                    }}
                    style={[globStyles.text]}
                />
            </View>
        );
    }

    return (
        <View style={globStyles.mainContainer}>
            <View style={styles.formContainer}>
                <View style={styles.formField}>
                    <Text style={styles.labels}>Title:</Text>
                    <Text style={styles.txtinput}>{todo.title}</Text>
                </View>
                <View style={styles.formField}>
                    <Text style={styles.labels}>Description:</Text>
                    <Text style={[styles.txtinput, { maxWidth: '80%' }]}>{todo.description}</Text>
                </View>
                <View style={styles.formField}>
                    <Text style={styles.labels}>Due date:</Text>
                    <Text style={styles.txtinput}>{todo.due}</Text>
                </View>
                <View style={styles.formField}>
                    <Text style={styles.labels}>Urgency:</Text>
                    <Text style={styles.txtinput}>{todo.urgency}</Text>
                </View>
                <View style={styles.formField}>
                    <Text style={styles.labels}>Completed:</Text>
                    <CustCheckBox/>
                </View>
                <View style={styles.buttonRow}>
                    <View style={styles.buttonContainer}>
                        <Button color="#696969" onPress={handleDelete} title="Delete" />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button color="#696969" onPress={handleUpdate} disabled= {!isUpdateVisible} title="Update" />
                    </View>
                </View>
            </View>
        </View>
    );

}

const styles = StyleSheet.create(
    {
        formContainer: {
            flexDirection: 'column',
            flexGrow: 0.8,
            justifyContent: 'center',
            paddingHorizontal: 20,
            paddingTop: 50

        },
        formField: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start'
        },
        txtinput: {
            marginLeft: 10,
            color: 'black'
        },
        buttonRow : {
            flex: 1,
            flexDirection: 'row',
            marginTop: 10,
            justifyContent: 'center',
            alignItems: 'flex-start'
        }, 
        buttonContainer: {
            marginHorizontal: 5,
            flex:1
        }
    
    }
);

export default TodoDetail;