/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import {appStyles, colores} from '../resources/globalStyles';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faBars,
  faCaretDown,
  faCaretUp,
  faPowerOff,
  faSignal5,
} from '@fortawesome/free-solid-svg-icons';
import {faSnowflake} from '@fortawesome/free-regular-svg-icons';
import ImageButton from '../components/ImageButton';
import {useState} from 'react';
import socketClient from '../resources/socketClient';

function AControllerScreen({navigation}) {
  // const getterAController = 'get/ac_controller';
  const setterAController = 'set/ac_controller';
  const [temperatue, settemperatue] = useState(23);
  const [onOff, setonOff] = useState(false);
  /**
   * funcion de clic del boton
   * 1: apagado
   * 2: subir clima
   * 3: bajar clima
   * 4: encendido
   * 5: menu
   * @param value valor de la funcion
   * @param idInstruccion id de la instruccion
   */
  const onClickAC = (idInstruccion: Number) => {
    const requestBody = {id: idInstruccion, text: ''};
    let textSend = '';
    switch (idInstruccion) {
      case 1:
        textSend = onOff ? 'off' : 'on'; // si el estado actual es true/on significa que se va a apagar
        setonOff(prev => !prev);
        break;
      case 2:
        textSend = temperatue + 1 + '';
        settemperatue(prev => prev + 1);
        break;
      case 3:
        textSend = temperatue - 1 + '';
        settemperatue(prev => prev - 1);
        break;
      default:
        console.error('sin funcionalidad valida');
        return;
    }
    requestBody.text = textSend;
    socketClient.emit(setterAController, requestBody);
  };
  return (
    <SafeAreaView style={{flex: 1.1}}>
      <View style={{flex: 0.4}}>
        <View style={estilos.centerGray}>
          <View style={estilos.centerBlue}>
            <Text style={estilos.textAC}>AC Controller</Text>
            <View style={{borderWidth: 0.5, marginVertical: 5}} />
            <View style={[estilos.gridrows, appStyles.itemsCenter]}>
              <View style={[appStyles.itemsCenter, estilos.numberCenter]}>
                <Text style={[estilos.textAC, estilos.textTemperature]}>
                  {temperatue}
                </Text>
                <Text style={[estilos.textAC, {top: -10}]}>°C</Text>
              </View>
              <View style={estilos.lineCenter} />
              <View style={[estilos.itemRightAC, appStyles.itemsCenter]}>
                <FontAwesomeIcon icon={faSnowflake} size={30} />
                <Text style={[estilos.textAC]}>Frio</Text>
                <View style={estilos.typeConfig} />
                <FontAwesomeIcon
                  icon={faSignal5}
                  size={30}
                  style={{marginTop: 10}}
                />
                <Text style={estilos.textAC}>Media</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={estilos.buttonsGrid}>
        {/** botones */}
        <View style={[{flex: 1, alignItems: 'center'}]}>
          <ImageButton
            onClick={() => {
              onClickAC(5);
            }}
            buttonColor={colores.PrimaryDark}
            text=""
            faIcon={faBars}
            buttonSize={80}
          />
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <ImageButton
            onClick={() => {
              onClickAC(1);
            }}
            buttonColor={onOff ? colores.greenButton : colores.redButton}
            text=""
            faIcon={faPowerOff}
            buttonSize={80}
          />
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <ImageButton
            onClick={() => {
              onClickAC(2);
            }}
            buttonColor={colores.irexcoreDegradadoNegro}
            text=""
            faIcon={faCaretUp}
            buttonSize={80}
          />
          <ImageButton
            onClick={() => {
              onClickAC(3);
            }}
            buttonColor={colores.irexcoreDegradadoNegro}
            text=""
            faIcon={faCaretDown}
            buttonSize={80}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export const estilos = StyleSheet.create({
  centerGray: {
    backgroundColor: colores.grayLite,
  },
  centerBlue: {
    backgroundColor: colores.blueLite,
    margin: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  textTemperature: {
    fontSize: 70,
    fontFamily: 'Play-Bold',
    color: colores.irexcoreDegradadoNegro,
  },
  textAC: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  gridrows: {
    flexDirection: 'row',
  },
  itemRightAC: {
    flex: 0.49,
    marginTop: 20,
  },
  numberCenter: {
    flex: 0.49,
    flexDirection: 'row',
  },
  typeConfig: {
    borderWidth: 0.5,
    marginVertical: 5,
    width: '95%',
  },
  lineCenter: {
    flex: 0.004,
    backgroundColor: colores.irexcoreDegradadoNegro,
    height: '95%',
  },
  buttonsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    flex: 0.7,
  },
});

export default AControllerScreen;
