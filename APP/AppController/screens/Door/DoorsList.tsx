/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-native/no-inline-styles */
import { FlatList, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { colores, appStyles } from '../../resources/globalStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DeviceiOS } from '../../Constants';
import { faDoorClosed, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

export default function DoorsList({ navigation }) {
    const doorClick = (name: string, id: number) => {
        navigation.navigate('DoorScreen', {name, id});
    };
    const portones = [
        {
            id: 1,
            name: 'Porton principal',
            status: true,
            lastUpdate: '01/09/23 07:54 PM',
            allow: true,
        },
        {
            id: 2,
            name: 'Porto Carros',
            status: false,
            lastUpdate: '11/07/23 11:00 PM',
            allow: true,
        },
        {
            id: 3,
            name: 'Arquitecto',
            status: true,
            lastUpdate: '19/08/23 08:16 PM',
            allow: false,
        },
    ];
    const dataList = ({ item }: any) => {
        let icon;
        let colorIcon;
        if (item.status) {
            icon = faDoorOpen;
            colorIcon = colores.redButton;
        } else {
            icon = faDoorClosed;
            colorIcon = colores.greenButton;
        }
        return (
            <TouchableOpacity activeOpacity={0.7} key={item.id} onPress={() => doorClick(item.name, item.id)}>
                <View style={[estilos.cardStyle, appStyles.cardView, { marginBottom: 0 }]}>
                    <View style={[estilos.formularioStyle]}>
                        <Text style={[appStyles.itemSelection, { flex: 0.6 }, appStyles.mediumTextView]}>{item.name}</Text>
                        <Text style={[appStyles.itemSelection, estilos.dateText]}>{item.lastUpdate}</Text>
                    </View>
                    <View style={[estilos.formularioStyle]}>
                        <View style={estilos.textViews}>
                            <Text style={[appStyles.itemSelection, appStyles.mediumTextView, { color: colorIcon }]}>{item?.status ? 'Abierto' : 'Cerrado'}</Text>
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
