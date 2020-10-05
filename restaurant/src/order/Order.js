import React from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import { Actions } from 'react-native-router-flux';

function OrderItem(props) {
    return (
        <View style={styles.list}>
            <Text>{props.name}</Text>
            <Text style={styles.memo}>{props.memo}</Text>
            <Text>數量 : {props.quantity}</Text>
        </View>
    )
}

export default class Order extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id : props.id,
            status : props.status,
            orderDate : props.orderDate,
            orderItems : props.orderItems,
            orderPrice : props.orderPrice,
        }
    };

    goDetail = (props) => {

    }

    render() {

        var statusString;
        var statusStyle;
        var display = [];

        for(let i = 0; i < 3 && i < this.state.orderItems.length; i++)
        {
            display.push(this.state.orderItems[i]);
        }

        switch(this.state.status)
        {
            case 0 :
                statusString = "  未接單  ";
                statusStyle = styles.unacceptedOrder;
                break;
            case 1 :
                statusString = "  處理中  ";
                statusStyle = styles.doingOrder;
                break;
            case 2 :
                statusString = "  待取餐  ";
                statusStyle = styles.notTakenOrder;
        }

        return (
            <View style={styles.cardView}>

                <View style={styles.info}>
                    <Text>{this.state.id}</Text>
                    <Text style={statusStyle}>{statusString}</Text>
                    <Text>{this.state.orderDate}</Text>
                </View>

                <View>
                    {display.map(item => (
                        <OrderItem
                            key={item.id}
                            name={item.name}
                            memo={item.memo}
                            quantity={item.quantity}
                        />
                    ))}
                </View>

                <View  style={styles.more}>
                    <Text onPress={() => goDetail(this.state)}>more...</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardView: {
        flexDirection : 'column',
        borderWidth : 2,
        borderColor : '#17202A',
        padding: 3,
        margin: 5,
    },

    more: {
        flexDirection : 'row',
        justifyContent : 'flex-end',
    },

    info: {
        flexDirection : 'row',
        justifyContent : 'space-between'
    },

    unacceptedOrder : {
        backgroundColor : '#FF6969',
        right : 100,
        color : '#FFFFFF'
    },

    doingOrder : {
        backgroundColor : '#F7BF00',
        right : 100,
        color : '#FFFFFF'
    },

    notTakenOrder : {
        backgroundColor : '#69B9FF',
        right : 100,
        color : '#FFFFFF'
    },

    list: {
        flexDirection : 'row',
        justifyContent : 'space-around',
        padding : 3,
        right : 30
    },

    memo: {
        right : 70,
        top : 2,
        fontSize : 12,
        color : "#A9A9A9"
    }

});