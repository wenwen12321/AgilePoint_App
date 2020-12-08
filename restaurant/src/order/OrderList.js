import React from 'react';

import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Dimensions,
    BackHandler,
    Alert
} from 'react-native';

import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Actions } from 'react-native-router-flux';

import CurrentOrderList from './CurrentOrderList';
import HistoryOrderList from './HistoryOrderList';
import serverInfo from '../ServerInfo';
import PushNotification from 'react-native-push-notification';

export default class OrderList extends React.Component {

    /*componentDidMount() {

        var address = serverInfo.SERVICE_ADDRESS;
        address += "store/1/currentOrders";
        console.log(address);
        fetch(address, {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    orderList: responseJson
                });
                //console.log(this.state.orderList);
            })
            .catch((error) => {
                console.log(error);
            });

        address = serverInfo.SERVICE_ADDRESS;
        address += "store/1/historyOrders";
        console.log(address);
        fetch(address, {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    historyOrderList: responseJson
                });
                //console.log(this.state.historyOrderList);
            })
            .catch((error) => {
                console.log(error);
            });
    }*/

    constructor(props) {
        super(props);

        this.state = {
            orderList: [
                // {
                //     id: "#AB0001",
                //     status: 0,
                //     //orderDate: new Date(),
                //     orderItems: [
                //         {
                //             id: 0,
                //             name: "牛肉麵",
                //             memo: "不蔥小辣",
                //             quantity: 1,
                //             mealPrice: 95
                //         },
                //         {
                //             id: 4,
                //             name: "牛肉麵",
                //             memo: "不蔥小辣",
                //             quantity: 1,
                //             mealPrice: 95,
                //         }
                //     ],
                //     orderPrice: 475,
                // },
                // {
                //     id: "#AB0002",
                //     status: 1,
                //     //orderDate: new Date(),
                //     orderItems: [
                //         {
                //             id: 1,
                //             name: "牛肉麵",
                //             memo: "不蔥小辣",
                //             quantity: 1,
                //             mealPrice: 95,
                //         }
                //     ],
                //     orderPrice: 95,
                // },
                // {
                //     id: "#AB0003",
                //     status: 2,
                //     //orderDate: new Date(),
                //     orderItems: [
                //         {
                //             id: 2,
                //             name: "牛肉麵",
                //             memo: "不蔥小辣",
                //             quantity: 1,
                //             mealPrice: 95,
                //         }
                //     ],
                //     orderPrice: 95,
                // }
            ],

            historyOrderList: [
                // {
                //     id: "#AB0004",
                //     orderDate: new Date(2020, 4, 20),
                //     orderItems: [
                //         {
                //             id: 0,
                //             name: "牛肉麵",
                //             memo: "不蔥小辣",
                //             quantity: 1,
                //             mealPrice: 95
                //         },
                //         {
                //             id: 4,
                //             name: "牛肉麵",
                //             memo: "不蔥小辣",
                //             quantity: 1,
                //             mealPrice: 95,
                //         }
                //     ],
                //     orderPrice: 475,
                // },
            ]
        }
    }

    // componentDidMount() {
    //     BackHandler.addEventListener('hardwareBackPress', this.backPressed());
    // }

    // componentWillUnmount() {
    //     BackHandler.removeEventListener('hardwareBackPress',this.backPressed());
    // }

    // backPressed = () => {
    //     Alert.alert(
    //         'Exit App',
    //         'Do you want to exit?',
    //         [
    //             { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
    //             { text: 'Yes', onPress: () => BackHandler.exitApp() },
    //         ],
    //         { cancelable: false });
    //     return true;
    // }

    componentDidMount(){
        PushNotification.createChannel(
            {
              channelId: "4654", // (required)
              channelName: "My channel", // (required)
              channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
              soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
              importance: 4, // (optional) default: 4. Int value of the Android notification importance
              vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
            },
            (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
          );
    }

    render() {
        console.log("render~~");

        return (
            <OrderListTab
                setStatus={this.setStatus}
                deleteOrder={this.deleteOrder}
            />
        )
    }
}

function OrderListTab(props) {

    const [index, setIndex] = React.useState(0);

    const [routes] = React.useState([
        { key: 'current', title: '目前訂單' },
        { key: 'history', title: '歷史訂單' },
    ]);

    const renderScene = ({ route }) => {

        switch (route.key) {
            case 'history':
                return <HistoryOrderList />;
            case 'current':
                return <CurrentOrderList
                    setStatus={props.setStatus}
                    deleteOrder={props.deleteOrder}
                />;
            default:
                return null;
        }
    };

    const renderTabBar = props => (
        <TabBar
            {...props}
            renderLabel={({ route, focused, color }) => (
                <Text style={{ color: 'black', margin: 4 }}>
                    {route.title}
                </Text>
            )}
            indicatorStyle={{ backgroundColor: 'black' }}
            style={{ backgroundColor: 'white' }}
        />
    );

    const initialLayout = { width: Dimensions.get('window').width };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TabView
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
            />
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    tab: {
        backgroundColor: '#FFFFFF',
    },

    order: {
        paddingTop: 10,
    },
});
