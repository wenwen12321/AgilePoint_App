import React from 'react';

import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    SafeAreaView
} from 'react-native';
import { IconButton, TextInput } from 'react-native-paper';
import { Button, Shape } from 'react-native-material-ui';
import { Actions } from 'react-native-router-flux';
import serverInfo from '../ServerInfo';


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
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontSize: 14, color: "#696969" }}>- {flavor.flavorType}：{flavor.flavor}{(flavor.extraPrice > 0) ? (" + $" + flavor.extraPrice) : ("")}</Text>
                    </View>
                ))}
            </View>
        </>
    )
}

function renderButton(id, status, setStatus = null, deleteOrder = null, completeOrder, totalOrder) {
    switch (status) {
        case 0:
            return (
                <>
                    <View style={styles.button}>
                        <Button raised primary style={{ text: styles.buttonText }} text="  開始製作  " onPress={() => setStatus(id)} />
                        <Button raised accent style={{ text: styles.buttonText }} text="  拒絕接單  " onPress={() => deleteOrder(id)} />
                    </View>
                    {(totalOrder) ?
                        <Text>顧客取餐紀錄：{Math.round((completeOrder / totalOrder) * 10.0) / 10}%  ({completeOrder}/{totalOrder})</Text>
                        :
                        <Text>該顧客尚未有取餐紀錄</Text>
                    }

                </>
            )
            break;

        case 1:
            return (
                <View style={styles.button}>
                    <Button raised primary style={{ text: styles.buttonText }} text="      餐點完成      " onPress={() => setStatus(id)} />
                </View>
            )
            break;

        case 2:
            return (
                <View style={styles.button}>
                    <Button raised primary style={{ text: styles.buttonText }} text="     顧客已取餐     " onPress={() => setStatus(id)} />
                </View>
            )
            break;

        default:
            null;
    }
}

export default class OrderDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            status: props.status,
            orderDate: props.orderDate,
            orderItems: props.orderItems,
            orderPrice: props.orderPrice,
            setStatus: props.setStatus,
            deleteOrder: props.deleteOrder,
            isNeedUpdate: false,
            auth: props.auth,
            orderMemo: "",
            totalOrder: 0,
            completeOrder: 0,
        }
    };

    componentDidMount() {

        var address = serverInfo.SERVICE_ADDRESS;
        address += ("store/" + this.state.id + "/orders/detail");
        console.log(address);
        fetch(address, {
            method: 'GET',
            headers: {
                "Authorization": ("Basic " + this.state.auth),
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({
                    status: responseJson.status,
                    orderDate: responseJson.orderDate,
                    orderItems: responseJson.orderItems,
                    orderPrice: responseJson.orderPrice,
                    orderMemo: responseJson.orderMemo,
                    totalOrder: responseJson.totalOrder,
                    completeOrder: responseJson.completeOrder,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    updateData() {
        if (this.state.isNeedUpdate) {
            var address = serverInfo.SERVICE_ADDRESS;
            address += ("store/" + this.state.id + "/orders/detail");
            console.log(address);
            fetch(address, {
                method: 'GET',
                headers: {
                    "Authorization": ("Basic " + this.state.auth),
                }
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    this.setState({
                        status: responseJson.status,
                        orderDate: responseJson.orderDate,
                        orderItems: responseJson.orderItems,
                        orderPrice: responseJson.orderPrice,
                        orderMemo: orderMemo,
                        totalOrder: responseJson.totalOrder,
                        completeOrder: responseJson.completeOrder,
                    });
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setTimeout(() => {
                        this.setState({ isNeedUpdate: false });
                    }, 0)
                });
        }
    }

    render() {

        const goBack = () => {
            Actions.pop();
        };

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView>
                    <View style={styles.main}>
                        {this.updateData()}
                        <IconButton icon="arrow-left" size={30} color="#676767" onPress={() => goBack} />
                        {/* <Text style={styles.popText} onPress={goBack}> X </Text> */}

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
                            <Text style={{ color: "#4a4a4a" }}>(總價格包含口味加價項)</Text>
                        </View>

                        {renderButton(this.state.id, this.state.status, this.state.setStatus, this.state.deleteOrder, this.state.completeOrder, this.state.totalOrder)}

                    </View>
                </ScrollView>
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
        alignItems: "flex-end",
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
    }
});