/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DeviceiOS } from '../../Constants';
import { appStyles, colores } from '../../resources/globalStyles';
import { Text } from 'react-native';
import { diaSemana, getHorarioFormatting, getHorarioFormattingSingle, horarioStringConvert } from '../../utils';
import { useContext, useEffect, useState } from 'react';
import TimeInputModal from '../../views/timeInputModal';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Request from '../../networks/request';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { listUserKey } from '../Menu';
import { ModalContext } from '../../context/modal-provider';
import { AlertDialogCallback } from '../../objects/alertdialog-callback';
import Usuario from '../../db/tables/usuario';

/**
 *
 * @returns
 */
export function DetailDoorUser({ route, navigation }) {
    const { showLoading, showAlertError, showAlertSucess, showAlertWarning } = useContext(ModalContext);
    const portones: [{ id, text, uuid }] = route?.params?.portones; // id
    const { form } = route?.params;
    const MAX_HORARIOS_PORTON = 10;
    const [modal, setModal] = useState({ visible: false, uuid: null });
    const [horariosList, sethorariosList] = useState<Horario[]>([]);
    const { isEdit } = route?.params;
    const usuario: Usuario = route?.params?.usuario;
    const allHorariosList = ['0A0C0', '1A0C0', '2A0C0', '3A0C0', '4A0C0', '5A0C0', '6A0C0'];
    const request = new Request(navigation);
    useEffect(() => {
        sethorariosList(portones.flatMap(p => {
            if (isEdit) {
                const json: MetadataObject = usuario.getMetadataJson(usuario);
                const index = json.porton.findIndex(f => f.uuid === p.uuid);
                if (index !== -1) {
                    const hr = json.porton[index].horario;
                    return { uuid: p.uuid, horario: hr.length === 0 ? [] : hr.split(','), text: p.text};
                }
            }
            return { uuid: p.uuid, horario: [], text: p.text } as Horario;

        }) as Horario[]);
    }, []);

    const deleteTimeClick = (uuid, index) => {
        sethorariosList((prev) => {
            prev.find(horario => horario.uuid === uuid).horario.splice(index, 1);
            setModal({ ...modal, visible: false });
            return prev;
        });
    };

    const itemHorarios = (uuid, horario, i) => {
        const dayName = diaSemana[((horario).substring(0, 1))];
        return (
            <View style={estilos.horariosCard}>
                <Text style={[appStyles.smallTextView, { flex: 0.95 }]}>{`${dayName}: ${getHorarioFormatting([horario], false)}`}</Text>
                <TouchableOpacity onPress={() => deleteTimeClick(uuid, i)}>
                    <FontAwesomeIcon icon={faTimesCircle} color="red" style={{ flex: 0.05 }} size={20} />
                </TouchableOpacity>
            </View>
        );
    };

    const emptyHorariosList = () => {
        return (
            <>
                <Text>{`Agregue un horario (Max ${MAX_HORARIOS_PORTON})`}</Text>
            </>
        );
    };
    const addClick = (uuid: string) => {
        setModal({ uuid, visible: true });
    };

    const cardPortones = ({ text, uuid }) => {
        return (
            <View style={estilos.container}>
                <View style={[estilos.titleCardContainer]}>
                    <Text style={[estilos.titleCard, { color: colores.white, flex: 0.75, alignSelf: 'center' }]}>{text}</Text>
                    <TouchableOpacity style={[appStyles.buttonRound, { flex: 0.25, paddingVertical: 10, backgroundColor: colores.redDotech }]}
                        onPress={() => addClick(uuid)}>
                        <Text style={[appStyles.textButtonLogin, { fontSize: 15 }]}>{'Agregar'}</Text>
                    </TouchableOpacity>
                </View>
                <KeyboardAwareFlatList
                    scrollEnabled
                    removeClippedSubviews={!DeviceiOS}
                    style={{ padding: 10 }} data={horariosList.filter(v => v.uuid === uuid)[0]?.horario}
                    renderItem={(item) => itemHorarios(uuid, item.item, item.index)}
                    ListEmptyComponent={emptyHorariosList}
                    keyExtractor={item => item.id} />
            </View >
        );
    };
    function ordenarHorarios(array: string[]) {
        // Parsear los códigos en objetos con día y hora de apertura
        const horarios = array.map(horarioStringConvert);
        // Ordenar los horarios por día y luego por hora de apertura
        horarios.sort((a, b) => {
            if (a.dia !== b.dia) {
                return a.dia - b.dia; // Ordenar por día
            } else {
                return a.abierto - b.abierto; // Ordenar por hora de apertura si son del mismo día
            }
        });
        // Devolver el array de códigos ordenado
        return horarios.map(m => m.codigo);
    }

    const handleTimeInput = (outputArray: string[]) => {
        const horarioIndex = horariosList.findIndex(p => p.uuid === modal.uuid);
        const horariosArray = horariosList[horarioIndex]?.horario;
        // revisamos la cantidad de horarios distintos
        if ((horariosArray.length) + outputArray.length > MAX_HORARIOS_PORTON) {
            showAlertWarning(`No puedes agregar mas de ${MAX_HORARIOS_PORTON} horarios distintos`);
            return;
        }
        // revisamos que no haya empalmes con algun otro horario ya ingresado
        for (const output of outputArray) {
            const horarioOutput = horarioStringConvert(output);
            const ind = horariosArray.findIndex((value) => {
                const arrayHorario = horarioStringConvert(value);
                if (horarioOutput.dia !== arrayHorario.dia) {
                    return false;
                }
                return !(horarioOutput.cerrado <= arrayHorario.abierto || horarioOutput.abierto >= arrayHorario.cerrado);
            });
            if (ind !== -1) {
                showAlertError(`El horario del ${diaSemana[horarioOutput.dia]} ${getHorarioFormattingSingle(output)} se empalma con ${getHorarioFormattingSingle(horariosArray[ind])}`);
                return;
            }
        }
        sethorariosList(v => {
            v[horarioIndex].horario = ordenarHorarios(v[horarioIndex].horario.concat(outputArray));
            setModal({ uuid: null, visible: false });
            return v;
        });
    };

    const handleSend = () => {
        // si no encuentra ningun horario asignado, la app automaticamente va a asignar horarios de lun a dom 12:00 a 12:00
        // que es la configuracion de todo el dia
        const horariosEmpty: Horario[] = [];
        for (const list of horariosList) {
            if (list.horario.length <= 0) {
                horariosEmpty.push(list);
            }
        }
        const callbackAcept: AlertDialogCallback = {
            onClick: () => {
                const list = (): Horario[] => {
                    if (horariosEmpty.length === 0) {
                        return horariosList;
                    }
                    return horariosList.map((h) => {
                        // si no se encuentra vacio se envia igual
                        if (h.horario.length > 0) {
                            return h;
                        }
                        return {
                            text: h.text,
                            uuid: h.uuid,
                            horario: allHorariosList,
                        };
                    });
                };
                return isEdit ? handlePositiveEdit(list()) : handlePositiveAdd(list());
            },
            text: 'Aceptar',
        };
        const callbackNegate: AlertDialogCallback = {
            onClick: async () => true,
            text: 'Cancelar',
        };
        const msgAlert = () => {
            console.log('horariosEmpty ', horariosEmpty);
            
            if (horariosEmpty.length !== 0) {
                return `El usuario tendrá acceso sin limite de tiempo a los portones: \n${horariosEmpty.map(h => h.text).join(',')}\n ¿Desea continuar?`;
            }
            return '¿Esta seguro de enviar la siguiente información?';
        };
        showAlertWarning(msgAlert(), callbackAcept, callbackNegate);
    };

    const handlePositiveEdit = async (list: Horario[]): Promise<boolean> => {
        showLoading();
        const response = await request.editUser(usuario.idUsuario, form[1], form[5], list);
        if (response) {
            if (response === 'token') {
                return;
            }
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
            showAlertSucess('Usuario modificado', callback);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Menu' }],
            });
        }
        return false;
    };

    const handlePositiveAdd = async (list: Horario[]): Promise<boolean> => {
        showLoading();
        const response = await request.addNewUser(
            form[4],
            form[5],
            form[1],
            list);
        if (response) {
            if (response === 'token') {
                return;
            }
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
            showAlertSucess('Usuario agregado', callback);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Menu' }],
            });
        }
        return false;
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colores.grayBackgrounds, marginVertical: 10 }}>
            <StatusBar animated backgroundColor={colores.PrimaryDark} barStyle={'light-content'} />
            <TimeInputModal visible={modal.visible} onClose={() => setModal({ ...modal, visible: false })} onSubmit={handleTimeInput} />
            <KeyboardAwareFlatList
                scrollEnabled
                removeClippedSubviews={!DeviceiOS}
                style={{ paddingHorizontal: 20, flex: 0.9 }} data={portones}
                renderItem={(item) => cardPortones(item.item)}
                keyExtractor={item => item.id} />
            <TouchableOpacity style={[appStyles.buttonRound, { backgroundColor: colores.PrimaryDark, margin: 10 }]}
                onPress={handleSend}>
                <Text style={[appStyles.textButtonLogin, { fontSize: 15 }]}>{'Enviar'}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    container: {
        backgroundColor: colores.white,
        marginTop: 10,
    },
    titleCard: {
        color: colores.Primary,
        fontWeight: 'bold',
        fontSize: 16,
        flex: 1,
    },
    horariosCard: {
        flex: 1,
        flexDirection: 'row',
        padding: 3,
    },
    titleCardContainer: {
        flexDirection: 'row',
        backgroundColor: colores.Primary,
        padding: 5,
        flex: 1,
    },
    titleImageContainer: {
        flex: 0.1,
    },
});
