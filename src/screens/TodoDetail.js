import React, { useState } from 'react';
import {View, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput} from "react-native";
import globStyles from '../Styles';
import { useFocusEffect } from '@react-navigation/native';
import {getTodoDetails, updateTodo, deleteTodo, addNewTodo} from '../api/HandleTodo';
import CheckBox from '@react-native-community/checkbox';
import { NativeModules } from 'react-native';
import {formatRelative} from "date-fns";
import {locale} from "../locales/AddTodoLocale";
import DatePicker from "react-native-date-picker";
import _ from "lodash";
const { CalendarModule } = NativeModules;

const TodoDetail = ({navigation, route}) => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [due, setDue] = useState(new Date());
    const [urg, setUrg] = useState("");
    const [comp, setComp] = useState(null);
    const [eventId, setEventId] = useState(null);
    const [isDatePickerOpen, setDatePickerOpen] = useState(false);

    React.useEffect(() => {
        {!route.params.isNew?
        navigation.setOptions({
            headerRight: () => (
                <>
                <TouchableOpacity onPress={handleDelete} >
                    <Image source={require("../../assets/icons/delete.png")} style={globStyles.icon}/>
                </TouchableOpacity>
                    {!eventId ?
                <TouchableOpacity onPress={handleExport}>
                    <Image source={require("../../assets/icons/exportcal.png")} style={globStyles.icon}/>
                </TouchableOpacity> : ''}
                </>
            ),
        }) : ''}
    }, [navigation, title, desc, due, urg, comp, eventId]);

    useFocusEffect(
        React.useCallback(() => {
            console.log("screen becomes focused");
            let isActive = true;
            const fetchTodo = async () => {
                try {
                    const response = await getTodoDetails(route.params.todoId);
                    const json = await JSON.parse(response);
                    if (isActive) {
                        console.log(json);
                        const todo = json[0];
                        setTodoData(todo);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
            if(!route.params.isNew){
                fetchTodo();
            } else {
                if (typeof route.params.date !== 'undefined') setDue(new Date(route.params.date))
            }

            return () => {
                console.log("TODODETAIL: screen becomes unfocused");
                isActive = false;
            };
        }, [])
    );

    const setTodoData = (todo) => {
        setTitle(todo.title);
        setDesc(todo.description);
        setDue(new Date(todo.due));
        setUrg(todo.urgency);
        setComp(todo.completed);
        setEventId(todo.eventId);
    }

    const createTodoFromData = () => {
        const todo = {
            "id": route.params.todoId,
            "title": title,
            "description" : desc,
            "due": due.toISOString(),
            "urgency": urg,
            "completed": comp,
            "eventId" : eventId
        }
        console.log('created todo', todo);
        return todo;
    }

    const handleUpdate = async function () {
        const todo = createTodoFromData();
        const origTodo = JSON.parse(await getTodoDetails(route.params.todoId))[0];
        console.log("changed todo", todo, "orig todo", origTodo);
        if (_.isEqual(todo,origTodo)) {
            console.log("no change to todo");
            return;
        }
        try {
            await updateTodo(todo);
            const res = await todo.eventId ? await CalendarModule.editCalendarEvent(todo, 'edit'): '';
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }

    const handleNewTodo = () => {
        const todo = createTodoFromData();
        // try adding to database
        addNewTodo(todo)
            .then((res) => {
                console.log(res + ". " + "added data: ", todo);
                navigation.navigate("Todos")
            })
            .catch((err) => console.log(err));
    }

    const handleDelete = async function () {
        try {
            const _ = await deleteTodo(route.params.todoId);
            console.log('delete successful');
            navigation.goBack();
        } catch (err) {
            console.log(err);
        }
    }

    const handleExport = async () => {
        const todo = createTodoFromData();
        console.log(todo);
        try {
            const eventId = await CalendarModule.editCalendarEvent(todo, 'insert');
            const localUpdatedTodo = {...todo, "eventId": eventId};
            console.log('localUpdatedTodo', localUpdatedTodo);
            const _ = await updateTodo(localUpdatedTodo);
            setEventId(eventId);
        } catch (e) {
            console.log(e);
        }
    }

    const toggleOverlay = () => {
        setDatePickerOpen(!isDatePickerOpen);
    }

    const CustCheckBox = () => {
        return (
            <CheckBox
                    value={comp}
                    tintColors={{ true: '#F15927' }}
                    onValueChange={() => {
                        setComp(!comp)
                    }}
                    style={[globStyles.text]}
                />
        );
    }

    return (
        <View style={globStyles.mainContainer}>
                <View style={styles.formContainer}>
                    <View style={styles.formFieldContainer}>
                        <Text style={styles.fieldLabel}>Title:</Text>
                        <View style={styles.txtinputContainer}>
                            {route.params.isNew ?
                                <TextInput
                                    style={[styles.txtinput, { maxWidth: '80%' }]}
                                    onChangeText={title => setTitle(title)}
                                    value={title}
                                    selectTextOnFocus={true}
                                /> :
                                <Text style={styles.txtinputReadOnly}>{title}</Text>
                            }
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
                    {!route.params.isNew ?
                    <View style={styles.formFieldContainer}>
                        <Text style={styles.fieldLabel}>Completed:</Text>
                        <View style={styles.checkboxContainer}>
                            <CustCheckBox/>
                        </View>
                    </View> : ''
                    }
                    <View style={styles.buttonRow}>
                        <View style={styles.buttonContainer}>
                            {route.params.isNew ?
                                <Button color="#696969" onPress={handleNewTodo} title="Add" /> :
                                <Button color="#696969" onPress={handleUpdate} title="Update" />
                            }
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
        },
        formFieldContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 20
        },
        txtinput: {
            padding:0,
            paddingLeft:5,
            color: 'black'
        },
        txtinputReadOnly: {
            padding: 5,
            color: 'gray'
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
        },
        checkboxContainer: {
            flex: 5
        }
    
    }
);

export default TodoDetail;