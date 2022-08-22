import * as ScopedStorage from "react-native-scoped-storage"
const dir = "content://com.android.externalstorage.documents/tree/primary%3Amydata/document/primary%3Amydata";
const path = "content://com.android.externalstorage.documents/tree/primary%3Amydata/document/primary%3Amydata%2Fdata.json";

export async function getTodos() {
    // read contents of file, make it async
    return new Promise(async function (resolve) {
        // let dir = await ScopedStorage.openDocumentTree(true);
        setTimeout(async function () {
            let response;
            try {
                response = await ScopedStorage.readFile(path);
                console.log(response);
            } catch (er) {
                console.log(er);
            }
            resolve(response);
        }, 100);

    });
}

export async function addNewTodo(todo) {

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