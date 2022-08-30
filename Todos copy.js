import React, { useState } from 'react';
import { View, Text, SectionList, StyleSheet, TouchableOpacity, Button, Image } from "react-native";
import CheckBox from '@react-native-community/checkbox';
import { useFocusEffect } from '@react-navigation/native';
import globStyles from './Styles';
import { getAllTodos, getCurrentTodos, markTodosComplete } from './HandleTodo';
import { formatRelative, parseISO } from 'date-fns';
import { locale, dateToString } from './TodosLocale';
import { parseInt } from 'lodash';
var _ = require('lodash');

const CustCheckBox = ({ todoId, addChecked, deleteChecked }) => {
    const [checked, setChecked] = useState(false);

    return (
        <View style={styles.checkboxContainer}>
            <CheckBox
                value={checked}
                tintColors={{ true: '#F15927' }}
                onValueChange={() => {
                    if(checked) {
                        deleteChecked(todoId);
                    } else {
                        addChecked(todoId);
                    }
                    setChecked(!checked);
                }}
                style={[globStyles.text]}
            />
        </View>
    );
}

/*

 app

    useState(checkedTodos)

    - mark complete button -- needs to know if any checked, by using state checkedTodos
    - todos section list
        - checkbox can inherit set CheckedTodos method

*/

const Todos = ({ navigation }) => {
    const [checkedTodos, setCheckedTodos] = useState([]) // initialize state to the number of todos retreived
    const [sections, setSections] = useState([])

    const addChecked = (todoId) => {
        let checked = [...checkedTodos, todoId];
        console.log(checked);
        setCheckedTodos(checked);
    } 

    const deleteChecked = (todoId) => {
        let checked = [...checkedTodos]
        checked.splice(checked.indexOf(todoId));
        setCheckedTodos(checked);
    }

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            if (isActive) fetchTodos();

            return () => {
                isActive = false;
            };
        }, [])
    );

    console.log('todos rerender');

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
                    date: key
                });
            }
            sections = _.orderBy(sections, ['date'], ['asc']);
            setSections(sections);
            setCheckedTodos([]);
        } catch (err) {
            console.error(err);
        }
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
            await fetchTodos();
        } catch (err) {
            console.error(err);
        }
    }

    

    const renderTodo = ({ item: todo }) => (
        <View style={styles.todoRow}>
            <CustCheckBox todoId={todo.id} deleteChecked={deleteChecked} addChecked={addChecked}/>
            <Text style={[globStyles.text, styles.todoTitle]}>{todo.title}</Text>
        </View>
    );

    const renderDate = ({ section: { title } }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
        </View>
    )

    const renderAddButton = ({ section }) => (
        <TouchableOpacity style={styles.plusButtonContainer} onPress={() => navigation.navigate('AddTodo', { "date": section.date })}>
            <Image source={require('./assets/icons/plus.jpg')} style={styles.icon} />
         </TouchableOpacity>
    )

    return (
        <View style={globStyles.mainContainer}>
            {checkedTodos.length != 0 ?
                <View style={styles.markCompleteButtonContainer}>
                    <Button color="#696969" onPress={handleMarkComplete} title="Mark as Complete" />
                </View>
                : ''}
            <View style={styles.todoListContainer}>
                <SectionList
                    sections={sections}
                    renderItem={renderTodo}
                    renderSectionHeader={renderDate}
                    keyExtractor={item => item.id}
                    renderSectionFooter = {renderAddButton}
                />
            </View>
            <TouchableOpacity
                style={globStyles.addButton}
                onPress={() => navigation.navigate('AddTodo')}
            >
                <Text style={globStyles.addButtonText}>New</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    checkboxContainer: {
        paddingRight: 10
    },
    todoRow: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center'
    },
    todoTitle: {
        fontSize: 15,
    },
    markCompleteButtonContainer: {
        flex: 1,
        alignSelf: 'flex-end'
    },
    todoListContainer: {
        flex: 9
    },
    sectionHeader: {
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    sectionHeaderText: {
        fontSize: 20
    },
    icon: {
        width: 24,
        height: 24
    },
    plusButtonContainer : {
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 5,
        flex: 1,
        backgroundColor: 'lightgrey',
        borderRadius: 10,
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'black'
    }
});

export default Todos;
