/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import socketClient from '../resources/socketClient';
import { appStyles, colores } from '../resources/globalStyles';
import ImageButton from '../components/ImageButton';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

//👇🏻 Import socket from the socket.js file in utils folder
function DoorScreen({ navigation }) {
  const doorEndpoint = 'get/door';
  const setDoorEndpoint = 'set/door';
  const timeKey = 'doorTimer';
  const [serverState, setServerState] = useState('');
  const openDate = '22/03/2023 08:20 PM';
  const closeDate = '21/03/2023 11:34 PM';

  const [open, setopen] = useState(false);
  useEffect(() => {
    socketClient.on(doorEndpoint, (val: any) => {
      console.log('entrando a sensores ', val);
      setServerState(val);
      setopen(val === 'open');
    });
    return () => {
      socketClient.off(doorEndpoint);
    };
  }, []);
  const handleButtonDoor = async () => {
    let timer = await AsyncStorage.getItem(timeKey);
    if (!timer) {
      timer = '0';
    }
    if (Date.now() > +timer) {
      console.log('abriendo');
      await AsyncStorage.setItem(timeKey, '' + (Date.now() + 5000));
      setopen(prev => {
        socketClient.emit(setDoorEndpoint, '1');
        return !prev;
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[appStyles.itemsCenter, { flex: 0.4, marginTop: 0 }]}>
        <ImageButton
          buttonColor={colores.irexcoreDegradadoNegro}
          text={'Activo'}
          faIcon={faCircle}
          iconColor={colores.irexcoreDegradadoNegro}
          onClick={handleButtonDoor}
          buttonSize={150}
          textStyle={{ fontSize: 30 }}
        />
      </View>
      <View style={estilos.viewDiv}>
        <ScrollView>
          <Text
            style={[
              appStyles.headerStyle,
              { color: colores.irexcoreDegradadoNegro, marginLeft: -10 },
            ]}>
            Historial
          </Text>
          <Text
            style={
              estilos.textStatus
            }>{`Abierto por ultima vez: \n${openDate}`}</Text>
          <Text
            style={
              estilos.textStatus
            }>{`Cerrado por ultima vez: \n${closeDate}`}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
const estilos = StyleSheet.create({
  textStatus: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    padding: 10,
    color: colores.PrimaryDark,
  },
  viewDiv: {
    flex: 0.6,
    borderTopWidth: 5,
    borderTopColor: colores.irexcoreDegradadoNegro,
  },
});
export default DoorScreen;
