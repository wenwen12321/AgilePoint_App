import React, { Component } from 'react';
import { View, StyleSheet, Alert, Image, ImageBackground, TouchableHighlight, ScrollView, RefreshControl, TouchableWithoutFeedback, SafeAreaView, AsyncStorage } from 'react-native';
import { TextInput, Divider, Text, Switch, Button, Chip, IconButton, Portal, Dialog, Checkbox, TouchableRipple } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import { Root, Toast } from 'native-base'
import serverInfo from '../ServerInfo';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default class AccountManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            userID: props.userID,

            userName: props.userName,

            userNameForEdit: props.userName,

            email: props.email,

            imageUri: props.imageUri,

            imageFile: "",

            isLoading: false,

            isNeedUpdate: false,

            auth: props.auth,

            flag: 0,

            isUserNameDialogVisible: false,

        }
    }

    _onChangeName = () => {
        if (this.state.userName !== this.state.userNameForEdit) {
            this.setState({ userName: this.state.userNameForEdit, flag: 1 });
        }
        this.showDialog();
        // const list = this.state.food;
        // list.name = foodName;

        // console.log(this.state.food.name);
    };

    showDialog() {
        this.setState({
            isUserNameDialogVisible: !this.state.isUserNameDialogVisible,
            userNameForEdit: this.state.userName
        });
    }

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

    // componentDidMount() {
    //     var address = serverInfo.SERVICE_ADDRESS;
    //     address = serverInfo.SERVICE_ADDRESS;
    //     address += (this.state.userID + "/userInfo");
    //     console.log(address);
    //     fetch(address, {
    //         method: 'GET',
    //     })
    //         .then((response) => response.json())
    //         .then((responseJson) => {
    //             this.setState({
    //                 storeName: responseJson.storeName,
    //                 imageUri: serverInfo.STORAGE_ADDRESS + "avatar/" + responseJson.storeImg
    //             })
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }

    completeEdit = () => {
        if (this.state.flag || this.state.imageFile) {
            setTimeout(() => { this.setState({ isLoading: true }) }, 0);
            var bodyData = {};
            bodyData.userName = this.state.userName;
            if (this.state.imageFile) {
                bodyData.userAvatar = this.state.imageFile;
            }

            var address = serverInfo.SERVICE_ADDRESS;
            address += (this.state.userID + "/userInfo");
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
                        return response.json();
                    }
                    // return response.text();
                })
                .then((responseJson)=>{
                    // console.log(responseJson);
                    this.setState({imageUri: responseJson.imagePath});
                    this.setStorage().done();
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        else {
            Actions.pop();
        }
    }

    setStorage = async () => {
        try {
            // console.log(userID + username);
            // await AsyncStorage.setItem('@User:loginStatus', 'loggedin');
            // const auth = base64.encode(this.state.email + ":" + this.state.newPassword);
            // await AsyncStorage.setItem('@User:email', this.state.email);
            // await AsyncStorage.setItem('@User:authorization', auth);
            // await AsyncStorage.setItem('@User:userID', userID.toString());
            await AsyncStorage.setItem('@User:username', this.state.userName);
            await AsyncStorage.setItem('@User:avatar', this.state.imageUri);
        } catch (error) {
            console.log(error);
        } finally {
            setTimeout(() => { this.setState({ isLoading: false }) }, 0);
            Actions.reset('accountSetting');
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


    render() {



        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Root>
                    <View style={styles.title}>
                        <View style={{ flexDirection: "row" }}>
                            <IconButton icon="arrow-left" size={30} color="#676767" onPress={() => { this.goBack() }} />
                            <Text style={styles.titleText}>帳戶資料</Text>
                        </View>
                        <IconButton icon="check" size={30} color="#676767" onPress={() => { this.completeEdit() }} />
                    </View>
                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={this.state.isLoading} />
                        }
                    >
                        <View style={styles.root}>
                            <Text style={{ fontSize: 20, marginHorizontal: 10 }}>大頭貼</Text>
                            <TouchableHighlight activeOpacity={0.85} underlayColor="#ffffff" onPress={() => { this._imagePress() }}>
                                <View style={styles.imageGroup}>

                                    <ImageBackground style={{ backgroundColor: "#d7d7d7", width: "100%", height: "100%" }} resizeMode="cover" source={{ uri: this.state.imageUri }}>
                                        <Text style={{ color: "#ffffff", backgroundColor: "rgba(50,50,50,0.3)", alignSelf: "flex-end", justifyContent: "flex-end" }}>編輯圖片</Text>
                                    </ImageBackground>
                                </View>
                            </TouchableHighlight>

                            <Divider />
                            <View style={{ margin: 10, justifyContent: "space-between", flexDirection: "row" }}>
                                <Text style={{ alignSelf: "center", fontSize: 18 }}>Email</Text>
                                <Text style={{ alignSelf: "center", fontSize: 18 }}>{this.state.email}</Text>
                            </View>
                            <Divider />
                            <TouchableRipple onPress={() => this.showDialog()} rippleColor="rgba(0,0,0,0.2)">
                                {/* <View> */}
                                {/* <Text style={styles.itemText}>使用者名稱</Text> */}
                                <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 10, marginRight: 0 }}>
                                    <Text style={{ alignSelf: "center", fontSize: 18 }}>使用者名稱</Text>
                                    <View style={{ alignItems: "center", flexDirection: "row" }}>
                                        <Text style={{ alignSelf: "center", fontSize: 18 }}>{this.state.userName}</Text>
                                        {/* <Text style={{ color: "#575757" }}>編輯</Text> */}
                                        <Icon style={{ marginRight: 10, alignSelf: "center" }} color="#575757" size={30} name="chevron-right" />
                                    </View>
                                </View>
                                {/* </View> */}
                            </TouchableRipple>
                            <Divider />
                            <TouchableRipple onPress={() => { Actions.changePassword({ email: this.state.email, auth: this.state.auth }) }} rippleColor="rgba(0,0,0,0.2)">
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <View style={{ margin: 10, alignItems: "center", flexDirection: "row" }}>
                                        {/* <Icon style={{ marginRight: 10 }} color="#272acb" size={30} name="key-outline" /> */}
                                        <Text style={{ fontSize: 18 }}>修改密碼</Text>
                                    </View>
                                    <View style={{ alignItems: "center", flexDirection: "row" }}>
                                        <Text style={{ color: "#575757", fontSize: 18 }}>修改</Text>
                                        <Icon style={{ marginRight: 10, alignSelf: "center" }} color="#575757" size={30} name="chevron-right" />
                                    </View>
                                </View>
                            </TouchableRipple>
                            <Divider />

                            <Portal>
                                <Dialog visible={this.state.isUserNameDialogVisible} onDismiss={() => { this.showDialog() }} >
                                    <Dialog.Title>編輯使用者名稱</Dialog.Title>
                                    <Dialog.Content>
                                        <TextInput
                                            label="使用者名稱"
                                            mode="outlined"
                                            value={this.state.userNameForEdit}
                                            onChangeText={text => this.setState({ userNameForEdit: text })}
                                            selectionColor="#d6d6d6"
                                            style={{ flexGrow: 10, paddingRight: 5, }}
                                        />
                                    </Dialog.Content>
                                    <Dialog.Actions>
                                        <Button onPress={() => { this.showDialog() }} >取消</Button>
                                        <Button onPress={() => { this._onChangeName() }} >確認</Button>
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
        paddingHorizontal: 10,
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
    itemText: {
        color: "#575757",
        marginTop: 5,
        fontSize: 14,
        alignContent: "center"
    }
});