/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-native/no-inline-styles */
import { FlatList, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { colores, appStyles } from '../../resources/globalStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { checkTokenError, DeviceiOS, getDateFormatLocal } from '../../Constants';
import { faDoorClosed, faDoorOpen, IconLookup, IconName, IconPrefix } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useContext, useEffect, useState } from 'react';
import { Porton } from '../../objects/porton';
import Request from '../../networks/request';
import { ModalContext } from '../../context/modal-provider';
export default function DoorsList({ navigation, route }: any) {
    const { showLoading, hideLoading, showAlertError } = useContext(ModalContext);
    const [portones, setportones] = useState<Porton[]>(); // id
    const token = route?.params?.token;
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            console.log('onFocus');
            const request = new Request(navigation);
            showLoading();
            request.getPorton().then(async (porton: Porton[]) => {
                setportones(porton);
                hideLoading();
            }).catch((e) => {
                console.log('err door list ', e);
                if (!checkTokenError(e)) {
                    showAlertError('Hubo un error al obtener los portones, intente más tarde');
                    console.error('error puerta ', e);
                }
            });
        });
        return unsubscribe;
    }, [hideLoading, navigation, showAlertError, showLoading]);

    const doorClick = (item: any) => {
        navigation.navigate('DoorScreen', { porton: item, token });
    };
    const dataList = ({ item }) => {
        let icon: string | IconLookup | [IconPrefix, IconName];
        let colorIcon: string;
        if (item.idtipomodificacion === 1) { // 1 si esta abierto, 2 si se encuentra cerrado
            icon = faDoorOpen;
            colorIcon = colores.greenButton;
        } else {
            icon = faDoorClosed;
            colorIcon = colores.redDotech;
        }
        return (
            <TouchableOpacity activeOpacity={0.7} key={item.uuid} onPress={() => doorClick(item)}>
                <View style={[estilos.cardStyle, appStyles.cardView, { marginBottom: 0 }]}>
                    <View style={[estilos.formularioStyle]}>
                        <Text style={[appStyles.itemSelection, { flex: 0.6 }, appStyles.mediumTextView]}>{item.descripcion}</Text>
                        <Text style={[appStyles.itemSelection, estilos.dateText]}>{getDateFormatLocal(item.ultmodificacion)}</Text>
                    </View>
                    <View style={[estilos.formularioStyle]}>
                        <View style={estilos.textViews}>
                            <Text style={[appStyles.itemSelection, appStyles.mediumTextView, { color: colorIcon }]}>{item?.idtipomodificacion === 1 ? 'Abierto' : 'Cerrado'}</Text>
                        </View>
                        <View style={[appStyles.itemsCenter, { alignItems: 'center', flex: 0.3 }]}>
                            <FontAwesomeIcon size={DeviceiOS ? 25 : 22} icon={icon} color={colorIcon} />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    return (
        <SafeAreaView style={estilos.rootView}>
            <FlatList data={portones} renderItem={dataList} />
        </SafeAreaView>
    );
}
const estilos = StyleSheet.create({
    textViews: {
        flex: 0.7,
    },
    dateText: {
        flex: 0.4, textAlign: 'right',
        fontSize: 12,
        color: colores.cardBlackBackground,
        fontWeight: 'bold',
        marginTop: 10,
    },
    formularioStyle: {
        flex: 1,
        flexDirection: 'row',
    },
    cardStyle: {
        marginVertical: 5,
        marginHorizontal: 10,
        padding: 5,
        backgroundColor: colores.white,
    },
    rootView: {
        flex: 1,
        backgroundColor: colores.grayBackgrounds,
    },
});
