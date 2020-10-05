
import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
    AppRegistry,
    AsyncStorage,
    RefreshControl,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

import { Container, Header, Content, Tab, Tabs, ScrollableTab } from 'native-base';
import serverInfo from '../ServerInfo';
import { TextInput, Button } from 'react-native-paper';
import { Table, Row, Rows } from 'react-native-table-component';
import CardView from 'react-native-cardview';
import { LineChart } from 'react-native-chart-kit';
import { Rect, Text as TextSVG, Svg } from 'react-native-svg';
import LineCharts from './LineChart';

export default class MonthRevenue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // isNeedUpdate: false,
            // isUpadting: false,
            // isLoggedIn: null,
            // auth: null,
            // userID: null,
            monthRevenue: props.monthRevenue,
            // storeID: null,
            historyDayHeader: ["日期", "營業額"],
            historyDayRevenue: props.historyDayRevenue,
            historyDayRevenueForTable: [],
        }
    }

    screenWidth = Dimensions.get("window").width;

    componentDidMount() {
        var arr = [];
        for (var i = 0; i < this.state.historyDayRevenue.date.length; i++) {
            arr.push([this.state.historyDayRevenue.date[i], (this.state.historyDayRevenue.revenue[i] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')]);
        }
        this.setState({
            historyDayRevenueForTable: arr
        });
    }

    // componentDidMount() {
    //     this.getLoginSatus();
    // }

    // getLoginSatus = async () => {
    //     try {
    //         const loginStatus = await AsyncStorage.getItem("@User:loginStatus");
    //         console.log(loginStatus);
    //         if (loginStatus !== null) {
    //             const auth = await AsyncStorage.getItem("@User:authorization");
    //             const userID = await AsyncStorage.getItem("@User:userID");
    //             const storeID = await AsyncStorage.getItem("@User:storeID");
    //             console.log(userID);
    //             // console.log(auth);
    //             console.log("not null");
    //             setTimeout(() => {
    //                 this.setState({
    //                     isLoggedIn: true,
    //                     auth: auth,
    //                     userID: userID,
    //                     storeID: storeID,
    //                     isNeedUpdate: true,
    //                     isUpdating: false,
    //                 });
    //             }, 0);
    //         }
    //     }
    //     catch (error) {
    //         console.log(error);
    //     }
    // }

    // updateData = () => {
    //     if (this.state.isLoggedIn && this.state.isNeedUpdate && (!this.state.isUpadting)) {
    //         setTimeout(() => { this.setState({ isUpadting: true }) }, 0);
    //         var address = serverInfo.SERVICE_ADDRESS;
    //         address += (this.state.storeID + "/analytics");
    //         console.log(address);
    //         fetch(address, {
    //             method: 'GET',
    //             headers: {
    //                 "Authorization": ("Basic " + this.state.auth)
    //             }
    //         })
    //             .then((response) => response.json())
    //             .then((responseJson) => {
    //                 console.log(responseJson);
    //                 for (var i = 0; i < responseJson.mealRanking.length; i++) {
    //                     responseJson.mealRanking[i][2] = (responseJson.mealRanking[i][2] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');;
    //                     responseJson.mealRanking[i][3] = "$" + (responseJson.mealRanking[i][3] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');;
    //                 }
    //                 responseJson.dayRevenue = (responseJson.dayRevenue || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    //                 responseJson.monthRevenue = (responseJson.monthRevenue || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    //                 this.setState({
    //                     dayRevenue: responseJson.dayRevenue,
    //                     monthRevenue: responseJson.monthRevenue,
    //                     mealRanking: responseJson.mealRanking,
    //                     isUpadting: false,
    //                     isNeedUpdate: false,
    //                 });
    //             })
    //             .catch((error) => {
    //                 console.log(error);
    //             });
    //     }
    // }

    render() {
        // let [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0 })

        return (
            <SafeAreaView style={{flex:1}}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
            // refreshControl={
            //     <RefreshControl refreshing={this.state.isUpadting} onRefresh={() => { setTimeout(() => { this.setState({ isNeedUpdate: true }) }, 0) }} />
            // }
            >
                {/* {this.updateData()} */}
                <Text style={styles.titleText}>分析報表</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={styles.revenue}>
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={5}
                        >
                                <View style={styles.revenueText}>
                                    <Text style={{ fontSize: 20 }}>本月營業額</Text>
                                    <Text style={{ fontSize: 25 }} >{"$" + this.state.monthRevenue}</Text>
                                </View>
                        </CardView>
                    </View>
                </View>
                <View style={{ marginVertical: 10, margin: 5 }}>
                    <CardView
                        cardElevation={3}
                        cardMaxElevation={3}
                        cornerRadius={5}
                    >
                        <Text style={{ margin: 10, fontSize: 20 }}>過去30天日營業額</Text>
                        <View>
                            <LineCharts
                                fromZero
                                label={this.state.historyDayRevenue.date}
                                data={this.state.historyDayRevenue.revenue}
                                rotation={45}
                                width={this.screenWidth - 20}
                            />
                        </View>
                        <View style={{ margin: 10 }}>
                            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                                <Row data={this.state.historyDayHeader} style={styles.head} textStyle={styles.text} />
                                <Rows data={this.state.historyDayRevenueForTable} textStyle={styles.text} />
                            </Table>
                        </View>
                    </CardView>
                </View>
            </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    head: {
        height: 40,
        backgroundColor: '#f1f8ff',
    },
    text: {
        margin: 6
    },
    titleText: {
        fontSize: 30,
        paddingLeft: 5,
        paddingTop: 10
    },

    revenue: {
        // borderWidth: 3,
        // borderRadius: 5,
        flexGrow: 1,
        margin: 5,
        marginVertical: 10,
        // backgroundColor: 'transparent',
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.23,
        // shadowRadius: 2.62,

        // elevation: 2,
    },

    revenueText: {
        margin: 10,
        paddingLeft: 5,
    }
})