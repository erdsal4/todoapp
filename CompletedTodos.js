import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, SectionList, TouchableOpacity } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import globStyles from './Styles';
import { getCompletedTodos } from './HandleTodo';
import { getWeek, parseISO } from 'date-fns';
var _ = require('lodash');

const CompletedTodos = ({ navigation }) => {
    const [todos, setTodos] = useState([]);
    const [sections, setSections] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            if (isActive) fetchCompletedTodos();

            return () => {
                isActive = false;
            };
        }, [])
    );

    const fetchCompletedTodos = async () => {
        try {
            const response = await getCompletedTodos();
            const json = await JSON.parse(response);
            const todos = json.todos;
            let sections = [];
            const groupedByDate = _.groupBy(todos, todo => getWeek(parseISO(todo.due)));
            const thisWeek = getWeek(new Date());
            for (const [key, value] of Object.entries(groupedByDate)) {
                let title = key
                if (key == thisWeek) {
                    title = 'this week'
                }
                else if (key == thisWeek - 1) {
                    title = 'last week';
                }
                else {
                    title = `${thisWeek - key} weeks ago`;
                }
                sections.push({
                    title: title,
                    data: value,
                    week: key
                });
            }
            sections = _.orderBy(sections, ['week'], ['desc']);
            console.log(sections);
            setSections(sections);
        } catch (err) {
            console.error(err);
        }
    }

    const renderTodo = ({ item: todo }) => (
        <View style={styles.todoRow}>
            <TouchableOpacity
                onPress={() => navigation.navigate('TodoDetail', { "todoId": todo.id })}
            >
                <Text style={globStyles.text}>{todo.title}</Text>
            </TouchableOpacity>
        </View>
    );

    const renderDate = ({ section: { title } }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
        </View>
    )

    return (
        <View style={globStyles.mainContainer}>
            <SectionList
                    sections={sections}
                    renderItem={renderTodo}
                    renderSectionHeader={renderDate}
                    keyExtractor={item => item.id}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    sectionHeader: {
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginTop: 5,
        marginBottom: 5
    },
    sectionHeaderText: {
        fontSize: 20
    },
    todoRow: {
        paddingLeft: 15,
    }

});

export default CompletedTodos;