/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import socketClient from '../resources/socketClient';
import {faLock, faLockOpen} from '@fortawesome/free-solid-svg-icons';
import {appStyles, colores} from '../resources/globalStyles';
import ImageButton from '../components/ImageButton';

//👇🏻 Import socket from the socket.js file in utils folder
function DoorScreen({navigation}) {
  const doorEndpoint = 'get/door';
  const setDoorEndpoint = 'set/door';
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
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={[appStyles.itemsCenter, {flex: 0.4, marginTop: 0}]}>
        <ImageButton
          buttonColor={open ? colores.warningColor : colores.Primary}
          text={open ? 'Abierto ' : 'Cerrado'}
          faIcon={open ? faLockOpen : faLock}
          onClick={() => {
            setopen(prev => {
              socketClient.emit(setDoorEndpoint, !prev ? 'open' : 'close');
              return !prev;
            });
          }}
          buttonSize={150}
          textStyle={{fontSize: 30}}
        />
      </View>
      <View style={estilos.viewDiv}>
        <ScrollView>
          <Text
            style={[
              appStyles.headerStyle,
              {color: colores.irexcoreDegradadoNegro, marginLeft: -10},
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
