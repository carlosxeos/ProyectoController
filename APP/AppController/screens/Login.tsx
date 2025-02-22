/* eslint-disable prettier/prettier */
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { appStyles, colores } from '../resources/globalStyles';
import Request, { ErrorHandler } from '../networks/request';
import React from 'react';
import { TextInput } from 'react-native-paper';
import { appVersion, keyStorage, testingURL, tokenKey } from '../Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '../db/tables/session';
import TipoUsuario from '../db/tables/tipoUsuario';
import { ModalContext } from '../context/modal-provider';

function Login({ navigation }) {
    const { showLoading, hideLoading, showAlertError } = useContext(ModalContext);
    const [usuario, setusuario] = useState(testingURL ? 'usr.dotech' : '');
    const [password, setpassword] = useState(testingURL ? 'Password01' : '');
    const request = new Request();
    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        setusuario(await AsyncStorage.getItem(keyStorage.user) || '');
    };

    async function onLogin() {
        if (!usuario || !password) {
            showAlertError('Ingrese un usuario y una contraseña');
            return;
        }
        showLoading();
        request.loginUser(usuario, password).then(async (response) => {
            if (response.auth) {
                console.log('inicia sesion');
                await AsyncStorage.setItem(tokenKey, response.token);
                await AsyncStorage.setItem(keyStorage.user, usuario);
                const session = new Session();
                await session.removeSession(); // removemos la sesion anterior
                const resp = await request.getTiposUsuario();
                console.log('tipos usuarios ', resp);
                if (resp instanceof ErrorHandler) {
                    showAlertError(resp.error);
                    return;
                }
                await (new TipoUsuario()).addAll(resp); // agregamos todo
                await session.addSession(response);
                hideLoading();
                navigation.replace('Menu');
            } else {
                console.error('err');
                showAlertError(response.error || 'Usuario o contraseña incorrectos');
            }
        }).catch(e => {
            console.error('error ', e);
            showAlertError('Usuario o contraseña incorrectos');
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
