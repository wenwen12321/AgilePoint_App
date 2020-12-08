import React from 'react';

import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    AsyncStorage,
    RefreshControl,
    SafeAreaView
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import serverInfo from './ServerInfo';
import orderList from './OrderList.js';

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
            <Text style={styles.font}>{props.name}</Text>
            <View style={{ flexDirection: "row", marginLeft: 5 }}>
                {props.flavors.map((flavor, findex) => (
                    <View style={{ flexDirection: "row", alignSelf: "center" }}>
                        <Text style={{ fontSize: 14, color: "#696969" }}>{flavor.flavor}</Text>
                        {renderLastFlavor(findex, props.flavors.length)}
                    </View>
                ))}
            </View>
            {/* <Text style={styles.memo}>{props.memo}</Text> */}
            <Text style={{ flexGrow: 2 }} />
            <Text style={styles.quantityFont}>數量 : {props.quantity}</Text>
        </View>
    )
}

function Order(props) {

    var display = [];

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
                    <Text style={styles.font}>#{props.orderNumber}</Text>
                    {/*<Text style={styles.font}>{props.orderDate}</Text>*/}
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
                    <Text onPress={() => goDetail(props)}>more...</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default class CurrentOrderList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //orderList: props.orderList,
            historyOrderList: [
                // {
                //     id: "#AB0004",
                //     store: "滷肉飯偉琪",
                //     orderDate: new Date(2020, 4, 20),
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
                // },
            ],
            isNeedUpdate: false,
            isUpdating: false,
            isLoggedIn: null,
            auth: null,
            userID: null,
            timer: null,
        }
    };

    componentDidMount() {
        this.getLoginSatus();
        let timer = setInterval(this.tick, 20000);
        this.setState({ timer });
    }

    tick = () => {
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
    }

    updateData = () => {
        if (this.state.isNeedUpdate && (!this.state.isUpdating)) {
            setTimeout(() => {
                this.setState({ isUpdating: true });
            })
            var address = serverInfo.SERVICE_ADDRESS;
            address += "customer/" + this.state.userID + "/historyOrders";
            console.log(address);
            fetch(address, {
                method: 'GET',
                headers: {
                    "Authorization": ("Bearer " + this.state.auth)
                }
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    this.setState({
                        historyOrderList: responseJson,
                        isNeedUpdate: false,
                    })
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setTimeout(() => {
                        this.setState({
                            isUpdating: false,
                            isNeedUpdate: false,
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
                    {this.state.historyOrderList.map(item => (
                        <Order
                            key={item.id}
                            id={item.id}
                            orderNumber={item.orderNumber}
                            status={item.status}
                            store={item.store}
                            orderDate={item.orderDate}
                            orderItems={item.orderItems}
                            orderPrice={item.orderPrice}
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
    },

    cardView: {
        flexDirection: 'column',
        borderWidth: 2,
        borderColor: '#17202A',
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

    list: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 3,
    },

    quantityFont: {
        fontSize: 18,
        paddingRight: 10,
    },

    font: {
        fontSize: 18,
    },

    memo: {
        top: 2,
        fontSize: 15,
        color: "#A9A9A9",
        paddingLeft: 10
    },

    storeName: {
        fontSize: 25,
        fontWeight: 'bold',
        color: "#57585F"

    },
});


