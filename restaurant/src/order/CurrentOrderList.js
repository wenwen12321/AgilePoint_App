import React from 'react';

import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    RefreshControl,
    AsyncStorage, SafeAreaView
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import serverInfo from '../ServerInfo';
import base64 from 'react-native-base64';

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
                <View style={{ marginLeft: 5, flexDirection: "row" }} >
                    {props.flavors.map((flavor, findex) => (
                        <View style={{ flexDirection: "row", alignSelf: "center" }}>
                            <Text style={{ fontSize: 14, color: "#696969" }}>{flavor.flavor}</Text>
                            {renderLastFlavor(findex, props.flavors.length)}
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

    goDetail = (props) => {
        Actions.detail(props);
    };

    return (
        <TouchableOpacity onPress={() => goDetail(props)}>
            <View style={styles.cardView}>

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
            isLoggedIn: null,
            auth: null,
            userID: null,
            storeID: null,
            timer: null,
        }

    };

    componentDidMount() {
        this.getLoginSatus();
        let timer = setInterval(this.tick, 20000);
        this.setState({timer});

    }

    componentWillUnmount(){
        clearInterval(this.state.timer);
    }

    tick = () =>{
        this.setState({
            isNeedUpdate: true,
        })
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

    setStatus = (id) => {

        const newOrderList = this.state.orderList;
        const index = this.state.orderList.findIndex(item => item.id === id);
        newOrderList[index].status++;
        console.log(newOrderList[index].status);
        var address = serverInfo.SERVICE_ADDRESS;
        address += ("store/" + id + "/orders/status");
        console.log(address);
        fetch(address, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": ("Basic " + this.state.auth)
            },
            body: JSON.stringify({
                Status: newOrderList[index].status
            })
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
                "Authorization": ("Basic " + this.state.auth),
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

    updateData = () => {
        if (this.state.isLoggedIn && this.state.isNeedUpdate && (!this.state.isUpadting)) {


            setTimeout(() => { this.setState({ isUpadting: true }) }, 0);
            var address = serverInfo.SERVICE_ADDRESS;
            address += "store/" + this.state.storeID + "/currentOrders";
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
                        isUpadting: false,
                        isNeedUpdate: false,
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    render() {
        console.log("render2~~");
        console.log(this.state.p);
        return (
            <SafeAreaView style={{flex:1}}>
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
                            status={item.status}
                            orderDate={item.orderDate}
                            orderItems={item.orderItems}
                            orderPrice={item.orderPrice}
                            setStatus={this.setStatus}
                            auth={this.state.auth}
                            deleteOrder={this.deleteOrder}
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

