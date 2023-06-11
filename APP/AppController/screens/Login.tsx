/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import ImageButton from '../components/ImageButton';
import {DeviceiOS} from '../Constants';
import {faDoorClosed, faFan} from '@fortawesome/free-solid-svg-icons';
import {appStyles, colores} from '../resources/globalStyles';

function Login({navigation}) {
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
        navigation.navigate('DoorScreen');
      },
    },
  ];
  return (
    <View style={{flex: 1, backgroundColor: colores.PrimaryDark}}>
      <StatusBar
        animated
        backgroundColor={colores.PrimaryDark}
        barStyle={'light-content'}
        showHideTransition={'slide'}
      />
      <View style={{marginBottom: 20}}>
        <Text style={appStyles.headerStyle}>App Controller</Text>
      </View>
      <ScrollView
        style={{
          backgroundColor: colores.white,
          paddingTop: DeviceiOS ? 20 : 0,
        }}>
        {!DeviceiOS && (
          <View style={{backgroundColor: colores.PrimaryDark}}>
            <Text
              style={[
                appStyles.headerStyle,
                {marginTop: 20, marginBottom: 0, color: colores.white},
              ]}>
              {'HOME'}
            </Text>
          </View>
        )}
        <View style={[appStyles.cardView, estilos.cardFlex]}>
          {userOptions.map(e => (
            <View
              style={[estilos.itemsCenter, {minWidth: '40%', maxWidth: '50%'}]}
              key={e.id}>
              <ImageButton
                text={e.text}
                faIcon={e.faIcon}
                buttonColor={e.color}
                buttonSize={75}
                iconColor={colores.white}
                onClick={e.onClick}
                textStyle={{color: colores.irexcoreDegradadoNegro}}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
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
export default Login;
