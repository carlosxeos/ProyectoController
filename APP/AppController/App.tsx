/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Login from './screens/Login';
import {colores} from './resources/globalStyles';
import DoorScreen from './screens/DoorScreen';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: '',
            headerShadowVisible: false,
            headerStyle: {backgroundColor: colores.PrimaryDark},
          }}
        />
        <Stack.Screen
          name="DoorScreen"
          component={DoorScreen}
          options={{
            title: 'Door',
            headerLargeTitle: true,
            headerStyle: {
              backgroundColor: colores.PrimaryDark,
            },
            headerTintColor: colores.white,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
