/* eslint-disable prettier/prettier */
import { StyleSheet } from 'react-native';
import { DeviceiOS } from '../Constants';

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
  redDotech: '#a62527',
  grayBackgrounds: '#ebecf2',
  cardBlackBackground: 'rgba(81, 81, 81,1)',
  greenLite: '#29E18B',
  blackLight: '#8a8686', //Color para degradado tipo sombra

});

export const appStyles = StyleSheet.create({
  textView: {
    marginTop: 5,
    color: colores.white,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Signika-Medium',
  },
  headerStyle: {
    fontSize: DeviceiOS ? 32 : 24,
    fontFamily: 'Poppins-Bold',
    color: colores.white,
    paddingHorizontal: 20,
  },
  cardView: {
    //card effect
    shadowColor: colores.irexcoreDegradadoNegro,
    shadowOffset: { width: 0, height: 1 },
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
  textHeader: {
    fontSize: DeviceiOS ? 32 : 24,
    fontFamily: 'RobotoSlab-Regular',
    color: colores.irexcoreDegradadoNegro,
    paddingVertical: '8%',
  },
  textInput: {
    marginVertical: 10,
    color: colores.irexcoreDegradadoNegro,
  },
  bodyView: {
    paddingHorizontal: 20,
  },
  buttonRound: {
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colores.PrimaryDark,
    paddingVertical: 15,
  },
  textButtonLogin: {
    color: colores.white,
    fontSize: 18,
    fontFamily: 'RobotoSlab-Regular',
  },
  itemListView: {
    color: colores.irexcoreDegradadoNegro,
    fontSize: 18,
    fontFamily: 'RobotoSlab-Regular',
    textAlignVertical: 'center',
    marginHorizontal: 20,
  },
  itemSelection: {
    fontFamily: 'Signika-Medium',
    fontSize: DeviceiOS ? 14 : 11,
    margin: DeviceiOS ? 4 : 2,
  },
  mediumTextView: {
    marginTop: 5,
    color: colores.cardBlackBackground,
    fontSize: 18,
    fontFamily: 'RobotoSlab-Regular',
  },
  smallTextView: {
    marginTop: 2,
    color: colores.cardBlackBackground,
    fontSize: 12,
    fontFamily: 'RobotoSlab-Regular',
  },
  flexRowCenter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center', //Centered vertically
    alignItems: 'center', // Centered horizontally
  },
  titleView: {
    marginTop: 5,
    color: colores.white,
    fontSize: 30,
    textAlign: 'center',
    fontFamily: 'Signika-Medium',
  },
  screen: {
    backgroundColor: colores.grayBackgrounds,
    flex: 1,
  },
  imageRound: {
    borderRadius: 120 / 2,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: colores.irexcoreDegradadoNegro,
  },
});


export const usuariosDummy = [
  {
      id: 0, name: 'Luis Huerta', type: 'Admin',
      phone: '8183091232', permission: [1, 2],
  },
  {
      id: 1, name: 'Carlos Gzz', type: 'user',
      phone: '8110262869', permission: [2],
  }
];
