/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import socketClient from '../../resources/socketClient';
import { appStyles, colores } from '../../resources/globalStyles';
import ImageButton from '../../components/ImageButton';
import { faGear, faHistory, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mqttEvents } from '../../Constants';

//👇🏻 Import socket from the socket.js file in utils folder
function DoorScreen({ navigation, route }: any) {
  const { name } = route?.params; // id
  const timeKey = 'doorTimer';
  const [serverState, setServerState] = useState('');
  const openDate = '22/03/2023 08:20 PM';
  const closeDate = '21/03/2023 11:34 PM';

  const [open, setopen] = useState(false);
  useEffect(() => {
    socketClient.on(mqttEvents.get.door, (val: any) => {
      console.log('entrando a sensores ', val);
      setServerState(val);
      setopen(val === 'open');
    });
    return () => {
      socketClient.off(mqttEvents.get.door);
    };
  }, []);
  const handleButtonDoor = async () => {
    let timer = await AsyncStorage.getItem(timeKey);
    if (!timer) {
      timer = '0';
    }

    if (Date.now() > +timer) {
      console.log('abriendo');
      if (true) { return; }
      await AsyncStorage.setItem(timeKey, '' + (Date.now() + 5000));
      setopen(prev => {
        socketClient.emit(mqttEvents.set.door, '1');
        return !prev;
      });
    }
  };

  const handleOption = (id: number) => {
    switch (id) {
      case 1:
        navigation.navigate('DoorHistory', {name});
        break;
      default:
        break;
    }
  };
  return (
    <SafeAreaView style={[{ justifyContent: 'center', flex: 1, backgroundColor: colores.grayLite}]}>
      <View style={[appStyles.cardView, {marginTop: -20}]}>
        <Text style={[appStyles.textHeader, estilos.textName]}>{name}</Text>
        <Text style={[appStyles.smallTextView, estilos.textLastAction]}>{`Abierto últ. vez: ${openDate}`}</Text>
        <Text style={[appStyles.smallTextView, estilos.textLastAction]}>{`Cerrado últ. vez: ${closeDate}`}</Text>
        <View style={[appStyles.itemsCenter, { marginVertical: 20 }]}>
          <ImageButton
            buttonColor={colores.white}
            text={'Abierto'}
            faIcon={faLockOpen}
            iconColor={colores.irexcoreDegradadoNegro}
            onClick={handleButtonDoor}
            buttonSize={140}
            borderColor={colores.greenLite}
            textStyle={{ fontSize: 20 }} />
          <View style={[appStyles.flexRowCenter, { marginTop: 30 }]}>
            <View style={estilos.optionsCenter}>
              <ImageButton faIcon={faHistory} buttonSize={60} onClick={()=> handleOption(1)}
                buttonColor={colores.white} iconColor={colores.irexcoreDegradadoNegro}
                borderColor={colores.irexcoreDegradadoNegro}/>
            </View>
            <View style={estilos.optionsCenter}>
              <ImageButton faIcon={faGear} buttonSize={60} onClick={()=> handleOption(2)}
                buttonColor={colores.white} iconColor={colores.irexcoreDegradadoNegro} borderColor={colores.irexcoreDegradadoNegro}/>
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
