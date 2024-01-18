/* eslint-disable prettier/prettier */
import {
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { appStyles, colores, usuariosDummy } from '../../resources/globalStyles';
import { DeviceiOS } from '../../Constants';
import {
    faDoorClosed,
    faSnowflake,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useState } from 'react';
import Usuario from '../../objects/Usuario';
import { SearchBar } from 'react-native-elements';
import { FAB } from 'react-native-paper';

export function ListUsers({ navigation}) {
    const [search, setSearch] = useState('');
    const [users] = useState(usuariosDummy);
    const [userFiltered, setuserFiltered] = useState(usuariosDummy);
    const cardUsers = ({ item }: any) => {
        const usuario: Usuario = new Usuario(item);
        return (
            <TouchableOpacity activeOpacity={0.7} key={item.id} onPress={() => { }}>
                <View
                    style={estilos.viewParentContainer}>
                    <Text style={[appStyles.itemSelection, estilos.nameItem]}>
                        {usuario.name}
                    </Text>
                    <View style={[estilos.formularioStyle]}>
                        <View style={estilos.centerContainer}>
                            <Text
                                style={[
                                    appStyles.itemSelection,
                                    estilos.itemsStyle,
                                    { color: colores.irexcoreDegradadoNegro },
                                ]}>{`${usuario.type}`}</Text>
                            <Text
                                style={[
                                    appStyles.itemSelection,
                                    estilos.itemsStyle,
                                    { color: colores.blackLight },
                                ]}>{`${usuario.phone}`}</Text>
                        </View>
                        <View style={estilos.viewStatusContainer}>
                            {
                                usuario.permission.map((index) => {
                                    let icon;
                                    if (index === 2) {
                                        icon = faSnowflake;
                                    } else {
                                        icon = faDoorClosed;
                                    }
                                    return (
                                        <FontAwesomeIcon
                                            size={DeviceiOS ? 25 : 22}
                                            icon={icon}
                                            color={colores.irexcoreDegradadoNegro}
                                        />
                                    );
                                })
                            }
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const handleAdd = () => {
        console.log('open');
        navigation.navigate('AddUser');
    };
    return (
        <SafeAreaView style={appStyles.screen}>
            <StatusBar
                animated
                backgroundColor={colores.PrimaryDark}
                barStyle={'light-content'}
            />
            <SearchBar
                placeholder={'Buscar...'}
                onChangeText={(text) => {
                    if (text.length === 0) {
                        console.log('change text');
                        setuserFiltered(users);
                    }
                    setSearch(text);
                }}
                onSubmitEditing={() => setuserFiltered(users.filter((x) => x?.name.toLowerCase().includes(search.toLowerCase())))}
                inputContainerStyle={estilos.searchBar}
                inputStyle={{ color: colores.Primary }}
                containerStyle={estilos.searchContainer}
                onClear={()=> {
                    setuserFiltered(users);
                    console.log('on clear');

                }}
                value={search}
            />
            <FlatList
                style={estilos.flatStyle}
                data={userFiltered}
                renderItem={cardUsers}
                keyExtractor={item => item.id + ''}
            />
            <FAB
                style={estilos.fab}
                icon="plus"
                color="white"
                onPress={handleAdd}
            />
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    viewParentContainer: {
        backgroundColor: colores.white,
        marginHorizontal: 10,
        marginVertical: 5,
        paddingBottom: 5,
    },
    centerContainer: { flex: 0.6, marginVertical: 5, marginLeft: 20 },
    viewStatusContainer: {
        flex: 0.4, alignItems: 'center', flexDirection: 'row',
        flexWrap: 'wrap-reverse',
        marginBottom: 10,
    },
    searchContainer: {
        margin: 10,
        padding: 2,
        borderWidth: 1,
        backgroundColor: colores.Primary,
    },
    flatStyle: {
        marginTop: 10,
    },
    searchBar: {
        backgroundColor: colores.white,
    },
    formularioStyle: {
        flex: 1,
        flexDirection: 'row',
    },
    userImage: {
        position: 'absolute',
        alignSelf: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
    },
    cardDesignContainer: {
        flex: 0.25,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameItem: {
        color: colores.PrimaryDark,
        fontSize: 20,
        fontFamily: 'RobotoSlab-Regular',
        marginHorizontal: 20,
        marginTop: 10,
        width: '100%',
    },
    itemsStyle: { fontSize: 15 },
    fab: {
        position: 'absolute',
        margin: 20,
        right: 10,
        bottom: 10,
        backgroundColor: colores.Primary,
        borderRadius: 30,
    },
});
