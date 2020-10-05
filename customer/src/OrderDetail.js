import React from 'react';

import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    SafeAreaView
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { Button, Shape } from 'react-native-material-ui';
import { Actions } from 'react-native-router-flux';
import serverInfo from './ServerInfo.js';

function OrderDetailItem(props) {
    return (
        <>
            <View style={styles.item}>
                <Text style={styles.font}>{props.name}</Text>
                {/* <Text style={styles.memo}>{props.memo}</Text> */}
                <Text style={{ flexGrow: 1 }} />
                <Text style={{ flexGrow: 1 }} />
                <Text style={styles.font}>{props.quantity}</Text>
                <Text style={{ flexGrow: 1 }} />
                <Text style={styles.font}>{props.mealPrice}</Text>
            </View>
            <View style={{ marginLeft: 15 }}>
                {props.flavors.map((flavor) => (
                    <View style={{ flexDirection: "row"}}>
                        <Text style={{ fontSize: 14, color: "#696969" }}>- {flavor.flavorType}：{flavor.flavor}{(flavor.extraPrice > 0) ? (" + $" + flavor.extraPrice) : ("")}</Text>
                    </View>
                ))}
            </View>
        </>
    )
}

export default class OrderDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            /* id : props.id,
             status : props.status,
             orderDate : props.orderDate,
             orderItems : props.orderItems,
             orderPrice : props.orderPrice,
             setStatus : props.setStatus,
             deleteOrder : props.deleteOrder,*/
            id: props.id,
            store: "",
            status: 0,
            orderDate: "",
            orderItems: [],
            orderPrice: 0,
            auth: props.auth,
            orderMemo: "",
        }
    };

    componentDidMount() {
        var id = this.state.id;
        var address = serverInfo.SERVICE_ADDRESS;
        address += ("customer/" + id + "/orders/detail");
        console.log(address);
        fetch(address, {
            method: 'GET',
            headers: {
                "Authorization": ("Basic " + this.state.auth)
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({
                    store: responseJson.store,
                    status: responseJson.status,
                    orderDate: responseJson.orderDate,
                    orderItems: responseJson.orderItems,
                    orderPrice: responseJson.orderPrice,
                    orderMemo: responseJson.orderMemo,
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {

        const goBack = () => {
            Actions.pop();
        };

        return (
            <SafeAreaView style={{flex:1}}>
            <View style={styles.main}>
                <Text style={styles.popText} onPress={goBack}> X </Text>

                <View>
                    <Text style={styles.storeName}>{this.state.store}</Text>
                </View>

                <View style={styles.header}>
                    <Text style={styles.idText}>#{this.state.id}</Text>
                    <Text style={styles.dateText}>{this.state.orderDate}</Text>
                </View>

                <View style={styles.orderDetailItemTitle}>
                    <Text style={styles.font}>品項</Text>
                    <Text style={{ flexGrow: 1 }} />
                    <Text style={{ flexGrow: 1 }} />
                    <Text style={styles.font}>數量</Text>
                    <Text style={{ flexGrow: 1 }} />
                    <Text style={styles.font}>單價</Text>
                </View>

                <View style={styles.orderDetailItemList}>
                    {this.state.orderItems.map(item => (
                        <OrderDetailItem
                            key={item.id}
                            name={item.name}
                            memo={item.memo}
                            quantity={item.quantity}
                            mealPrice={item.mealPrice}
                            flavors={item.flavors}
                        />
                    ))}
                </View>

                <Text style={styles.font}>備註 : </Text>
                <TextInput
                    mode="outlined"
                    multiline={true}
                    numberOfLines={4}
                    // style={styles.remark}
                    // underlineColorAndroid='transparent'
                    editable={false}
                    value={this.state.orderMemo}
                />

                <View style={styles.price}>
                    <Text style={styles.priceText}>總價格 $ {this.state.orderPrice}</Text>
                    <Text>(總價格包含口味加價項)</Text>
                </View>

            </View>
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    main: {
        flexDirection: 'column',
        padding: 3,
        margin: 5,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 20,
        paddingTop: 10,
    },

    orderDetailItemTitle: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 5
    },

    orderDetailItemList: {
        paddingTop: 10,
        paddingBottom: 20
    },

    remark: {
        height: 100,
        backgroundColor: '#EDEDEE',
    },

    price: {
        // flexDirection: 'row',
        alignItems:"flex-end",
        justifyContent: 'flex-end',
        padding: 10
    },

    priceText: {
        fontSize: 25
    },

    idText: {
        fontSize: 25
    },

    dateText: {
        fontSize: 25,
        color: "#A9A9A9"
    },

    font: {
        fontSize: 18,
        marginBottom: 5,
    },


    button: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },

    item: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },

    memo: {
        paddingLeft: 10,
        top: 2,
        fontSize: 18,
        color: "#A9A9A9"
    },

    popText: {
        fontSize: 20,
    },

    buttonText: {
        fontSize: 20,
    },

    storeName: {
        fontSize: 25,
        fontWeight: 'bold',
        color: "#57585F"

    },
});