import React, { Component } from 'react';
import { View, StyleSheet, AsyncStorage, ActivityIndicator, Alert, Image, ImageBackground, TouchableHighlight, ScrollView, RefreshControl, SafeAreaView, Dimensions } from 'react-native';
import { TextInput, Divider, Text, Switch, Button, Chip, IconButton } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import UIStepper from 'react-native-ui-stepper';
import { Toast, Root } from 'native-base';
import serverInfo from './ServerInfo';
import Lightbox from 'react-native-lightbox';



export default class EditMenu extends React.Component {

    componentDidMount() {
        this.isLoggedIn();

        setTimeout(() => { this.setState({ isUpdating: true }) }, 0);

        var address = serverInfo.SERVICE_ADDRESS;
        address += (this.state.storeID + "/meals/" + this.state.mealID);
        console.log(address);
        fetch(address, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({
                    foodDescription: responseJson.foodDescription,
                    foodName: responseJson.foodName,
                    foodPrice: responseJson.foodPrice,
                    calories: responseJson.calories,
                    foodIsSoldOut: responseJson.foodIsSoldOut,
                    imageUri: serverInfo.STORAGE_ADDRESS + responseJson.imageUri,
                    storeName: responseJson.storeName,

                })
            })
            .catch((error) => {
                console.log(error);
            });

        address = serverInfo.SERVICE_ADDRESS;
        address += (this.state.storeID + "/meals/" + this.state.mealID + "/flavors");
        console.log(address);
        fetch(address, {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                var requiredCount = 0;

                if (responseJson.flavors.length != 0) {
                    let flavor = [];


                    for (var i = 0; i < responseJson.flavors.length; i++) {
                        let item = [];

                        if (responseJson.flavors[i].isRequired) {
                            requiredCount++;
                        }

                        for (var j = 0; j < responseJson.flavors[i].items.length; j++) {
                            item.push({
                                name: responseJson.flavors[i].items[j].flavorName,
                                extraPrice: responseJson.flavors[i].items[j].extraPrice,
                                selected: false
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
                setTimeout(() => { this.setState({ isUpdating: false }) }, 0);
            });
    }

    constructor(props) {
        super(props);
        this.state = {

            storeID: props.storeID,

            mealID: props.mealID,

            foodDescription: "",

            foodName: "",

            foodPrice: 0,

            flavors: [],

            memo: "",

            calories: 0,

            quantity: 1,

            imageUri: "",

            storeName: "",

            foodIsSoldOut: true,

            isLoggedIn: null,

            auth: null,

            userID: null,

            isUpdating: true,

            extraFlavorPrice: 0,

            requiredNum: 0,

        }
    }

    _handleChipPress = (flavorIndex, index) => {

        this.setState(state => {
            const list = state.flavors.map((item, findex) => {
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



    _imagePress = () => {

    };

    isLoggedIn = async () => {
        try {
            const loginStatus = await AsyncStorage.getItem("@User:loginStatus");
            console.log(loginStatus);
            if (loginStatus !== null) {
                const auth = await AsyncStorage.getItem("@User:authorization");
                const userID = await AsyncStorage.getItem("@User:userID");
                console.log("not null");
                setTimeout(() => {
                    this.setState({
                        isLoggedIn: true,
                        auth: auth,
                        userID: userID,
                    });
                }, 0);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    _addToCartPress = () => {
        this.isLoggedIn();
        if (this.state.isLoggedIn === true) {

            var flavorSelected = [];
            var count = 0;
            for (var i = 0; i < this.state.flavors.length; i++) {
                var flag = 0;
                for (var j = 0; j < this.state.flavors[i].items.length; j++) {
                    if (this.state.flavors[i].items[j].selected === true) {
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
                address += (this.state.userID + "/cart");
                console.log(address);
                fetch(address, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        "Authorization": "Basic " + this.state.auth
                    },
                    body: JSON.stringify({
                        storeID: this.state.storeID,
                        mealID: this.state.mealID,
                        flavors: flavorSelected,
                        quantity: this.state.quantity,
                    })
                })
                    .then((response) => {
                        console.log(response);

                        if (response.ok) {
                            return response.json();
                        }
                        else if (response.status === 403) {
                            Toast.show({
                                text: "您尚未驗證帳號，無法加入購物車",
                                type: "warning"
                            })
                        }
                    })
                    .then((responseJson) => {
                        console.log(responseJson);
                        if (responseJson.result === true) {
                            Toast.show({
                                text: "已加入至購物車",
                                type: "success",
                                duration: 3000
                            });
                        }
                        else {
                            Toast.show({
                                text: "餐點已完售，無法加入購物車",
                                type: "danger"
                            })
                            setTimeout(() => { this.setState({ foodIsSoldOut: 1 }) }, 0);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });


                // Actions.cart({ 'pushData': pushData, 'quantity': this.state.quantity });
            }
        }
        else {
            Actions.login();
        }

    };

    updateData = () => {

        setTimeout(() => { this.setState({ isUpdating: true }) }, 0);

        var address = serverInfo.SERVICE_ADDRESS;
        address += (this.state.storeID + "/meals/" + this.state.mealID);
        console.log(address);
        fetch(address, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({
                    foodDescription: responseJson.foodDescription,
                    foodName: responseJson.foodName,
                    foodPrice: responseJson.foodPrice,
                    calories: responseJson.calories,
                    foodIsSoldOut: responseJson.foodIsSoldOut,
                    imageUri: serverInfo.STORAGE_ADDRESS + responseJson.imageUri,
                    storeName: responseJson.storeName,

                })
            })
            .catch((error) => {
                console.log(error);
            });

        address = serverInfo.SERVICE_ADDRESS;
        address += (this.state.storeID + "/meals/" + this.state.mealID + "/flavors");
        console.log(address);
        fetch(address, {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                var requiredCount = 0;

                if (responseJson.flavors.length != 0) {
                    let flavor = [];

                    if (responseJson.flavors[i].isRequired) {
                        requiredCount++;
                    }

                    for (var i = 0; i < responseJson.flavors.length; i++) {
                        let item = [];
                        for (var j = 0; j < responseJson.flavors[i].items.length; j++) {
                            item.push({
                                name: responseJson.flavors[i].items[j].flavorName,
                                extraPrice: responseJson.flavors[i].items[j].extraPrice,
                                selected: false
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
                setTimeout(() => { this.setState({ isUpdating: false }) }, 0);
            });
    }

    renderFlavorSection = () => {
        if (this.state.flavors.length > 0) {
            return (
                <>
                    <View style={styles.divider}>
                        <Divider />
                    </View>

                    <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", paddingHorizontal: 20, marginBottom: 5 }}>
                        <Text style={{ fontSize: 22 }}>口味調整</Text>
                    </View>
                </>
            )
        }
    }

    render() {
        // console.log(this.state.flavors[2]);
        const windowWidth = Dimensions.get("window").width;

        return (
            <SafeAreaView style={{flex:1}}>
            <Root>

                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isUpdating}
                            onRefresh={() => { this.updateData() }} />
                    }
                >
                    <View style={styles.root}>
                        <View style={styles.title}>
                            <IconButton icon="arrow-left" size={30} color="#676767" onPress={() => { Actions.pop() }} />
                            <Text style={styles.titleText}>{this.state.storeName}</Text>
                        </View>
                        <Lightbox underlayColor="rgba(255,255,255,0)" backgroundColor="rgba(0,0,0,0.7)">
                            <View style={styles.imageGroup}>
                                <ImageBackground style={{ backgroundColor: "#d7d7d7", width: "100%", height: "100%" }} resizeMode="cover" source={{ uri: this.state.imageUri }}>
                                </ImageBackground>
                            </View>
                            {/* <Image style={{ backgroundColor: "#d7d7d7", width: "100%", height: 250 }} resizeMode="cover" source={{ uri: this.state.imageUri }} /> */}
                        </Lightbox>
                        {/* <TouchableHighlight activeOpacity={0.85} underlayColor="#ffffff" onPress={() => { this._imagePress() }}>
                            <View style={styles.imageGroup}>
                                <ImageBackground style={{ backgroundColor: "#d7d7d7", width: "100%", height: "100%" }} resizeMode="cover" source={{ uri: this.state.imageUri }}>
                                </ImageBackground>
                            </View>
                        </TouchableHighlight> */}
                        <View style={styles.nameAndPrice}>
                            <Text style={{ fontSize: 28 }}>{this.state.foodName}</Text>
                            <Text style={{ fontSize: 28 }}>$ {this.state.foodPrice}</Text>
                        </View>
                        <View style={styles.nameAndPrice}>
                            <Text style={{width:windowWidth-200}}>{this.state.foodDescription}</Text>
                            {(this.state.calories) ?
                                <Text style={{ alignSelf: "flex-end" }}>熱量：{this.state.calories} kcal</Text>
                                :
                                <></>
                            }

                        </View>

                        {this.renderFlavorSection()}

                        {/* <View style={styles.divider}>
                            <Divider />
                        </View>

                        <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", paddingHorizontal: 20, marginBottom: 5 }}>
                            <Text style={{ fontSize: 22 }}>口味調整</Text>
                        </View> */}
                        <View style={styles.flavorGroup}>
                            {this.state.flavors.map((flavor, flavorIndex) => (

                                <View style={styles.flavor}>
                                    <Text style={{ justifyContent: "flex-start", width: 60, fontSize: 18, marginRight: 2, alignSelf: "center" }}>{flavor.name}{(flavor.isRequired) ? <Text style={{ color: "#f00" }}>*</Text> : ""}</Text>
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
                        <View style={styles.divider}>
                            <Divider />
                        </View>

                        {/* <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", paddingHorizontal: 20 }}>
                            <Text style={{ fontSize: 22 }}>備註</Text>
                        </View>
                        <TextInput
                            label=""
                            mode="outlined"
                            value={this.state.memo}
                            onChangeText={memo => this.setState({ memo })}
                            numberOfLines={2}
                            multiline={true}
                            style={{ paddingHorizontal: 20, fontSize: 20, paddingTop: 5 }}
                        /> */}

                        {/* <View style={styles.divider}>
                            <Divider />
                        </View> */}

                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, alignContent: "center" }}>
                            <Text style={{ fontSize: 22, alignSelf: "center" }}>份數　{this.state.quantity}</Text>
                            <UIStepper
                                onValueChange={(quantity) => { this.setState({ quantity }) }}
                                initialValue={this.state.quantity}
                                minimumValue={1}
                                maximumValue={99}
                                tintColor="#6300ee"
                                borderColor="#6300ee"
                                height={40}
                            />
                        </View>

                        <View style={styles.divider}>
                            <Divider />
                        </View>

                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20 }}>
                            <Text style={{ fontSize: 25 }}>總價</Text>
                            <Text style={{ fontSize: 25 }}>NT $ {((this.state.quantity) * (this.state.foodPrice)) + (this.state.extraFlavorPrice)}</Text>
                        </View>



                        <View style={styles.divider}>
                            <Divider />
                        </View>


                        <View style={{ paddingHorizontal: 20, marginBottom:10 }}>
                            <Button disabled={(this.state.foodIsSoldOut == 1)} style={{ elevation: 0 }} labelStyle={{ fontSize: 18 }} mode="contained" onPress={() => this._addToCartPress()}>加入購物車</Button>
                        </View>
                    </View>
                </ScrollView>
            </Root>
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({

    root: {
        // paddingTop:5,
        // padding: 10
    },

    divider: {
        height: 10,
        padding: 10,
        justifyContent: "center"
    },

    title: {
        flexDirection: "row",
        // justifyContent: "space-between",
        alignContent: "center"
    },

    titleText: {
        fontSize: 30,
        // paddingLeft: 20,
        // paddingTop: 10
        alignSelf:"center"
    },

    nameAndPrice: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginBottom: 10
    },

    foodName: {
        flexGrow: 10
    },

    foodPrice: {
        flexGrow: 5
    },

    todaySpecialGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20
    },

    imageGroup: {
        paddingHorizontal: 20,
        // paddingVertical:10,
        marginVertical: 10,
        height: 250
    },

    flavorGroup: {
        paddingHorizontal: 20
    },

    flavor: {
        flexDirection: "row",
        alignContent: "center",
        marginVertical: 3
    }
});