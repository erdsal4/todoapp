import React from 'react';
import { View, Text, SectionList, StyleSheet, TouchableOpacity, Image } from "react-native";
import globStyles from '../Styles';
import { CustCheckBox } from './CustCheckBox';

export const TodoList = ({ memoSections, navigation }) => {
    console.log("here3", memoSections.sections);
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
            <Image source={require('../../assets/icons/plus.jpg')} style={styles.icon} />
        </TouchableOpacity>
    )

    return (
        <View style={styles.todoListContainer}>
            <SectionList
                sections={memoSections.sections}
                renderItem={renderTodo}
                renderSectionHeader={renderDate}
                keyExtractor={item => item.id}
                renderSectionFooter={renderAddButton}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    todoRow: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center'
    },
    todoTitle: {
        fontSize: 15,
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
    plusButtonContainer: {
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