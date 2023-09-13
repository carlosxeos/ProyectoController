/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-native/no-inline-styles */
import { FlatList, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { colores, appStyles } from '../../resources/globalStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DeviceiOS } from '../../Constants';
import { faDoorClosed, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

export function DoorHistory({ navigation }) {
    const messageText = ['Abrir puerta', 'Cerrar puerta', 'Agregar usuario'];
    const history = [
        {
            id: 1,
            type: 1,
            username: 'luis.lucio',
            date: '01/09/23 07:54 PM',
        },
        {
            id: 2,
            type: 2,
            username: 'carlos.gzz',
            date: '11/07/23 11:00 PM',
        },
        {
            id: 3,
            type: 1,
            username: 'luis.lucio',
            date: '19/08/23 08:16 PM',
        },
    ];
    const dataList = ({ item }: any) => {
        return (
            <TouchableOpacity activeOpacity={1} key={item.id}>
                <View style={[estilos.cardStyle, { marginBottom: 0 }]}>
                    <View style={[estilos.formularioStyle]}>
                        <Text style={[appStyles.itemSelection, { flex: 0.6 }, appStyles.mediumTextView]}>{item.username}</Text>
                        <Text style={[appStyles.itemSelection, estilos.dateText]}>{item.date}</Text>
                    </View>
                    <View style={estilos.textViews}>
                        <Text style={[appStyles.itemSelection, appStyles.mediumTextView, { color: colores.PrimaryDark }]}>{typeof item?.type !== 'undefined' ? messageText[item?.type - 1] : 'Sin comentarios'}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    const separadorItem = () => {
        return (
            <View style={{ height: 0.5, backgroundColor: colores.blackLight }} />
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
            <FlatList data={history} ListHeaderComponent={headerComponent} renderItem={dataList} ItemSeparatorComponent={separadorItem} />
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
