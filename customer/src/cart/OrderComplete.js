import React, { Component } from 'react';
import { View, StyleSheet, Alert, Image, ImageBackground, TouchableHighlight, ScrollView, SafeAreaView } from 'react-native';
import { TextInput, Text, Switch, Button, Divider } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import UIStepper from 'react-native-ui-stepper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomBar from '../bottomBar/BottomBar.js'

export default class OrderComplete extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    goToOrderPage = () => {
        Actions.reset("orderList");
    };

    render() {

        return (
            <SafeAreaView style={{flex:1}}>
            <View style={{ padding: 10 }}>
                <ScrollView>
                    <View style={{alignItems:"center",justifyContent:"center"}}>
                        <Icon style={styles.checkIcon} name="check-circle" size={200} color="#9e9e9e" />
                        <Text style={{ marginBottom: 5, fontSize: 30 }}>餐廳已收到您的訂單</Text>
                        <Text style={{ marginBottom: 20, fontSize:15 }}>餐廳完成餐點後會再發送通知給您</Text>
                    </View>
                    {/* <Text style={{paddingHorizontal:10, fontSize:18}}>訂單資料：</Text> */}
                    <View style={{ paddingHorizontal: 10 }}>
                        <Button mode="contained" style={styles.orderButton} contentStyle={styles.orderButton} labelStyle={{ fontSize: 30 }} onPress={() => { this.goToOrderPage() }} >前往我的訂單</Button>
                    </View>
                </ScrollView>
            </View>
            </SafeAreaView>
        )
    }
};

const styles = StyleSheet.create({
    checkIcon: {
        marginTop: 30,
        marginBottom: 10,
    },
    orderButton: {
        width: "100%",
        height: 60
    }
});