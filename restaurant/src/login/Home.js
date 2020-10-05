import React, { Component } from 'react';
import { View, StyleSheet, Alert, Image, ImageBackground, TouchableHighlight, ScrollView } from 'react-native';
import { TextInput, Divider, Text, Switch, Button, Chip, IconButton } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    goToLoginPage(){
        Actions.login();
    }

    goToRegisterPage(){
        Actions.register();
    }

    render() {
        return (
            <View style={{ flex: 1, padding:10, justifyContent:"center" }}>
                <Text style={styles.title}>歡迎使用</Text>
                <Button labelStyle={styles.labelText} style={styles.button} mode="contained" onPress={()=>this.goToLoginPage()}>登入</Button>
                <Button labelStyle={styles.labelText} style={styles.button} mode="outlined" onPress={()=>this.goToRegisterPage()}>註冊</Button>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 26,
        justifyContent:"center",
        alignSelf:"center",
        alignContent:"center",
        fontWeight:"bold",
        marginBottom:5
    },
    button:{
        width:"100%",
        marginVertical:10
    },
    labelText:{
        fontSize:20,
        fontWeight:"bold"
    }
});