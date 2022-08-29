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

const Todos = ({ navigation }) => {
    const [checked, setChecked] = useState({}); // initialize state to the number of todos retreived
    const [sections, setSections] = useState([])
    const [isMarkCompleteVisible, setMarkCompleteVisible] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            if (isActive) fetchTodos();

            return () => {
                isActive = false;
            };
        }, [])
    );

    console.log('rerender');

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

            // set checked values 
            let checked = {}
            todos.forEach(todo => {
                checked[todo.id] = false
            });

            setSections(sections);
            setChecked(checked);
        } catch (err) {
            console.error(err);
        }
    }

    const handleMarkComplete = async function () {
        // get keys of checked items
        let todoIdsToBeMarkedComplete = _.flow(
            Object.entries,
            arr => arr.filter(([key, value]) => value),
            Object.fromEntries
        )(checked);
        todoIdsToBeMarkedComplete = Object.keys(todoIdsToBeMarkedComplete).map(parseInt);

        // send them to server
        try {
            const _ = await markTodosComplete(todoIdsToBeMarkedComplete);
            console.log('update successful');
        } catch (err) {
            console.log(err);
        }

        // update todos on screen
        try {
            await fetchTodos();
            setMarkCompleteVisible(false);
        } catch (err) {
            console.error(err);
        }
    }

    const CustCheckBox = ({ todoId }) => {
        return (
            <View style={styles.checkboxContainer}>
                <CheckBox
                    value={checked[todoId]}
                    tintColors={{ true: '#F15927' }}
                    onValueChange={() => {
                        let updatedChecked = { ...checked };
                        updatedChecked[todoId] = !checked[todoId];
                        setMarkCompleteVisible(Object.values(updatedChecked).includes(true));
                        setChecked(updatedChecked);
                    }}
                    style={[globStyles.text]}
                />
            </View>
        );
    }

    const renderTodo = ({ item: todo }) => (
        <View style={styles.todoRow}>
            <CustCheckBox todoId={todo.id} />
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
            {isMarkCompleteVisible ?
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
