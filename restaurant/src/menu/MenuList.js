import * as React from 'react';
import { List, Checkbox, Switch, Divider, Title, Text, IconButton, Colors, TouchableRipple } from 'react-native-paper';
import { Button, View, Alert, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, AsyncStorage, SafeAreaView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { ActionSheet, Root, Toast } from 'native-base';
import BottomSheet from 'react-native-bottomsheet';
import serverInfo from '../ServerInfo';

export default class MenuList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storeID: null,
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
            isNeedUpdate: false,
            isUpdating: false,
            isLoggedIn: false,
            auth: null,
            userID: null,
            isStoreOpen: true,
        }
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
    //     setTimeout(()=>{
    //         this.setState({
    //             isUpdating:true
    //         });
    //     },0)
    //     var address = serverInfo.SERVICE_ADDRESS;
    //     address += "1/meals";
    //     console.log(address);
    //     fetch(address, {
    //         method: 'GET',
    //     })
    //         .then((response) => response.json())
    //         .then((responseJson) => {
    //             console.log(responseJson);
    //             let menuList=[];
    //             for(var i=0;i<responseJson.length;i++){

    //                 menuList.push({
    //                     id: responseJson[i].id,
    //                     type: responseJson[i].type,
    //                     expanded: true,
    //                     items: responseJson[i].items
    //                 });
    //             }
    //             setTimeout(()=>{
    //                 this.setState({
    //                     menuList: menuList,
    //                     isUpdating: false,
    //                 });
    //             },0)
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }

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

    _onToggleSwitch = (i, j) => {
        this.setState(state => {
            const list = state.menuList.map(item => {
                if (i === item.id) {
                    const foodList = item.items.map(food => {
                        if (j === food.id) {
                            if (food.checked == true) {
                                food.checked = 0;
                                var address = serverInfo.SERVICE_ADDRESS;
                                address += (this.state.storeID + "/meals/" + j + "/mealSoldOut");
                                console.log(address);
                                fetch(address, {
                                    method: 'PUT',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + this.state.auth,
                                    },
                                    body: JSON.stringify({
                                        mealSoldOut: false
                                    })
                                })
                                    .then((response) => {
                                        if (response.ok) {

                                            console.log(food.checked);
                                        }
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            }
                            else {
                                food.checked = 1;
                                var address = serverInfo.SERVICE_ADDRESS;
                                address += (this.state.storeID + "/meals/" + j + "/mealSoldOut");
                                console.log(address);
                                fetch(address, {
                                    method: 'PUT',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + this.state.auth,
                                    },
                                    body: JSON.stringify({
                                        mealSoldOut: true
                                    })
                                })
                                    .then((response) => {
                                        if (response.ok) {

                                        }
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            }
                        }
                        return food;
                    })
                }
                return item;
            });
            return { list };
        });
    };

    _itemNameStyle = (opt) => {
        if (opt == false) {
            return {
                textAlignVertical: "center",
                // fontSize: 20
            }
        }
        else {
            return {
                textAlignVertical: "center",
                // fontSize: 20,
                color: "#d6d6d6"
            }
        }
    };

    _itemPriceStyle = (opt) => {
        if (opt == false) {
            return {
                justifyContent: "flex-end",
                textAlignVertical: "center",
                textAlign: "right",
                paddingRight: 20,
                // fontSize: 20
            }
        }
        else {
            return {
                justifyContent: "flex-end",
                textAlignVertical: "center",
                textAlign: "right",
                paddingRight: 20,
                // fontSize: 20,
                color: "#d6d6d6"
            }
        }
    };

    _handleFoodPress = (item, food) => {
        var OPTIONS = [
            { text: "移動到...", icon: "md-move" },
            { text: "編輯", icon: "edit", iconType: "MaterialIcons" },
            { text: "刪除餐點", icon: "md-trash", iconColor: "#fa213b" },
            { text: "取消", icon: "close" }
        ];
        var CANCEL = 3;
        var DESTRUCTIVE = 2;

        const typeList = [];
        const tlist = this.state.menuList.map(item => {
            typeList.push({ value: item.type });
        });


        ActionSheet.show(
            {
                options: OPTIONS,
                cancelButtonIndex: CANCEL,
                destructiveButtonIndex: DESTRUCTIVE,
                title: "請選擇要進行的動作"
            },
            buttonIndex => {
                console.log(buttonIndex);
                if (buttonIndex == 0) {
                    this._movetoPress(food.id);
                }
                else if (buttonIndex == 1) {
                    console.log(food);
                    Actions.editFood({ 'mealID': food.id, "typeList": typeList, 'auth': this.state.auth, 'storeID': this.state.storeID });
                }
                else if (buttonIndex == 2) {
                    this._deletePress(item, food);
                }
            }

        )
    };

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
    }

    _movetoPress = (foodID) => {
        const OPTIONS = [];
        let idList = [];
        const typeList = this.state.menuList.map(item => {
            OPTIONS.push(item.type);
            idList.push(item.id);
        });
        OPTIONS.push("取消");
        console.log(OPTIONS);
        BottomSheet.showBottomSheetWithOptions({
            options: OPTIONS,
            title: "請選擇要移動到的類別",
            cancelButtonIndex: OPTIONS.length - 1,
        }, (value) => {
            if (value != (OPTIONS.length - 1)) {
                var address = serverInfo.SERVICE_ADDRESS;
                address += (this.state.storeID + "/meals/" + foodID + "/menuType");
                console.log(address);
                fetch(address, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.state.auth,
                    },
                    body: JSON.stringify({
                        menuTypeID: idList[value]
                    })
                })
                    .then((response) => {
                        if (response.ok) {
                            Toast.show({
                                text: "已移動至" + OPTIONS[value],
                                type: "success"
                            });
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                    .finally(() => {
                        setTimeout(() => {
                            this.setState({
                                isNeedUpdate: true
                            })
                        }, 0)
                    });
                console.log("mealID:" + foodID + ",id:" + idList[value] + ",name:" + OPTIONS[value]);
            }
        });
    };

    renderItemGroup = (item, food) => {
        if (!this.state.isUpdating) {
            console.log(food.checked);
            var checked = true;
            if (food.checked == 0) checked = false;
            return (
                <View style={styles.menuItem}>

                    < View style={styles.itemNameGroup} >
                        <Switch value={!checked} onValueChange={() => this._onToggleSwitch(item.id, food.id)} />
                        <Text style={this._itemNameStyle(food.checked)}> {food.name} {food.checked == true ? "(未上架)" : ""}</Text>
                    </View >

                    <Text style={this._itemPriceStyle(food.checked)}>${food.price}</Text>

                </View>

            )
        }
    };

    updateData() {
        if (this.state.isNeedUpdate && !this.state.isUpdating) {
            setTimeout(() => {
                this.setState({
                    isUpdating: true
                });
            })
            var address = serverInfo.SERVICE_ADDRESS;
            let menuList = [];
            address += (this.state.storeID + "/meals");
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
                    if(responseJson.isStoreOpen){
                        status = true;
                    }
                    setTimeout(() => {
                        this.setState({
                            isStoreOpen: status
                        });
                    }, 0)
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
                    },0);
                });
        }
    }

    handleStoreOpen = () => {
        var status = this.state.isStoreOpen;
        status = !status;
        setTimeout(()=>{this.setState({ isStoreOpen: status, isLoading: true })},0);
        var address = serverInfo.SERVICE_ADDRESS;
        address += (this.state.storeID + "/storeStatus");
        console.log(address);
        console.log("status:"+this.state.isStoreOpen);
        fetch(address, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.auth,
            },
            body: JSON.stringify({
                isOpen: status
            })
        })
            .then((response) => {
                console.log(response);
                if (response.ok) {
                    setTimeout(() => { this.setState({ isUpdating: false }) }, 0);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(()=>{
                this.setState({isNeedUpdate: true});
            });
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Root style={{ flex: 1 }}>
                    {this.updateData()}
                    <View style={styles.title}>
                        <Text style={styles.titleText}>菜單列表</Text>
                        <IconButton icon="tune" color={Colors.black} size={30} onPress={() => Actions.editMenu()} />
                    </View>
                    {(this.state.isLoggedIn) ?
                        <>
                            <Divider />
                            <TouchableRipple onPress={() => this.handleStoreOpen()}>
                                {/* <Switch value={this.state.isStoreOpen} onValueChange={() => this.handleStoreOpen()} /> */}
                                <View style={styles.nameAndPrice}>
                                    <Text style={{ alignSelf: "center", fontSize:20 }}>開店狀態</Text>
                                    <Switch style={{ alignSelf: "center" }} value={this.state.isStoreOpen} onValueChange={() => this.handleStoreOpen()} />
                                </View>
                            </TouchableRipple>
                            <Divider />
                        </>
                        :
                        null
                    }
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        refreshControl={
                            <RefreshControl refreshing={this.state.isUpdating} onRefresh={() => { this.setState({ isNeedUpdate: true }) }} enabled={true} />
                        }
                    >

                        <List.Section>


                            {this.state.menuList.map(item => (
                                <List.Accordion
                                    title={item.type}
                                    titleStyle={styles.typeText}
                                    left={props => <List.Icon {...props} icon="folder" />}
                                    expanded={item.expanded}
                                    onPress={() =>
                                        this._handlePress(item.id)}
                                >
                                    {item.items.map(food => (
                                        <TouchableOpacity onPress={() => { this._handleFoodPress(item, food) }}>


                                            <View>
                                                {this.renderItemGroup(item, food)}
                                                <View style={styles.menuItem}>

                                                    {/* <View style={styles.itemNameGroup}>
                                                    <Switch value={food.checked} onValueChange={() => this._onToggleSwitch(item.id, food.id)} />
                                                    <Text style={this._itemNameStyle(food.checked)}> {food.name} {food.checked === false ? "(未上架)" : ""}</Text>
                                                </View> */}

                                                    {/* <Text style={this._itemPriceStyle(food.checked)}>${food.price}</Text> */}

                                                </View>
                                                <Divider />
                                            </View>
                                        </TouchableOpacity>

                                    ))}

                                </List.Accordion>
                            ))}
                        </List.Section>
                    </ScrollView>
                </Root>
            </SafeAreaView>
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
        fontSize: 20
    },

    itemNameGroup: {
        height: 40,
        flexDirection: "row",
        alignContent: "center",
        textAlignVertical: "center",
        // fontSize: 20,
        justifyContent: "flex-start"
    },

    itemPrice: {
        justifyContent: "flex-end",
        textAlignVertical: "center",
        textAlign: "right",
        paddingRight: 20,
        fontSize: 20
    },

    titleText: {
        fontSize: 30,
        paddingLeft: 10,
        paddingTop: 10
    },

    typeText: {
        fontSize: 15
    },

    nameAndPrice: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginVertical: 5,
    },
});