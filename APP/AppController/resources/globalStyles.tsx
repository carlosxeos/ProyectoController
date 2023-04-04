import {StyleSheet} from 'react-native';
import {DeviceiOS} from '../Constants';

export const colores = Object.freeze({
  PrimaryDark: 'rgba(62, 107, 182,1)', // Colores principales aplicacion 62, 107, 182
  Primary: '#4A89A6', // Color para componentes de toolbars, bottom bar, etc
  irexcoreWaveClrInicio: '#3488E4', //diseno olas
  white: '#FFFFFFFF',
  irexcoreDegradadoNegro: '#353434', //Color para degradado tipo sombra
  warningColor: '#eb7149',
  grayLite: 'rgba(249, 249, 249,1)',
  blueLite: 'rgba(197, 216, 226,1)',
  redButton: '#e62222',
  greenButton: '#58a12b',
});

export const appStyles = StyleSheet.create({
  headerStyle: {
    fontSize: DeviceiOS ? 32 : 24,
    fontFamily: 'Poppins-Bold',
    color: colores.white,
    paddingHorizontal: 20,
  },
  cardView: {
    //card effect
    shadowColor: colores.irexcoreDegradadoNegro,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    elevation: 2,
    // fin card effect
    borderRadius: 5,
    padding: 10,
    backgroundColor: colores.white,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  itemsCenter: {
    justifyContent: 'center', //Centered vertically
    alignItems: 'center', // Centered horizontally
  },
});
