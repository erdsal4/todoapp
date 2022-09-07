import React from 'react';
import Todos from './src/screens/Todos';
import CompletedTodos from './src/screens/CompletedTodos';
import AddTodo from './src/screens/AddTodo';
import TodoDetail from './src/screens/TodoDetail';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const Home = () => {
  return (
    <Drawer.Navigator initialRouteName="Tdodos">
        <Drawer.Screen name="Todos" component={Todos} />
        <Drawer.Screen name="Completed" component={CompletedTodos} />
    </Drawer.Navigator>
  );

}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName='Home'
        headerMode='screen'
        screenOptions = {{headerShown : false}}
      >
        <Stack.Screen
          name="Home"
          component={Home}
        />
        <Stack.Group screenOptions = {{headerShown : true}}>
          <Stack.Screen 
            name="AddTodo" 
            component={AddTodo} 
          />
          <Stack.Screen 
            name="TodoDetail" 
            component={TodoDetail} 
          />
        </Stack.Group>
      </Stack.Navigator> 
    </NavigationContainer>
    
  );
}

export default App;
