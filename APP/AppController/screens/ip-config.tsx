/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import { appStyles } from '../resources/globalStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

function IpConfig({ navigation }) {
  const [ipconfig, setipconfig] = useState('');
  const onClick = () => {
    console.log('entrnado ');
    navigation.replace('Login');
  };

  return (
    <SafeAreaView>
      <TextInput
        label="IP Address" value={ipconfig}
        style={appStyles.textInput} autoCorrect={false} autoCapitalize={'none'}
        onChangeText={setipconfig} />
      <TouchableOpacity style={[appStyles.buttonRound]}
        onPress={onClick}>
        <Text style={appStyles.textButtonLogin}>{'Entrar'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
export default IpConfig;
