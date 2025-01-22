/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DeviceiOS } from '../../Constants';
import { appStyles, colores } from '../../resources/globalStyles';
import { Text } from 'react-native';
import { diaSemana, getHorarioFormatting } from '../../utils';

/**
 *
 * @returns
 */
export function DetailDoorUser({ route }) {
    const portones: [{ id, text, uuid }] = route?.params?.portones; // id
    const horariosList: [{ uuid: string, horario: string }] = [
        {
            uuid: 'af04b978-e4e7-4cbf-a31f-9ea50c3d6744',
            horario: '1A600C720',
        },
        {
            uuid: 'af04b978-e4e7-4cbf-a31f-9ea50c3d6744',
            horario: '1A700C720',
        },
    ];

    const itemHorarios = ({ horario }) => {
        const dayName = diaSemana[((horario).substring(0, 1))];
        return (
            <>
                <Text style={appStyles.smallTextView}>{`${dayName}: ${getHorarioFormatting([horario], false)}`}</Text>
            </>);
    };

    const emptyHorariosList = () => {
        return (
            <>
                <Text>Agregue un horario (Max 20)</Text>
            </>
        );
    };
    const addClick = () => {

    };

    const cardPortones = ({ text, uuid }) => {
        return (
            <View style={estilos.container}>
                <View style={[estilos.titleCardContainer]}>
                    <Text style={[estilos.titleCard, { color: colores.white, flex: 0.75, alignSelf: 'center' }]}>{text}</Text>
                    <TouchableOpacity style={[appStyles.buttonRound, { flex: 0.25, paddingVertical: 10, backgroundColor: colores.redDotech }]} onPress={addClick}>
                        <Text style={[appStyles.textButtonLogin, { fontSize: 15 }]}>{'Agregar'}</Text>
                    </TouchableOpacity>
                </View>
                <KeyboardAwareFlatList
                    scrollEnabled
                    removeClippedSubviews={!DeviceiOS}
                    style={{ padding: 10 }} data={horariosList.filter(v => v.uuid === uuid)}
                    renderItem={(item) => itemHorarios(item.item)}
                    ListEmptyComponent={emptyHorariosList}
                    keyExtractor={item => item.id} />
            </View >
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colores.grayBackgrounds, marginVertical: 10 }}>
            <StatusBar animated backgroundColor={colores.PrimaryDark} barStyle={'light-content'} />
            <KeyboardAwareFlatList
                scrollEnabled
                removeClippedSubviews={!DeviceiOS}
                style={{ paddingHorizontal: 20 }} data={portones}
                renderItem={(item) => cardPortones(item.item)}
                keyExtractor={item => item.id} />
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
