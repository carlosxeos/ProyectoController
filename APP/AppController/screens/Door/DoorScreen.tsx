/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import socketClient from '../../resources/socketClient';
import { appStyles, colores } from '../../resources/globalStyles';
import ImageButton from '../../components/ImageButton';
import { faHistory, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDateFormatLocal, timeWaitSeconds, timeWaitUnauthorized, tokenKey, wsEvents } from '../../Constants';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import { Session } from '../../db/tables/session';
import { Porton } from '../../objects/porton';
import { getHorarioFormatting } from '../../utils';
import { ModalContext } from '../../context/modal-provider';
import Geolocation from 'react-native-geolocation-service';
import { hasLocationPermission } from '../../resources/PermissionFunctions';
import { isIOS } from 'react-native-elements/dist/helpers';


let initialEnvio = 0;
function DoorScreen({ navigation, route }: any) {
  const { token } = route?.params; // id
  const timeKey = 'doorTimer';
  const portonHorariosSemana: string[] = route?.params?.porton.horario.split(',');
  const [porton, setporton] = useState<Porton>(route?.params?.porton);
  const [open, setopen] = useState(route?.params?.porton.idtipomodificacion === 1);
  const [horarios, sethorarios] = useState<string[]>([]);
  const [historyButton, sethistoryButton] = useState(false);
  const { showAlertError, showAlertWarning, showLoading, hideLoading } = useContext(ModalContext);
  const [sessionUserData, setsessionUserData] = useState<Session>();
  useEffect(() => {
    //console.log('horario ', moment().day());
    sethorarios(portonHorariosSemana.filter(p => +p[0] === moment().day()));
    const session = new Session();
    session.getSession()
      .then(s => setsessionUserData(s))
      .catch(e => {
        console.error('error al obtener data ', e);
      });
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
      setTimeout(() => {
        showAlertError(response?.msg || 'Ha ocurrido un error en la conexión del servicio de ws');
      }, Math.max(initialEnvio - Date.now(), 0));
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
    socketClient.on('unauthorizedDoor', (response) => {
      console.warn('puerta sin autorizacion ' + new Date() + ' initial = ', initialEnvio);
      setTimeout(() => {
        showAlertError(response.msg || 'No es permitido abrir/cerrar el porton por algun motivo, contacte al administrador');
      }, Math.max(initialEnvio - Date.now(), 0));
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
  }, [token]);

  const openCloseWsDoor = async () => {
    showLoading();
    initialEnvio = Date.now() + 700;
    const permisos = await hasLocationPermission();
    if (!permisos) {
      if (isIOS) {
        showAlertWarning('Se necesitan permisos de ubicacion para usar esta app');
      } else {
        showAlertWarning('Se necesitan permisos de ubicación precisa y aproximada para usar esta aplicación');
      }
      return;
    }
    console.log('init ', new Date());
    Geolocation.getCurrentPosition(
      async (position) => {
        await AsyncStorage.setItem(`${timeKey}-${porton.uuid}`, '' + (Date.now() + (timeWaitSeconds * 1000)));
        setopen(prev => {
          console.log('emit msg', new Date());
          console.log('position.mocked ', position.mocked);
          socketClient.emit(`${wsEvents.set.door}`, {
            uuid: porton.uuid,
            token: token,
            type: porton.idtipomodificacion === 1 ? '0' : '1', // abrir(1) o cerrar(0)
            lat: position.coords.latitude,
            long: position.coords.longitude,
            mock: position.mocked,
          });
          hideLoading();
          return !prev;
        });
      },
      (error) => {
        console.log(error.message);
        showAlertWarning('Hubo un error al obtener la ubicación, revise si tiene los permisos de ubicación activados y vuelva a intentar');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, accuracy: { ios: 'best', android: 'high' } }
    );
  };

  const handleButtonDoor = async () => {
    if (sessionUserData?.accionesPorton !== 1) {
      showAlertError('No tiene los permisos para abrir o cerrar portones');
      return;
    }
    const timer = await AsyncStorage.getItem(`${timeKey}-${porton.uuid}`) || '0';
    if (Date.now() > +timer) {
      openCloseWsDoor();
    } else {
      const seconds = Math.max(Math.trunc(((+timer) - Date.now()) / 1000), 1);
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
