const RNFS = require('react-native-fs');
const path = RNFS.DocumentDirectoryPath + '/data.json';

export function getAllTodos() {
    /*const data = {"todos": [{"completed": true, "description": "Prepare dinner", "due": "2022-08-19", "id": 1, "title": "food stuff", "urgency": "1"}, {"completed": true, "description": "go out when you come home from the office", "due": "2022-08-25", "id": 2, "title": "take a walk", "urgency": "3"}, {"completed": true, "description": "buy eggs, potatoes, tomatoes, olive oil, wet wipes.", "due": "2022-08-23", "id": 3, "title": "go shopping", "urgency": "2"}, {"completed": true, "description": "go out when you come home from the office", "due": "2022-08-25", "id": 4, "title": "take a walk", "urgency": "3"}, {"completed": true, "description": "go out when you come home from the office", "due": "2022-08-25", "id": 5, "title": "take a walk", "urgency": "3"}, {"completed": true, "description": "go out when you come home from the office", "due": "2022-08-25", "id": 6, "title": "take a walk", "urgency": "3"}, {"completed": true, "description": "checking to see if id logic works", "due": "2022-08-24T20:15:00.000Z", "id": 7, "title": "item id test", "urgency": "3"}, {"completed": true, "description": "test id increment", "due": "2022-08-23T20:16:20.318Z", "id": 8, "title": "another test", "urgency": "-1"}, {"completed": true, "description": "new good todo", "due": "2022-08-23T20:52:45.508Z", "id": 9, "title": "neww", "urgency": "-1"}, {"completed": true, "description": "new todo description", "due": "2022-08-25T23:02:00.000Z", "id": 10, "title": "this is a new todo", "urgency": "-1"}, {"completed": true, "description": "Enter description", "due": "2022-08-26T15:43:00.000Z", "id": 11, "title": "go shopping", "urgency": "-1"}, {"completed": false, "description": "Enter description", "due": "2022-08-29T17:00:00.000Z", "id": 12, "title": "Enter title", "urgency": "-1"}, {"completed": true, "description": "Enter description", "due": "2022-08-27T17:20:00.000Z", "id": 13, "title": "Enter title", "urgency": "-1"}, {"completed": true, "description": "list: - tomatoes - potatoes", "due": "2022-08-27T17:00:00.000Z", "id": 14, "title": "weekend shopping", "urgency": "2"}, {"completed": true, "description": "go to jummah prayer", "due": "2022-08-26T17:15:00.000Z", "id": 15, "title": "jummah", "urgency": "1"}, {"completed": true, "description": "drawer will arrive on saturday. install with 2 people.", "due": "2022-08-28T18:00:00.000Z", "id": 16, "title": "install drawer", "urgency": "2"}, {"completed": true, "description": "Enter description", "due": "2022-08-26T04:00:00.000Z", "id": 17, "title": "Enter title", "urgency": "-1"}, {"completed": true, "description": "Enter description", "due": "2022-08-27T01:16:45.655Z", "id": 18, "title": "Enter title", "urgency": "-1"}, {"completed": true, "description": "something is wrong wth thus aoo", "due": "2022-08-27T01:16:50.501Z", "id": 19, "title": "not workin", "urgency": "-1"}, {"completed": false, "description": "seven day treatment", "due": "2022-08-31T14:00:00.000Z", "id": 20, "title": "take medicine", "urgency": "1"}, {"completed": false, "description": "buy plant for room", "due": "2022-09-03T17:00:00.000Z", "id": 21, "title": "buy plant", "urgency": "3"}]};
    RNFS.writeFile(path,JSON.stringify(data))
    .then((success) => console.log("DATA added"))
    .catch((err) => console.log(err.message));*/

    return new Promise(function (resolve) {
        setTimeout(async function () {
            let response;
            try {
                response = await RNFS.readFile(path);
                response = JSON.parse(response);
                // console.log(response);
            } catch (er) {
                console.log(er);
            }
            resolve(JSON.stringify(response));
        }, 100);

    });
}

export async function getCurrentTodos() {
    let allTodos;
    try {
        allTodos = await getAllTodos();
        allTodos = JSON.parse(allTodos);
        const todos = allTodos.todos.filter((el) => !el.completed);
        allTodos.todos = todos;
    } catch (err) {
        console.log(err)
    }
    return JSON.stringify(allTodos);
}

export async function getCompletedTodos() {
    let allTodos;
    try {
        allTodos = await getAllTodos();
        allTodos = JSON.parse(allTodos);
        const todos = allTodos.todos.filter((el) => el.completed);
        allTodos.todos = todos;
    } catch (err) {
        console.log(err)
    }
    return JSON.stringify(allTodos);
}

export async function getTodoDetails(todoId) {
    let allTodos;
    let todo;
    try {
        allTodos = await getAllTodos();
        allTodos = JSON.parse(allTodos);
        todo = allTodos.todos.filter((el) => el.id == todoId);
    } catch (err) {
        console.log(err)
    }
    return JSON.stringify(todo);
}

function updateTodosTable(newTodos) {
    return new Promise(function (resolve, reject) {
        RNFS.writeFile(path, newTodos)
            .then(resolve('success'))
            .catch((er) => {
                console.log(er);
                reject('could not add new data/update todos table')});
    });
}

export function addNewTodo(todo) {

    return new Promise(function (resolve, reject) {
        setTimeout(async function () {
            let allTodos = await getAllTodos();
            allTodos = JSON.parse(allTodos);
            
            const lastID = allTodos.todos[allTodos.todos.length - 1].id;
            todo['id'] = lastID+1;
            todo['completed'] = false;

            allTodos['todos'].push(todo);
            const newTodos = JSON.stringify(allTodos);
            try {
                const stat = await updateTodosTable(newTodos);
                resolve(stat)
            } catch (er) {
                console.log(er);
                reject(er);
            }
        }, 100)
    });
}

export function markTodosComplete(todoIds) {

    return new Promise(function (resolve, reject) {
        setTimeout(async function () {
            let allTodos = await getAllTodos();
            allTodos = await JSON.parse(allTodos);
            allTodos["todos"]
                .forEach(el => {
                    if (todoIds.includes(el.id)) {
                        el["completed"] = true;
                    }
                });
            console.log('updatedtodos');
            console.log(allTodos);
            const newTodos = JSON.stringify(allTodos);
            try {
                const stat = await updateTodosTable(newTodos);
                resolve(stat)
            } catch (er) {
                console.log(er);
                reject(er);
            }
        }, 100)
    });
}

export async function updateTodo(todo) {
    return new Promise(function (resolve, reject) {
        setTimeout(async function () {
            let allTodos = await getAllTodos();
            allTodos = await JSON.parse(allTodos);
            allTodos["todos"]
                .forEach((el, ind) => {
                    if (todo.id == el.id) {
                        allTodos["todos"][ind] = todo
                    }
                });
            console.log('updatedtodos');
            console.log(allTodos);
            const newTodos = JSON.stringify(allTodos);
            try {
                const stat = await updateTodosTable(newTodos);
                resolve(stat)
            } catch (er) {
                console.log(er);
                reject(er);
            }
        }, 100)
    });
}

export async function deleteTodo(todoId) {
    return new Promise(function (resolve, reject) {
        setTimeout(async function () {
            let allTodos = await getAllTodos();
            allTodos = await JSON.parse(allTodos);
            allTodos["todos"] = allTodos["todos"]
                                .filter(todo => todo.id != todoId);
            console.log('updatedtodos');
            console.log(allTodos);
            const newTodos = JSON.stringify(allTodos);
            try {
                const stat = await updateTodosTable(newTodos);
                resolve(stat);
            } catch (er) {
                console.log(er);
                reject(er);
            }
        }, 100)
    });

}