/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import socketClient from '../../resources/socketClient';
import { appStyles, colores } from '../../resources/globalStyles';
import ImageButton from '../../components/ImageButton';
import { faGear, faHistory, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wsEvents } from '../../Constants';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import Usuario from '../../objects/Usuario';
import { Session } from '../../objects/session';

//👇🏻 Import socket from the socket.js file in utils folder
function DoorScreen({ navigation, route }: any) {
  const { token } = route?.params; // id
  const [porton, setporton] = useState(route?.params?.porton);
  const timeKey = 'doorTimer';
  //const [serverState, setServerState] = useState('');
  const [open, setopen] = useState(route?.params?.porton.idtipomodificacion === 1);
  useEffect(() => {
    socketClient.on('roomDoor', (response) => {
      console.log('respuesta server ', response);
      setporton(response);
      // setServerState(val);
      setopen(response.idtipomodificacion === 1);
    });
    // enviamos la reunion al uuid correspondiente
    socketClient.emit('join/door', {
      uuid: porton.uuid,
      token: token,
      socketId: socketClient.id,
    });
    return () => {
      socketClient.off('roomDoor');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleButtonDoor = async () => {
    const session = new Session();
    const data = await session.getSession();
    if (data?.accionesPorton !== 1) {
      Snackbar.show({
        text: 'No tiene los permisos para abrir o cerrar portones',
        duration: Snackbar.LENGTH_LONG,
      });
      return;
    }
    let timer = await AsyncStorage.getItem(timeKey);
    if (!timer) {
      timer = '0';
    }
    if (Date.now() > +timer) {
      console.log('abriendo');
      await AsyncStorage.setItem(timeKey, '' + (Date.now() + 10000));
      setopen(prev => {
        socketClient.emit(`${wsEvents.set.door}`, {
          uuid: porton.uuid,
          token: token,
          type: porton.idtipomodificacion === 1 ? '0' : '1', // abrir(1) o cerrar(0)
        });
        return !prev;
      });
    } else {
      Snackbar.show({
        text: 'Espere 10 segundos para volver a enviar una acción al portón',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const handleOption = (id: number) => {
    switch (id) {
      case 1:
        navigation.navigate('DoorHistory', {uuid: porton.uuid});
        break;
      default:
        break;
    }
  };
  const getDateTimeString = (date: string) => {
    return moment(date).format('DD/MM/YY hh:mm:ss A');
  };
  return (
    <SafeAreaView style={[{ justifyContent: 'center', flex: 1, backgroundColor: colores.grayLite }]}>
      <View style={[appStyles.cardView, { marginTop: -20 }]}>
        <Text style={[appStyles.textHeader, estilos.textName]}>{porton.descripcion}</Text>
        <Text style={[appStyles.smallTextView, estilos.textLastAction, {fontSize: 14}]}>{`${porton.idtipomodificacion === 1 ? 'Abierto' : 'Cerrado'} últ. vez: ${getDateTimeString(porton.ultmodificacion)}`}</Text>
        {<Text style={[appStyles.smallTextView, estilos.textLastAction]}>{`Por : ${porton.nombre}`}</Text>}
        <View style={[appStyles.itemsCenter, { marginVertical: 20 }]}>
          <ImageButton
            buttonColor={colores.white}
            text={porton.idtipomodificacion === 1 ? 'Abierto' : 'Cerrado'}
            faIcon={porton.idtipomodificacion === 1 ? faLockOpen : faLock}
            iconColor={colores.irexcoreDegradadoNegro}
            onClick={handleButtonDoor}
            buttonSize={140}
            borderColor={porton.idtipomodificacion === 1 ? colores.redButton : colores.greenLite}
            textStyle={{ fontSize: 20 }} />
          <View style={[appStyles.flexRowCenter, { marginTop: 30 }]}>
            <View style={estilos.optionsCenter}>
              <ImageButton faIcon={faHistory} buttonSize={60} onClick={() => handleOption(1)}
                buttonColor={colores.white} iconColor={colores.irexcoreDegradadoNegro}
                borderColor={colores.irexcoreDegradadoNegro} />
            </View>
            <View style={estilos.optionsCenter}>
              <ImageButton faIcon={faGear} buttonSize={60} onClick={() => handleOption(2)}
                buttonColor={colores.white} iconColor={colores.irexcoreDegradadoNegro} borderColor={colores.irexcoreDegradadoNegro} />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
const estilos = StyleSheet.create({
  optionsCenter: {
    flex: 0.5, alignItems: 'center',
  },
  textName: {
    paddingVertical: 10,
    textAlign: 'center',
  },
  textLastAction: {
    paddingVertical: 5,
    textAlign: 'center',
  },
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
