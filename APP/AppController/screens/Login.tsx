/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { appStyles, colores } from '../resources/globalStyles';
import { TextInput } from 'react-native-paper';

function Login({navigation }) {
    const [usuario, setusuario] = useState('');
    const [password, setpassword] = useState('');
    function onLogin() {
        console.log('logeando..');
        navigation.replace('Menu');
    }
    return (
        <View style={appStyles.bodyView}>
            <Text style={appStyles.textHeader}>Ingresa tu usuario y contraseña</Text>
            <TextInput
                label="Usuario" value={usuario}
                style={appStyles.textInput} autoCorrect={false} autoCapitalize={'none'}
                onChangeText={setusuario}
                left={<TextInput.Icon icon={'account'} iconColor={colores.Primary} />}
                mode="outlined" outlineColor={colores.irexcoreDegradadoNegro}
                activeOutlineColor={colores.Primary} />
            <TextInput
                label="Contraseña" value={password}
                style={appStyles.textInput} autoCorrect={false} autoCapitalize={'none'}
                secureTextEntry
                onChangeText={setpassword}
                left={<TextInput.Icon icon={'lock'} iconColor={colores.Primary} />}
                mode="outlined" outlineColor={colores.irexcoreDegradadoNegro}
                activeOutlineColor={colores.Primary} />
            <TouchableOpacity style={[appStyles.buttonRound]}
                onPress={onLogin}>
                <Text style={appStyles.textButtonLogin}>{'Ingresar'}</Text>
            </TouchableOpacity>
        </View>
    );
}
export default Login;
