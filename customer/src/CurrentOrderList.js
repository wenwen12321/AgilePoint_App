import React from 'react';

import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    TouchableHighlight,
    Animated,
    AsyncStorage,
    RefreshControl,
    SafeAreaView
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { Card } from 'react-native-material-ui';
import serverInfo from './ServerInfo.js';

function OrderItem(props) {

    renderLastFlavor = (findex, flength) => {
        if (findex != flength - 1) {
            return (
                <Text style={{ color: "#696969" }}>｜</Text>
            )
        }
    };

    return (
        <View style={styles.list}>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.font}>{props.name}</Text>
                <View style={{ marginLeft: 5, flexDirection:"row" }} >
                    {props.flavors.map((flavor, findex) => (
                        <View style={{ flexDirection: "row", alignSelf: "center" }}>
                            <Text style={{ fontSize: 14, color: "#696969" }}>{flavor.flavor}</Text>
                            {renderLastFlavor(findex, props.flavors.length)}
                        </View>
                    ))}
                </View>
            </View>
            {/* <Text style={styles.memo}>{props.memo}</Text> */}
            <Text style={styles.quantityFont}>X {props.quantity}</Text>
            <Text style={{ flexGrow: 1 }} />
            <Text style={styles.price}>單價:${props.mealPrice}</Text>
        </View>
    )
}

function Order(props) {

    var display = [];
    var statusString;
    var statusStyle;

    switch (props.status) {
        case 0:
            statusString = "  未接單  ";
            statusStyle = styles.unacceptedOrder;
            break;
        case 1:
            statusString = "  處理中  ";
            statusStyle = styles.doingOrder;
            break;
        case 2:
            statusString = "  待取餐  ";
            statusStyle = styles.notTakenOrder;
            break;
    }

    for (let i = 0; i < 3 && i < props.orderItems.length; i++) {
        display.push(props.orderItems[i]);
    }

    const goDetail = (props) => {
        Actions.orderDetail(props);
    };

    return (
        <TouchableOpacity onPress={() => goDetail(props)}>
            <View style={styles.cardView}>
                <View>
                    <Text style={styles.storeName}>{props.store}</Text>
                </View>

                <View style={styles.info}>
                    <Text style={styles.idFont}>#{props.id}</Text>
                    <Text style={statusStyle}>{statusString}</Text>
                    <Text style={{ flexGrow: 2 }} />
                    <Text style={styles.font}>{props.orderDate}</Text>
                </View>

                <View>
                    {display.map(item => (
                        <OrderItem
                            key={item.id}
                            name={item.name}
                            memo={item.memo}
                            quantity={item.quantity}
                            mealPrice={item.mealPrice}
                            flavors={item.flavors}
                        />
                    ))}
                </View>

                <View style={{ justifyContent: "flex-end", flexDirection: "row" }}>
                    <Text style={{ fontSize: 20 }}>總價格：$ {props.orderPrice} </Text>
                </View>

                <View style={styles.more}>
                    <Text>more...</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default class CurrentOrderList extends React.Component {
    constructor(props) {
        super(props);

        /*this.icons = {
            'up' : require('../img/Arrowhead-Up'),
            'down' : require('../img/Arrowhead-Down'),
        }*/

        this.state = {
            //orderList: props.orderList,
            orderList: [
                // {
                //     id: "#AB0001",
                //     store: "滷肉飯偉琪",
                //     status: 0,
                //     orderDate: new Date(),
                //     orderItems: [
                //         {
                //             id: 0,
                //             name: "牛肉麵",
                //             memo: "不蔥小辣",
                //             quantity: 1,
                //             mealPrice: 95
                //         },
                //         {
                //             id: 4,
                //             name: "牛肉麵",
                //             memo: "不蔥小辣",
                //             quantity: 1,
                //             mealPrice: 95,
                //         }
                //     ],
                //     orderPrice: 475,
                // }
            ],
            isNeedUpdate: false,
            isUpdating: false,
            isLoggedIn: null,
            auth: null,
            userID: null,
        }

    };

    componentDidMount() {
        this.getLoginSatus();


    }

    getLoginSatus = async () => {
        try {
            const loginStatus = await AsyncStorage.getItem("@User:loginStatus");
            console.log(loginStatus);
            if (loginStatus !== null) {
                const auth = await AsyncStorage.getItem("@User:authorization");
                const userID = await AsyncStorage.getItem("@User:userID");
                console.log(userID);
                // console.log(auth);
                console.log("not null");
                setTimeout(() => {
                    this.setState({
                        isLoggedIn: true,
                        auth: auth,
                        userID: userID,
                        isNeedUpdate: true,
                        isUpdating: false,
                    });
                }, 0);
            }
        }
        catch (error) {
            console.log(error);
        }
        // finally {
        //     var address = serverInfo.SERVICE_ADDRESS;
        //     address += "customer/" + this.state.userID + "/currentOrders";
        //     console.log(address);
        //     fetch(address, {
        //         method: 'GET',
        //         headers: {
        //             "Authorization": ("Basic " + this.state.auth)
        //         }
        //     })
        //         .then((response) => response.json())
        //         .then((responseJson) => {
        //             console.log(responseJson);
        //             this.setState({
        //                 orderList: responseJson
        //             })
        //         })
        //         .catch((error) => {
        //             console.log(error);
        //         });
        // }
    }

    updateData = () => {
        if (this.state.isNeedUpdate && (!this.state.isUpdating)) {
            setTimeout(() => {
                this.setState({ isUpdating: true });
            })
            var address = serverInfo.SERVICE_ADDRESS;
            address += "customer/" + this.state.userID + "/currentOrders";
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
                        orderList: responseJson,
                        isNeedUpdate: false,
                    })
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setTimeout(() => {
                        this.setState({
                            isNeedUpdate: false,
                            isUpdating: false,
                        })
                    }, 0)
                });
        }
    }

    render() {

        return (
            <SafeAreaView style={{flex:1}}>
            <View style={styles.order}>
                {this.updateData()}
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    refreshControl={<RefreshControl refreshing={this.state.isUpdating} onRefresh={() => { this.setState({ isNeedUpdate: true }) }} />}
                >
                    {/*<Text style={styles.orderListTitle}>目前訂單</Text>*/}
                    {this.state.orderList.map(item => (
                        <Order
                            key={item.id}
                            id={item.id}
                            status={item.status}
                            store={item.store}
                            orderDate={item.orderDate}
                            orderItems={item.orderItems}
                            orderPrice={item.orderPrice}
                            setStatus={this.props.setStatus}
                            deleteOrder={this.props.deleteOrder}
                            auth={this.state.auth}
                        />
                    ))}

                </ScrollView>
            </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    order: {
        // top: 10,
        flex: 1,
        marginBottom:5,
    },

    cardView: {
        flexDirection: 'column',
        borderColor: 'black',
        borderWidth: 2,
        padding: 3,
        margin: 5,
    },

    more: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

    info: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    unacceptedOrder: {
        backgroundColor: '#FF6969',
        color: '#FFFFFF',
        fontSize: 18
    },

    doingOrder: {
        backgroundColor: '#F7BF00',
        color: '#FFFFFF',
        fontSize: 18
    },

    notTakenOrder: {
        backgroundColor: '#69B9FF',
        color: '#FFFFFF',
        fontSize: 18
    },

    list: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 3,
    },

    idFont: {
        fontSize: 18,
        paddingRight: 10,
    },

    quantityFont: {
        fontSize: 18,
        paddingRight: 10,
        paddingLeft: 30,
    },

    font: {
        fontSize: 18,
    },

    memo: {
        paddingLeft: 10,
        top: 2,
        fontSize: 15,
        color: "#A9A9A9"
    },

    price: {
        fontSize: 18,
    },

    orderListTitle: {
        textAlign: 'center',
        fontSize: 30,
    },

    storeName: {
        fontSize: 25,
        fontWeight: 'bold',
        color: "#57585F"
    },

});

