import React from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    RefreshControl,
    SafeAreaView, Dimensions
} from 'react-native';
import { Divider, IconButton } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import { ActionSheet } from 'native-base';
import serverInfo from './ServerInfo';

function MenuItem(props) {
    const windowWidth = Dimensions.get("window").width;
    return (
        <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", margin: 5 }} onPress={() => { Actions.mealDetail({ mealID: props.mealID, storeID: props.storeID }) }}>
            <View style={{ justifyContent: "space-between" }}>
                <View style={{width:windowWidth-170}}>
                    <Text style={styles.font}>{props.mealName}</Text>
                    <Text style={{ fontSize: 16, color: "#898989" }}>{props.description}</Text>
                </View>
                <Text style={{ fontSize: 18, marginVertical: 5 }}>${props.mealPrice}</Text>
            </View>

            <View style={{alignSelf:"center"}}>
                <Image source={{ uri: serverInfo.STORAGE_ADDRESS + props.img }} resizeMode="cover" style={{ width: 120, height: 70}} />
            </View>

        </TouchableOpacity>
    )
}

function MenuList(props) {

    var display = [];

    for (let i = 0; i < props.mealList.length; i++) {
        display.push(props.mealList[i]);
    }

    /*const goDetail = (props) => {
          Actions.orderDetail(props);
      };*/

    return (

        // <TouchableOpacity onPress={() => Actions.mealDetail({})}>
        <View>
            <View style={{ marginVertical: 10 }}>
                <Text style={styles.titleText}>{props.mealtype}</Text>
                {/* <Text>{props.orderDate}</Text> */}
            </View>

            {/* <TouchableOpacity onPress={()=> Actions.mealDetail({'imageUri': this.state.img, 'foodPrice': this.state.mealPrice})}> */}
            {display.map(item => (
                <>
                    <MenuItem
                        mealName={item.mealName}
                        mealID={item.mealID}
                        mealPrice={item.mealPrice}
                        img={item.img}
                        description={item.mealDescription}
                        storeID={props.storeID}
                    />
                    <View style={styles.divider, { paddingHorizontal: 10 }}>
                        <Divider />
                    </View>
                </>
            ))}
            {/* </TouchableOpacity> */}
            <View style={styles.divider, { marginHorizontal: -10 }}>
                <Divider style={{ height: 10, backgroundColor: "#f7f7f7" }} />
            </View>
        </View>
        // </TouchableOpacity>
    )
}

export default class RestaurantPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            storeID: props.storeID,
            stroeName: "",
            menu: [
                // {
                //     mealtype: "冰品",
                //     mealList: [
                //         {
                //             mealName: "招牌粉圓愛玉檸檬冰",
                //             mealPrice: 48,
                //             img: <Image source={require('../img/soybean_pudding.jpg')} style={{ width: 120, height: 70 }} />,
                //         },
                //         {
                //             mealName: "招牌粉圓綠豆冰",
                //             mealPrice: 48,
                //             img: <Image source={require('../img/soybean_pudding.jpg')} style={{ width: 120, height: 70 }} />,
                //         },
                //         {
                //             mealName: "招牌黑砂糖冰",
                //             mealPrice: 48,
                //             img: <Image source={require('../img/soybean_pudding.jpg')} style={{ width: 120, height: 70 }} />,
                //         },
                //     ],
                // },
                // {
                //     mealtype: "豆花",
                //     mealList: [
                //         {
                //             mealName: "芋頭豆花",
                //             mealPrice: 60,
                //             img: <Image source={require('../img/soybean_pudding.jpg')} style={{ width: 120, height: 70 }} />,
                //         },
                //         {
                //             mealName: "粉圓豆花",
                //             mealPrice: 48,
                //             img: <Image source={require('../img/soybean_pudding.jpg')} style={{ width: 120, height: 70 }} />,
                //         },
                //         {
                //             mealName: "花生豆花",
                //             mealPrice: 48,
                //             img: <Image source={require('../img/soybean_pudding.jpg')} style={{ width: 120, height: 70 }} />,
                //         },
                //     ],
                // },
                // {
                //     mealtype: "飲料",
                //     mealList: [
                //         {
                //             mealName: "古早味紅茶",
                //             mealPrice: 24,
                //             img: <Image source={require('../img/bubble_milk_tea.jpg')} style={{ width: 120, height: 70 }} />,
                //         },
                //         {
                //             mealName: "茉莉綠茶",
                //             mealPrice: 24,
                //             img: <Image source={require('../img/bubble_milk_tea.jpg')} style={{ width: 120, height: 70 }} />,
                //         },
                //         {
                //             mealName: "珍珠奶茶",
                //             mealPrice: 48,
                //             img: <Image source={require('../img/bubble_milk_tea.jpg')} style={{ width: 120, height: 70 }} />,
                //         },
                //     ],
                // },

            ],
            isUpdating: false,

        };
    }

    componentDidMount() {

        setTimeout(() => { this.setState({ isUpdating: true }) }, 0);

        var address = serverInfo.SERVICE_ADDRESS;
        address += ("customer/" + this.state.storeID + "/meals");
        console.log(address);
        fetch(address, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({
                    storeID: responseJson.storeID,
                    storeName: responseJson.storeName,
                    menu: responseJson.menu,
                })
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setTimeout(() => { this.setState({ isUpdating: false }) }, 0);
            });
    }

    updateData = () => {
        setTimeout(() => { this.setState({ isUpdating: true }) }, 0);

        var address = serverInfo.SERVICE_ADDRESS;
        address += ("customer/" + this.state.storeID + "/meals");
        console.log(address);
        fetch(address, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({
                    storeID: responseJson.storeID,
                    storeName: responseJson.storeName,
                    menu: responseJson.menu,
                })
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setTimeout(() => { this.setState({ isUpdating: false }) }, 0);
            });
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={this.state.isUpdating} onRefresh={() => { this.updateData() }} />
                    }
                >
                    <View style={{ flexDirection: "row", backgroundColor: '#FA5858', justifyContent: "space-between" }}>
                        <IconButton icon="arrow-left" size={30} color="#676767" onPress={() => { Actions.pop() }} />
                        <Text style={styles.stroe}>{this.state.storeName}</Text>
                        <Text style={styles.stroe, { color: "#FA5858" }}>{this.state.storeName}</Text>
                    </View>
                    <View style={{ paddingHorizontal: 10 }} >

                        {this.state.menu.map(item => (
                            <MenuList
                                id={item.id}
                                mealtype={item.mealType}
                                mealName={item.mealName}
                                mealPrice={item.mealPrice}
                                img={item.img}
                                mealList={item.mealList}
                                mealID={item.mealID}
                                storeID={this.state.storeID}
                            />
                        ))}
                    </View>

                </ScrollView>

            </SafeAreaView>

        )
    }
};

const styles = StyleSheet.create({
    stroe: {
        fontSize: 30,
        textAlign: "center",
        backgroundColor: '#FA5858',
        marginTop: 7,
        marginBottom: 10,
    },
    titleText: {
        fontSize: 30,
    },
    cardView: {
        flexDirection: 'column',
        borderColor: 'black',
        borderWidth: 2,
        padding: 3,
        margin: 5,
    },
    order: {
        top: 10,
    },

    cardView: {
        flexDirection: 'column',
        borderWidth: 2,
        borderColor: '#17202A',
        padding: 3,
        margin: 5,
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
    },

    storeName: {
        fontSize: 25,
        fontWeight: 'bold',
        color: "#57585F"

    },

    divider: {
        height: 10,
        // padding: 10,
        justifyContent: "center",
    },

});