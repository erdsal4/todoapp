import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import globStyles from './Styles';
import DatePicker from 'react-native-date-picker';
import { addNewTodo } from './HandleTodo';

const dateOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
}

const AddTodo = ({ navigation, route }) => {
    const [title, setTitle] = useState("Enter title"); // initialize state to the number of todos retreived
    const [desc, setDesc] = useState("Enter description");
    const [due, setDue] = useState(new Date());
    const [urg, setUrg] = useState("-1");
    const [isDatePickerOpen, setDatePickerOpen] = useState(false);
    const toggleOverlay = () => {
        setDatePickerOpen(!isDatePickerOpen);
    }
    const handleNewTodo = () => {
        // add todo to database, in our case database is just a json file
        const todo = {
            "id": route.params.itemId,
            "title": title,
            "description": desc,
            "due": due,
            "urgency": urg
        }
        // try adding to database
        addNewTodo(todo)
        .then((res) => {
            console.log(res + ". " + "added data: ", todo);
            navigation.navigate("Todos")
        })
        .catch((err) => console.log(err));
        
    }
    return (
        <View style={globStyles.container}>
            <View style={styles.formContainer}>
                <View style={styles.formField}>
                    <Text style={styles.labels}>Title:</Text>
                    <TextInput
                        style={styles.txtinput}
                        onChangeText={title => setTitle(title)}
                        value={title}
                        selectTextOnFocus={true}
                    />
                </View>
                <View style={styles.formField}>
                    <Text style={styles.labels}>Description:</Text>
                    <TextInput
                        multiline
                        style={[styles.txtinput, {maxWidth: '80%'}]}
                        onChangeText={desc => setDesc(desc)}
                        value={desc}
                        selectTextOnFocus={true}
                    />
                </View>
                <View style={styles.formField}>
                    <Text style={styles.labels}>Due date:</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={toggleOverlay}
                    >
                        <Text style={styles.txtinput}>{due.toLocaleString("en-US", dateOptions)}</Text>
                    </TouchableOpacity>
                    <> 
                        <DatePicker
                            modal
                            open={isDatePickerOpen}
                            date={due}
                            onConfirm={(date) => {
                                setDatePickerOpen(false)
                                setDue(date)
                            }}
                            onCancel={() => {
                                setDatePickerOpen(false)
                            }}
                        />
                    </>
                </View>
                <View style={styles.formField}>
                    <Text style={styles.labels}>Urgency:</Text>
                    <TextInput
                        style={styles.txtinput}
                        onChangeText={urg => setUrg(urg)}
                        value={urg}
                        selectTextOnFocus={true}
                    />
                </View>
            </View>
            <TouchableOpacity
                style={globStyles.button}
                onPress={handleNewTodo}
            >
                <Text style={globStyles.buttonText}>Add</Text>
            </TouchableOpacity>
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
            marginLeft: 10
        }
    }
);

export default AddTodo;