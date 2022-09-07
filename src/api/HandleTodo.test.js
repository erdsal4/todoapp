import {getTodos, addNewTodo, markTodosComplete} from 'HandleTodo.js';
import * as ScopedStorage from "react-native-scoped-storage"
const data = {"todos":[{"id":1,"title":"food stuff","description":"Prepare dinner","urgency":"1","due":"2022-08-19","completed":true},{"id":2,"title":"take a walk","description":"go out when you come home from the office","urgency":"3","due":"2022-08-25","completed":false},{"id":3,"title":"go shopping","description":"buy eggs, potatoes, tomatoes, olive oil, wet wipes.","urgency":"2","due":"2022-08-23","completed":false},{"id":4,"title":"take a walk","description":"go out when you come home from the office","urgency":"3","due":"2022-08-25","completed":false},{"id":5,"title":"take a walk","description":"go out when you come home from the office","urgency":"3","due":"2022-08-25","completed":false},{"id":6,"title":"take a walk","description":"go out when you come home from the office","urgency":"3","due":"2022-08-25","completed":false}]};

// test if we can update data

afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });

it("renders todo data", async () => {
    
    jest.spyOn(ScopedStorage, "readFile").mockImplementation(() =>
      Promise.resolve(data)
    );
  
    // Use the asynchronous version of act to apply resolved promises
    const ret = await getTodos();
  
    expect(ret).toEqual(data);
  });

