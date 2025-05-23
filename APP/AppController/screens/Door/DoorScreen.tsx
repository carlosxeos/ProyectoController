/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import socketClient from '../../resources/socketClient';
import { appStyles, colores } from '../../resources/globalStyles';
import ImageButton from '../../components/ImageButton';
import { faGear, faHistory, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDateFormatLocal, timeWaitSeconds, timeWaitUnauthorized, tokenKey, wsEvents } from '../../Constants';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import { Session } from '../../db/tables/session';
import { Porton } from '../../objects/porton';
import { getHorarioFormatting } from '../../utils';
import { ModalContext } from '../../context/modal-provider';

//👇🏻 Import socket from the socket.js file in utils folder
function DoorScreen({ navigation, route }: any) {
  const { token } = route?.params; // id
  const timeKey = 'doorTimer';
  const portonHorariosSemana: string[] = route?.params?.porton.horario.split(',');
  const [porton, setporton] = useState<Porton>(route?.params?.porton);
  const [open, setopen] = useState(route?.params?.porton.idtipomodificacion === 1);
  const [horarios, sethorarios] = useState<string[]>([]);
  const [historyButton, sethistoryButton] = useState(false);
  const { showAlertError } = useContext(ModalContext);
  useEffect(() => {
    //console.log('horario ', moment().day());
    sethorarios(portonHorariosSemana.filter(p => +p[0] === moment().day()));
    // tracker para obtener errores
    socketClient.on('errorTracker', async (response) => {
      console.log('socket invocado ', response);
      if (response?.authFailed) {
        await AsyncStorage.removeItem(tokenKey);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login', params: { closeSession: true } }],
        });
      }
      showAlertError(response?.msg || 'Ha ocurrido un error en la conexión del servicio de ws');
    });
    socketClient.on('roomDoor', (response) => {
      //console.log('respuesta server ', response);
      setporton((prev) => {
        return {
          horario: prev.horario,
          ...response,
        };
      });
      // setServerState(val);
      setopen(response.idtipomodificacion === 1);
    });
    socketClient.on('unauthorizedDoor', (_) => {
      console.warn('puerta sin autorizacion');
      Alert.alert('Aviso', 'No es permitido abrir/cerrar el porton en este horario');
      AsyncStorage.setItem(`${timeKey}-${porton.uuid}`, '' + (Date.now() + (timeWaitUnauthorized * 1000)));
    });
    // enviamos la reunion al uuid correspondiente
    socketClient.emit('join/door', {
      uuid: porton.uuid,
      token: token,
      socketId: socketClient.id,
    });
    (new Session()).getSession().then(s => {
      // si tiene la opcion de agregar usuarios significa que tiene los privilegios mas altos
      sethistoryButton(s.agregarUsuario === 1);
    }).catch(e => {
      console.warn('error al obtener la sesion ', e);
    });
    return () => {
      console.log('sacamdp sesiones');

      socketClient.off('errorTracker');
      socketClient.off('roomDoor');
      socketClient.off('unauthorizedDoor');
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
    let timer = await AsyncStorage.getItem(`${timeKey}-${porton.uuid}`);
    if (!timer) {
      timer = '0';
    }
    if (Date.now() > +timer) {
      console.log('abriendo');
      await AsyncStorage.setItem(`${timeKey}-${porton.uuid}`, '' + (Date.now() + (timeWaitSeconds * 1000)));
      setopen(prev => {
        socketClient.emit(`${wsEvents.set.door}`, {
          uuid: porton.uuid,
          token: token,
          type: porton.idtipomodificacion === 1 ? '0' : '1', // abrir(1) o cerrar(0)
        });
        return !prev;
      });
    } else {
      let seconds = Math.trunc(((+timer) - Date.now()) / 1000);
      if (seconds === 0) {
        seconds = 1;
      }
      Snackbar.show({
        text: `Espere ${seconds} segundo(s) para volver a enviar una acción al portón`,
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const handleOption = (id: number) => {
    switch (id) {
      case 1:
        navigation.navigate('DoorHistory', { uuid: porton.uuid });
        break;
      default:
        break;
    }
  };


  return (
    <SafeAreaView style={[{ justifyContent: 'center', flex: 1, backgroundColor: colores.grayLite }]}>
      <View style={[appStyles.cardView, { marginTop: -20 }]}>
        <Text style={[appStyles.textHeader, estilos.textName]}>{porton.descripcion}</Text>
        <Text style={[appStyles.smallTextView, estilos.textLastAction,
        { fontSize: 14, paddingVertical: 0, color: horarios.length === 0 ? colores.redButton : colores.black }]}>
          {getHorarioFormatting(horarios)}
        </Text>
        <Text style={[appStyles.smallTextView, estilos.textLastAction, { fontSize: 14 }]}>{`${porton.idtipomodificacion === 1 ? 'Abierto' : 'Cerrado'} últ. vez: ${getDateFormatLocal(porton.ultmodificacion)}`}</Text>
        {<Text style={[appStyles.smallTextView, estilos.textLastAction]}>{`Por : ${porton.nombre}`}</Text>}
        <View style={[appStyles.itemsCenter, { marginVertical: 20 }]}>
          <ImageButton
            buttonColor={colores.white}
            text={porton.idtipomodificacion === 1 ? 'Abierto' : 'Cerrado'}
            faIcon={porton.idtipomodificacion === 1 ? faLockOpen : faLock}
            iconColor={colores.irexcoreDegradadoNegro}
            onClick={handleButtonDoor}
            buttonSize={140}
            borderColor={porton.idtipomodificacion === 1 ? colores.greenLite : colores.redButton}
            textStyle={{ fontSize: 20 }} />
          {historyButton && <View style={[appStyles.flexRowCenter, { marginTop: 30 }]}>
            <View style={estilos.optionsCenter}>
              <ImageButton faIcon={faHistory} buttonSize={60} onClick={() => handleOption(1)}
                buttonColor={colores.white} iconColor={colores.irexcoreDegradadoNegro}
                borderColor={colores.irexcoreDegradadoNegro} />
            </View>
          </View>
          }
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
