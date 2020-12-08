import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
    AppRegistry,
    AsyncStorage,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Container, Header, Content, Tab, Tabs, ScrollableTab } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PersonalProfile from './PersonalProfile';
import { TextInput, Button, TouchableRipple, Divider } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import ServerInfo from '../ServerInfo';

export default class AccountSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            isLoggedIn: null,
            email: null,
            auth: null,
            imageUri: "",
            userID: null,
        }
    }

    logoutPressed = () => {
        this.setStorage().done();
        // Actions.reset('home');
    }

    loginPressed = () => {
        console.log("login pressed");
        Actions.login();
    }

    setStorage = async () => {
        try {
            await AsyncStorage.removeItem('@User:loginStatus');
            await AsyncStorage.removeItem('@User:authorization');
            await AsyncStorage.removeItem('@User:userID');
            await AsyncStorage.removeItem('@User:username');
            await AsyncStorage.removeItem('@User:email');
            await AsyncStorage.removeItem('@User:avatar');
        } catch (error) {
            console.log(error);
        } finally {
            Actions.reset('accountSetting');
        }
    }

    getStorage = async () => {
        try {
            const value = await AsyncStorage.getItem('@User:loginStatus');
            const username = await AsyncStorage.getItem('@User:username');
            const email = await AsyncStorage.getItem('@User:email');
            const auth = await AsyncStorage.getItem('@User:authorization');
            const imageUri = await AsyncStorage.getItem('@User:avatar');
            const userID = await AsyncStorage.getItem('@User:userID');
            if (value !== null) {
                console.log(username);
                setTimeout(() => {
                    this.setState({
                        id: username,
                        isLoggedIn: value,
                        email: email,
                        auth: auth,
                        imageUri: ServerInfo.STORAGE_ADDRESS + "avatar/" + imageUri,
                        userID: userID
                    });
                }, 0);
            }
        } catch (error) {
            console.log(error)
        }
    }

    componentDidMount() {
        this.getStorage().done();
    }

    renderLogoutButton = () => {
        console.log(this.state.id);
        if (this.state.id !== null) {
            return (
                <View style={{ paddingHorizontal: 30, marginBottom: 20 }}>
                    <Button onPress={() => this.logoutPressed()} style={styles.button} labelStyle={{ fontSize: 18, color: 'black' }} mode="contained">登出</Button>
                </View>
            )
        }
        else {
            return (
                <View style={{ paddingHorizontal: 30, marginBottom: 20 }}>
                    <Button onPress={() => this.loginPressed()} style={styles.button} labelStyle={{ fontSize: 18, color: 'black' }} mode="contained">登入/註冊</Button>
                </View>
            )
        }
    }

    renderSettingButton = () => {
        console.log(this.state.id);
        if (this.state.id !== null) {
            return (
                <View>
                    <Divider />
                    <TouchableRipple onPress={() => { Actions.reset('cart') }} rippleColor="rgba(0,0,0,0.2)">
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <View style={{ margin: 10, alignItems: "center", flexDirection: "row" }}>
                                <Icon style={{ marginRight: 10 }} color="#dfb63c" size={30} name="cart-outline" />
                                <Text style={{ fontSize: 18 }}>購物車</Text>
                            </View>
                            <Icon style={{ marginRight: 10, alignSelf: "center" }} color="#575757" size={30} name="chevron-right" />
                        </View>
                    </TouchableRipple>
                    <Divider />
                    <TouchableRipple onPress={() => { Actions.reset('orderList') }} rippleColor="rgba(0,0,0,0.2)">
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <View style={{ margin: 10, alignItems: "center", flexDirection: "row" }}>
                                <Icon style={{ marginRight: 10 }} color="#5d27cb" size={30} name="reorder-horizontal" />
                                <Text style={{ fontSize: 18 }}>訂單管理</Text>
                            </View>
                            <Icon style={{ marginRight: 10, alignSelf: "center" }} color="#575757" size={30} name="chevron-right" />
                        </View>
                    </TouchableRipple>
                    <Divider />
                    {/* <TouchableRipple onPress={() => { Actions.changePassword({ email: this.state.email, auth: this.state.auth }) }} rippleColor="rgba(0,0,0,0.2)">
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <View style={{ margin: 10, alignItems: "center", flexDirection: "row" }}>
                                <Icon style={{ marginRight: 10 }} color="#272acb" size={30} name="key-outline" />
                                <Text style={{ fontSize: 18 }}>修改密碼</Text>
                            </View>
                            <Icon style={{ marginRight: 10, alignSelf: "center" }} color="#575757" size={30} name="chevron-right" />
                        </View>
                    </TouchableRipple>
                    <Divider /> */}
                    <TouchableRipple onPress={() => Actions.accountManagement({ userID: this.state.userID, auth: this.state.auth, userName: this.state.id, imageUri: this.state.imageUri, email: this.state.email })} rippleColor="rgba(0,0,0,0.2)">
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <View style={{ margin: 10, alignItems: "center", flexDirection: "row" }}>
                                <Icon style={{ marginRight: 10 }} color="#4e80ff" size={30} name="account-box-outline" />
                                <Text style={{ fontSize: 18 }}>帳戶設定</Text>
                            </View>
                            <Icon style={{ marginRight: 10, alignSelf: "center" }} color="#575757" size={30} name="chevron-right" />
                        </View>
                    </TouchableRipple>
                    <Divider />
                </View>
            )
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    {/* <Text style={styles.titleText}>帳戶</Text> */}
                    {/*<PersonalProfile />*/}
                    <View style={{ justifyContent: "space-between", flex: 1 }}>
                        <View>
                            <LinearGradient colors={['#4761ea', '#7f91f1']}>
                                <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity
                                        rippleColor="rgba(0,0,0,0.2)"
                                        style={{
                                            borderWidth: 1,
                                            borderColor: 'rgba(0,0,0,0)',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 60,
                                            height: 60,
                                            backgroundColor: '#c3c3c3',
                                            borderRadius: 50,
                                            alignSelf: "center",
                                            marginLeft: 10
                                        }}
                                        onPress={() => Actions.accountManagement({ userID: this.state.userID, auth: this.state.auth, userName: this.state.id, imageUri: this.state.imageUri, email: this.state.email })}
                                    >
                                        {(this.state.imageUri) ?
                                            <Image style={{ alignSelf: "center", width: 60, height: 60, borderRadius: 50, resizeMode: "cover" }} source={{ uri: this.state.imageUri }} />
                                            :
                                            <Icon style={{ alignSelf: "center" }} name="account" size={50} color="#fff" />
                                        }
                                    </TouchableOpacity>
                                    <Text style={styles.greeting}>{(this.state.id) ? (this.state.id) : "您好，使用者！"}</Text>
                                </View>
                            </LinearGradient>
                            {this.renderSettingButton()}
                        </View>
                        {this.renderLogoutButton()}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    titleText: {
        paddingHorizontal: 10,
        fontSize: 30,
        marginTop: 10,
    },

    greeting: {
        fontSize: 30,
        color: "#fff",
        // textAlign: 'center',
        // backgroundColor: 'lightgray',
        // borderRadius: 15,
        margin: 10,
        padding: 30,
        marginLeft: -20,
        alignSelf: "center",
    },

    button: {
        // position: 'relative',
        // bottom: -330,
        backgroundColor: 'white',
        borderWidth: 3,
        borderRadius: 15,
        margin: 20,
        justifyContent: 'flex-end',
        padding: 10,
    }
})