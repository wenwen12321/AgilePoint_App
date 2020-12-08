import * as React from 'react';
import { Button, List, Checkbox, Switch, Divider, Title, Text, IconButton, Colors } from 'react-native-paper';
import { View, Alert, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, AsyncStorage, Pressable, SafeAreaView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { ActionSheet, Root, Toast } from 'native-base';
import DialogInput from 'react-native-dialog-input';
import serverInfo from '../ServerInfo';


export default class EditMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuList: [
                // {
                //     id: 1,
                //     type: "米食",
                //     expanded: true,
                //     items: [
                //         {
                //             id: 1,
                //             name: "肉絲炒飯",
                //             price: 65,
                //             checked: true
                //         },
                //         {
                //             id: 2,
                //             name: "排骨飯",
                //             price: 95,
                //             checked: true
                //         },
                //         {
                //             id: 3,
                //             name: "滑蛋牛肉燴飯",
                //             price: 95,
                //             checked: true
                //         },
                //         {
                //             id: 4,
                //             name: "韓式燒肉拌飯",
                //             price: 70,
                //             checked: true
                //         }
                //     ]
                // },
                // {
                //     id: 2,
                //     type: "麵食",
                //     expanded: true,
                //     items: [
                //         {
                //             id: 1,
                //             name: "牛肉麵",
                //             price: 120,
                //             checked: true
                //         },
                //         {
                //             id: 2,
                //             name: "紅油抄手麵",
                //             price: 70,
                //             checked: true
                //         },
                //         {
                //             id: 3,
                //             name: "酸辣麵",
                //             price: 60,
                //             checked: true
                //         },
                //         {
                //             id: 4,
                //             name: "餛飩麵",
                //             price: 60,
                //             checked: true
                //         }
                //     ]
                // },
                // {
                //     id: 3,
                //     type: "湯品",
                //     expanded: true,
                //     items: [
                //         {
                //             id: 1,
                //             name: "蛋花湯",
                //             price: 25,
                //             checked: true
                //         },
                //         {
                //             id: 2,
                //             name: "貢丸湯",
                //             price: 30,
                //             checked: true
                //         },
                //         {
                //             id: 3,
                //             name: "酸辣湯",
                //             price: 30,
                //             checked: true
                //         },
                //         {
                //             id: 4,
                //             name: "青菜豆腐湯",
                //             price: 30,
                //             checked: true
                //         }
                //     ]
                // }
            ],
            isDialogVisible: false,
            isNeedUpdate: false,
            isUpdating: false,
            storeID: null,
            isLoggedIn: true,
            auth: null,
            userID: null,
            isEditTypeDialogVisible: false,
            itemID: null,
            itemName: null,
        }
    }

    componentDidMount() {
        this.getLoginSatus();
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

    _handlePress = (i) => {
        this.setState(state => {
            const list = state.menuList.map(item => {
                if (i === item.id) {

                    if (item.expanded === true) {
                        console.log(item.id);
                        item.expanded = false;
                        console.log(item.expanded);
                    }
                    else {
                        item.expanded = true;
                    }
                }
                return item;
            });
            return { list };
        });
    };

    _handleLongPress = (itemID) =>{
        console.log("longPressed");
    };

    // _onToggleSwitch = (i, j) => {
    //     this.setState(state => {
    //         const list = state.menuList.map(item => {
    //             if (i === item.id) {
    //                 const foodList = item.items.map(food => {
    //                     if (j === food.id) {
    //                         if (food.checked === true) {
    //                             food.checked = false;
    //                             console.log(food.checked);
    //                         }
    //                         else {
    //                             food.checked = true;
    //                         }
    //                     }
    //                     return food;
    //                 })
    //             }
    //             return item;
    //         });
    //         return { list };
    //     });
    // };

    // _itemNameStyle = (opt) => {
    //     if (opt === true) {
    //         return {
    //             textAlignVertical: "center",
    //             fontSize: 20
    //         }
    //     }
    //     else {
    //         return {
    //             textAlignVertical: "center",
    //             fontSize: 20,
    //             color: "#d6d6d6"
    //         }
    //     }
    // };

    // _itemPriceStyle = (opt) => {
    //     if (opt === true) {
    //         return {
    //             justifyContent: "flex-end",
    //             textAlignVertical: "center",
    //             textAlign: "right",
    //             paddingRight: 20,
    //             fontSize: 20
    //         }
    //     }
    //     else {
    //         return {
    //             justifyContent: "flex-end",
    //             textAlignVertical: "center",
    //             textAlign: "right",
    //             paddingRight: 20,
    //             fontSize: 20,
    //             color: "#d6d6d6"
    //         }
    //     }
    // };

    _deletePress = (item, food) => {
        console.log("type id:" + item.id + " food id:" + food.id);
        Alert.alert(
            "確定要刪除餐點嗎?",
            "此動作將永久刪除以下餐點:\n" + food.name,
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
                        address += (this.state.storeID + "/meals/" + food.id);
                        console.log(address);
                        fetch(address, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': 'Bearer ' + this.state.auth,
                            }
                        })
                            .then((response) => {
                                if (response.ok) {
                                    Toast.show({
                                        text: food.name + "已刪除",
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
                                setTimeout(() => {
                                    this.setState({ isNeedUpdate: true });
                                }, 0);
                            });;

                    }
                }
            ],
            { cancelable: true }
        );
    };

    showDialog(isShow) {
        this.setState({ isDialogVisible: isShow });
    };

    _addType = (inputText) => {
        this.showDialog(false);
        if (inputText !== "") {
            var address = serverInfo.SERVICE_ADDRESS;
            address += (this.state.storeID + "/menuType");
            console.log(address);
            fetch(address, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.auth,
                },
                body: JSON.stringify({
                    MenuTypeName: inputText
                })
            })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setTimeout(() => {
                        this.setState({
                            isNeedUpdate: true,
                        });
                    }, 0);
                });
            // let array = this.state.menuList;
            // array.push({
            //     id: this.state.menuList.length + 1,
            //     type: inputText,
            //     expanded: true,
            //     items: []
            // });
            // this.setState({ menuList: array });
        }
    };

    _handleAddFood = (item) => {
        const typeList = [];
        const tlist = this.state.menuList.map(iitem => {
            typeList.push({ value: iitem.type });
        });
        Actions.addFood({ 'item': item, 'foodTypeName': item.type, 'auth': this.state.auth, 'storeID': this.state.storeID });
    };

    updateData() {
        if (this.state.isNeedUpdate && !this.state.isUpdating) {
            setTimeout(() => {
                this.setState({
                    isUpdating: true
                });
            })
            var address = serverInfo.SERVICE_ADDRESS;
            address += (this.state.storeID + "/meals");
            let menuList = [];
            console.log(address);
            fetch(address, {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    for (var i = 0; i < responseJson.length; i++) {

                        menuList.push({
                            id: responseJson[i].id,
                            type: responseJson[i].type,
                            expanded: true,
                            items: responseJson[i].items
                        });
                    }
                })
                .then(()=>{
                    address = serverInfo.SERVICE_ADDRESS;
                    address += (this.state.storeID + "/menuType");
                    console.log(address);
                    fetch(address, {
                        method: 'GET',
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            console.log(responseJson);
                            for (var i = 0; i < responseJson.length; i++) {
                                var flag = 0;
                                // console.log(menuList);
                                for(var j=0;j<menuList.length;j++){
                                    if(responseJson[i].menuTypeID===menuList[j].id){
                                        // console.log(responseJson[i].menuTypeID);
                                        flag = 1;
                                    }
                                }
    
                                if(!flag){
                                    menuList.push({
                                        id: responseJson[i].menuTypeID,
                                        type: responseJson[i].menuTypeName,
                                        expanded: true,
                                        items: []
                                    });
                                }
        
                                
                            }
                            setTimeout(() => {
                                this.setState({
                                    menuList: menuList
                                });
                            }, 0)
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setTimeout(() => {
                        this.setState({
                            isNeedUpdate: false,
                            isUpdating: false
                        });
                    });
                });
        }
    }

    goBack = () => {
        Actions.reset('menuList');
    }

    _handleEditTypeName = (id, typeName) => {
        setTimeout(()=>{this.setState({itemID: id, itemName: typeName})},0);
        this.showEditTypeDialog(true);
    }

    _deleteTypeNamePress = (id, typeName) => {
        Alert.alert(
            "確定要刪除類別嗎?",
            "此動作將永久刪除以下餐點:" + typeName + "\n且會連帶刪除該類別下所有餐點",
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
                        address += (this.state.storeID + "/menuType/" + id);
                        console.log(address);
                        fetch(address, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': 'Bearer ' + this.state.auth,
                            }
                        })
                            .then((response) => {
                                console.log(response);
                                if (response.ok) {
                                    Toast.show({
                                        text: typeName + "類別已刪除",
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
                                setTimeout(() => {
                                    this.setState({ isNeedUpdate: true });
                                }, 0);
                            });;

                    }
                }
            ],
            { cancelable: true }
        );
    }

    showEditTypeDialog = (isShow) => {
        this.setState({isEditTypeDialogVisible:isShow});
        if(!isShow){
            setTimeout(()=>{this.setState({itemID: null, itemName: null})},0);
        }
    }

    editType = (inputText) => {
        var itemID = this.state.itemID;
        this.showEditTypeDialog(false);
        if (inputText !== "") {
            var address = serverInfo.SERVICE_ADDRESS;
            address += (this.state.storeID + "/menuType");
            console.log(address);
            fetch(address, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.auth,
                },
                body: JSON.stringify({
                    menuTypeID: itemID,
                    menuTypeName: inputText
                })
            })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setTimeout(() => {
                        this.setState({
                            isNeedUpdate: true,
                        });
                    }, 0);
                });
        }
    }

    render() {
        return (
            <Root>
            <SafeAreaView style={{flex:1}}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={this.state.isUpdating} onRefresh={() => { this.setState({ isNeedUpdate: true }) }} />
                }
            >
                {this.updateData()}
                <List.Section>
                    <View style={styles.title}>
                        <Text style={styles.titleText}>編輯菜單</Text>
                        <IconButton icon="check-all" color={Colors.black} size={30} onPress={() => this.goBack()} />
                    </View>
                    {this.state.menuList.map(item => (
                        // <TouchableOpacity onLongPress={() => this._handleLongPress(item.id)}>
                        <>
                        <View style={{marginTop:5}}>
                            <Divider/>
                        </View>
                        <View style={{flexDirection:"row", margin:10, justifyContent:"space-between"}}>
                            <View style={{flexDirection:"row"}}>
                                <Text style={{fontSize:20, alignSelf:"center", marginLeft:5}}>{item.type}</Text>
                                <IconButton icon="pencil" style={styles.deleteIcon} size={25} color="#676767" onPress={()=>this._handleEditTypeName(item.id, item.type)} />
                            </View>
                            <IconButton style={styles.deleteIcon} icon="delete" color="#fa223b" size={28} onPress={() => this._deleteTypeNamePress(item.id, item.type)} />
                        </View>
                        {/* <List.Accordion
                            title={item.type}
                            titleStyle={styles.typeText}
                            left={props => <List.Icon {...props} icon="folder" />}
                            expanded={item.expanded}
                            onPress={() =>
                                this._handlePress(item.id)}
                        > */}
                        <View style={{marginLeft:25}}>
                            {item.items.map((food) => (
                                <View>
                                    <View style={styles.menuItem}>
                                        <View style={styles.itemNameGroup}>
                                            <Text style={styles.itemName}> {food.name}</Text>
                                        </View>
                                        <View style={styles.itemPriceGroup}>
                                            <Text style={styles.itemPrice}>${food.price}</Text>
                                            <IconButton style={styles.deleteIcon} icon="delete" color="#fa223b" size={28} onPress={() => this._deletePress(item, food)} />
                                        </View>
                                    </View>
                                    <Divider style={{paddingRight:20}} />
                                </View>
                            ))}
                            <View style={styles.addButton}>
                                <Button color="#7a7a7a" icon="plus-circle-outline" mode="outlined" onPress={() => this._handleAddFood(item)}>
                                    新增餐點
                                    </Button>
                            </View>
                        </View>
                        {/* </List.Accordion> */}
                        </>
                        // </TouchableOpacity>
                    ))}
                </List.Section>
                <View style={styles.addTypeButton}>
                    <Button color="#ad80ed" icon="plus-circle-outline" mode="outlined" onPress={() => this.showDialog(true)}>
                        新增類別
                        </Button>
                </View>
                <DialogInput
                    isDialogVisible={this.state.isDialogVisible}
                    title={"新增類別"}
                    message={"請輸入要新增的類別"}
                    submitInput={(inputText) => { this._addType(inputText) }}
                    closeDialog={() => { this.showDialog(false) }}
                    submitText={"確認"}
                    cancelText={"取消"}
                >
                </DialogInput>
                <DialogInput
                    isDialogVisible={this.state.isEditTypeDialogVisible}
                    title={"修改類別"}
                    message={"請輸入要修改的類別"}
                    submitInput={(inputText) => { this.editType(inputText) }}
                    closeDialog={() => { this.showEditTypeDialog(false) }}
                    submitText={"確認"}
                    cancelText={"取消"}
                    initValueTextInput={this.state.itemName}
                >
                </DialogInput>
            </ScrollView>
            </SafeAreaView>
            </Root>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center"
    },

    menuItem: {
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-between"
    },

    itemName: {
        textAlignVertical: "center",
        // fontSize: 20
    },

    itemNameGroup: {
        height: 40,
        flexDirection: "row",
        // alignContent: "center",
        justifyContent: "flex-start"
    },

    itemPrice: {
        textAlignVertical: "center",
        textAlign: "right",
        // fontSize: 20
    },

    itemPriceGroup: {
        height: 40,
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingRight: 20
    },

    titleText: {
        fontSize: 30,
        paddingLeft: 10,
        paddingTop: 10
    },

    typeText: {
        fontSize: 15
    },

    deleteIcon: {
        height: 28,
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        // paddingBottom: 12
    },

    addButton: {
        paddingRight: 20,
        marginVertical: 5
    },

    addTypeButton: {
        // height:40,
        paddingRight: 20,
        paddingLeft: 20,
        paddingBottom: 10,
        paddingTop: 5
    }
});