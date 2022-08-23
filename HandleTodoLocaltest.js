// import * as ScopedStorage from "react-native-scoped-storage"
const dir = "content://com.android.externalstorage.documents/tree/primary%3Amydata/document/primary%3Amydata";
const path = "content://com.android.externalstorage.documents/tree/primary%3Amydata/document/primary%3Amydata%2Fdata.json";
const localpath = 'data.json';
var fs = require('fs/promises');

function getTodos() {
    /* const data = {"todos":[{"id":1,"title":"food stuff","description":"Prepare dinner","urgency":"1","due":"2022-08-19","completed":true},{"id":2,"title":"take a walk","description":"go out when you come home from the office","urgency":"3","due":"2022-08-25","completed":false},{"id":3,"title":"go shopping","description":"buy eggs, potatoes, tomatoes, olive oil, wet wipes.","urgency":"2","due":"2022-08-23","completed":false},{"id":4,"title":"take a walk","description":"go out when you come home from the office","urgency":"3","due":"2022-08-25","completed":false},{"id":5,"title":"take a walk","description":"go out when you come home from the office","urgency":"3","due":"2022-08-25","completed":false},{"id":6,"title":"take a walk","description":"go out when you come home from the office","urgency":"3","due":"2022-08-25","completed":false}]};
    ScopedStorage.writeFile(dir,JSON.stringify(data), 'data.json'); */

    // read contents of file, make it async
    return new Promise(function (resolve) {
        // let dir = await ScopedStorage.openDocumentTree(true);
        setTimeout(async function () {
            let response;
            try {
                response = await fs.readFile(localpath);
                response = JSON.parse(response);
                const todos = response.todos.filter((el) => !el.completed);
                response.todos = todos;
                console.log(response);
            } catch (er) {
                console.log(er);
            }
            resolve(JSON.stringify(response));
        }, 100);

    });
}

function addNewTodo(todo) {

    // get file writer, make it async
    return new Promise(function (resolve, reject) {
        setTimeout(async function () {
            let currentTodos = await getTodos();
            currentTodos = JSON.parse(currentTodos);
            currentTodos['todos'].push(todo);
            const newTodos = JSON.stringify(currentTodos);
            try {
                ScopedStorage.writeFile(path, newTodos)
                    .then(resolve('success'))
                    .catch(reject('could not add new data'));
            } catch (er) {
                console.log(er);
            }
        }, 100)
    });
}

function markTodosComplete(todoIds) {

    return new Promise(function (resolve, reject) {
        setTimeout(async function () {
            let currentTodos = await getTodos();
            currentTodos = await JSON.parse(currentTodos);
            console.log('currently');
            console.log(currentTodos);
            console.log('updated ids');
            console.log(todoIds);
            currentTodos["todos"]
                .forEach(el => {
                    if (todoIds.includes(el.id)) {
                        el["completed"] = true;
                    }
                });
            console.log('updatedtodos');
            console.log(currentTodos);
            const newTodos = JSON.stringify(currentTodos);
            try {
                fs.writeFile(localpath,newTodos)
                    .then(resolve('success'))
                    .catch(reject('could not update data'));
            } catch (er) {
                console.log(er);
            }
        }, 100)
    });
}

async function main() {
    const stat = await markTodosComplete([3,4]);
    console.log(stat);
    const response = await getTodos();
    const json = await JSON.parse(response);
    console.log("jsonn")
    console.log(json);
}

main();