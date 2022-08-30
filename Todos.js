import React, { useState, useMemo, useCallback, useContext } from 'react';
import { View, Text, SectionList, StyleSheet, TouchableOpacity, Button, Image } from "react-native";
import CheckBox from '@react-native-community/checkbox';
import { useFocusEffect } from '@react-navigation/native';
import globStyles from './Styles';
import { getAllTodos, getCurrentTodos, markTodosComplete } from './HandleTodo';
import { formatRelative, parseISO } from 'date-fns';
import { locale, dateToString } from './TodosLocale';
var _ = require('lodash');

/*
    todotemplate

    useState(checkedTodos)
    - mark complete button -- needs to know if any checked, by using state checkedTodos
    - todos section list - changing checkedTodos shouldn't change this 
        - checkbox should have access to checkedTodos and setCheckedTodos method

*/
const CheckedContext = React.createContext();

const CustCheckBox = ({ todoId }) => {
    const [checked, setChecked] = useState(false);
    const {addChecked, deleteChecked} = useContext(CheckedContext);
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


const MarkCompleteButton = ({handleMarkComplete}) => {
    console.log("here2");
    return(
        <View>
            <Button color="#696969" onPress={handleMarkComplete} title="Mark as Complete" />
        </View>
        );
}

const TodoList = ({ memoSections, navigation}) => {
    console.log("here3",memoSections.sections);
    const renderTodo = ({ item: todo }) => (
        <View style={styles.todoRow}>
            <CustCheckBox todoId={todo.id}/>
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
        
        <View>
            <View>
                <SectionList
                    sections={memoSections.sections}
                    renderItem={renderTodo}
                    renderSectionHeader={renderDate}
                    keyExtractor={item => item.id}
                    renderSectionFooter = {renderAddButton}
                />
            </View>
        </View>
    );
}

const TodoListMemo = React.memo(TodoList);

const Todos = ({navigation}) => {

    const [checkedTodos, setCheckedTodos] = useState([]);
    const [sections, setSections] = useState([]);
    const memoSections = useMemo(() => ({ sections: sections }), [sections]);
    console.log('todos rerenders')
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
                    date: key
                });
            }
            sections = _.orderBy(sections, ['date'], ['asc']);
            setSections(sections);
        } catch (err) {
            console.error(err);
        }
    }

    const addChecked = (todoId) => {
        console.log('checked todos',checkedTodos)
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

    return(
        <View>
            {checkedTodos.length != 0 ? <MarkCompleteButton handleMarkComplete={handleMarkComplete}/> : ''}
            <CheckedContext.Provider value={{addChecked: addChecked, deleteChecked:deleteChecked}}>
                <TodoListMemo memoSections={memoSections} navigation={navigation}/>
            </CheckedContext.Provider>
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
