import React from 'react';

import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    RefreshControl,
    AsyncStorage, SafeAreaView, Alert
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import serverInfo from '../ServerInfo';
import base64 from 'react-native-base64';
import PushNotification from 'react-native-push-notification';

function OrderItem(props) {

    // renderLastFlavor = (findex, flength) => {
    //     if (findex != flength - 1) {
    //         return (
    //             <Text style={{ color: "#696969" }}>｜</Text>
    //         )
    //     }
    // };

    return (
        <View style={styles.list}>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.font}>{props.name}</Text>
                <View style={{ marginLeft: 5, flexDirection: "row" }} >
                    {props.flavors.map((flavor, findex) => (
                        <View style={{ flexDirection: "row", alignSelf: "center" }}>
                            <Text style={{ fontSize: 14, color: "#696969" }}>{flavor.flavor + ((findex !== props.flavors.length - 1) ? "｜" : "")}</Text>
                            {/* {renderLastFlavor(findex, props.flavors.length)} */}
                        </View>
                    ))}
                </View>
            </View>
            <Text style={styles.memo}>{props.memo}</Text>
            <Text style={styles.quantityFont}>X {props.quantity}</Text>
        </View>
    )
}

function Order(props) {

    var display = [];
    var statusString;
    var statusStyle;

    switch (props.status) {
        case 0:
            if (props.estimatedTime === "0000-00-00 00:00:00") {
                statusString = "  未接單  ";
                statusStyle = styles.unacceptedOrder;
            }
            else {
                statusString = " 預定訂單 "
                statusStyle = styles.preOrder;
            }
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

    goDetail = (props) => {
        Actions.detail(props);
    };

    return (
        <TouchableOpacity onPress={() => goDetail(props)}>
            <View style={styles.cardView}>

                <View style={styles.info}>
                    <Text style={styles.idFont}>#{props.orderNumber}</Text>
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

        this.state = {
            orderList: [],
            p: props,
            isNeedUpdate: false,
            isUpadting: false,
            isLoggedIn: false,
            auth: null,
            userID: null,
            storeID: null,
            timer: null,
            updatedOrders: [],
        }

    };

    componentDidMount() {
        this.getLoginSatus();

        var address = serverInfo.SERVICE_ADDRESS;
        address += ("restaurant/versionNumber");
        console.log(address);
        fetch(address, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (serverInfo.VERSION_NUMBER < responseJson.versionNumber) {
                    Alert.alert(
                        "有新版本可用",
                        responseJson.msg,
                        [
                            {
                                text: "更新",
                                onPress: () => Linking.openURL(responseJson.url)
                            }
                        ],
                        { cancelable: responseJson.cancelable }
                    );
                }
            })
            .catch((error) => {
                console.log(error);
            })

        let timer = setInterval(this.tick, 20000);
        this.setState({ timer });

    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    tick = () => {
        this.getLoginSatus();
    }

    pushNotification = () => {
        for (var i = 0; i < this.state.updatedOrders.length; i++) {
            var msgText = "";
            switch (this.state.updatedOrders[i].status) {
                case 0:
                    msgText = "有新訂單進來哦，請前往確認"
                    break;
                // case 1:
                //     msgText = "已接單，餐點製作中";
                //     break;
                // case 2:
                //     msgText = "已完成，可前往取餐";
                //     break;
                // case 3:
                //     msgText = "已被放入歷史訂單中";
                //     break;
                // case 4:
                //     msgText = "逾時未取餐";
                //     break;
                // case 5:
                //     msgText = "過久未接單，訂單已被取消";
                //     break;
                // case 99:
                //     msgText = "店家拒絕接單，訂單已被取消";
                //     break;
                default:
                    msgText = "有狀態更新，請前往確認";
                    break;
            }
            PushNotification.localNotification({
                /* Android Only Properties */
                channelId: "4654",
                subText: "訂單更新",
                largeIcon: "",

                /* iOS and Android properties */
                title: "訂單 #" + this.state.updatedOrders[i].orderNumber, // (optional)
                message: msgText, // (required)
                orderID: this.state.updatedOrders[i].orderID
            });
        }
    }

    getLoginSatus = async () => {
        try {
            const loginStatus = await AsyncStorage.getItem("@User:loginStatus");
            console.log(loginStatus);
            if (loginStatus !== null) {
                const auth = await AsyncStorage.getItem("@User:authorization");
                const userID = await AsyncStorage.getItem("@User:userID");
                const storeID = await AsyncStorage.getItem("@User:storeID");
                console.log(userID);
                // console.log(auth);
                console.log("not null");
                setTimeout(() => {
                    this.setState({
                        isLoggedIn: true,
                        auth: auth,
                        userID: userID,
                        storeID: storeID,
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

    // componentDidMount() {
    //     var auth = base64.encode("user1@gmail.com:password1");

    //     setTimeout(() => { this.setState({ isUpadting: true }) }, 0);
    //     var address = serverInfo.SERVICE_ADDRESS;
    //     address += "store/1/currentOrders";
    //     console.log(address);
    //     fetch(address, {
    //         method: 'GET',
    //         headers: {
    //             "Authorization": ("Basic " + auth)
    //         }
    //     })
    //         .then((response) => response.json())
    //         .then((responseJson) => {
    //             console.log(responseJson);
    //             this.setState({
    //                 orderList: responseJson,
    //                 auth: auth,
    //                 isUpadting: false,
    //             });
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }

    setStatus = (id, waitTime = -1) => {

        const newOrderList = this.state.orderList;
        const index = this.state.orderList.findIndex(item => item.id === id);
        newOrderList[index].status++;
        console.log(newOrderList[index].status);
        var address = serverInfo.SERVICE_ADDRESS;

        var bodyData = {};
        bodyData.status = newOrderList[index].status;
        if (waitTime >= 0) {
            var d = new Date();
            d.setHours(d.getHours() + 8);
            d.setMinutes(d.getMinutes() + waitTime);
            bodyData.estimatedTime = d;
            console.log(d);
        }

        address += ("store/" + id + "/orders/status");
        console.log(address);
        fetch(address, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": ("Bearer " + this.state.auth)
            },
            body: JSON.stringify(bodyData)
        })
            .catch((error) => {
                console.log(error);
            });

        if (newOrderList[index].status > 2) {
            newOrderList.splice(index, 1);
        }

        this.setState(() => {
            return {
                orderList: newOrderList
            };
        });

        Actions.reset('orderList');
    };

    deleteOrder = (id) => {

        var address = serverInfo.SERVICE_ADDRESS;
        address += ("store/" + id + "/orders/delete");
        console.log(address);
        fetch(address, {
            method: 'DELETE',
            headers: {
                "Authorization": ("Bearer " + this.state.auth),
            }
        })
            .catch((error) => {
                console.log(error);
            });

        const newOrderList = this.state.orderList;
        const index = this.state.orderList.findIndex(item => item.id === id);

        newOrderList.splice(index, 1);

        this.setState(() => {
            return {
                orderList: newOrderList
            };
        });

        Actions.reset('orderList');
    };

    setStorage = async () => {
        try {
            await AsyncStorage.removeItem('@User:loginStatus');
            await AsyncStorage.removeItem('@User:authorization');
            await AsyncStorage.removeItem('@User:userID');
            await AsyncStorage.removeItem('@User:storeID');
            await AsyncStorage.removeItem('@User:username');
            await AsyncStorage.removeItem('@User:email');
            await AsyncStorage.removeItem('@User:avatar');
            await AsyncStorage.removeItem('@User:role');
        } catch (error) {
            console.log(error);
        }
    }

    updateData = () => {
        if (this.state.isLoggedIn && this.state.isNeedUpdate && (!this.state.isUpadting)) {


            setTimeout(() => { this.setState({ isUpadting: true }) }, 0);
            var address = serverInfo.SERVICE_ADDRESS;
            address += "store/" + this.state.storeID + "/currentOrders";
            console.log(address);
            fetch(address, {
                method: 'GET',
                headers: {
                    "Authorization": ("Bearer " + this.state.auth)
                }
            })
                .then((response) => {
                    console.log(response);
                    if (response.ok) {
                        return response.json();
                    }
                    else if (response.status === 401) {
                        this.setStorage().then(() => {
                            Alert.alert(
                                "警告",
                                "由於帳戶偵測到異常，因此已登出，請重新進行登入",
                                [
                                    { text: "好", onPress: () => { Actions.reset('accountSetting'); } }
                                ]
                            );
                        });
                    }
                })
                .then((responseJson) => {
                    console.log(responseJson);
                    if (typeof responseJson !== "undefined") {
                        this.setState({
                            orderList: responseJson,
                            isUpadting: false,
                            isNeedUpdate: false,
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });

            address = serverInfo.SERVICE_ADDRESS;
            address += "store/" + this.state.storeID + "/updatedOrders";
            console.log(address);
            fetch(address, {
                method: 'GET',
                headers: {
                    "Authorization": ("Bearer " + this.state.auth)
                }
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                })
                .then((responseJson) => {
                    console.log(responseJson);
                    if (typeof responseJson !== "undefined") {
                        this.setState({
                            updatedOrders: responseJson
                        })
                        this.pushNotification();
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            // })
        }
    }

    render() {
        console.log("render2~~");
        console.log(this.state.p);
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.order}>
                    {this.updateData()}
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        refreshControl={
                            <RefreshControl refreshing={this.state.isUpadting} onRefresh={() => { this.setState({ isNeedUpdate: true }) }} />
                        }
                    >

                        {this.state.orderList.map(item => (
                            <Order
                                key={item.id}
                                id={item.id}
                                orderNumber={item.orderNumber}
                                status={item.status}
                                orderDate={item.orderDate}
                                orderItems={item.orderItems}
                                orderPrice={item.orderPrice}
                                setStatus={this.setStatus}
                                auth={this.state.auth}
                                deleteOrder={this.deleteOrder}
                                storeID={this.state.storeID}
                                estimatedTime={item.estimatedTime}
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
        // marginTop:5,
        flex: 1,
        // marginBottom: 10,
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

    preOrder: {
        backgroundColor: '#459844',
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
        justifyContent: 'space-between',
        padding: 3,
    },

    idFont: {
        fontSize: 18,
        paddingRight: 10,
    },

    quantityFont: {
        fontSize: 18,
        paddingRight: 10,
    },

    font: {
        fontSize: 18,
    },

    memo: {
        paddingLeft: 10,
        top: 2,
        fontSize: 15,
        color: "#A9A9A9"
    }

});

