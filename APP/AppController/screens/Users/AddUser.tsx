/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import { Alert, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { WorkerInputs, DeviceiOS } from '../../Constants';
import { colores, appStyles } from '../../resources/globalStyles';
import { ComponentForm } from '../../views/FormList/ComponentsForms';
import Request, { ErrorHandler } from '../../networks/request';
import { Porton } from '../../objects/porton';
import { ModalContext } from '../../context/modal-provider';
import Usuario from '../../db/tables/usuario';
import { AlertDialogCallback } from '../../objects/alertdialog-callback';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { listUserKey } from '../Menu';

/**
 * Pantalla para agregar usuarios nuevos
 */
export function AddUser({ route, navigation }) {

    const { showLoading, hideLoading, showAlertError, showAlertWarning, showAlertSucess } = useContext(ModalContext);
    let count = 11;
    const [form, setform] = useState({});
    const [idError, setidError] = useState(-1);
    const [inputs, setinputs] = useState([]);
    const [boxPortones, setboxPortones] = useState<[{ id, text, uuid }]>([] as any);
    const [showDelete, setshowDelete] = useState(false);
    const request = new Request();
    const data: ErrorHandler | Porton[] = route?.params?.data; // id
    const { isEdit, isAdmin } = route?.params;
    const usuario: Usuario = route?.params?.usuario;
    const passwordQuestions = [5, 6];
    const [showEditPassword, setshowEditPassword] = useState(true);
    useEffect(() => {
        getPortones();
    }, []);

    const getPortones = async () => {
        setinputs(() => {
            //si es edicion de un usuario, ya que comparten todas las funciones
            if (isEdit) {
                if (data instanceof ErrorHandler) {
                    return WorkerInputs.filter(f => f.editable);
                }
                const json: MetadataObject = usuario.getMetadataJson(usuario);
                const val: [{ id, text, uuid }] = [] as any;
                for (const element of data) {
                    val.push({
                        id: count++,
                        text: element.descripcion,
                        uuid: element.uuid,
                    });
                }
                setboxPortones(val);
                setform((prev) => {
                    const selectedBoxes = {};
                    for (const element of val) {
                        if (json.porton.findIndex(f => f.uuid === element.uuid) !== -1) {
                            selectedBoxes[element.id] = true;
                        }
                    }
                    return {
                        ...prev,
                        [1]: usuario.nombreCompleto,// insertamos manualmente el nombre
                        ...selectedBoxes,
                    };
                });
                return [...WorkerInputs.filter(f => f.editable), { id: 8, hint: 'Seleccione portones a los cuales va a tener acceso', type: 'checkbox', box: val }];
            }
            // en caso que sea un nuevo usuario
            // en caso que no pudieran obtenerse los portones
            if (data instanceof ErrorHandler) {
                return WorkerInputs;
            }
            const val: [{ id, text, uuid }] = [] as any;
            for (const element of data) {
                val.push({
                    id: count++,
                    text: element.descripcion,
                    uuid: element.uuid,
                });
            }
            setboxPortones(val);
            return [...WorkerInputs, { id: 8, hint: 'Seleccione portones a los cuales va a tener acceso', type: 'checkbox', box: val }];
        });
    };

    const validateForm = (): string => {
        for (const v of inputs) {
            // si es titulo no hay que revisar
            if (v.type === 'title' || v.type === 'checkbox') {
                continue;
            }
            const valueForm = form[v.id];
            console.log('value ' + v.id, ': ', valueForm);
            // si esta vacio el campo, da error directamente
            if (!valueForm) {
                return v?.error;
            }
            if (v?.minLength && v?.minLength > valueForm.length) {
                return v?.error;
            }
            if (v?.maxLength && valueForm.length > v?.maxLength) {
                return v?.error;
            }
            if (v?.regex && !(v?.regex).test(valueForm)) {
                return v?.error;
            }
        }
        // revisa si las contraseñas no son iguales
        if (form[5] !== form[6]) {
            return 'La contraseña con coincide';
        }
        return '';
    };
    const nextAction = async () => {
        const errorString = validateForm();
        if (errorString.length > 0) {
            showAlertError(errorString);
        }
        else {
            const filterBoxPortones = boxPortones.filter(b => form[b.id]);
            if (filterBoxPortones.length > 0) {
                showLoading();
                // si es edicion es diferente el proceso desde aqui
                if (isEdit) {
                    hideLoading();
                    navigation.navigate('DetailDoorUser', { form, portones: filterBoxPortones, isEdit, usuario });
                } else {
                    if (await request.checkUsername(form[4])) {
                        hideLoading();
                        navigation.navigate('DetailDoorUser', { form, portones: filterBoxPortones });
                    } else {
                        hideLoading();
                        showAlertError('El username es inválido o ya existe');
                    }
                }
            } else {
                showAlertError('Selecciona al menos un portón');
            }
        }
    };

    const deleteUser = async () => {
        showLoading();
        const response = await request.deleteUser(usuario.idUsuario);
        if (response) {
            showAlertError(`Error: ${response}`);
        } else {
            // hacemos que obtenga todos los usuarios para refrescar
            AsyncStorage.setItem(listUserKey, '1');
            const callback: AlertDialogCallback = {
                onClick: async () => {
                    return true;
                },
                text: 'Aceptar',
            };
            showAlertSucess('Usuario eliminado', callback);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Menu' }],
            });
        }
        return false;
    };

    const deleteAction = () => {
        const callbackConfirm: AlertDialogCallback = {
            text: 'Si',
            onClick: deleteUser,
        };
        const callbackNegative: AlertDialogCallback = {
            text: 'No',
            onClick: async () => {
                setshowDelete(false);
                return true;
            },
        };
        showAlertWarning('¿Está seguro de borrar este usuario?', callbackConfirm, callbackNegative);
    };
    const handleEditPassword = () => {
        if (inputs.findIndex(p => passwordQuestions.includes(p.id)) !== -1) {
            return;
        }
        setinputs(prev => {
            return [...prev, ...WorkerInputs.filter(f => passwordQuestions.includes(f.id))];
        });
        setshowEditPassword(false);
    };

    const FooterButton = () => {
        return (
            < View style={{ marginVertical: 10 }}>
                <TouchableOpacity style={[appStyles.buttonLogin, appStyles.buttonRound, estilos.buttonRound]} onPress={nextAction}>
                    <Text style={appStyles.textButtonLogin}>{'Siguiente'}</Text>
                </TouchableOpacity>
                {!isAdmin &&
                    // si es admin no se puede borrar directamente desde la app
                    <>
                        {isEdit && showEditPassword &&
                            <TouchableOpacity style={[appStyles.buttonLogin, appStyles.buttonRound, estilos.buttonPwd]}
                                onPress={handleEditPassword}>
                                <Text style={appStyles.textButtonLogin}>{'Editar contraseña'}</Text>
                            </TouchableOpacity>
                        }
                        {isEdit &&
                            <TouchableOpacity style={[appStyles.buttonLogin, appStyles.buttonRound, estilos.buttonRed, showDelete && { backgroundColor: colores.irexcoreDegradadoNegro }]}
                                onPress={() => setshowDelete(prev => !prev)}>
                                <Text style={appStyles.textButtonLogin}>{'Pulse para borrar'}</Text>
                            </TouchableOpacity>
                        }
                        {(isEdit && showDelete) &&
                            <TouchableOpacity style={[appStyles.buttonLogin, appStyles.buttonRound, estilos.buttonRed]} onPress={deleteAction}>
                                <Text style={appStyles.textButtonLogin}>{'Borrar'}</Text>
                            </TouchableOpacity>
                        }
                    </>
                }
            </View >
        );
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colores.grayBackgrounds }}>
            <StatusBar animated backgroundColor={colores.PrimaryDark} barStyle={'light-content'} />
            <KeyboardAwareFlatList
                scrollEnabled
                removeClippedSubviews={!DeviceiOS}
                style={{ paddingHorizontal: 20 }} data={inputs}
                renderItem={(item) => ComponentForm(item, form, setform, idError, setidError)}
                ListFooterComponent={FooterButton}
                keyExtractor={item => item.id} />
        </SafeAreaView>
    );
}


const estilos = StyleSheet.create({
    buttonPwd: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: colores.greenButton,
    },
    buttonRound: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonRed: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: colores.redDotech,
        marginVertical: 30,
    },
});
