const RNFS = require('react-native-fs');
const path = RNFS.DocumentDirectoryPath + '/data.json';

export function getAllTodos() {
    /* const data = {"todos":[{"id":1,"title":"food stuff","description":"Prepare dinner","urgency":"1","due":"2022-08-19","completed":true},{"id":2,"title":"take a walk","description":"go out when you come home from the office","urgency":"3","due":"2022-08-25","completed":false},{"id":3,"title":"go shopping","description":"buy eggs, potatoes, tomatoes, olive oil, wet wipes.","urgency":"2","due":"2022-08-23","completed":false},{"id":4,"title":"take a walk","description":"go out when you come home from the office","urgency":"3","due":"2022-08-25","completed":false},{"id":5,"title":"take a walk","description":"go out when you come home from the office","urgency":"3","due":"2022-08-25","completed":false},{"id":6,"title":"take a walk","description":"go out when you come home from the office","urgency":"3","due":"2022-08-25","completed":false}]};
    RNFS.writeFile(path,JSON.stringify(data))
    .then((success) => console.log("DATA added"))
    .catch((err) => console.log(err.message)); */

    return new Promise(function (resolve) {
        setTimeout(async function () {
            let response;
            try {
                response = await RNFS.readFile(path);
                response = JSON.parse(response);
                console.log(response);
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
                RNFS.writeFile(path, newTodos)
                    .then(resolve('success'))
                    .catch(reject('could not add new data'));
            } catch (er) {
                console.log(er);
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
                RNFS.writeFile(path,newTodos)
                    .then(resolve('success'))
                    .catch(reject('could not update data'));
            } catch (er) {
                console.log(er);
            }
        }, 100)
    });
}