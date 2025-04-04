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
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFingerprint } from '@fortawesome/free-solid-svg-icons';
import { Image } from 'react-native-svg';

function Login({ navigation }) {
    const { showLoading, hideLoading, showAlertError } = useContext(ModalContext);
    const [usuario, setusuario] = useState(testingURL ? 'usr.dotech' : '');
    const [password, setpassword] = useState(testingURL ? 'Password01' : '');
    const request = new Request();
    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        const usrName = await AsyncStorage.getItem(keyStorage.user) || '';
        setusuario(usrName);
        if (usrName.length > 0) {
            const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });
            rnBiometrics.isSensorAvailable()
                .then((resultObject) => {
                    const { available, biometryType } = resultObject;
                    if (available && biometryType === BiometryTypes.FaceID) {
                        console.log('FaceID is supported');
                    } else if (available && biometryType === BiometryTypes.TouchID) {
                        console.log('TouchID is supported');
                    }
                    else if (available && biometryType === BiometryTypes.Biometrics) {
                        console.log('Biometrics is supported');
                    } else {
                        console.log('Biometrics not supported');
                    }
                });
        }
    };

    const getKeyBiometric = async () => {
        const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });
        const key = await AsyncStorage.getItem(keyStorage.biometricKey);
        if (!key) { // si no hay key aqui
            if ((await rnBiometrics.biometricKeysExist()).keysExist) { // si dice que hay una key existente pero no la encuentra
                await rnBiometrics.deleteKeys(); // borra la key anterior por si acaso
            }
            const { publicKey } = await rnBiometrics.createKeys();
            await AsyncStorage.setItem(keyStorage.biometricKey, publicKey);
            return publicKey;
        }
        return key;
    };
    async function onLogin() {
        if (!usuario || !password) {
            showAlertError('Ingrese un usuario y una contraseña');
            return;
        }
        showLoading();
        const keyBiometric = await getKeyBiometric();
        request.loginUser(usuario, password, keyBiometric).then(async (response) => {
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
                <TouchableOpacity style={appStyles.itemsCenter} onPress={onLogin}>
                    <Image href={require('../assets/android_fingerprint.png')} height={100} width={100}/>
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
