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
import { appStyles, colores } from '../../resources/globalStyles';
import React, { useEffect, useState } from 'react';
import { SearchBar } from 'react-native-elements';
import { FAB } from 'react-native-paper';
import Usuario from '../../db/tables/usuario';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { DeviceiOS } from '../../Constants';
import { faDoorClosed, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import TipoUsuario from '../../db/tables/tipoUsuario';
import Request, { ErrorHandler } from '../../networks/request';
import { Porton } from '../../objects/porton';


export function ListUsers({ navigation }) {
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([] as Usuario[]);
    const [userFiltered, setuserFiltered] = useState([] as Usuario[]);
    const request = new Request();
    useEffect(() => {
        const usuarios = new Usuario();
        usuarios.getUsers().then((us: Usuario[]) => {
            setUsers(us);
            setuserFiltered(us);
        });
    }, []);

    const cardUsers = ({ item }) => {
        const it: Usuario = item;
        return (
            <TouchableOpacity activeOpacity={0.7} key={item.idUsuario} onPress={() => handleEdit(it)}>
                <View
                    style={estilos.viewParentContainer}>
                    <Text style={[appStyles.itemSelection, estilos.nameItem]}>
                        {item.nombreCompleto}
                    </Text>
                    <View style={[estilos.formularioStyle]}>
                        <View style={estilos.centerContainer}>
                            <Text
                                style={[
                                    appStyles.itemSelection,
                                    estilos.itemsStyle,
                                    { color: colores.irexcoreDegradadoNegro },
                                ]}>{`${item.idTipoUsuario.descripcion}`}</Text>
                        </View>
                        {handlePermissionIcons(it.idTipoUsuario)}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const handlePermissionIcons = (tipoUsuario: TipoUsuario) => {
        const icons: IconDefinition[] = [];
        // if (tipoUsuario.accionesClima !== 0) {
        //     icons.push(faSnowflake);
        // }
        if (tipoUsuario.accionesPorton !== 0) {
            icons.push(faDoorClosed);
        }
        return (
            <View style={estilos.viewStatusContainer}>
                {
                    icons.map(icon => <FontAwesomeIcon
                        size={DeviceiOS ? 25 : 22}
                        icon={icon}
                        key={icon.iconName}
                        color={colores.irexcoreDegradadoNegro} />
                    )
                }
            </View>
        );

    };
    const handleAdd = async () => {
        const data: Porton[] | ErrorHandler = await request.getPortonesEmpresa();
        navigation.navigate('AddUser', { data });
    };
    const handleEdit = async (item: Usuario) => {
        const data: Porton[] | ErrorHandler = await request.getPortonesEmpresa();
        navigation.navigate('AddUser', { data, isEdit: true, usuario: item, isAdmin: item.idTipoUsuario.idTipoUsuario === 1});
    };
    const onChange = ((text: string) => {
        if (text.length === 0) {
            console.log('change text');
            setuserFiltered(users);
        }
        setSearch(text);
    });
    const onSubmitSearch = () => {
        setuserFiltered(users.filter((x) => x?.nombreCompleto?.toLowerCase().includes(search.toLowerCase())));
    };

    const onClearSearch = () => {
        setuserFiltered(users);
        console.log('on clear');
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
                onChangeText={onChange}
                onSubmitEditing={onSubmitSearch}
                inputContainerStyle={estilos.searchBar}
                inputStyle={{ color: colores.Primary }}
                containerStyle={estilos.searchContainer}
                onClear={onClearSearch}
                value={search}
            />
            <FlatList
                style={estilos.flatStyle}
                data={userFiltered}
                renderItem={cardUsers}
                keyExtractor={item => item.idUsuario + ''}
            />
            <FAB
                style={estilos.fab}
                icon={'plus'}
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
