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
import { IconButton } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

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
        Actions.detail(props);
    };

    return (
        <TouchableOpacity onPress={() => goDetail(props)}>
            <View style={styles.cardView}>

                <View style={styles.info}>
                    <Text style={styles.font}>#{props.orderNumber}</Text>
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
                    <Text onPress={() => goDetail(props)}>more...</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default class HistoryOrderList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            orderList: [],
            isNeedUpdate: false,
            isUpadting: false,
            isLoggedIn: false,
            auth: null,
            userID: null,
            storeID: null,
            timer: null,
            dateInString: null,
            date: null,
            today: null,
            isDatePickerVisible: false,
        }
    };

    componentDidMount() {
        this.getLoginSatus();
        // let timer = setInterval(this.tick, 20000);
        // this.setState({ timer });

    }

    // componentWillUnmount() {
    //     clearInterval(this.state.timer);
    // }

    tick = () => {
        this.getLoginSatus();
    }

    covertToString = (d) => {
        return d.getFullYear() + "-" + (((d.getMonth() + 1) > 9) ? "" : "0") + (d.getMonth() + 1) + "-" + ((d.getDate()) > 9 ? "" : "0") + d.getDate();
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
                var d = new Date();
                var date = this.covertToString(d);
                setTimeout(() => {
                    this.setState({
                        isLoggedIn: true,
                        auth: auth,
                        userID: userID,
                        isNeedUpdate: true,
                        isUpdating: false,
                        storeID: storeID,
                        dateInString: date,
                        date: d,
                        today: date
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
    //     address += "store/1/historyOrders";
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

    updateData = () => {
        if (this.state.isLoggedIn && this.state.isNeedUpdate && (!this.state.isUpadting)) {


            setTimeout(() => { this.setState({ isUpadting: true }) }, 0);
            var address = serverInfo.SERVICE_ADDRESS;
            address += "store/" + this.state.storeID + "/historyOrders?date=" + this.state.dateInString;
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

    handleDateConfirm = (date) => {
        console.log(date);
        var now = new Date();
        console.log(date - now);
        if (date - now < 0) {

            var dateInString = this.covertToString(date);

            this.setState({
                isDatePickerVisible: false,
                dateInString: dateInString,
                date: date,
                isNeedUpdate: true,
                isUpadting: false,
            });
        }
        else {
            this.setState({
                isDatePickerVisible: false,
                isNeedUpdate: true,
                isUpadting: false,
            });
        }
    }

    handleBefore = () => {
        var d = this.state.date;
        d.setDate(d.getDate() - 1);
        var dateInString = this.covertToString(d);
        this.setState({
            dateInString: dateInString,
            date: d,
            isNeedUpdate: true,
            isUpadting: false,
        });
    }

    handleAfter = () => {
        var d = this.state.date;
        d.setDate(d.getDate() + 1);
        var dateInString = this.covertToString(d);
        this.setState({
            dateInString: dateInString,
            date: d,
            isNeedUpdate: true,
            isUpadting: false,
        });
    }

    render() {
        console.log("render3~~");
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
                        {(this.state.isLoggedIn) ?
                            <View style={{ justifyContent: "center", flexDirection: "row", margin: 5 }}>
                                <IconButton icon="chevron-left" onPress={() => this.handleBefore()} size={15} style={{ alignSelf: "center", marginRight: 10 }} />
                                <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => { this.setState({ isDatePickerVisible: true }) }}>
                                    <Text>{this.state.dateInString}</Text>
                                    <DateTimePickerModal
                                        cancelTextIOS="取消"
                                        confirmTextIOS="確認"
                                        headerTextIOS="選擇日期"
                                        isVisible={this.state.isDatePickerVisible}
                                        mode="date"
                                        onConfirm={(date) => this.handleDateConfirm(date)}
                                        onCancel={() => { this.setState({ isDatePickerVisible: false }) }}
                                    />
                                </TouchableOpacity>
                                <IconButton icon="chevron-right" onPress={() => this.handleAfter()} disabled={(this.state.dateInString === this.state.today)} size={15} style={{ alignSelf: "center", marginLeft: 10 }} />
                            </View>
                            :
                            null
                        }
                        {(this.state.orderList.length) ?
                            null
                            :
                            <Text style={{ color: "#9e9e9e", fontSize: 24, margin: 20, textAlign: "center" }}>查無資料</Text>
                        }
                        {this.state.orderList.map(item => (
                            <Order
                                key={item.id}
                                id={item.id}
                                orderNumber={item.orderNumber}
                                status={item.status}
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
        // marginBottom: 5,
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
    }
});


