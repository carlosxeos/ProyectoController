/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Menu from './screens/Menu';
import {colores} from './resources/globalStyles';
import DoorScreen from './screens/DoorScreen';
import AControllerScreen from './screens/AControllerScreen';
import Login from './screens/Login';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">
      <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: 'Sistema',
            headerTintColor: 'white',
            statusBarColor: colores.redDotech,
            headerShadowVisible: false,
            headerStyle: {backgroundColor: colores.redDotech},
          }}
        />
        <Stack.Screen
          name="Menu"
          component={Menu}
          options={{
            title: '',
            headerShadowVisible: false,
            headerStyle: {backgroundColor: colores.redDotech},
          }}
        />
        <Stack.Screen
          name="DoorScreen"
          component={DoorScreen}
          options={{
            title: 'Door',
            headerLargeTitle: true,
            headerStyle: {
              backgroundColor: colores.redDotech,
            },
            headerTintColor: colores.white,
          }}
        />
        <Stack.Screen
          name="AControllerScreen"
          component={AControllerScreen}
          options={{
            title: 'AC Control',
            headerLargeTitle: false,
            headerStyle: {
              backgroundColor: colores.redDotech,
            },
            headerTintColor: colores.white,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
