import React, { Component } from 'react';
import { View, StyleSheet, Alert, Image, ImageBackground, TouchableHighlight, ScrollView, RefreshControl, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { TextInput, Divider, Text, Switch, Button, Chip, IconButton, Portal, Dialog, Checkbox, TouchableRipple } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import { Toast } from 'native-base';
import DialogInput from 'react-native-dialog-input';
import { Dropdown } from 'react-native-material-dropdown';
import BottomSheet from 'react-native-bottomsheet';
import serverInfo from '../ServerInfo';
import ImagePicker from 'react-native-image-picker';


export default class EditMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            storeID: props.storeID,

            mealID: this.props.mealID,

            foodDescription: "",

            todaySpecial: false,

            foodName: "",

            foodPrice: 0,

            foodIsSoldOut: true,

            foodTypeID: 0,

            foodTypeName: "",

            calories: 0,

            imageUri: "https://via.placeholder.com/250",

            imageFile: "",

            menuTypeList: [],

            // food: this.props.food,

            // item: this.props.item,

            typeList: [],

            typeIDList: [],

            flavors: [
                // {
                //     id: 1,
                //     name: "辣度",
                //     items: ["不辣", "小辣", "中辣", "大辣", "超級辣", "地獄辣", "辣到哭"]
                // },
                // {
                //     id: 2,
                //     name: "蔥",
                //     items: ["少蔥", "不蔥"]
                // },
                // {
                //     id: 3,
                //     name: "酸菜",
                //     items: ["不要", "另外放"]
                // }
            ],

            flavorsForPush: [],

            offset: 0,

            editFlavor: false,

            isAddFlavorDialogVisible: false,

            isAddChipDialogVisible: false,

            isEditFlavorDialogVisible: false,

            flavorIndex: null,

            isLoading: false,

            chipName: "",

            chipPrice: 0,

            flavorName: "",

            isRequired: false,

            isMultiple: false,

            auth: props.auth,

            flag: 0,

            // foodType: this.props.item.type,

            // imageUri: "https://i.imgur.com/gSwhoIJ.jpg"

        }
    }

    _onChangeName = (foodName) => {
        // const list = this.state.food;
        // list.name = foodName;
        this.setState({ foodName: foodName, flag: 1 });
        console.log(this.state.foodName);
    };

    _onChangePrice = (foodPrice) => {
        // const list = this.state.food;
        // list.price = foodPrice;
        this.setState({ foodPrice: foodPrice, flag: 1 });
        console.log(this.state.foodPrice);
    };

    _onChangeCalories = (calories) => {
        // const list = this.state.food;
        // list.price = foodPrice;
        this.setState({ calories: calories, flag: 1 });
    };

    _onHandleTodaySpecial = () => {
        if (this.state.todaySpecial == true) {
            this.setState({ todaySpecial: false, flag: 1 });
        }
        else {
            this.setState({ todaySpecial: true, flag: 1 });
        }
    };

    _onHandleFoodIsSoldOut = () => {
        if (this.state.foodIsSoldOut == true) {
            this.setState({ foodIsSoldOut: false, flag: 1 });
        }
        else {
            this.setState({ foodIsSoldOut: true, flag: 1 });
        }
    };

    _deletePress = () => {
        // console.log("type id:" + item.id + " food id:" + food.id);
        Alert.alert(
            "確定要刪除餐點嗎?",
            "此動作將永久刪除以下餐點:\n" + this.state.foodName,
            [
                {
                    text: "取消",
                    onPress: () => console.log("cancel"),
                    style: "cancel"
                },
                {
                    text: "確定",
                    onPress: () => {
                        var address = serverInfo.SERVICE_ADDRESS;
                        address += (this.state.storeID + "/meals/" + this.state.mealID);
                        console.log(address);
                        fetch(address, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': 'Bearer ' + this.state.auth,
                            }
                        })
                            .then((response) => {
                                if (response.ok) {
                                    Actions.pop();
                                    Toast.show({
                                        text: this.state.foodName + "已刪除",
                                        type: "danger"
                                    })
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                                Toast.show({
                                    text: "發生錯誤：" + error,
                                    type: "danger"
                                })
                            })
                            .finally(() => {
                                // setTimeout(() => {
                                //     this.setState({ isNeedUpdate: true });
                                // }, 0);
                            });;
                        // Actions.pop();
                        // Toast.show({
                        //     text: food.name + "已刪除",
                        //     type: "danger"
                        // })
                    }
                }
            ],
            { cancelable: true }
        );
    };

    _removeChip = (flavorIndex, index) => {
        var indexForPush = index;
        var array = [];
        setTimeout(() => {
            this.setState(state => {
                const list = this.state.flavors.map((f, findex) => {
                    if (flavorIndex === findex) {

                        array = f.items;

                        //var index = array.indexOf(item);
                        if (index !== -1) {
                            array.splice(index, 1);
                            f.items = array;
                        }

                    }
                });
                return { list };
            });
        }, 0);

        this._removeChipForPush(flavorIndex, indexForPush);

    };

    _removeChipForPush = (flavorIndex, index) => {
        index += this.state.offset;
        console.log(index);
        var array2 = [];
        // var array = this.state.flavorsForPush;
        // if(typeof array[flavorIndex].items[index].flavorID !== undefined){
        //     array[flavorIndex].items[index].change = "D";
        // }
        // else{
        //     array[flavorIndex].splice(index,1);
        // }
        // setTimeout(()=>{
        //     this.setState({
        //         flavorsForPush: array
        //     })
        // },0)

        // console.log(this.state.flavorsForPush[0].items[index].flavorID+"\n"+this.state.flavors[0]);
        setTimeout(() => {
            this.setState(state => {
                const list2 = this.state.flavorsForPush.map((f, findex) => {
                    // console.log(f);
                    if (flavorIndex === findex) {

                        array2 = f.items;
                        console.log(array2);
                        //var index = array.indexOf(item);
                        if (index !== -1) {
                            if (typeof array2[index].flavorID === "undefined") {
                                array2.splice(index, 1);
                            }
                            else {
                                array2[index].change = "D";
                                var offset = this.state.offset + 1;
                                this.setState({ offset: offset, flag: 1 });
                            }
                            f.items = array2;
                        }

                    }
                });
                return { list2 };
            });
        }, 0);
    };

    _handleChipButton = (index) => {
        this.showAddChipDialog(true);
        this.setState({ flavorIndex: index });
    };

    _addChip = () => {
        this.showAddChipDialog(false);
        var chipName = this.state.chipName;
        var chipPrice = this.state.chipPrice;

        this.setState({
            chipName: "",
            chipPrice: 0,
            flag: 1,
        })

        if (chipName !== "") {
            var array = [];
            this.setState(state => {
                const list = this.state.flavors.map((f, findex) => {
                    if (this.state.flavorIndex === findex) {
                        array = f.items;
                        array.push({
                            change: "C",
                            flavorName: chipName,
                            extraPrice: chipPrice
                        });
                        f.items = array;
                    }
                });
                return { list };
            });
            this.setState(state => {
                const list = this.state.flavorsForPush.map((f, findex) => {
                    if (this.state.flavorIndex === findex) {
                        array = f.items;
                        array.push({
                            change: "C",
                            flavorName: chipName,
                            extraPrice: chipPrice
                        });
                        f.items = array;
                    }
                });
                return { list };
            });
        }
    };

    showDialog(isShow) {
        if (isShow === false) {
            this.setState({
                isAddFlavorDialogVisible: isShow,
                flavorName: "",
                isMultiple: false,
                isRequired: false,
            });
        }
        else {
            this.setState({ isAddFlavorDialogVisible: isShow });
        }

    }

    showEditFlavorDialog(isShow, flavorName, isMultiple, isRequired, flavorIndex) {
        if (isShow === false) {
            this.setState({
                isEditFlavorDialogVisible: isShow,
                flavorName: "",
                isMultiple: false,
                isRequired: false,
                flavorIndex: null,
            })
        }
        else {
            this.setState({
                isEditFlavorDialogVisible: isShow,
                flavorName: flavorName,
                isMultiple: isMultiple,
                isRequired: isRequired,
                flavorIndex: flavorIndex,
            })
        }
    }

    showAddChipDialog(isShow) {
        if (isShow === false) {
            this.setState({
                isAddChipDialogVisible: isShow,
                chipName: "",
                chipPrice: 0,
            });
        }
        else {
            this.setState({ isAddChipDialogVisible: isShow });
        }
    }

    _editFlavor = () => {
        var inputText = this.state.flavorName;
        var isRequired = this.state.isRequired;
        var isMultiple = this.state.isMultiple;
        this.setState({
            flavorName: "",
            isRequired: false,
            isMultiple: false,
        });
        this.showEditFlavorDialog(false, "", false, false, 0);
        if (inputText !== "") {
            let array = this.state.flavors;
            array[this.state.flavorIndex].name = inputText;
            array[this.state.flavorIndex].isRequired = isRequired;
            array[this.state.flavorIndex].isMultiple = isMultiple;
            var obj = JSON.parse(JSON.stringify(array));
            this.setState({ flavors: array, flavorsForPush: obj });
        }
    };

    _addFlavor = () => {
        var inputText = this.state.flavorName;
        var isRequired = this.state.isRequired;
        var isMultiple = this.state.isMultiple;
        this.setState({
            flavorName: "",
            isRequired: false,
            isMultiple: false,
        });
        this.showDialog(false);
        if (inputText !== "") {
            let array = this.state.flavors;
            array.push({
                // id: this.state.flavors.length,
                name: inputText,
                items: [],
                isRequired: isRequired,
                isMultiple: isMultiple,
            });
            var obj = JSON.parse(JSON.stringify(array));
            this.setState({ flavors: array, flavorsForPush: obj });
        }
    };

    cmdList = [];

    _removeFlavor = (flavor, index) => {
        Alert.alert(
            "確定要刪除口味嗎?",
            "此動作將刪除以下口味:\n" + flavor.name,
            [
                {
                    text: "取消",
                    onPress: () => console.log("cancel"),
                    style: "cancel"
                },
                {
                    text: "確定",
                    onPress: () => {
                        if (typeof flavor.id !== "undefined") {
                            this.cmdList.push(this.state.storeID + "/meals/" + this.state.mealID + "/flavors/" + flavor.id)
                        }
                        var array = this.state.flavors;
                        array.splice(index, 1);
                        this.setState({ flavors: array, flavorsForPush: array, flag: 1 });
                    }
                }
            ],
            { cancelable: true }
        );
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
        //     else if(value == 0){
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
                    flag: 1,
                })
            }
        });
    }

    // _flavorRender = () => {
    //     if (this.state.editFlavor === true) {
    //         return (
    //             <>
    //                 <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", paddingHorizontal: 20, marginBottom: 5 }}>
    //                     <Text style={{ fontSize: 25 }}>口味調整</Text>
    //                     {/* <Button style={{ elevation: 0 }} icon="check-all" color="#757575" mode="contained" onPress={() => this.setState({ editFlavor: false })}>完成</Button> */}
    //                     <IconButton style={{ alignItems: "center" }} icon="check-all" color="#000000" size={30} onPress={() => this.setState({ editFlavor: false })} />
    //                 </View>
    //                 <View style={styles.flavorGroup}>
    //                     {this.state.flavors.map((flavor, index) => (

    //                         <View style={styles.flavor}>
    //                             <IconButton style={{ paddingLeft: -20, justifyContent: "center", alignSelf: "center", alignItems: "center" }} icon="delete" size={20} color="#fa223b" onPress={() => this._removeFlavor(flavor, index)} />
    //                             <Text style={{ justifyContent: "flex-start", width: 60, fontSize: 18, marginRight: 2, alignSelf: "center" }}>{flavor.name}</Text>
    //                             <ScrollView horizontal={true}>
    //                                 <View style={{ flexDirection: "row" }}>
    //                                     {flavor.items.map((item, index) => (
    //                                         <View style={{ alignSelf: "center", marginRight: 3, marginVertical: 2 }}>
    //                                             <Chip onClose={() => this._removeChip(flavor, index)}>{item}</Chip>
    //                                         </View>
    //                                     ))}
    //                                     <IconButton style={{ alignItems: "center" }} icon="plus-circle-outline" size={20} color="#7b7b7b" onPress={() => this._handleChipButton(index)} />
    //                                 </View>
    //                             </ScrollView>
    //                         </View>
    //                     ))}
    //                     <IconButton style={{ alignItems: "center" }} icon="plus-circle-outline" size={20} color="#7b7b7b" onPress={() => this.showDialog(true)} />


    //                 </View>
    //             </>
    //         )
    //     }
    //     else {
    //         return (
    //             <>
    //                 <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", paddingHorizontal: 20, marginBottom: 5 }}>
    //                     <Text style={{ fontSize: 25 }}>口味調整</Text>
    //                     <IconButton style={{ alignItems: "center" }} icon="tune" color="#000000" size={30} onPress={() => this.setState({ editFlavor: true })} />
    //                 </View>
    //                 <View style={styles.flavorGroup}>
    //                     {this.state.flavors.map(flavor => (

    //                         <View style={styles.flavor}>
    //                             <Text style={{ justifyContent: "flex-start", width: 60, fontSize: 18, marginRight: 5, alignSelf: "center" }}>{flavor.name}</Text>
    //                             <ScrollView horizontal={true}>
    //                                 <View style={{ flexDirection: "row" }}>
    //                                     {flavor.items.map(item => (
    //                                         <View style={{ alignSelf: "center", marginRight: 3, marginVertical: 2 }}>
    //                                             <Chip>{item}</Chip>
    //                                         </View>
    //                                     ))}
    //                                 </View>
    //                             </ScrollView>

    //                         </View>
    //                     ))}

    //                 </View>
    //                 <View style={styles.divider}>
    //                     <Divider />
    //                 </View>

    //                 <View style={styles.todaySpecialGroup}>
    //                     <Text style={{ textAlign: "center", fontSize: 20 }}>設為今日特餐</Text>
    //                     <Switch value={this.state.todaySpecial} onValueChange={() => this._onHandleTodaySpecial()} />
    //                 </View>

    //                 <View style={styles.divider}>
    //                     <Divider />
    //                 </View>

    //                 <View style={{ justifyContent: "space-between", flexDirection: "row", paddingHorizontal: 20, paddingBottom: 10 }}>
    //                     <View style={{ flexGrow: 1, paddingRight: 5 }}>
    //                         <Button labelStyle={{ fontSize: 18 }} mode="outlined" color="#757575" onPress={() => Actions.pop()} >取消修改</Button>

    //                     </View>
    //                     <View style={{ flexGrow: 1, paddingLeft: 5 }}>

    //                         <Button style={{ elevation: 0 }} labelStyle={{ fontSize: 18 }} mode="contained" onPress={() => Actions.pop()}>完成修改</Button>
    //                     </View>
    //                 </View>
    //                 <View style={{ paddingHorizontal: 20 }}>

    //                     <Button style={{ elevation: 0 }} labelStyle={{ fontSize: 18 }} color="#fa223b" mode="contained" onPress={() => this._deletePress(this.state.item, this.state.food)}>刪除餐點</Button>
    //                 </View>
    //             </>
    //         )
    //     }
    // };

    componentDidMount() {
        setTimeout(() => { this.setState({ isLoading: true }) }, 0);
        var address = serverInfo.SERVICE_ADDRESS;
        address += (this.state.storeID + "/meals/" + this.state.mealID);
        console.log(address);
        fetch(address, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                var soldOut = true;
                if (responseJson.foodIsSoldOut == 0) soldOut = false;
                var todaySpecial = true;
                if (responseJson.todaySpecial == 0) todaySpecial = false;
                this.setState({
                    foodDescription: responseJson.foodDescription,
                    todaySpecial: todaySpecial,
                    foodName: responseJson.foodName,
                    foodPrice: responseJson.foodPrice,
                    foodIsSoldOut: soldOut,
                    foodTypeID: responseJson.foodTypeID,
                    foodTypeName: responseJson.foodType,
                    calories: responseJson.calories,
                    imageUri: serverInfo.STORAGE_ADDRESS + responseJson.imageUri
                })
            })
            .catch((error) => {
                console.log(error);
            });

        address = serverInfo.SERVICE_ADDRESS;
        address += (this.state.storeID + "/menuType");
        console.log(address);
        fetch(address, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log("menuType:"+responseJson);
                var typeArr = [];
                var typeIDArr = [];
                for (var i = 0; i < responseJson.length; i++) {
                    typeArr.push({
                        id: responseJson[i].menuTypeID,
                        value: responseJson[i].menuTypeName
                    });
                    typeIDArr.push(responseJson[i].menuTypeID);
                }
                this.setState({
                    typeList: typeArr,
                    typeIDList: typeIDArr
                })
                console.log(typeArr);
            })
            .catch((error) => {
                console.log(error);
            });

        address = serverInfo.SERVICE_ADDRESS;
        address += (this.state.storeID + "/meals/" + this.state.mealID + "/flavors");
        console.log(address);
        fetch(address, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                setTimeout(() => {
                    this.setState({
                        flavors: responseJson.flavors
                    })
                }, 0);


                var obj = JSON.parse(JSON.stringify(responseJson.flavors));
                // console.log("obj:"+obj);
                this.setState({
                    flavorsForPush: obj
                })
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setTimeout(() => { this.setState({ isLoading: false }) }, 0);
            });


    }

    completeEdit = () => {
        console.log(this.state.flavorsForPush);
        setTimeout(() => { this.setState({ isLoading: true }) }, 0);
        for (var i = 0; i < this.state.flavorsForPush.length; i++) {
            console.log(this.state.flavorsForPush[i].items);
        }
        console.log(this.cmdList);
        if (this.cmdList.length) {
            for (var i = 0; i < this.cmdList.length; i++) {
                var address = serverInfo.SERVICE_ADDRESS;
                address += this.cmdList[i];
                console.log(address);
                fetch(address, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + this.state.auth,
                    }
                })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }

        for (var i = 0; i < this.state.flavorsForPush.length; i++) {
            //POST add FlavorType and Flavor
            if (typeof this.state.flavorsForPush[i].id === "undefined") {
                var address = serverInfo.SERVICE_ADDRESS;
                address += (this.state.storeID + "/meals/" + this.state.mealID + "/flavors");
                console.log(address);
                fetch(address, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.state.auth,
                    },
                    body: JSON.stringify({
                        name: this.state.flavorsForPush[i].name,
                        items: this.state.flavorsForPush[i].items,
                        isMultiple: this.state.flavorsForPush[i].isMultiple,
                        isRequired: this.state.flavorsForPush[i].isRequired,
                    })
                })
                    .catch((error) => {
                        console.log(error);
                    });
            }
            //PUT updateFlavor
            else {
                let flavorArr = [];
                for (var j = 0; j < this.state.flavorsForPush[i].items.length; j++) {
                    if (typeof this.state.flavorsForPush[i].items[j].change !== "undefined") {
                        flavorArr.push(this.state.flavorsForPush[i].items[j]);
                    }
                }
                // console.log(flavorArr);
                if (flavorArr.length > 0) {
                    var address = serverInfo.SERVICE_ADDRESS;
                    address += (this.state.storeID + "/meals/" + this.state.mealID + "/flavors/" + this.state.flavorsForPush[i].id);
                    console.log(address);
                    fetch(address, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + this.state.auth,
                        },
                        body: JSON.stringify(flavorArr)
                    })
                        .catch((error) => {
                            console.log(error);
                        });
                }
                console.log("flavorForPush:" + this.state.flavorsForPush[i]);
                //update flavorType
                address = serverInfo.SERVICE_ADDRESS;
                address += (this.state.storeID + "/meals/" + this.state.mealID + "/flavorTypes/" + this.state.flavorsForPush[i].id);
                console.log(address);
                fetch(address, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.state.auth,
                    },
                    body: JSON.stringify({
                        name: this.state.flavorsForPush[i].name,
                        isRequired: this.state.flavorsForPush[i].isRequired,
                        isMultiple: this.state.flavorsForPush[i].isMultiple,
                    })
                })
                    .then((response) => console.log(response))
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }

        //foodTypeName to foodTypeID
        var typeID = 0;
        for (var i = 0; i < this.state.typeList.length; i++) {
            if (this.state.typeList[i].value === this.state.foodTypeName) {
                typeID = this.state.typeList[i].id;
            }
        }

        var bodyData = {};
        if (this.state.foodDescription) {
            bodyData.foodDescription = this.state.foodDescription;
        }
        bodyData.todaySpecial = this.state.todaySpecial;
        bodyData.foodName = this.state.foodName;
        bodyData.foodPrice = this.state.foodPrice;
        bodyData.foodIsSoldOut = this.state.foodIsSoldOut;
        bodyData.foodTypeID = typeID;
        bodyData.calories = this.state.calories;
        if (this.state.imageFile !== "") {
            bodyData.imageFile = this.state.imageFile
        }


        var address = serverInfo.SERVICE_ADDRESS;
        address += (this.state.storeID + "/meals/" + this.state.mealID);
        console.log(address);
        fetch(address, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.auth,
            },
            body: JSON.stringify(bodyData)
        })
            .then((response) => {
                if (response.ok) {
                    setTimeout(() => { this.setState({ isLoading: false }) }, 0);
                    Actions.reset('menuList');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    goBack = () => {
        if (this.state.flag) {
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

    render() {

        // console.log(this.state.flavorsForPush[0]);

        // for (var i = 0; i < this.state.flavorsForPush.length; i++) {
        //     console.log(this.state.flavorsForPush[i]);
        // }

        return (
            <SafeAreaView style={{flex:1}}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={this.state.isLoading} />
                }
            >
                <View style={styles.root}>
                    <View style={styles.title}>
                        <IconButton icon="arrow-left" size={30} color="#676767" onPress={() => { this.goBack() }} />
                        <Text style={styles.titleText}>編輯餐點</Text>
                    </View>
                    <TouchableHighlight activeOpacity={0.85} underlayColor="#ffffff" onPress={() => { this._imagePress() }}>
                        <View style={styles.imageGroup}>

                            <ImageBackground style={{ backgroundColor: "#d7d7d7", width: "100%", height: "100%" }} resizeMode="cover" source={{ uri: this.state.imageUri }}>
                                <Text style={{ color: "#ffffff", backgroundColor: "rgba(50,50,50,0.3)", alignSelf: "flex-end", justifyContent: "flex-end" }}>編輯圖片</Text>
                            </ImageBackground>
                        </View>
                    </TouchableHighlight>
                    <View style={styles.nameAndPrice}>
                        <TextInput
                            label="品名"
                            mode="outlined"
                            value={this.state.foodName}
                            onChangeText={foodName => this._onChangeName(foodName)}
                            selectionColor="#d6d6d6"
                            style={{ flexGrow: 10, paddingRight: 5 }}
                        />
                        <TextInput
                            label="價格"
                            mode="outlined"
                            value={this.state.foodPrice.toString()}
                            onChangeText={foodPrice => this._onChangePrice(foodPrice)}
                            keyboardType="number-pad"
                            style={{ flexGrow: 5, paddingLeft: 5 }}
                        />
                    </View>
                    <TextInput
                        label="餐點說明"
                        mode="outlined"
                        value={this.state.foodDescription}
                        onChangeText={foodDescription => this.setState({ foodDescription })}
                        numberOfLines={5}
                        multiline={true}
                        style={{ paddingHorizontal: 20, paddingTop: 5 }}
                    />
                    <View style={styles.calories}>
                        <TextInput
                            label="卡路里"
                            mode="outlined"
                            value={this.state.calories.toString()}
                            onChangeText={calories => this._onChangeCalories(calories)}
                            keyboardType="number-pad"
                            style={{ flexGrow: 200, paddingRight: 5, paddingTop: 5 }}
                        />
                        <Text style={{ flexGrow: 1, paddingLeft: 5, }}>大卡</Text>
                    </View>
                    <View style={[styles.divider, { paddingBottom: -5 }]}>
                        <Divider />
                    </View>

                    <View style={{ paddingHorizontal: 20 }}>
                        <Dropdown
                            label="餐點類別"
                            data={this.state.typeList}
                            value={this.state.foodTypeName}
                            fontSize={15}
                            onChangeText={(value) => { this.setState({ foodTypeName: value }) }}
                        />
                    </View>

                    <View style={[styles.divider]}>
                        <Divider />
                    </View>

                    <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", paddingHorizontal: 20, marginBottom: 5 }}>
                        <Text style={{ fontSize: 20 }}>口味調整</Text>
                        {/* <Button style={{ elevation: 0 }} icon="check-all" color="#757575" mode="contained" onPress={() => this.setState({ editFlavor: false })}>完成</Button> */}
                        {/* <IconButton style={{ alignItems: "center" }} icon="check-all" color="#000000" size={30} onPress={() => this.setState({ editFlavor: false })} /> */}
                    </View>
                    <View style={styles.flavorGroup}>
                        {this.state.flavors.map((flavor, flavorIndex) => (

                            <View style={styles.flavor}>
                                <View style={{ flexDirection: "row", alignContent: "center" }}>
                                    <IconButton style={{ flexGrow: 1, marginRight: -10, marginLeft: -5, alignSelf: "center", alignItems: "center" }} icon="delete" size={20} color="#fa223b" onPress={() => this._removeFlavor(flavor, flavorIndex)} />
                                    <IconButton style={{ flexGrow: 1, alignSelf: "center" }} icon="pencil" size={20} color="#676767" onPress={() => { this.showEditFlavorDialog(true, flavor.name, flavor.isMultiple, flavor.isRequired, flavorIndex) }} />
                                    <Text adjustsFontSizeToFit={true} style={{ flexGrow: 2, justifyContent: "flex-start", width: 60, marginRight: 2, alignSelf: "center" }}>{flavor.name}</Text>
                                </View>
                                {/* <IconButton style={{ paddingLeft: -20, justifyContent: "center", alignSelf: "center", alignItems: "center" }} icon="delete" size={20} color="#fa223b" onPress={() => this._removeFlavor(flavor, flavorIndex)} />
                                <Text style={{ justifyContent: "flex-start", width: 60, marginRight: 2, alignSelf: "center" }}>{flavor.name}</Text>
                                <IconButton style={{ justifyContent: "center", alignSelf: "center", alignItems: "center" }} icon="pencil" size={20} color="#676767" onPress={() => { this.showEditFlavorDialog(true, flavor.name, flavor.isMultiple, flavor.isRequired, flavorIndex) }} /> */}
                                <ScrollView horizontal={true}>
                                    <View style={{ flexDirection: "row" }}>
                                        {flavor.items.map((item, index) => (
                                            <View style={{ alignSelf: "center", marginRight: 3, marginVertical: 2 }}>
                                                <Chip onClose={() => this._removeChip(flavorIndex, index)}>{item.flavorName}{(item.extraPrice > 0) ? (" + $" + item.extraPrice) : ""}</Chip>
                                            </View>
                                        ))}
                                        <IconButton style={{ alignItems: "center" }} icon="plus-circle-outline" size={20} color="#7b7b7b" onPress={() => this._handleChipButton(flavorIndex)} />
                                    </View>
                                </ScrollView>
                            </View>
                        ))}
                        <IconButton style={{ alignItems: "center" }} icon="plus-circle-outline" size={20} color="#7b7b7b" onPress={() => this.showDialog(true)} />
                    </View>
                    <View style={{marginHorizontal:10,justifyContent:"center",marginTop:10}}>
                        <Divider />
                    </View>

                    <TouchableRipple onPress={() => this._onHandleTodaySpecial()} rippleColor="rgba(0,0,0,0.2)">
                        <View style={styles.todaySpecialGroup}>
                            <Text style={{ alignSelf: "center", textAlign: "center" }}>設為今日特餐</Text>
                            <Switch value={this.state.todaySpecial} onValueChange={() => this._onHandleTodaySpecial()} />
                        </View>
                    </TouchableRipple>

                    <View style={{marginHorizontal:10,justifyContent:"center"}}>
                        <Divider />
                    </View>

                    <TouchableRipple onPress={() => this._onHandleFoodIsSoldOut()} rippleColor="rgba(0,0,0,0.2)">
                        <View style={styles.todaySpecialGroup}>
                            <Text style={{ alignSelf: "center", textAlign: "center" }}>餐點是否完售</Text>
                            <Switch value={this.state.foodIsSoldOut} onValueChange={() => this._onHandleFoodIsSoldOut()} />
                        </View>
                    </TouchableRipple>

                    <View style={{marginHorizontal:10,justifyContent:"center", marginBottom:10}}>
                        <Divider />
                    </View>

                    <View style={{ justifyContent: "space-between", flexDirection: "row", paddingHorizontal: 20, paddingBottom: 10 }}>
                        <View style={{ flexGrow: 1, paddingRight: 5 }}>
                            <Button mode="outlined" color="#757575" onPress={() => this.goBack()} >取消修改</Button>

                        </View>
                        <View style={{ flexGrow: 1, paddingLeft: 5 }}>

                            <Button style={{ elevation: 0 }} mode="contained" onPress={() => this.completeEdit()}>完成修改</Button>
                        </View>
                    </View>
                    <View style={{ paddingHorizontal: 20 }}>

                        <Button style={{ elevation: 0 }} color="#fa223b" mode="contained" onPress={() => this._deletePress()}>刪除餐點</Button>
                    </View>

                    {/* <DialogInput
                        isDialogVisible={this.state.isAddFlavorDialogVisible}
                        title={"新增口味"}
                        message={"請輸入要新增的口味"}
                        submitInput={(inputText) => { this._addFlavor(inputText) }}
                        closeDialog={() => { this.showDialog(false) }}
                        submitText={"確認"}
                        cancelText={"取消"}
                    >
                    </DialogInput> */}

                    <Portal>
                        <Dialog visible={this.state.isEditFlavorDialogVisible} onDismiss={() => { this.showEditFlavorDialog(false, "", false, false) }} >
                            <Dialog.Title>編輯口味</Dialog.Title>
                            <Dialog.Content>

                                <View style={styles.chipNameAndPrice, { marginBottom: 5 }}>
                                    <TextInput
                                        label="口味名稱"
                                        mode="outlined"
                                        value={this.state.flavorName}
                                        onChangeText={text => this.setState({ flavorName: text })}
                                        selectionColor="#d6d6d6"
                                        style={{ flexGrow: 10, paddingRight: 5, }}
                                    />
                                    {/* <TextInput
                                            label="價格"
                                            mode="outlined"
                                            value={this.state.chipPrice.toString()}
                                            onChangeText={text => this.setState({ chipPrice: text })}
                                            keyboardType="number-pad"
                                            style={{ flexGrow: 5, paddingLeft: 5, }}
                                        /> */}
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: -5 }}>
                                    <Checkbox status={this.state.isRequired ? 'checked' : 'unchecked'} onPress={() => { this.setState({ isRequired: !this.state.isRequired }) }} />
                                    <Text style={{ alignSelf: "center" }}>必填</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: -5 }}>
                                    <Checkbox status={this.state.isMultiple ? 'checked' : 'unchecked'} onPress={() => { this.setState({ isMultiple: !this.state.isMultiple }) }} />
                                    <Text style={{ alignSelf: "center" }}>可複選</Text>
                                </View>
                                {/* <Checkbox label="可複選" checked={this.state.isMultiple} onCheck={(checked) => { this.setState({ isMultiple: checked }) }} /> */}

                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => { this.showEditFlavorDialog(false, "", false, false) }} >取消</Button>
                                <Button onPress={() => { this._editFlavor() }} >確認</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>

                    <Portal>
                        <Dialog visible={this.state.isAddFlavorDialogVisible} onDismiss={() => { this.showDialog(false) }} >
                            <Dialog.Title>新增口味</Dialog.Title>
                            <Dialog.Content>

                                <View style={styles.chipNameAndPrice, { marginBottom: 5 }}>
                                    <TextInput
                                        label="口味名稱"
                                        mode="outlined"
                                        value={this.state.flavorName}
                                        onChangeText={text => this.setState({ flavorName: text })}
                                        selectionColor="#d6d6d6"
                                        style={{ flexGrow: 10, paddingRight: 5, }}
                                    />
                                    {/* <TextInput
                                            label="價格"
                                            mode="outlined"
                                            value={this.state.chipPrice.toString()}
                                            onChangeText={text => this.setState({ chipPrice: text })}
                                            keyboardType="number-pad"
                                            style={{ flexGrow: 5, paddingLeft: 5, }}
                                        /> */}
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: -5 }}>
                                    <Checkbox status={this.state.isRequired ? 'checked' : 'unchecked'} onPress={() => { this.setState({ isRequired: !this.state.isRequired }) }} />
                                    <Text style={{ alignSelf: "center" }}>必填</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: -5 }}>
                                    <Checkbox status={this.state.isMultiple ? 'checked' : 'unchecked'} onPress={() => { this.setState({ isMultiple: !this.state.isMultiple }) }} />
                                    <Text style={{ alignSelf: "center" }}>可複選</Text>
                                </View>
                                {/* <Checkbox label="可複選" checked={this.state.isMultiple} onCheck={(checked) => { this.setState({ isMultiple: checked }) }} /> */}

                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => { this.showDialog(false) }} >取消</Button>
                                <Button onPress={() => { this._addFlavor() }} >確認</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>


                    <Portal>
                        <Dialog visible={this.state.isAddChipDialogVisible} onDismiss={() => { this.showAddChipDialog(false) }} >
                            <Dialog.Title>新增項目</Dialog.Title>
                            <Dialog.Content>
                                <View style={styles.chipNameAndPrice}>
                                    <TextInput
                                        label="項目名稱"
                                        mode="outlined"
                                        value={this.state.chipName}
                                        onChangeText={text => this.setState({ chipName: text })}
                                        selectionColor="#d6d6d6"
                                        style={{ flexGrow: 10, paddingRight: 5, }}
                                    />
                                    <TextInput
                                        label="價格"
                                        mode="outlined"
                                        value={this.state.chipPrice.toString()}
                                        onChangeText={text => this.setState({ chipPrice: text })}
                                        keyboardType="number-pad"
                                        style={{ flexGrow: 5, paddingLeft: 5, }}
                                    />
                                </View>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => { this.showAddChipDialog(false) }} >取消</Button>
                                <Button onPress={() => { this._addChip() }} >確認</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>

                    {/* <DialogInput
                        isDialogVisible={this.state.isAddChipDialogVisible}
                        title={"新增項目"}
                        message={"請輸入要新增的項目"}
                        submitInput={(inputText) => { this._addChip(inputText) }}
                        closeDialog={() => { this.showAddChipDialog(false) }}
                        submitText={"確認"}
                        cancelText={"取消"}
                    >
                    </DialogInput> */}
                </View>
            </ScrollView>
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({

    root: {
        // paddingTop:5,
        paddingVertical: 10
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
        paddingLeft: 5,
        paddingTop: 10
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
        paddingHorizontal: 20,
        marginVertical:10
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