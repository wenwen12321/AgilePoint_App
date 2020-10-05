import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Image, ImageBackground, TouchableHighlight, ScrollView, RefreshControl, SafeAreaView } from 'react-native';
import { TextInput, Divider, Text, Switch, Button, Chip, IconButton } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import serverInfo from '../ServerInfo';
import { Toast, Root } from 'native-base';

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            usernameError: "",
            email: "",
            emailError: "",
            password: "",
            passwordError: "",
            confirmPassword: "",
            confirmPasswordError: "",
            phone: "",
            phoneError: "",
            previous: this.props.previous,
            isLoading: false,
        }
    }

    goToLoginPage = () => {
        if (this.state.previous === "login") {
            Actions.pop();
        }
        else {
            Actions.login({ previous: "register" });
        }
        // if(this.state.previous === "home"){
        // }
        // else{
        //     Actions.pop();
        // }
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

    usernameValidator = (username) => {
        if (!username || username.length <= 0) return '使用者名稱不得為空';
        return '';
    }

    phoneValidator = (phone) => {
        const re = /(0)[0-9]{9}/;
        if (!phone || phone.length <= 0) return '電話不得為空';
        if (!re.test(phone)) return '請輸入正確的電話格式';
        return '';
    }

    confirmPasswordValidator = (password, confirmPassword) => {
        if (!confirmPassword || confirmPassword.length <= 0) return '確認密碼不得為空';
        if (password !== confirmPassword) return '確認密碼與密碼不同';
        return '';
    }

    goToForgot = () => {

    }

    registerPress = () => {
        const emailError = this.emailValidator(this.state.email);
        const passwordError = this.passwordValidator(this.state.password);
        const usernameError = this.usernameValidator(this.state.username);
        const phoneError = this.phoneValidator(this.state.phone);
        const confirmPasswordError = this.confirmPasswordValidator(this.state.password, this.state.confirmPassword);

        console.log(emailError);

        if (emailError || passwordError || usernameError || phoneError || confirmPasswordError) {
            setTimeout(() => {
                this.setState({
                    emailError: emailError,
                    passwordError: passwordError,
                    usernameError: usernameError,
                    phoneError: phoneError,
                    confirmPasswordError: confirmPasswordError,
                });
            }, 0);
            return;
        }

        setTimeout(() => { this.setState({ isLoading: true }) }, 0);

        var address = serverInfo.SERVICE_ADDRESS;
        address += "register";
        console.log(address);
        fetch(address, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Username: this.state.username,
                UserEmail: this.state.email,
                UserPhone: this.state.phone,
                UserPassword: this.state.password,
                UserPassword_confirmation: this.state.confirmPassword,
            })
        })
            .then((response) => {
                if (response.ok) {
                    // Toast.show({
                    //     text: "註冊成功，請前往收取驗證信",
                    //     type: "success",
                    //     duration: "3000"
                    // })
                    Actions.registerSuccess();

                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            <SafeAreaView style={{flex:1}}>
            <ScrollView
                contentContainerStyle={{flexGrow:1}}
                refreshControl={
                    <RefreshControl refreshing={this.state.isLoading} />
                }
            >
                <IconButton icon="arrow-left" size={30} color="#676767" onPress={() => { Actions.pop() }} />
                <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
                    <Text style={styles.title}>建立一個帳號</Text>
                    <View style={{ marginBottom: 10 }}>
                        <TextInput
                            mode="outlined"
                            label="使用者名稱"
                            returnKeyType="next"
                            error={!!this.state.usernameError}
                            value={this.state.username}
                            onChangeText={text => this.setState({ username: text })}
                        />
                        {this.state.usernameError ? <Text style={styles.error}>{this.state.usernameError}</Text> : null}
                    </View>
                    <View style={{ marginBottom: 10 }}>
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
                    <View style={{ marginBottom: 10 }}>
                        <TextInput
                            mode="outlined"
                            label="電話"
                            returnKeyType="next"
                            value={this.state.phone}
                            onChangeText={text => this.setState({ phone: text })}
                            keyboardType="number-pad"
                            error={!!this.state.phoneError}
                        />
                        {this.state.phoneError ? <Text style={styles.error}>{this.state.phoneError}</Text> : null}

                    </View>

                    <View style={{ marginBottom: 10 }}>
                        <TextInput
                            mode="outlined"
                            label="密碼"
                            placeholder="密碼(至少8個字元)"
                            returnKeyType="next"
                            autoCapitalize="none"
                            value={this.state.password}
                            onChangeText={text => this.setState({ password: text })}
                            error={!!this.state.passwordError}
                            secureTextEntry
                        />
                        {this.state.passwordError ? <Text style={styles.error}>{this.state.passwordError}</Text> : null}

                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <TextInput
                            mode="outlined"
                            label="確認密碼"
                            returnKeyType="done"
                            autoCapitalize="none"
                            value={this.state.confirmPassword}
                            onChangeText={text => this.setState({ confirmPassword: text })}
                            error={!!this.state.confirmPasswordError}
                            secureTextEntry
                        />
                        {this.state.confirmPasswordError ? <Text style={styles.error}>{this.state.confirmPasswordError}</Text> : null}

                    </View>

                    <Button labelStyle={styles.labelText} style={styles.button} mode="contained" onPress={() => this.registerPress()}>註冊</Button>
                    <View style={styles.row}>
                        <Text style={{ color: "#878787" }}>已經有帳號了? </Text>
                        <TouchableOpacity onPress={() => this.goToLoginPage()}>
                            <Text style={{ fontWeight: "bold", color: "#8249d1" }}>登入</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
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
    },
});