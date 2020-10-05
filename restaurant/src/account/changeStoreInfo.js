import React, { Component } from 'react';
import { View, StyleSheet, Alert, Image, ImageBackground, TouchableHighlight, ScrollView, RefreshControl, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { TextInput, Divider, Text, Switch, Button, Chip, IconButton, Portal, Dialog, Checkbox, TouchableRipple } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import { Root, Toast } from 'native-base';
import DialogInput from 'react-native-dialog-input';
import { Dropdown } from 'react-native-material-dropdown';
import BottomSheet from 'react-native-bottomsheet';
import serverInfo from '../ServerInfo';
import ImagePicker from 'react-native-image-picker';


export default class ChangeStoreInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            storeID: props.storeID,

            storeName: "",

            imageUri: "",

            imageFile: "",

            isLoading: false,

            isNeedUpdate: false,

            auth: props.auth,

            flag: 0,

        }
    }

    _onChangeName = (storeName) => {
        // const list = this.state.food;
        // list.name = foodName;
        this.setState({ storeName: storeName, flag: 1 });
        // console.log(this.state.food.name);
    };

    _imagePress = () => {
        this.openImagePicker();
        // const OPTIONS = ["更換圖片", "刪除圖片", "取消"];

        // BottomSheet.showBottomSheetWithOptions({
        //     options: OPTIONS,
        //     title: "請選擇要進行的動作",
        //     cancelButtonIndex: 2,
        // }, (value) => {
        //     if (value == 1) {
        //         this.setState({ imageUri: "" });
        //     }
        //     else if (value == 0) {
        //         this.openImagePicker();
        //     }
        // });
    };

    openImagePicker() {
        const options = {
            title: "選擇照片",
        }

        ImagePicker.launchImageLibrary(options, (response) => {
            console.log('response:' + response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const source = { uri: 'data:' + response.type + ';base64,' + response.data };
                // console.log(response.data);
                this.setState({
                    imageUri: response.uri,
                    imageFile: response.data,
                })
            }
        });
    }

    componentDidMount() {
        var address = serverInfo.SERVICE_ADDRESS;
        address = serverInfo.SERVICE_ADDRESS;
        address += (this.state.storeID + "/storeInfo");
        console.log(address);
        fetch(address, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({
                    storeName: responseJson.storeName,
                    imageUri: serverInfo.STORAGE_ADDRESS + "store/" + responseJson.storeImg
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    completeEdit = () => {
        if (this.state.flag || this.state.imageFile) {
            setTimeout(() => { this.setState({ isLoading: true }) }, 0);
            var bodyData = {};
            bodyData.storeName = this.state.storeName;
            if (this.state.imageFile) {
                bodyData.storeImg = this.state.imageFile;
            }
            console.log(bodyData);

            var address = serverInfo.SERVICE_ADDRESS;
            address += (this.state.storeID + "/storeInfo");
            console.log(address);
            fetch(address, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + this.state.auth,
                },
                body: JSON.stringify(bodyData)
            })
                .then((response) => {
                    console.log(response);
                    if (response.ok) {
                        setTimeout(() => { this.setState({ isLoading: false }) }, 0);
                        Actions.reset('accountSetting');
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        else {
            Actions.pop();
        }
    }

    goBack = () => {
        if (this.state.flag || this.state.imageFile) {
            Alert.alert(
                "確定要返回嗎?",
                "您所做的變動將不會被改變",
                [
                    {
                        text: "取消",
                        onPress: () => console.log("cancel"),
                        style: "cancel"
                    },
                    {
                        text: "確定",
                        onPress: () => {
                            Actions.pop();
                        }
                    }
                ],
                { cancelable: true }
            );
        }
        else {
            Actions.pop();
        }
    }

    addMeal = () => {

        if (this.state.foodName !== "" && this.state.foodPrice !== "") {
            setTimeout(() => { this.setState({ isLoading: true }) }, 0);


            // for (var i = 0; i < this.state.flavors.length; i++) {
            //     //POST add FlavorType and Flavor

            //         var address = serverInfo.SERVICE_ADDRESS;
            //         address += (this.state.storeID + "/meals/" + this.state.mealID + "/flavors");
            //         console.log(address);
            //         fetch(address, {
            //             method: 'POST',
            //             headers: {
            //                 'Accept': 'application/json',
            //                 'Content-Type': 'application/json',
            //             },
            //             body: JSON.stringify({
            //                 name: this.state.flavors[i].name,
            //                 isRequired: this.state.flavors[i].isRequired,
            //                 isMultiple: this.state.flavors[i].isMultiple,
            //                 items: this.state.flavors[i].items
            //             })
            //         })
            //             .catch((error) => {
            //                 console.log(error);
            //             });
            // }

            //foodTypeName to foodTypeID
            var typeID = 0;
            for (var i = 0; i < this.state.typeList.length; i++) {
                if (this.state.typeList[i].value === this.state.foodTypeName) {
                    console.log(this.state.typeList[i].value + this.state.typeList[i].id);
                    typeID = this.state.typeList[i].id;
                }
            }

            // console.log(this.state.flavors);
            // for (var i = 0; i < this.state.flavors.length; i++) {
            //     console.log(this.state.flavors[i].name);
            //     for (var j = 0; j < this.state.flavors[i].items.length; j++) {
            //         console.log(this.state.flavors[i].items[j]);
            //     }
            // }

            // var data = new FormData();
            // data.append("foodDescription",this.state.foodDescription);
            // data.append("todaySpecial",this.state.todaySpecial);
            // data.append("foodName",this.state.foodName);
            // data.append("foodPrice",this.state.foodPrice);
            // data.append("foodIsSoldOut",this.state.foodIsSoldOut);
            // data.append("foodTypeID",typeID);
            // data.append("calories",this.state.calories);
            // data.append("flavors",this.state.flavors);
            // data.append("imageFile",this.state.imageFile,this.state.imageFileName);


            var address = serverInfo.SERVICE_ADDRESS;
            address += (this.state.storeID + "/meals");
            console.log(address);
            fetch(address, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + this.state.auth,
                },
                body: JSON.stringify({
                    foodDescription: this.state.foodDescription,
                    todaySpecial: this.state.todaySpecial,
                    foodName: this.state.foodName,
                    foodPrice: this.state.foodPrice,
                    foodIsSoldOut: this.state.foodIsSoldOut,
                    foodTypeID: typeID,
                    calories: this.state.calories,
                    imageFile: this.state.imageFile,
                    flavors: this.state.flavors
                })
            })
                .then((response) => {
                    console.log(response);
                    if (response.ok) {
                        setTimeout(() => { this.setState({ isLoading: false }) }, 0);
                        Actions.reset('editMenu');
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        else {
            Toast.show({
                text: "請輸入標題與價格",
                duration: 3000
            });
        }
    };

    render() {



        return (
            <SafeAreaView style={{flex:1}}>
            <Root>
                <View style={styles.title}>
                    <View style={{ flexDirection: "row" }}>
                        <IconButton icon="arrow-left" size={30} color="#676767" onPress={() => { this.goBack() }} />
                        <Text style={styles.titleText}>修改餐廳資料</Text>
                    </View>
                    <IconButton icon="check" size={30} color="#676767" onPress={() => { this.completeEdit() }} />
                </View>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={this.state.isLoading} />
                    }
                >
                    <View style={styles.root}>
                        <Text style={{ fontSize: 20, marginHorizontal: 20 }}>餐廳照片</Text>
                        <TouchableHighlight activeOpacity={0.85} underlayColor="#ffffff" onPress={() => { this._imagePress() }}>
                            <View style={styles.imageGroup}>

                                <ImageBackground style={{ backgroundColor: "#d7d7d7", width: "100%", height: "100%" }} resizeMode="cover" source={{ uri: this.state.imageUri }}>
                                    <Text style={{ color: "#ffffff", backgroundColor: "rgba(50,50,50,0.3)", alignSelf: "flex-end", justifyContent: "flex-end" }}>編輯圖片</Text>
                                </ImageBackground>
                            </View>
                        </TouchableHighlight>
                        <View style={styles.nameAndPrice}>
                            <TextInput
                                label="店名"
                                mode="outlined"
                                value={this.state.storeName}
                                onChangeText={storeName => this._onChangeName(storeName)}
                                selectionColor="#d6d6d6"
                                style={{ flexGrow: 1 }}
                            />
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
        justifyContent: "space-between",
        alignContent: "center",
        // position: "absolute"
    },

    titleText: {
        fontSize: 25,
        marginLeft: 5,
        // paddingTop: 10,
        alignSelf: "center"
        // marginTop: 9,
    },

    nameAndPrice: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
    },

    chipNameAndPrice: {
        flexDirection: "row",
        justifyContent: "space-between",
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
    },

    calories: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        alignItems: "center",
        flexGrow: 1
    }
});