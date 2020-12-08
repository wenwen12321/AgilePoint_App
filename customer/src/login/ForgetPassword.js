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

export default class ForgetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            emailError: "",
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

    goToLoginPage = () => {
        Actions.pop();
    }


    emailValidator = (email) => {
        const re = /\S+@\S+\.\S+/;

        if (!email || email.length <= 0) return 'Email不得為空';
        if (!re.test(email)) return '請輸入正確的Email格式';

        return '';
    };


    resetPasswordPress = () => {
        const emailError = this.emailValidator(this.state.email);

        console.log(emailError);

        if (emailError) {
            setTimeout(() => {
                this.setState({
                    emailError: emailError,
                });
            }, 0);
            return;
        }


        var bodyData = new FormData();
        bodyData.append("email", this.state.email);

        var address = serverInfo.SERVICE_ADDRESS;
        address += "password/email";
        console.log(address);
        fetch(address, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: bodyData
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.message === 'passwords.sent') {
                    Toast.show({
                        text: "已送出重設密碼信",
                        type: "success"
                    });
                }
                else {
                    Toast.show({
                        text: "查無使用者",
                        type: "warning"
                    });

                }
            })
            .catch((error) => {
                console.log(error);
            });


    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Root>
                    <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
                        <Text style={styles.title}>重設密碼</Text>
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


                        <Button labelStyle={styles.labelText} style={styles.button} mode="contained" onPress={() => this.resetPasswordPress()}>寄送重設密碼信</Button>
                        {/* <Button style={styles.button} mode="outlined" onPress={this.goToRegisterPage()}>註冊</Button> */}
                        <View style={styles.row}>
                            <TouchableOpacity onPress={() => this.goToLoginPage()}>
                                <Text style={{ fontWeight: "bold", color: "#878787" }}>←返回</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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