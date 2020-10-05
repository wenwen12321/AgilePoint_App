import React from 'react';

import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Dimensions,
} from 'react-native';

//import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import {Container, Header, Content, Tab, Tabs, ScrollableTab} from 'native-base';
import { Actions } from 'react-native-router-flux';

import CurrentOrderList from './CurrentOrderList';
import HistoryOrderList from './HistoryOrderList';
import serverInfo from './ServerInfo';

export default class OrderList extends React.Component {

    /*componentDidMount() {

        var address = serverInfo.SERVICE_ADDRESS;
        address += "customer/1/currentOrders";
        console.log(address);
        fetch(address, {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({
                    orderList: responseJson
                });
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
                console.log(responseJson);

                this.setState({
                    historyOrderList: responseJson
                });

            })
            .catch((error) => {
                console.log(error);
            });
    }*/

    constructor(props) {
        super(props);

        this.state = {
            // orderList: [
            //     {
            //         id: "#AB0001",
            //         status: 0,
            //         orderDate: new Date(),
            //         orderItems: [
            //             {
            //                 id: 0,
            //                 name: "牛肉麵",
            //                 memo: "不蔥小辣",
            //                 quantity: 1,
            //                 mealPrice: 95
            //             },
            //             {
            //                 id: 4,
            //                 name: "牛肉麵",
            //                 memo: "不蔥小辣",
            //                 quantity: 1,
            //                 mealPrice: 95,
            //             }
            //         ],
            //         orderPrice: 475,
            //     },
            //     {
            //         id: "#AB0002",
            //         status: 1,
            //         orderDate: new Date(),
            //         orderItems: [
            //             {
            //                 id: 1,
            //                 name: "牛肉麵",
            //                 memo: "不蔥小辣",
            //                 quantity: 1,
            //                 mealPrice: 95,
            //             }
            //         ],
            //         orderPrice: 95,
            //     },
            //     {
            //         id: "#AB0003",
            //         status: 2,
            //         orderDate: new Date(),
            //         orderItems: [
            //             {
            //                 id: 2,
            //                 name: "牛肉麵",
            //                 memo: "不蔥小辣",
            //                 quantity: 1,
            //                 mealPrice: 95,
            //             }
            //         ],
            //         orderPrice: 95,
            //     }
            // ],

            // historyOrderList: [
            //     {
            //         id: "#AB0004",
            //         orderDate: new Date(2020, 4, 20),
            //         orderItems: [
            //             {
            //                 id: 0,
            //                 name: "牛肉麵",
            //                 memo: "不蔥小辣",
            //                 quantity: 1,
            //                 mealPrice: 95
            //             },
            //             {
            //                 id: 4,
            //                 name: "牛肉麵",
            //                 memo: "不蔥小辣",
            //                 quantity: 1,
            //                 mealPrice: 95,
            //             }
            //         ],
            //         orderPrice: 475,
            //     },
            // ]
        }
    }

    /*setStatus = (id) => {



        const newOrderList = this.state.orderList;
        const index = this.state.orderList.findIndex(item => item.id === id);
        newOrderList[index].status++;
        console.log(newOrderList[index].status);
        var address = serverInfo.SERVICE_ADDRESS;
        address += ("store/" + id + "/orders/status");
        console.log(address);
        fetch(address, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Status: newOrderList[index].status
            })
        })
            .catch((error) => {
                console.log(error);
            });

        if (newOrderList[index].status > 2) {
            const newHistoryOrderList = this.state.historyOrderList;
            newHistoryOrderList.push(newOrderList[index]);
            newOrderList.splice(index, 1);

            this.setState(() => {
                return {
                    historyOrderList: newHistoryOrderList
                };
            });
        }

        this.setState(() => {
            return {
                orderList: newOrderList
            };
        });
        Actions.pop();
        Actions.refresh();
    };

    deleteOrder = (id) => {

        var address = serverInfo.SERVICE_ADDRESS;
        address += ("store/"+id + "/orders/delete");
        console.log(address);
        fetch(address, {
            method: 'DELETE'
        })
            .catch((error) => {
                console.log(error);
            });

        const newOrderList = this.state.orderList;
        const index = this.state.orderList.findIndex(item => item.id === id);

        newOrderList.splice(index, 1);

        this.setState(() => {
            return {
                orderList: newOrderList
            };
        });

        Actions.pop();
        Actions.refresh();
    };

    render() {
        return (
            <OrderListTab
                orderList={this.state.orderList}
                historyOrderList={this.state.historyOrderList}
                setStatus={this.setStatus}
                deleteOrder={this.deleteOrder}
            />
        )
    }
}*/

/*function OrderListTab(props) {

    const [index, setIndex] = React.useState(0);

    const [routes] = React.useState([
        { key: 'current', title: '目前訂單' },
        { key: 'history', title: '歷史訂單' },
    ]);

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'history':
                return <HistoryOrderList orderList={props.historyOrderList} />;
            case 'current':
                return <CurrentOrderList
                    orderList={props.orderList}
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
        <TabView
            renderTabBar={renderTabBar}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
        />
    )
}*/

//////////////////////////////////////////////////////////////////
//                      UI from here                            //
//////////////////////////////////////////////////////////////////

render(){
    return(
        <SafeAreaView style={{flex:1}}>
        <Container>
            {/* <Header>
                <Text style={styles.orderListTitle}>我的訂單</Text>
            </Header> */}
            <Tabs tabBarUnderlineStyle={{backgroundColor:"#000"}}>
                <Tab heading="目前訂單" tabStyle={{backgroundColor:"#fff"}} textStyle={{color:"#a7a7a7"}} activeTabStyle={{backgroundColor:"#fff"}} activeTextStyle={{color:"#000"}}>
                    <CurrentOrderList />
                </Tab>
                <Tab heading="歷史訂單" tabStyle={{backgroundColor:"#fff"}} textStyle={{color:"#a7a7a7"}} activeTabStyle={{backgroundColor:"#fff"}} activeTextStyle={{color:"#000"}}>
                    <HistoryOrderList />
                </Tab>
            </Tabs>
        </Container>
        </SafeAreaView>
    )
}
}


const styles = StyleSheet.create({
    tab: {
        backgroundColor: '#FFFFFF',
    },

    order: {
        paddingTop: 10,
    },

    orderListTitle : {
        fontSize: 25,
        color: 'white',
        paddingTop: 10,
    },
});
