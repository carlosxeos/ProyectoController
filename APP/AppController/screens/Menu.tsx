/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { faDoorClosed, faFan } from '@fortawesome/free-solid-svg-icons';
import { appStyles, colores } from '../resources/globalStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Svg, { Circle } from 'react-native-svg';
import { faUser } from '@fortawesome/free-regular-svg-icons';

function Menu({ navigation }) {
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
      onClick: () => {
        if (true) { // si hay mas de una puerta, entra al list, si no abre directamente la que hay
          navigation.navigate('DoorsList');
        } else {
          navigation.navigate('DoorScreen');
        }
      },
    },
    {
      /** boton de ver horario registrado */
      id: 3,
      text: 'Lista Usuarios',
      faIcon: faUser,
      color: colores.greenButton,
      onClick: () => {
        navigation.navigate('ListUsers');
      },
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
      <FlatList data={userOptions} renderItem={cardOption} />
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
