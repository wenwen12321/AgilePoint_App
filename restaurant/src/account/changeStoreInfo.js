import React, { Component } from 'react';
import { View, StyleSheet, Alert, Image, ImageBackground, TouchableHighlight, ScrollView, RefreshControl, TouchableWithoutFeedback, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { TextInput, Divider, Text, Switch, Button, Chip, IconButton, Portal, Dialog, Checkbox, TouchableRipple } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import { Root, Toast } from 'native-base';
import DialogInput from 'react-native-dialog-input';
import { Dropdown } from 'react-native-material-dropdown';
import BottomSheet from 'react-native-bottomsheet';
import serverInfo from '../ServerInfo';
import ImagePicker from 'react-native-image-picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


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

            offset: 0,

            offsetText: "0 分鐘後",

            data: [],

            isStoreOpen: true,

            businessHour: [],

            isAddTimeSessionDialogVisible: false,

            startTimeText: "00:00",

            endTimeText: "00:00",

            isStartTimePickerVisible: false,

            isEndTimePickerVisible: false,

            isTimeMinus: false,

            isOverlap: false,

        }
    }

    _onChangeName = (storeName) => {
        // const list = this.state.food;
        // list.name = foodName;
        this.setState({ storeName: storeName, flag: 1 });
        // console.log(this.state.food.name);
    };

    _onChangeOffset = (offset) => {
        // const list = this.state.food;
        // list.name = foodName;
        this.setState({ offset: offset, flag: 1 });
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
        let data = [];
        for (var i = 0; i <= 60; i += 5) {
            data.push({
                value: i.toString() + " 分鐘後",
                waitTime: i,
            })
        }
        this.setState({ data: data });

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
                var status = false;
                if (responseJson.isStoreOpen) {
                    status = true;
                }
                this.setState({
                    storeName: responseJson.storeName,
                    imageUri: serverInfo.STORAGE_ADDRESS + "store/" + responseJson.storeImg,
                    offset: responseJson.offset,
                    offsetText: responseJson.offset.toString() + " 分鐘後",
                    isStoreOpen: status,
                    businessHour: responseJson.businessHour
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
            bodyData.offset = this.state.offset;
            bodyData.businessHour = this.state.businessHour;
            console.log(bodyData);

            var address = serverInfo.SERVICE_ADDRESS;
            address += (this.state.storeID + "/storeInfo");
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
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                });

            address = serverInfo.SERVICE_ADDRESS;
            address += (this.state.storeID + "/storeStatus");
            console.log(address);
            fetch(address, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.auth,
                },
                body: JSON.stringify({
                    isOpen: this.state.isStoreOpen
                })
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
                    'Authorization': 'Bearer ' + this.state.auth,
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

    handleOpenStore = () => {
        var status = this.state.isStoreOpen;
        status = !status;
        this.setState({ isStoreOpen: status, flag: 1 });
    }

    _handleEditTimeSession = (startTime, endTime) => {
        this.setState({
            startTimeText: startTime,
            endTimeText: endTime
        });
        this.showAddTimeSessionDialog(true);
    }

    _handleDeleteTimeSession = (startTime, endTime, index) => {
        Alert.alert(
            "提示",
            "確認要刪除該時段嗎?",
            [
                {
                    text: "取消",
                    onPress: () => console.log("cancel"),
                    style: "cancel"
                },
                {
                    text: "確定",
                    onPress: () => {
                        var businessHourList = [];
                        businessHourList = this.state.businessHour;
                        businessHourList.splice(index, 1);
                        this.setState({
                            businessHour: businessHourList,
                            flag: 1
                        })

                    }
                }
            ],
            { cancelable: true }
        )
    }

    showAddTimeSessionDialog = (isShow) => {
        if (isShow) {
            this.setState({
                isAddTimeSessionDialogVisible: isShow
            })
        }
        else {
            this.setState({
                isAddTimeSessionDialogVisible: isShow,
                startTimeText: "00:00",
                endTimeText: "00:00",
                isOverlap: false,
                isTimeMinus: false,
            })
        }
    }

    handleStartTimeSelect = (time) => {
        var timeTxt = ((time.getHours() < 10) ? "0" : "") + time.getHours().toString() + ":" + ((time.getMinutes() < 10) ? "0" : "") + time.getMinutes().toString();
        this.setState({
            startTimeText: timeTxt,
            isStartTimePickerVisible: false
        });
    }

    handleEndTimeSelect = (time) => {
        var timeTxt = ((time.getHours() < 10) ? "0" : "") + time.getHours().toString() + ":" + ((time.getMinutes() < 10) ? "0" : "") + time.getMinutes().toString();
        this.setState({
            endTimeText: timeTxt,
            isEndTimePickerVisible: false
        });
    }

    _addTimeSession = () => {
        var startTime = this.state.startTimeText;
        var endTime = this.state.endTimeText;

        var tmp = startTime.split(":");
        var startTimeHour = parseInt(tmp[0]);
        var startTimeMin = parseInt(tmp[1]);

        tmp = endTime.split(":");
        var endTimeHour = parseInt(tmp[0]);
        var endTimeMin = parseInt(tmp[1]);

        var flag = 0;

        if (endTimeHour < startTimeHour || (endTimeHour === startTimeHour && endTimeMin <= startTimeMin)) {
            // Alert.alert(
            //     "非法時間",
            //     "結束時間必須要晚於開始時間",
            //     [
            //         {
            //             text: "確定"
            //         }
            //     ],
            //     { cancelable: true }
            // );
            flag = 1;
            this.setState({ isTimeMinus: true });
        }


        for (var i = 0; i < this.state.businessHour.length; i++) {
            tmp = this.state.businessHour[i].start.split(":");
            var tmpStartTimeHour = parseInt(tmp[0]);
            var tmpStartTimeMin = parseInt(tmp[1]);

            console.log(tmp);

            tmp = this.state.businessHour[i].end.split(":");
            var tmpEndTimeHour = parseInt(tmp[0]);
            var tmpEndTimeMin = parseInt(tmp[1]);

            console.log(tmp);

            if ((startTimeHour > tmpStartTimeHour && startTimeHour < tmpEndTimeHour) || (endTimeHour > tmpStartTimeHour && endTimeHour < tmpEndTimeHour)) {
                flag = 1;
                this.setState({ isOverlap: true });
            }
            if ((startTimeHour === tmpStartTimeHour && startTimeMin >= tmpStartTimeMin) || (startTimeHour === tmpEndTimeHour && startTimeMin <= tmpEndTimeMin) || (endTimeHour === tmpStartTimeHour && endTimeMin >= tmpStartTimeMin) || (endTimeHour === tmpEndTimeHour && endTimeMin <= tmpEndTimeMin)) {
                flag = 1;
                this.setState({ isOverlap: true });
            }

        }

        if (flag) {
            // Alert.alert(
            //     "非法時間",
            //     "與其他時段重疊，請直接於該時段編輯",
            //     [
            //         {
            //             text: "確定"
            //         }
            //     ],
            //     { cancelable: true }
            // );

        }
        else {
            var businessHourList = [];
            businessHourList = this.state.businessHour;
            businessHourList.push({
                start: this.state.startTimeText + ":00",
                end: this.state.endTimeText + ":00"
            });
            this.setState({
                businessHour: businessHourList,
                flag: 1,
            });
            this.showAddTimeSessionDialog(false);
        }

    }

    render() {

        const windowWidth = Dimensions.get("window").width;
        console.log(this.state.imageUri);

        return (
            <SafeAreaView style={{ flex: 1 }}>
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
                            <Text style={{ fontSize: 20 }}>餐廳照片</Text>
                            <TouchableHighlight activeOpacity={0.85} underlayColor="#ffffff" onPress={() => { this._imagePress() }}>
                                <View style={styles.imageGroup}>

                                    <ImageBackground style={{ backgroundColor: "#d7d7d7", width: windowWidth - 40, height: "100%", alignSelf: "center" }} resizeMode="cover" source={{ uri: this.state.imageUri }}>
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
                            <Divider />
                            <View style={{ marginTop: -5 }}>
                                {/* <TextInput
                                    label="預設取餐時間"
                                    mode="outlined"
                                    value={this.state.offset}
                                    onChangeText={offset => this._onChangeOffset(offset)}
                                    selectionColor="#d6d6d6"
                                    keyboardType="number-pad"
                                    style={{ flexGrow: 2 }}
                                />
                                <Text style={{ flexGrow: 1 }}>分鐘後</Text> */}
                                <Dropdown
                                    label="預設取餐時間"
                                    data={this.state.data}
                                    value={this.state.offsetText}
                                    fontSize={15}
                                    onChangeText={(value, index) => { this.setState({ offset: this.state.data[index].waitTime, offsetText: this.state.data[index].value, flag: 1 }) }}
                                />
                            </View>
                            <Text style={{ color: "#7e7e7e", marginBottom: 5 }}>備註：預設取餐時間並不會自動接單，且您依然要在手動接單時選擇取餐時間</Text>
                            <Divider />
                            <TouchableRipple onPress={() => this.handleOpenStore()} rippleColor="rgba(0,0,0,0.2)">
                                <View style={styles.nameAndPrice}>
                                    <Text style={{ alignSelf: "center", fontSize: 18 }}>開店狀態</Text>
                                    <Switch style={{ alignSelf: "center" }} value={this.state.isStoreOpen} onValueChange={() => this.handleOpenStore()} />
                                </View>
                            </TouchableRipple>
                            <Text style={{ color: "#7e7e7e", marginBottom: 5 }}>備註：關店時顧客仍然可以看到已上架餐點，但無法下訂餐點</Text>
                            <Divider />
                            <View style={{ marginVertical: 5 }}>
                                <Text style={{ fontSize: 18 }}>營業時間</Text>
                                {(this.state.businessHour.map((item, index) => (
                                    <View style={{ flexDirection: "row", marginVertical: 5 }}>
                                        <IconButton icon="pencil" style={[styles.deleteIcon, { marginHorizontal: 0 }]} size={22} color="#676767" onPress={() => this._handleEditTimeSession(item.start, item.end)} />
                                        <IconButton icon="delete" style={[styles.deleteIcon, { marginHorizontal: 0 }]} size={22} color="#fa223b" onPress={() => this._handleDeleteTimeSession(item.start, item.end, index)} />
                                        <Text style={{ alignSelf: "center" }}>{item.start.substring(0, item.start.length - 3)}~{item.end.substring(0, item.end.length - 3)}</Text>
                                    </View>
                                )))}
                                <Button style={{marginVertical:5}} color="#7a7a7a" icon="plus-circle-outline" mode="outlined" onPress={() => this.showAddTimeSessionDialog(true)}>新增時段</Button>
                            </View>
                            <Portal>
                                <Dialog visible={this.state.isAddTimeSessionDialogVisible} onDismiss={() => { this.showAddTimeSessionDialog(false) }} >
                                    <Dialog.Title>新增時段</Dialog.Title>
                                    <Dialog.Content>
                                        <View style={{ flexDirection: "row", marginVertical: 5 }}>
                                            <Text>開始時間：</Text>
                                            <TouchableOpacity

                                                onPress={() => { this.setState({ isStartTimePickerVisible: true }) }}
                                            >
                                                <Text>{this.state.startTimeText}<Icon name="chevron-down" color="#696969" style={{ alignSelf: "center" }} size={15} /></Text>
                                            </TouchableOpacity>
                                            <DateTimePicker
                                                isVisible={this.state.isStartTimePickerVisible}
                                                mode="time"
                                                onConfirm={(time) => this.handleStartTimeSelect(time)}
                                                onCancel={() => this.setState({ isStartTimePickerVisible: false })}
                                                confirmTextIOS="確認"
                                                cancelTextIOS="取消"
                                                headerTextIOS="選擇開始時間"
                                            />
                                        </View>
                                        <View style={{ flexDirection: "row", marginVertical: 5 }}>
                                            <Text>結束時間：</Text>
                                            <TouchableOpacity
                                                onPress={() => { this.setState({ isEndTimePickerVisible: true }) }}
                                            >
                                                <Text>{this.state.endTimeText}<Icon name="chevron-down" color="#696969" style={{ alignSelf: "center" }} size={15} /></Text>
                                            </TouchableOpacity>
                                            <DateTimePicker
                                                isVisible={this.state.isEndTimePickerVisible}
                                                mode="time"
                                                onConfirm={(time) => this.handleEndTimeSelect(time)}
                                                onCancel={() => this.setState({ isEndTimePickerVisible: false })}
                                                confirmTextIOS="確認"
                                                cancelTextIOS="取消"
                                                headerTextIOS="選擇結束時間"
                                            />
                                        </View>
                                        {(this.state.isTimeMinus) ? (<Text style={{ color: "#e9273d" }}>結束時間必須要晚於開始時間</Text>) : null}
                                        {(this.state.isOverlap) ? (<Text style={{ color: "#e9273d" }}>與其他時段重疊，請直接於該時段編輯</Text>) : null}
                                    </Dialog.Content>
                                    <Dialog.Actions>
                                        <Button onPress={() => { this.showAddTimeSessionDialog(false) }} >取消</Button>
                                        <Button onPress={() => { this._addTimeSession() }} >確認</Button>
                                    </Dialog.Actions>
                                </Dialog>
                            </Portal>
                        </View>
                    </ScrollView>
                </Root>
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({

    root: {
        paddingHorizontal: 20
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
        marginVertical: 5,
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
    },

    deleteIcon: {
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        // paddingBottom: 12
    },
});