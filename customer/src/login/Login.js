import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Image, ImageBackground, TouchableHighlight, ScrollView, AsyncStorage, SafeAreaView, Platform } from 'react-native';
import { TextInput, Divider, Text, Switch, Button, Chip, IconButton } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import { color } from 'react-native-reanimated';
import serverInfo from '../ServerInfo';
import { Toast, Root, Form } from 'native-base';
import base64 from 'react-native-base64';
import FlagSecure from 'react-native-flag-secure-android';
import { usePrivacySnapshot, enabled } from 'react-native-privacy-snapshot';
import * as ScreenshotDetector from 'react-native-screenshot-detect';
import jwt_decode from 'jwt-decode';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            emailError: "",
            password: "",
            passwordError: "",
            previous: this.props.previous
        }
    }

    componentDidMount() {
        if (Platform.OS === "android") {
            FlagSecure.activate();
        }
        else if (Platform.OS === "ios") {
            enabled(true);
            this.eventEmitter = ScreenshotDetector.subscribe(() => {
                Alert.alert(
                    "截圖告示",
                    "剛剛已使用截圖功能，由於內容可能含有個人資料，請妥善保管截圖內容，謝謝",
                    [
                        { text: "好", onPress: () => { console.log("OK Pressed") } }
                    ]
                )
            });
        }
    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            FlagSecure.deactivate();
        }
        else if (Platform.OS === "ios") {
            enabled(false);
            ScreenshotDetector.unsubscribe(this.eventEmitter);
        }
    }

    goToRegisterPage = () => {
        if (this.state.previous === "register") {
            Actions.pop();
        }
        else {
            Actions.register({ previous: "login" });
        }
        // if(this.state.previous === "home"){
        // }
        // else{
        //     Actions.pop();
        // }
    }

    goToForgot = () => {
        Actions.forgetPassword();
    }

    emailValidator = (email) => {
        const re = /\S+@\S+\.\S+/;

        if (!email || email.length <= 0) return 'Email不得為空';
        if (!re.test(email)) return '請輸入正確的Email格式';

        return '';
    };



    passwordValidator = (password) => {
        if (!password || password.length <= 0) return '密碼不得為空';
        if (password.length < 8) return '密碼不得少於8個字元'

        return '';
    };

    loginPress = () => {
        const emailError = this.emailValidator(this.state.email);
        const passwordError = this.passwordValidator(this.state.password);

        console.log(emailError);

        if (emailError || passwordError) {
            setTimeout(() => {
                this.setState({
                    emailError: emailError,
                    passwordError: passwordError,
                });
            }, 0);
            return;
        }

        var address = serverInfo.SERVICE_ADDRESS;
        address += "login";
        console.log(address);
        fetch(address, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                UserEmail: this.state.email,
                UserPassword: this.state.password,
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (!responseJson.success) {
                    Toast.show({
                        text: "登入失敗",
                        type: "danger"
                    });
                }
                else {
                    // var token = responseJson.token.split('.');
                    
                    var decoded = jwt_decode(responseJson.token);
                    console.log(decoded);
                    console.log("user id:"+decoded.user_id);
                    this.setStorage(decoded.user_id, decoded.user_name, decoded.user_avatar, responseJson.token).done();

                }
            })
            .catch((error) => {
                console.log(error);
            });


    }

    setStorage = async (userID, username, avatar, auth) => {
        try {
            console.log(userID + username);
            await AsyncStorage.setItem('@User:loginStatus', 'loggedin');
            // const auth = base64.encode(this.state.email + ":" + this.state.password);
            await AsyncStorage.setItem('@User:email', this.state.email);
            await AsyncStorage.setItem('@User:authorization', auth);
            await AsyncStorage.setItem('@User:userID', userID.toString());
            await AsyncStorage.setItem('@User:username', username);
            await AsyncStorage.setItem('@User:avatar', avatar);
        } catch (error) {
            console.log(error);
        } finally {
            Actions.pop();
            Actions.refresh();
            Actions.reset('main2');
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Root>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <IconButton icon="arrow-left" size={30} color="#676767" onPress={() => { Actions.pop() }} />
                        <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
                            <Text style={styles.title}>登入帳號</Text>
                            <View style={{ marginBottom: 20 }}>
                                <TextInput
                                    mode="outlined"
                                    label="Email"
                                    returnKeyType="next"
                                    value={this.state.email}
                                    onChangeText={text => this.setState({ email: text })}
                                    autoCapitalize="none"
                                    autoCompleteType="email"
                                    textContentType="emailAddress"
                                    keyboardType="email-address"
                                    error={!!this.state.emailError}
                                />
                                {this.state.emailError ? <Text style={styles.error}>{this.state.emailError}</Text> : null}
                            </View>
                            <View>
                                <TextInput
                                    mode="outlined"
                                    label="密碼"
                                    returnKeyType="done"
                                    value={this.state.password}
                                    autoCapitalize="none"
                                    onChangeText={text => this.setState({ password: text })}
                                    error={!!this.state.passwordError}
                                    secureTextEntry
                                />
                                {this.state.passwordError ? <Text style={styles.error}>{this.state.passwordError}</Text> : null}
                            </View>
                            <View style={styles.forgotPassword}>
                                <TouchableOpacity
                                    onPress={() => this.goToForgot()}
                                >
                                    <Text style={{ color: "#878787" }}>忘記密碼?</Text>
                                </TouchableOpacity>
                            </View>
                            <Button labelStyle={styles.labelText} style={styles.button} mode="contained" onPress={() => this.loginPress()}>登入</Button>
                            {/* <Button style={styles.button} mode="outlined" onPress={this.goToRegisterPage()}>註冊</Button> */}
                            <View style={styles.row}>
                                <Text style={{ color: "#878787" }}>還沒有帳號? </Text>
                                <TouchableOpacity onPress={() => this.goToRegisterPage()}>
                                    <Text style={{ fontWeight: "bold", color: "#8249d1" }}>註冊</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </Root>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 26,
        justifyContent: "center",
        alignSelf: "center",
        alignContent: "center",
        fontWeight: "bold",
        marginBottom: 5
    },
    button: {
        width: "100%",
        marginVertical: 10
    },
    labelText: {
        fontSize: 16,
        fontWeight: "bold"
    },
    forgotPassword: {
        marginTop: 5,
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    error: {
        fontSize: 14,
        color: "#f13a59",
        paddingHorizontal: 4,
        paddingTop: 4,
        marginTop: 3
    },
});