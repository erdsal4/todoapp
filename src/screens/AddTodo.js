import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import globStyles from '../Styles';
import DatePicker from 'react-native-date-picker';
import { addNewTodo } from '../api/HandleTodo';
import { formatRelative, parseISO } from 'date-fns';
import { locale } from '../locales/AddTodoLocale';
import { AddTodoButton } from '../components/Buttons';

const AddTodo = ({ navigation, route }) => {
    const [title, setTitle] = useState("Enter title"); // initialize state to the number of todos retreived
    const [desc, setDesc] = useState("Enter description");
    const [due, setDue] = useState(new Date());
    const [urg, setUrg] = useState("-1");
    const [isDatePickerOpen, setDatePickerOpen] = useState(false);
    
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            if (isActive && typeof route.params !== 'undefined') setDue(new Date(route.params.date))

            return () => {
                isActive = false;
            };
        }, [])
    );

    const handleNewTodo = () => {
        // add todo to database, in our case database is just a json file
        const todo = {
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

    const toggleOverlay = () => {
        setDatePickerOpen(!isDatePickerOpen);
    }

    return (
        <View style={globStyles.mainContainer}>
            <View style={styles.formContainer}>

                <View style={styles.formFieldContainer}>
                    <Text style={styles.fieldLabel}>Title:</Text>
                    <View style={styles.txtinputContainer}>
                        <TextInput
                            style={styles.txtinput}
                            onChangeText={title => setTitle(title)}
                            value={title}
                            selectTextOnFocus={true}
                        />
                    </View>
                </View>

                <View style={styles.formFieldContainer}>
                    <Text style={styles.fieldLabel}>Description:</Text>
                    <View style={styles.txtinputContainer}>
                        <TextInput
                            multiline
                            style={[styles.txtinput, { maxWidth: '80%' }]}
                            onChangeText={desc => setDesc(desc)}
                            value={desc}
                            selectTextOnFocus={true}
                        />
                    </View>
                </View>

                <View style={styles.formFieldContainer}>
                    <Text style={styles.fieldLabel}>Due date:</Text>
                    <View style={styles.txtinputContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={toggleOverlay}
                        >
                            <Text style={styles.txtinput}>{formatRelative(new Date(due), new Date(), { locale })}</Text>
                        </TouchableOpacity>
                    </View>
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

                <View style={styles.formFieldContainer}>
                    <Text style={styles.fieldLabel}>Urgency:</Text>
                    <View style={styles.txtinputContainer}>
                        <TextInput
                            style={styles.txtinput}
                            onChangeText={urg => setUrg(urg)}
                            value={urg}
                            selectTextOnFocus={true}
                        />
                    </View>
                </View>
            </View>
            <AddTodoButton onPress={handleNewTodo} title="Add"/>
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
        formFieldContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 20
        },
        txtinput: {
            padding: 0,
            paddingLeft: 5,
            color: 'black'
        },
        txtinputContainer: {
            marginLeft: 10,
            flex: 5,
            backgroundColor: 'lightgrey',
            borderRadius: 5,
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth
        },
        fieldLabel: {
            flex: 2
        }
    }
);

export default AddTodo;