/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { appStyles, colores } from '../resources/globalStyles';
import Request, { ErrorHandler } from '../networks/request';
import AlertDialog from '../components/AlertDialog';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import React from 'react';
import { TextInput } from 'react-native-paper';
import { appVersion, keyStorage, testingURL, tokenKey } from '../Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '../db/tables/session';
import TipoUsuario from '../db/tables/tipoUsuario';

function Login({ navigation }) {
    const [usuario, setusuario] = useState(testingURL ? 'usr.dotech' : '');
    const [password, setpassword] = useState(testingURL ? 'Password01' : '');
    const [alertVisible, setalertVisible] = useState(false);
    const [loading, setloading] = useState(false);
    const [errorMessage, seterrorMessage] = useState('');
    const request = new Request();
    const onPosListener = () => {
        seterrorMessage('');
        setalertVisible(false);
    };

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        setusuario(await AsyncStorage.getItem(keyStorage.user) || '');
    };

    const onOkey = { onClick: onPosListener, text: 'OK' };
    async function onLogin() {
        if (!usuario || !password) {
            setalertVisible(true);
            seterrorMessage('Ingrese un usuario y una contraseña');
            return;
        }
        setloading(true);
        setalertVisible(true);
        request.loginUser(usuario, password).then(async (response) => {
            if (response.auth) {
                setalertVisible(false);
                console.log('inicia sesion');
                await AsyncStorage.setItem(tokenKey, response.token);
                await AsyncStorage.setItem(keyStorage.user, usuario);
                const session = new Session();
                await session.removeSession(); // removemos la sesion anterior
                const resp = await request.getTiposUsuario();
                console.log('tipos usuarios ', resp);
                if (resp instanceof ErrorHandler) {
                    setalertVisible(true);
                    seterrorMessage(resp.error);
                    return;
                }
                await (new TipoUsuario()).addAll(resp); // agregamos todo
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
        <View style={appStyles.flexOne}>
            <View style={[appStyles.bodyView, estilos.containerPrincipal]}>
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
            <Text style={[appStyles.mediumTextView, estilos.versionText]}>{`V. ${appVersion}`}</Text>
        </View>
    );
}
const estilos = StyleSheet.create({
    versionText: { flex: 0.1, alignSelf: 'center' },
    containerPrincipal: { flex: 0.9 },
});
export default Login;
