import React, { Component, memo } from 'react';
import { View, StyleSheet, ActivityIndicator, AsyncStorage, Alert, Image, ImageBackground, TouchableHighlight, ScrollView, RefreshControl, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import { TextInput, Text, Switch, Button, Divider } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import UIStepper from 'react-native-ui-stepper';
import serverInfo from '../ServerInfo.js';

export default class Cart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cart: [
                // {
                //     storeID: 1,
                //     storeName: "",
                //     cartItem: [
                //         {
                //             cartItemID: 1,
                //             mealID: 1,
                //             mealName: "",
                //             calories: 0,
                //             price: 0,
                //             flavors: [],
                //             memo: "",
                //             quantity: 1,
                //             imageUri: "https://i.imgur.com/gSwhoIJ.jpg"
                //         }
                //     ],
                // },
            ],
            totalPrice: 0,
            isNeedUpdate: false,
            isUpdating: true,
            userID: null,
            auth: null,
            isLoggedIn: null,
            totalExtraPrice: 0,
        };
    }

    componentDidMount() {
        this.getLoginSatus().done();
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
                    });
                }, 0);
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setTimeout(() => {
                this.setState({ isUpdating: false });
            })
        }
    }

    // componentDidMount() {

    //     var address = serverInfo.SERVICE_ADDRESS;
    //     address += "1/cart";
    //     console.log(address);
    //     fetch(address, {
    //         method: 'GET',
    //     })
    //         .then((response) => response.json())
    //         .then((responseJson) => {
    //             console.log(responseJson);
    //             this.setState({
    //                 cart: responseJson
    //             })
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }

    renderCartItem = () => {
        var cartStore = new Set();
        var renderStr = "";

        for (var i = 0; i < this.state.cart.length; i++) {
            if (cartStore.has(this.state.cart[i].storeID)) {

            }
            else {
                cartStore.add(this.state.cart[i].storeID);
            }
        }


    };

    renderLastFlavor = (findex, flength) => {
        if (findex != flength - 1) {
            return (
                <Text style={{ color: "#696969" }}>｜</Text>
            )
        }
    };

    setChangeQuantity = (quantity, cartItemID) => {
        var itemMemo = "";
        this.setState(state => {
            const list = state.cart.map(cart => {
                const cartItem = cart.cartItem.map(item => {
                    if (cartItemID === item.cartItemID) {
                        item.quantity = quantity;
                        itemMemo = item.memo;
                    }
                    return item;
                });
                return cart;
            });
            return { list };
        });
        console.log("quantity:" + quantity);
        var address = serverInfo.SERVICE_ADDRESS;
        address += (this.state.userID + "/cart/" + cartItemID);
        console.log(address);
        fetch(address, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Basic " + this.state.auth
            },
            body: JSON.stringify({
                quantity: quantity,
            })
        })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                Actions.refresh();
            });

        Actions.refresh();
    };

    setMemoStr = (memo) => {
        var str = memo;
        str = str.replace(/\n/g, ",");
        console.log(str);
        var len = str.replace(/[^\x00-\xff]/g, "xx").length;
        console.log(len);
        if (len > 24) {
            str = str.substr(0, 10) + "...";
        }
        return str;
    };

    deleteCartItem = (cartItemID, mealName) => {
        Alert.alert(
            "確定要刪除嗎?",
            "將刪除以下餐點：" + mealName,
            [
                {
                    text: "取消",
                    onPress: () => console.log("cancel"),
                    style: "cancel"
                },
                {
                    text: "確定",
                    onPress: () => {
                        console.log("delete");
                        setTimeout(() => { this.setState({ isUpdating: true }) }, 0);
                        var address = serverInfo.SERVICE_ADDRESS;
                        address += (this.state.userID + "/cart/" + cartItemID);
                        console.log(address);
                        fetch(address, {
                            method: 'DELETE',
                            headers: {
                                "Authorization": "Basic " + this.state.auth
                            }
                        })
                            .catch((error) => {
                                console.log(error);
                            })
                            .finally(() => {
                                // Actions.refresh();
                                setTimeout(() => {
                                    this.setState({ isNeedUpdate: true, isUpdating: false });
                                }, 0);
                            });;
                        Actions.refresh();
                    }
                }
            ],
            { cancelable: true }
        );
        Actions.refresh();
    };

    updateData() {
        if (this.state.isNeedUpdate && (!this.state.isUpdating)) {
            setTimeout(() => {
                this.setState({
                    isUpdating: true,
                })
            })
            var address = serverInfo.SERVICE_ADDRESS;
            address += (this.state.userID + "/cart");
            console.log(address);
            fetch(address, {
                method: 'GET',
                headers: {
                    "Authorization": ("Basic " + this.state.auth)
                }
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    for (var i = 0; i < responseJson.length; i++) {
                        responseJson[i].memo = "";
                    }
                    console.log(responseJson);
                    this.setState({
                        cart: responseJson
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
                        });
                    }, 0);
                });
        }
    }

    countTotalPrice = () => {
        var totalPrice = 0;
        const list = this.state.cart.map(cart => {
            const cartItem = cart.cartItem.map(item => {
                totalPrice += (item.price * item.quantity);
            });
        });
        return totalPrice;
    };

    order = () => {
        setTimeout(() => { this.setState({ isUpdating: true }) }, 0);
        var address = serverInfo.SERVICE_ADDRESS;
        address += (this.state.userID + "/orderFromCart");
        let bodyData = [];
        for (var i = 0; i < this.state.cart.length; i++) {
            bodyData.push({
                storeID: this.state.cart[i].storeID,
                memo: this.state.cart[i].memo
            })
        }
        console.log(bodyData);
        console.log(address);
        fetch(address, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Basic " + this.state.auth
            },
            body: JSON.stringify(bodyData)
        })
            .then((response) => {
                console.log(response);
                if (response.ok) {
                    Actions.push("orderComplete");
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setTimeout(() => { this.setState({ isUpdating: false }) }, 0);
            });

    };

    setMemoText = (text, storeID) => {
        // console.log("setMemoText");

        this.setState(state => {
            const list = state.cart.map(cart => {
                if (cart.storeID === storeID) {
                    cart.memo = text;
                }
            });
            return { list };
        });


        // console.log(this.state.cart);
    }

    countTotalExtraPrice = (extraPrice) => {
        if (extraPrice > 0) {
            var ep = this.state.totalExtraPrice;
            ep += extraPrice;
            setTimeout(() => { this.setState({ totalExtraPrice: ep }) }, 0);
            return ("( + $" + extraPrice + ")");
        }
    }



    render() {
        // console.log(serverInfo.SERVICE_ADDRESS);
        // console.log(this.state.cart[0]);
        return (
            <SafeAreaView style={{ flex: 1 }}>
                {this.updateData()}
                {/* <ActivityIndicator size="large" animating={this.state.isUpdating} style={{ marginTop: 10, position: "absolute", alignContent:"center", alignSelf: "center", justifyContent: "center" }} /> */}
                <View style={styles.container, { paddingBottom: -10 }}>
                    <Text style={styles.titleText}>購物車</Text>

                    <View style={{ paddingTop: 10 }}>
                        <Divider style={{ height: 3, backgroundColor: "#5c5c5c" }} />
                    </View>
                </View>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={{ paddingTop: 10 }}
                    refreshControl={
                        <RefreshControl refreshing={this.state.isUpdating} onRefresh={() => { this.setState({ isNeedUpdate: true }) }} />
                    }
                >
                    {/* <View style={{marginTop:10}}> */}

                    {/* <ScrollView> */}
                    {this.state.cart.map(cart => (
                        <View>
                            <View style={styles.storeBar}>
                                <Text style={{ fontSize: 25 }}>{cart.storeName}</Text>
                                {/* <Button mode="text" labelStyle={{ fontSize: 18, color: "#696969" }} onPress={this.renderCartItem()}>編輯</Button> */}
                            </View>

                            <View style={{ paddingVertical: 10 }}>
                                <Divider style={{ height: 2 }} />
                            </View>

                            {cart.cartItem.map(cartItem => (
                                <>
                                    <View style={{ paddingLeft: 50, flexDirection: "row", justifyContent: "space-between" }}>
                                        {/* <View style={{ flexDirection: "row" }}> */}
                                        <Image style={{ flexGrow: 1, marginRight: 5, height: 100, width: 100, resizeMode: "cover" }} source={{ uri: serverInfo.STORAGE_ADDRESS + cartItem.imageUri }} />
                                        <View style={{ flexGrow: 200, flexDirection: "column", marginRight: 10, justifyContent: "space-between" }}>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }} >
                                                <TouchableWithoutFeedback onPress={()=>{Actions.mealDetail({ mealID: cartItem.mealID, storeID: cart.storeID })}}>
                                                    <Text style={{ fontSize: 18 }}>{cartItem.mealName}</Text>
                                                </TouchableWithoutFeedback>
                                                <Text style={{ fontSize: 18 }}>$ {cartItem.price}/份</Text>
                                            </View>
                                            <ScrollView horizontal={true}>
                                                <View style={{ flexDirection: "row" }}>
                                                    {cartItem.flavors.map((flavor, findex) => (
                                                        <View style={{ flexDirection: "row" }}>
                                                            <Text style={{ fontSize: 14, color: "#696969" }}>{flavor.flavorName}{(flavor.extraPrice > 0) ? (" (+$" + flavor.extraPrice + ")") : ""}</Text>
                                                            {this.renderLastFlavor(findex, cartItem.flavors.length)}
                                                        </View>
                                                    ))}
                                                </View>
                                            </ScrollView>
                                            <Text style={{ color: "#696969" }}>{this.setMemoStr(cartItem.memo)}</Text>
                                            <View style={{ marginTop: 5, flexDirection: "row", justifyContent: "space-between" }}>
                                                <UIStepper
                                                    onValueChange={(quantity) => { this.setChangeQuantity(quantity, cartItem.cartItemID) }}
                                                    initialValue={cartItem.quantity}
                                                    displayValue={true}
                                                    minimumValue={1}
                                                    maximumValue={99}
                                                    tintColor="#696969"
                                                    borderColor="#696969"
                                                    textColor="#000000"
                                                    height={30}
                                                />
                                                <Button mode="contained" color="#fa223b" onPress={() => this.deleteCartItem(cartItem.cartItemID, cartItem.mealName)}>刪除</Button>
                                            </View>
                                        </View>
                                        {/* </View> */}
                                        {/* <View style={{ marginRight: 10, flexDirection: "column", justifyContent: "space-between" }}>
                                            <Text style={{ fontSize: 18 }}>$ {cartItem.price}/份</Text>
                                        </View> */}
                                    </View>
                                    <Text style={{ paddingLeft: 50, marginTop: 5, color: "#696969" }}>熱量：{cartItem.calories} 大卡</Text>
                                    <View style={{ paddingLeft: 45, paddingVertical: 10 }}>
                                        <Divider style={{ height: 2 }} />
                                    </View>
                                </>
                            ))}

                            <View style={{ marginHorizontal: 10 }}>
                                <TextInput
                                    mode="outlined"
                                    label="訂單備註"
                                    value={cart.memo}
                                    onChangeText={text => { this.setMemoText(text, cart.storeID) }}
                                    multiline
                                    numberOfLines={4}
                                />
                            </View>

                            <View style={{ paddingVertical: 10 }}>
                                <Divider style={{ height: 2, backgroundColor: "#5c5c5c" }} />
                            </View>

                        </View>
                    ))}
                    {/* </ScrollView> */}
                    {/* </View> */}
                </ScrollView>
                <View>
                    <View style={{ paddingBottom: 10, }}>
                        <Divider style={{ height: 2, backgroundColor: "#5c5c5c" }} />
                    </View>
                    <View style={{ paddingHorizontal: 10, marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ fontSize: 20 }}>訂單總額：$ {this.countTotalPrice()}</Text>
                        <Button contentStyle={styles.orderButton} labelStyle={{ fontSize: 20 }} style={styles.orderButton} mode="contained" disabled={!this.countTotalPrice()} onPress={() => this.order()}>現在預定</Button>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    titleText: {
        paddingHorizontal: 10,
        fontSize: 30,
        marginTop: 10
    },
    storeBar: {
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    orderButton: {
        height: 50,
        width: 150
    }
});

