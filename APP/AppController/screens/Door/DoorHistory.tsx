/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-native/no-inline-styles */
import { FlatList, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { colores, appStyles } from '../../resources/globalStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import Request from '../../networks/request';
import { History } from '../../objects/history';
import moment from 'moment';

export function DoorHistory({ route }: any) {
    const messageText = ['Abrir puerta', 'Cerrar puerta'];
    const [history, sethistory] = useState<History[]>([]);
    const { uuid } = route?.params;
    useEffect(() => {
        const request = new Request();
        request.getHistory(uuid).then((response: History[]) => {
            console.log('resp ', response);
            sethistory(response);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const getDateTimeString = (date: string) => {
        return moment(date).format('DD/MM/YY hh:mm:ss A');
      };
    const dataList = ({item}: any) => {
        return (
            <TouchableOpacity activeOpacity={1} key={item.idHistorial}>
                <View style={[estilos.cardStyle, { marginBottom: 0, backgroundColor: colores.white}]}>
                    <View style={[estilos.formularioStyle]}>
                        <Text style={[appStyles.itemSelection, { flex: 0.6 }, appStyles.mediumTextView]}>{item.userName}</Text>
                        <Text style={[appStyles.itemSelection, estilos.dateText]}>{getDateTimeString(item.fecha)}</Text>
                    </View>
                    <View style={estilos.textViews}>
                        <Text style={[appStyles.itemSelection, appStyles.mediumTextView, { color: colores.PrimaryDark }]}>{typeof item?.idTipoMovimiento !== 'undefined' ? messageText[item?.idTipoMovimiento - 1] : 'Sin comentarios'}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    const headerComponent = () => {
        return (
            <View>
                <Text style={[appStyles.headerStyle, estilos.headerList]}>Historial</Text>
            </View>
        );
    };
    return (
        <SafeAreaView style={estilos.rootView}>
            <FlatList data={history} ListHeaderComponent={headerComponent} renderItem={dataList}/>
        </SafeAreaView>
    );
}
const estilos = StyleSheet.create({
    headerList: {
        textAlign: 'center',
        color: colores.irexcoreDegradadoNegro,
        marginBottom: 0,
        marginVertical: 10,

    },
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
    },
    rootView: {
        flex: 1,
        backgroundColor: colores.grayBackgrounds,
    },
});
