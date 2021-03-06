import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Image, ImageBackground, TouchableHighlight, ScrollView, AsyncStorage, SafeAreaView, Platform } from 'react-native';
import { TextInput, Divider, Text, Switch, Button, Chip, IconButton } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import { color } from 'react-native-reanimated';
import serverInfo from '../ServerInfo';
import { Toast, Root } from 'native-base';
import base64 from 'react-native-base64';
import FlagSecure from 'react-native-flag-secure-android';
import { usePrivacySnapshot, enabled } from 'react-native-privacy-snapshot';
import * as ScreenshotDetector from 'react-native-screenshot-detect';
import { RefreshControl } from 'react-native';

export default class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: props.email,
            emailError: "",
            oldPassword: "",
            oldPasswordError: "",
            newPassword: "",
            newPasswordError: "",
            newPasswordConfirm: "",
            newPasswordConfirmError: "",
            auth: props.auth,
            isUpdating: false,
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

    newPasswordValidator = (password) => {
        if (!password || password.length <= 0) return '密碼不得為空';
        if (password.length < 8) return '密碼不得少於8個字元'
        if (password === this.state.oldPassword) return '新密碼與舊密碼相同';

        return '';
    };

    confirmPasswordValidator = (password, confirmPassword) => {
        if (!confirmPassword || confirmPassword.length <= 0) return '確認密碼不得為空';
        if (password !== confirmPassword) return '確認密碼與密碼不同';
        return '';
    }

    resetPasswordPress = () => {
        // const emailError = this.emailValidator(this.state.email);
        const oldPasswordError = this.passwordValidator(this.state.oldPassword);
        const newPasswordError = this.newPasswordValidator(this.state.newPassword);
        const newPasswordConfirmError = this.confirmPasswordValidator(this.state.newPassword, this.state.newPasswordConfirm);


        // console.log(emailError);

        if (oldPasswordError || newPasswordError || newPasswordConfirmError) {
            setTimeout(() => {
                this.setState({
                    oldPasswordError: oldPasswordError,
                    newPasswordError: newPasswordError,
                    newPasswordConfirmError: newPasswordConfirmError,
                });
            }, 0);
            return;
        }

        // console.log(this.state.auth);

        // var bodyData = new FormData();
        // bodyData.append("email", this.state.email);
        // console.log("auth:"+this.state.auth+"\nemail:"+this.state.email+"\nold:"+this.state.oldPassword+"\nnew:"+this.state.newPassword);
        this.setState({ isUpdating: true });

        var address = serverInfo.SERVICE_ADDRESS;
        address += "password/edit";
        console.log(address);
        fetch(address, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + this.state.auth,
            },
            body: JSON.stringify({
                email: this.state.email,
                oldPassword: this.state.oldPassword,
                newPassword: this.state.newPassword,
                newPassword_confirmation: this.state.newPasswordConfirm
            })
        })
            .then((response) => {
                console.log(response);
                // return response.text();
                if (response.ok) {
                    // if(typeof response.json()===undefined){
                    //     Toast.show({
                    //         text: "已變更密碼",
                    //         type: "success"
                    //     });
                    //     this.setStorage().done();
                    // }
                    // return response.json();
                    Toast.show({
                        text: "已變更密碼",
                        type: "success"
                    });
                    this.setStorage().done();
                }
                else {
                    Toast.show({
                        text: "發生錯誤",
                        type: "danger"
                    });
                    this.setState({ isUpdating: false });
                    // return response.text();
                }
            })
            // .then((responseJson) => {
            //     console.log(responseJson);
            //     if (responseJson.message === "Invalid credentials.") {
            //         Toast.show({
            //             text: "密碼錯誤",
            //             type: "danger"
            //         });
            //     }
            //     else {
            //         Toast.show({
            //             text: "已變更密碼",
            //             type: "success"
            //         });
            //         this.setStorage().done();
            //     }
            // })
            .catch((error) => {
                console.log(error);
            });


    }

    setStorage = async () => {
        try {
            // console.log(userID + username);
            // await AsyncStorage.setItem('@User:loginStatus', 'loggedin');
            const auth = base64.encode(this.state.email + ":" + this.state.newPassword);
            // await AsyncStorage.setItem('@User:email', this.state.email);
            await AsyncStorage.setItem('@User:authorization', auth);
            // await AsyncStorage.setItem('@User:userID', userID.toString());
            // await AsyncStorage.setItem('@User:username', username);
        } catch (error) {
            console.log(error);
        } finally {
            this.setState({ isUpdating: false });
            Actions.pop();
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Root>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} refreshControl={<RefreshControl refreshing={this.state.isUpdating} />}>
                        <IconButton icon="arrow-left" size={30} color="#676767" onPress={() => { Actions.pop() }} />
                        <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
                            <Text style={styles.title}>修改密碼</Text>
                            <View style={{ marginBottom: 10 }}>
                                {/* <Text style={{ fontSize: 18, color: "#676767" }}>Email:{this.state.email}</Text> */}
                                <TextInput
                                    editable={false}
                                    mode="outlined"
                                    label={this.state.email}
                                    style={{ color: "#676767" }}
                                />
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <TextInput
                                    mode="outlined"
                                    label="目前密碼"
                                    returnKeyType="next"
                                    value={this.state.oldPassword}
                                    autoCapitalize="none"
                                    onChangeText={text => this.setState({ oldPassword: text })}
                                    error={!!this.state.oldPasswordError}
                                    secureTextEntry
                                />
                                {this.state.oldPasswordError ? <Text style={styles.error}>{this.state.oldPasswordError}</Text> : null}
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <TextInput
                                    mode="outlined"
                                    label="新密碼"
                                    returnKeyType="next"
                                    value={this.state.newPassword}
                                    autoCapitalize="none"
                                    onChangeText={text => this.setState({ newPassword: text })}
                                    error={!!this.state.newPasswordError}
                                    secureTextEntry
                                />
                                {this.state.newPasswordError ? <Text style={styles.error}>{this.state.newPasswordError}</Text> : null}
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <TextInput
                                    mode="outlined"
                                    label="確認新密碼"
                                    returnKeyType="done"
                                    value={this.state.newPasswordConfirm}
                                    autoCapitalize="none"
                                    onChangeText={text => this.setState({ newPasswordConfirm: text })}
                                    error={!!this.state.newPasswordConfirmError}
                                    secureTextEntry
                                />
                                {this.state.newPasswordConfirmError ? <Text style={styles.error}>{this.state.newPasswordConfirmError}</Text> : null}
                            </View>


                            <Button labelStyle={styles.labelText} style={styles.button} mode="contained" onPress={() => this.resetPasswordPress()}>修改密碼</Button>
                            <View style={styles.forgotPassword}>
                                <TouchableOpacity
                                    onPress={() => this.goToForgot()}
                                >
                                    <Text style={{ color: "#878787" }}>忘記密碼?</Text>
                                </TouchableOpacity>
                            </View>
                            {/* <Button style={styles.button} mode="outlined" onPress={this.goToRegisterPage()}>註冊</Button> */}
                            {/* <View style={styles.row}>
                        <TouchableOpacity onPress={() => this.goToLoginPage()}>
                            <Text style={{ fontWeight: "bold", color: "#878787" }}>←返回登入</Text>
                        </TouchableOpacity>
                    </View> */}
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