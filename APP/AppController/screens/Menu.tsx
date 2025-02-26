/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { faDoorClosed, faFan } from '@fortawesome/free-solid-svg-icons';
import { appStyles, colores } from '../resources/globalStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Svg, { Circle } from 'react-native-svg';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { useContext, useEffect, useState } from 'react';
import Request, { ErrorHandler } from '../networks/request';
import Snackbar from 'react-native-snackbar';
import { Porton } from '../objects/porton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokenKey } from '../Constants';
import React from 'react';
import Usuario from '../db/tables/usuario';
import { Session } from '../db/tables/session';
import { ModalContext } from '../context/modal-provider';
export const listUserKey = 'usrKeyTimer';
function Menu({ navigation }) {
  const [sessionUser, setsessionUser] = useState<Session | null>();
  const [idOpciones, setidOpciones] = useState([0]);
  const { showLoading, hideLoading, showAlertError} = useContext(ModalContext);
  useEffect(() => {
    handleData();
  }, []);

  const handleData = async () => {
    const localSessionUser = await (new Session()).getSession();
    setsessionUser(localSessionUser);
    setidOpciones(() => {
      const array: number[] = [];
      if (localSessionUser) {
        //if (localSessionUser.accionesClima !== 0) {
        //  array.push(1);
        //}
        if (localSessionUser.accionesPorton !== 0) {
          array.push(2);
        }
        if (localSessionUser.agregarUsuario === 1) {
          array.push(3);
        }
      }
      return array;
    });
  };
  const handlePuerta = async () => {
    const request = new Request();
    const token = await AsyncStorage.getItem(tokenKey);
    if (sessionUser.metadataObject.porton.length === 1) {
      showLoading();
      request.getPorton().then(async (porton: Porton[]) => {
        navigation.navigate('DoorScreen', { porton: porton[0], token });
        hideLoading();
      }).catch((e) => {
        showAlertError('Hubo un error al obtener los portones, intente más tarde');
        console.error('error puerta ', e);
      });
    } else {
      navigation.navigate('DoorsList', { token });
    }
  };

  const handleListClick = async () => {
    const timerList = await AsyncStorage.getItem(listUserKey);
    if (timerList && +timerList > Date.now()) { // abre directo la lista de usuarios
      navigation.navigate('ListUsers');
      return;
    }
    const request = new Request();
    request.getListUsers().then(async (value) => {
      if (value instanceof ErrorHandler) {
        Snackbar.show({
          text: `Hubo un error, comuniquese con el administrador: ${value.error}`,
          duration: Snackbar.LENGTH_LONG,
        });
        return;
      } else {
        const usuario = new Usuario();
        await usuario.addUsers(value);
        await AsyncStorage.setItem(listUserKey, (Date.now() + 300000) + '');// le damos oportunidad de revisar cada 5 min
        navigation.navigate('ListUsers');
      }
    }).catch(e => {
      console.error('error al obtener usuarios ', e);
    });
  };
  const userOptions = [
    {
      /** boton de informacion de usuario */
      id: 1,
      text: 'AC Control',
      faIcon: faFan,
      color: colores.PrimaryDark,
      onClick: () => {
        navigation.navigate('AControllerScreen');
      },
    },
    {
      /** boton de ver horario registrado */
      id: 2,
      text: 'Puerta',
      faIcon: faDoorClosed,
      color: colores.Primary,
      onClick: handlePuerta,
    },
    {
      /** boton de ver horario registrado */
      id: 3,
      text: 'Lista Usuarios',
      faIcon: faUser,
      color: colores.greenButton,
      onClick: handleListClick,
    },
  ];
  const size = 60;
  const cardOption = ({ item }) => {
    const { color, text, faIcon } = item;
    return (
      <View style={appStyles.cardView}>
        <TouchableOpacity activeOpacity={0.8} style={[{ flexDirection: 'row' }]} onPress={item.onClick}>
          <View style={[estilos.itemsCenter, { width: size }]}>
            <Svg height={size} width={size} viewBox="0 0 100 100">
              <Circle cx="50" cy="50" r="45" fill={color} />
            </Svg>
            <View style={estilos.cameraIcon}>
              <FontAwesomeIcon icon={faIcon} size={20} color={'white'} />
            </View>
          </View>
          <Text style={appStyles.itemListView}>{text}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={estilos.rootView}>
      <Text style={[appStyles.textHeader, estilos.headerStyle]}>Menú</Text>
      <FlatList data={
        userOptions.filter(v => idOpciones.findIndex(a => a === v.id) !== -1)
      } renderItem={cardOption} />
    </View>
  );
}

const estilos = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: colores.grayBackgrounds,
  },
  headerStyle: {
    marginHorizontal: 20,
    paddingVertical: 15,
  },
  cameraIcon: {
    zIndex: 2,
    elevation: 2,
    position: 'absolute',
  },
  waveImage: {
    width: '100%',
    height: 100,
    resizeMode: 'stretch',
    tintColor: colores.PrimaryDark,
    backgroundColor: colores.white,
  },
  cardFlex: {
    flexDirection: 'row',
    flex: 2,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  itemsCenter: {
    justifyContent: 'center', //Centered vertically
    alignItems: 'center', // Centered horizontally
  },
});
export default Menu;
