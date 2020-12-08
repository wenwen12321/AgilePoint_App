import React, { Component, memo } from 'react';
import { View, StyleSheet, ActivityIndicator, AsyncStorage, Alert, Image, ImageBackground, TouchableHighlight, ScrollView, RefreshControl, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import { TextInput, Text, Switch, Button, Divider, Chip, Dialog, Portal } from 'react-native-paper';
import PushNotification from 'react-native-push-notification';
import { Actions } from 'react-native-router-flux';
import UIStepper from 'react-native-ui-stepper';
import serverInfo from '../ServerInfo.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Root, Toast } from 'native-base';
import { Dropdown } from 'react-native-material-dropdown';
import Spinner from 'react-native-loading-spinner-overlay';

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
            isEditChipDialogVisible: false,
            flavors: [],
            flavorSelected: [],
            requiredNum: 0,
            cartItemID: 0,
            spinner: false,
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
        this.setState({ spinner: true });
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
                "Authorization": "Bearer " + this.state.auth
            },
            body: JSON.stringify({
                quantity: quantity,
            })
        })
            .then((response) => {
                if (response.ok) {
                    this.setState({ spinner: false });
                }
                else {
                    Toast.show({
                        text: "發生錯誤",
                        type: "danger"
                    });
                }
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
                                "Authorization": "Bearer " + this.state.auth
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

    deleteAllCartItem = () => {
        Alert.alert(
            "確定要刪除所有餐點嗎?",
            "將刪除所有購物車內的餐點",
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
                        address += (this.state.userID + "/cart");
                        console.log(address);
                        fetch(address, {
                            method: 'DELETE',
                            headers: {
                                "Authorization": "Bearer " + this.state.auth
                            }
                        })
                            .then((response) => {
                                if (response.ok) {
                                    // console.log(response);
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                            })
                            .finally(() => {
                                this.setState({ isNeedUpdate: true, isUpdating: false });
                            });

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
                    "Authorization": ("Bearer " + this.state.auth)
                }
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    for (var i = 0; i < responseJson.length; i++) {
                        responseJson[i].memo = "";
                        let data = [];
                        var coeff = 1000 * 60 * 15;
                        var nowTime = new Date();
                        // nowTime.setHours(nowTime.getHours() + 8);

                        responseJson[i].waitTimeText = "即時(約等 " + responseJson[i].offset + " 分鐘)";
                        responseJson[i].waitTime = nowTime;

                        data.push({
                            value: "即時(約等 " + responseJson[i].offset + " 分鐘)",
                            waitTime: nowTime
                        });
                        var rounded = new Date(Math.ceil(nowTime.getTime() / coeff) * coeff);
                        var now = new Date();
                        if (rounded <= now.setHours(23, 59, 59, 0)) {
                            var cp = new Date(rounded.getTime());
                            var valueText = ((rounded.getHours() < 10) ? "0" : "") + rounded.getHours() + ":" + (rounded.getMinutes() < 10 ? "0" : "") + rounded.getMinutes();
                            data.push({
                                value: valueText,
                                waitTime: cp,
                            })
                        }
                        while (rounded < now.setHours(23, 59, 0, 0)) {
                            rounded.setMinutes(rounded.getMinutes() + 15);
                            var cp = new Date(rounded.getTime());
                            var valueText = (rounded.getHours() < 10 ? "0" : "") + rounded.getHours() + ":" + (rounded.getMinutes() < 10 ? "0" : "") + rounded.getMinutes();
                            if (valueText !== "00:00") {
                                data.push({
                                    value: valueText,
                                    waitTime: cp,
                                })
                            }
                        }
                        responseJson[i].orderTime = data;
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
                var extraPrice = 0;
                const flavorItem = item.flavors.map(flavor => {
                    extraPrice += flavor.extraPrice;
                })
                totalPrice += ((item.mealPrice + extraPrice) * item.quantity);
            });
        });
        return totalPrice;
    };

    order = () => {
        setTimeout(() => { this.setState({ isUpdating: true }) }, 0);
        var address = serverInfo.SERVICE_ADDRESS;
        address += (this.state.userID + "/orderFromCart");
        let bodyData = [];
        var nowTime = new Date();
        // nowTime.setHours(nowTime.getHours() + 8);
        for (var i = 0; i < this.state.cart.length; i++) {
            bodyData.push({
                storeID: this.state.cart[i].storeID,
            })
            if (this.state.cart[i].memo) {
                body[i].memo = this.state.cart[i].memo;
            }
            if (this.state.cart[i].waitTime > nowTime) {
                // this.state.cart[i].waitTime.setHours(this.state.cart[i].waitTime.getHours() + 8);
                var tmpTime = this.state.cart[i].waitTime;
                var tmpTimeText = tmpTime.getFullYear()+"-"+(tmpTime.getMonth()+1)+"-"+tmpTime.getDate()+" "+tmpTime.getHours()+":"+tmpTime.getMinutes()+":"+tmpTime.getSeconds();
                console.log(tmpTimeText);
                bodyData[i].estimatedTime = tmpTimeText;
            }
        }
        console.log(bodyData);
        console.log(address);
        fetch(address, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + this.state.auth
            },
            body: JSON.stringify(bodyData)
        })
            .then((response) => {
                console.log(response);
                if (response.ok) {
                    Actions.push("orderComplete");
                }
                else {
                    Toast.show({
                        text: "發生錯誤",
                        duration: 3000,
                        type: "danger"
                    });
                    return response.text();
                }
            })
            .then((responseJson) => { console.log(responseJson) })
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

    handleEditFlavor = (storeID, mealID, flavorSelected, cartItemID) => {
        this.setState({ isUpdating: true });
        var address = serverInfo.SERVICE_ADDRESS;
        address += (storeID + "/meals/" + mealID + "/flavors");
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
                var requiredCount = 0;

                if (responseJson.flavors.length != 0) {
                    let flavor = [];


                    for (var i = 0; i < responseJson.flavors.length; i++) {
                        if (responseJson.flavors[i].isRequired) {
                            requiredCount++;
                        }
                        let item = [];
                        for (var j = 0; j < responseJson.flavors[i].items.length; j++) {
                            item.push({
                                name: responseJson.flavors[i].items[j].flavorName,
                                extraPrice: responseJson.flavors[i].items[j].extraPrice,
                                selected: this.isFlavorSelected(responseJson.flavors[i].id, responseJson.flavors[i].items[j].flavorID, flavorSelected)
                            });
                        }
                        flavor.push(
                            {
                                id: responseJson.flavors[i].id,
                                name: responseJson.flavors[i].name,
                                isMultiple: responseJson.flavors[i].isMultiple,
                                isRequired: responseJson.flavors[i].isRequired,
                                items: item
                            }
                        );
                    }

                    this.setState({
                        flavors: flavor,
                        requiredNum: requiredCount,
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setTimeout(() => {
                    this.setState({
                        isEditChipDialogVisible: true,
                        flavorSelected: flavorSelected,
                        isUpdating: false,
                        cartItemID: cartItemID,
                    });
                }, 0);
            });
    }

    isFlavorSelected = (flavorTypeID, flavorID, flavorSelected) => {
        for (var i = 0; i < flavorSelected.length; i++) {
            if (flavorTypeID === flavorSelected[i].flavorTypeID && flavorID === flavorSelected[i].flavorID) {
                return true;
            }
        }
        return false;
    }

    _handleChipPress = (flavorIndex, index) => {

        this.setState(state => {
            const list = this.state.flavors.map((item, findex) => {
                if (flavorIndex === findex) {
                    if (!item.isMultiple) {
                        const foodList = item.items.map((chip, cindex) => {
                            if (index === cindex) {
                                if (chip.selected === true) {
                                    chip.selected = false;
                                    state.extraFlavorPrice -= chip.extraPrice;
                                }
                                else {
                                    chip.selected = true;
                                    state.extraFlavorPrice += chip.extraPrice;
                                }
                            }
                            else {
                                if (chip.selected === true) {
                                    chip.selected = false;
                                    state.extraFlavorPrice -= chip.extraPrice;
                                }
                            }
                            return chip;
                        })
                    }
                    else {
                        const foodList = item.items.map((chip, cindex) => {
                            if (index === cindex) {
                                if (chip.selected === true) {
                                    chip.selected = false;
                                    state.extraFlavorPrice -= chip.extraPrice;
                                }
                                else {
                                    chip.selected = true;
                                    state.extraFlavorPrice += chip.extraPrice;
                                }
                            }
                            return chip;
                        })
                    }
                }
                return item;
            });
            return { flavors: list };
        });
    };

    showEditChipDialog = (isShow) => {
        if (!isShow) {
            this.setState({
                isEditChipDialogVisible: isShow,
                flavors: [],
                flavorSelected: [],
                requiredNum: 0,
                cartItemID: 0,
            });
        }
        else {
            this.setState({ isEditChipDialogVisible: isShow });
        }
    }

    _editChip = () => {

        var flavorSelected = [];
        var count = 0;
        for (var i = 0; i < this.state.flavors.length; i++) {
            var flag = 0;
            for (var j = 0; j < this.state.flavors[i].items.length; j++) {
                if (this.state.flavors[i].items[j].selected) {
                    if (this.state.flavors[i].isRequired && flag === 0) {
                        flag = 1;
                        count++;
                    }
                    flavorSelected.push({
                        flavorTypeID: this.state.flavors[i].id,
                        flavorName: this.state.flavors[i].items[j].name
                    })
                }
            }
        }
        // console.log(flavorSelected);
        if (count < this.state.requiredNum) {
            Toast.show({
                text: "請選擇所有必填口味",
                duration: 3000
            });
        }
        else {
            console.log(flavorSelected);
            var address = serverInfo.SERVICE_ADDRESS;
            address += (this.state.userID + "/cart/" + this.state.cartItemID);
            console.log(address);
            fetch(address, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + this.state.auth
                },
                body: JSON.stringify({
                    flavors: flavorSelected
                })
            })
                .then((response) => {
                    console.log(response);
                    if (response.ok) {
                        this.setState({
                            isNeedUpdate: true
                        })
                        this.showEditChipDialog(false);
                    }
                    else {
                        return response.text();
                    }
                })
                .then((responseJson) => {
                    console.log(responseJson)
                })
                .catch((error) => {
                    console.log(error);
                });



            // Actions.cart({ 'pushData': pushData, 'quantity': this.state.quantity });
        }
    }

    onChangeWaitingTime = (index, cartIndex) => {
        var cart = this.state.cart;
        // console.log("cartIndex:" + cartIndex + " index:" + index);
        // console.log(JSON.stringify(cart));
        cart[cartIndex].waitTime = cart[cartIndex].orderTime[index].waitTime;
        cart[cartIndex].waitTimeText = cart[cartIndex].orderTime[index].value;
        this.setState({ cart: cart });
    }

    render() {
        // console.log(serverInfo.SERVICE_ADDRESS);
        // console.log(this.state.cart[0]);
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Root>
                    <Spinner
                        visible={this.state.spinner}
                        textContent="處理中..."
                        textStyle={{color:"#fff"}}
                    />
                    {this.updateData()}
                    {/* <ActivityIndicator size="large" animating={this.state.isUpdating} style={{ marginTop: 10, position: "absolute", alignContent:"center", alignSelf: "center", justifyContent: "center" }} /> */}
                    <View style={styles.container, { paddingBottom: -10 }}>
                        <View style={{ justifyContent: "space-between", flexDirection: "row", alignContent: "center" }}>
                            <Text style={styles.titleText}>購物車</Text>
                            {this.state.cart.length ?
                                <Button style={{ alignSelf: "center", margin: 10 }} mode="contained" color="#fa223b" onPress={() => this.deleteAllCartItem()}>刪除所有</Button>
                                :
                                null
                            }
                        </View>

                        <View>
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
                        {this.state.cart.map((cart, cartIndex) => (
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
                                                    <TouchableWithoutFeedback onPress={() => { Actions.mealDetail({ mealID: cartItem.mealID, storeID: cart.storeID }) }}>
                                                        <Text adjustsFontSizeToFit={true} style={{ fontSize: 18 }}>{cartItem.mealName}</Text>
                                                    </TouchableWithoutFeedback>
                                                    <Text style={{ fontSize: 18 }}>$ {cartItem.mealPrice}/份</Text>
                                                </View>
                                                <ScrollView horizontal={true}>
                                                    <TouchableWithoutFeedback onPress={() => this.handleEditFlavor(cart.storeID, cartItem.mealID, cartItem.flavors, cartItem.cartItemID)}>
                                                        <View style={{ flexDirection: "row", }}>
                                                            {cartItem.flavors.map((flavor, findex) => (
                                                                <View style={{ flexDirection: "row" }}>
                                                                    <Text style={{ fontSize: 14, color: "#696969" }}>{flavor.flavorName}{(flavor.extraPrice > 0) ? (" (+$" + flavor.extraPrice + ")") : ""}</Text>
                                                                    {this.renderLastFlavor(findex, cartItem.flavors.length)}
                                                                </View>
                                                            ))}
                                                            {(cartItem.flavors.length) ?
                                                                <Icon name="chevron-down" color="#696969" style={{ alignSelf: "center" }} size={15} />
                                                                :
                                                                null
                                                            }
                                                        </View>
                                                    </TouchableWithoutFeedback>
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
                                    <Dropdown
                                        label="預訂時間"
                                        data={cart.orderTime}
                                        value={cart.waitTimeText}
                                        fontSize={15}
                                        onChangeText={(value, index) => { this.onChangeWaitingTime(index, cartIndex) }}
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
                    <Portal>
                        <Dialog visible={this.state.isEditChipDialogVisible} onDismiss={() => { this.showEditChipDialog(false) }} >
                            <Dialog.Title>修改口味</Dialog.Title>
                            <Dialog.Content>
                                <View style={styles.flavorGroup}>
                                    {this.state.flavors.map((flavor, flavorIndex) => (

                                        <View style={styles.flavor}>
                                            <View style={{ alignSelf: "center" }}>
                                                <Text adjustsFontSizeToFit={true} style={{ justifyContent: "flex-start", width: 80, fontSize: 18, marginRight: 2, alignSelf: "center" }}>{flavor.name}{(flavor.isRequired) ? <Text style={{ color: "#f00" }}>*</Text> : ""}</Text>
                                                {(flavor.isMultiple) ? <Text style={{ color: "#9e9e9e", fontSize: 12 }}>(可複選)</Text> : <></>}
                                            </View>
                                            <ScrollView horizontal={true}>
                                                <View style={{ flexDirection: "row" }}>
                                                    {flavor.items.map((item, index) => (
                                                        <View style={{ alignSelf: "center", marginRight: 3, marginVertical: 2 }}>
                                                            <Chip onPress={() => this._handleChipPress(flavorIndex, index)} selected={item.selected}>{item.name}{(item.extraPrice > 0) ? (" + $" + item.extraPrice) : ""}</Chip>
                                                        </View>
                                                    ))}
                                                </View>
                                            </ScrollView>
                                        </View>
                                    ))}
                                </View>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => { this.showEditChipDialog(false) }} >取消</Button>
                                <Button onPress={() => { this._editChip() }} >確認</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </Root>
            </SafeAreaView>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    titleText: {
        fontSize: 30,
        margin: 10
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
    },
    flavorGroup: {
        paddingHorizontal: 0
    },

    flavor: {
        flexDirection: "row",
        alignContent: "center",
        marginVertical: 3
    }
});

