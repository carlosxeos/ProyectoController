/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { NativeStackNavigationOptions, createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Menu from './screens/Menu';
import { colores } from './resources/globalStyles';
import DoorScreen from './screens/Door/DoorScreen';
import AControllerScreen from './screens/AC/AControllerScreen';
import Login from './screens/Login';
import DoorsList from './screens/Door/DoorsList';
import { DoorHistory } from './screens/Door/DoorHistory';
import { ListUsers } from './screens/Users/ListUsers';
import { AddUser } from './screens/Users/AddUser';
import { isDebugApp } from './Constants';
import IpConfig from './screens/ip-config';

const Stack = createNativeStackNavigator();
const defaultOptions: NativeStackNavigationOptions = {
  headerLargeTitle: false,
  statusBarColor: colores.PrimaryDark,
  headerStyle: {
    backgroundColor: colores.PrimaryDark,
  },
  headerTintColor: colores.white,
};
function App(): JSX.Element {// isDebugApp ? 'IpConfig' : 'Login'
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Login'}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: 'Iniciar Sesión',
            headerTintColor: 'white',
            statusBarColor: colores.PrimaryDark,
            headerShadowVisible: false,
            headerShown: true,
            headerStyle: { backgroundColor: colores.PrimaryDark },
          }}
        />
        <Stack.Screen
          name="IpConfig"
          component={IpConfig} />
        <Stack.Screen
          name="Menu"
          component={Menu}
          options={() => {
            const opts = defaultOptions;
            opts.title = 'Inicio';
            return defaultOptions;
          }}
        />
        <Stack.Screen
          name="DoorScreen"
          component={DoorScreen}
          options={() => {
            const opts = defaultOptions;
            opts.title = 'Puertas';
            return defaultOptions;
          }}
        />
        <Stack.Screen
          name="AControllerScreen"
          component={AControllerScreen}
          options={() => {
            const opts = defaultOptions;
            opts.title = 'AC Control';
            return defaultOptions;
          }} />
        <Stack.Screen
          name="DoorsList"
          component={DoorsList}
          options={() => {
            const opts = defaultOptions;
            opts.title = 'Lista de Puertas';
            return defaultOptions;
          }} />
        <Stack.Screen
          name="DoorHistory"
          component={DoorHistory}
          options={({ route }) => {
            const opts = defaultOptions;
            opts.title = route.params?.name || 'Historial';
            return defaultOptions;
          }} />
        <Stack.Screen
          name="ListUsers"
          component={ListUsers}
          options={() => {
            const opts = defaultOptions;
            opts.title = 'Lista de usuarios';
            return defaultOptions;
          }} />
        <Stack.Screen
          name="AddUser"
          component={AddUser}
          options={() => {
            const opts = defaultOptions;
            opts.title = 'Agregar usuario';
            return defaultOptions;
          }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
