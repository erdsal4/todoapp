import React from 'react';
import Todos from './Todos';
import AddTodo from './AddTodo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App: () => Node = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName='Todos'
        headerMode='screen'
      >
        <Stack.Screen
          name="Todos"
          component={Todos}
        />
        <Stack.Screen 
          name="AddTodo" 
          component={AddTodo} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
