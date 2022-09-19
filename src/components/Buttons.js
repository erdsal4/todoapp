import React from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet } from "react-native";

export const MarkCompleteButton = ({ handleMarkComplete }) => {
    return (
        <View style={styles.markCompleteButtonContainer}>
            <Button color="#696969" onPress={handleMarkComplete} title="Mark as Complete" />
        </View>
    );
}

export const AddTodoButton = ({ onPress, title }) => {
    return(
    <TouchableOpacity
        style={styles.addButton}
        onPress={onPress}
    >
        <Text style={styles.addButtonText}>{title}</Text>
    </TouchableOpacity>
    );
}

export const WeeklyViewButton = ({onPress}) => {
    return(
        <TouchableOpacity style={{padding: 5, alignSelf: 'flex-end', backgroundColor: 'white', borderColor: 'lightgray', borderWidth: 2}}
                          onPress={onPress}>
            <Text style={{fontWeight:'bold', fontSize: 15}}>Weekly View</Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    markCompleteButtonContainer: {
        flex: 1,
        alignSelf: 'flex-end'
    },
    addButton: {
        backgroundColor: '#AA4A44',
        borderRadius: 50,
        height: 75,
        width: 75,
        padding: 15,
        margin: 10,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3
    },
    addButtonText: {
        color: '#FAF9F6',
        fontSize: 15
    },
});