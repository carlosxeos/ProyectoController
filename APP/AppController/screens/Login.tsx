/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { appStyles, colores } from '../resources/globalStyles';
import Request from '../networks/request';
import AlertDialog from '../components/AlertDialog';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { ConnectDB } from '../db/ConectDB';
import { Session } from '../objects/session';
import React from 'react';
import { TextInput } from 'react-native-paper';
import { isDebugApp, keyStorage } from '../Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Login({ navigation }) {
    const [usuario, setusuario] = useState(isDebugApp ? 'usr.dotech' : '');
    const [password, setpassword] = useState(isDebugApp ? 'Password01' : '');
    const [alertVisible, setalertVisible] = useState(false);
    const [loading, setloading] = useState(false);
    const [errorMessage, seterrorMessage] = useState('');
    const request = new Request();
    const onPosListener = () => {
        seterrorMessage('');
        setalertVisible(false);
    };

    useEffect(() => {
        const conDB = new ConnectDB();
        conDB.checkConnection();
        getUser();
    }, []);

    const getUser = async () => {
        setusuario(await AsyncStorage.getItem(keyStorage.user) || '');
    };

    const onOkey = { onClick: onPosListener, text: 'OK' };
    function onLogin() {
        if (!usuario || !password) {
            setalertVisible(true);
            seterrorMessage('Ingrese un usuario y una contraseña');
            return;
        }
        setloading(true);
        setalertVisible(true);
        request.loginUser(usuario, password).then(async (response) => {
            setalertVisible(false);
            if (response.auth) {
                console.log('inicia sesion');
                await AsyncStorage.setItem(keyStorage.user, usuario);
                const session = new Session();
                await session.addSession(response);
                navigation.replace('Menu');
            } else {
                console.error('err');
                seterrorMessage(response.error || 'Usuario o contraseña incorrectos');
            }
        }).catch(e => {
            console.error('error ', e);
            seterrorMessage('Usuario o contraseña incorrectos');
        }).finally(() => {
            setloading(false);
        });
    }
    return (
        <View style={appStyles.bodyView}>
            <Text style={appStyles.textHeader}>Ingresa tu usuario y contraseña</Text>
            <TextInput
                label="Usuario" value={usuario}
                style={appStyles.textInput} autoCorrect={false} autoCapitalize={'none'}
                onChangeText={setusuario}
                //left={<TextInput.Icon icon={'account'} color={colores.Primary} />}
                mode="outlined" outlineColor={colores.irexcoreDegradadoNegro}
                activeOutlineColor={colores.Primary} />
            <TextInput
                label="Contraseña" value={password}
                style={appStyles.textInput} autoCorrect={false} autoCapitalize={'none'}
                secureTextEntry
                onChangeText={setpassword}
                //left={<TextInput.Icon icon={'magnify'} color={colores.Primary} />}
                mode="outlined" outlineColor={colores.irexcoreDegradadoNegro}
                activeOutlineColor={colores.Primary} />
            <TouchableOpacity style={[appStyles.buttonRound]}
                onPress={onLogin}>
                <Text style={appStyles.textButtonLogin}>{'Ingresar'}</Text>
            </TouchableOpacity>
            <AlertDialog
                setVisible={setalertVisible} visible={alertVisible}
                alertColor={colores.redDotech}
                handleNegative={onOkey}
                handleNeutral={undefined} text={errorMessage}
                loading={loading} faIcon={faTimesCircle} />
        </View>
    );
}
export default Login;
