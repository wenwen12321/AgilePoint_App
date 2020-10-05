
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
import { Actions } from 'react-native-router-flux';

export default class Analytics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isNeedUpdate: false,
            isUpadting: false,
            isLoggedIn: null,
            auth: null,
            userID: null,
            dayRevenue: "",
            monthRevenue: "",
            mealRanking: [],
            storeID: null,
            mealRankingHeader: ["排名", "品名", "銷售份數", "銷售金額"],
            historyWeekRevenueHeader: ["日期", "營業額"],
            historyHourRevenue: {
                date: [""],
                revenue: [0]
            },
            historyWeekRevenue: {
                date: [""],
                revenue: [0]
            },
            historyDayRevenue: {
                date: [""],
                revenue: [0]
            },
            historyWeekRevenueForTable: [],

        }
    }

    screenWidth = Dimensions.get("window").width;

    chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#fff",
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => 'rgba(0, 0, 0, 1)',
        strokeWidth: 1, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };

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

    updateData = () => {
        if (this.state.isLoggedIn && this.state.isNeedUpdate && (!this.state.isUpadting)) {
            setTimeout(() => { this.setState({ isUpadting: true }) }, 0);
            var address = serverInfo.SERVICE_ADDRESS;
            address += (this.state.storeID + "/analytics");
            console.log(address);
            fetch(address, {
                method: 'GET',
                headers: {
                    "Authorization": ("Basic " + this.state.auth)
                }
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    for (var i = 0; i < responseJson.mealRanking.length; i++) {
                        responseJson.mealRanking[i][2] = (responseJson.mealRanking[i][2] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');;
                        responseJson.mealRanking[i][3] = "$" + (responseJson.mealRanking[i][3] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');;
                    }
                    responseJson.dayRevenue = (responseJson.dayRevenue || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
                    responseJson.monthRevenue = (responseJson.monthRevenue || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
                    this.setState({
                        dayRevenue: responseJson.dayRevenue,
                        monthRevenue: responseJson.monthRevenue,
                        mealRanking: responseJson.mealRanking,
                        historyHourRevenue: responseJson.historyHourRevenue,
                        historyWeekRevenue: responseJson.historyWeekRevenue,
                        historyDayRevenue: responseJson.historyDayRevenue,
                        isUpadting: false,
                        isNeedUpdate: false,
                    });
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    var arr = [];
                    for (var i = 0; i < this.state.historyWeekRevenue.date.length; i++) {
                        arr.push([this.state.historyWeekRevenue.date[i], (this.state.historyWeekRevenue.revenue[i] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')]);
                    }
                    this.setState({
                        historyWeekRevenueForTable: arr
                    });
                });
        }
    }

    render() {
        // let [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0 })

        return (
            <SafeAreaView style={{flex:1}}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl refreshing={this.state.isUpadting} onRefresh={() => { setTimeout(() => { this.setState({ isNeedUpdate: true }) }, 0) }} />
                }
            >
                {this.updateData()}
                <Text style={styles.titleText}>分析報表</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={styles.revenue}>
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={5}
                        >
                            <TouchableOpacity onPress={() => Actions.dayRevenue({ dayRevenue: this.state.dayRevenue, historyHourRevenue: this.state.historyHourRevenue })}>
                                <View style={styles.revenueText}>
                                    <Text style={{ fontSize: 20 }}>今日營業額</Text>
                                    <Text style={{ fontSize: 25 }} >{"$" + this.state.dayRevenue}</Text>
                                    <Text style={{ fontSize: 14, color: "#575757", alignSelf: "flex-end" }} >更多＞</Text>
                                </View>
                            </TouchableOpacity>
                        </CardView>
                    </View>
                    <View style={styles.revenue}>
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={5}
                        >
                            <TouchableOpacity onPress={() => Actions.monthRevenue({ monthRevenue: this.state.monthRevenue, historyDayRevenue: this.state.historyDayRevenue })}>
                                <View style={styles.revenueText}>
                                    <Text style={{ fontSize: 20 }}>本月營業額</Text>
                                    <Text style={{ fontSize: 25 }} >{"$" + this.state.monthRevenue}</Text>
                                    <Text style={{ fontSize: 14, color: "#575757", alignSelf: "flex-end" }} >更多＞</Text>
                                </View>
                            </TouchableOpacity>
                        </CardView>
                    </View>
                </View>
                <View style={{ marginVertical: 10, margin: 5 }}>
                    <CardView
                        cardElevation={3}
                        cardMaxElevation={3}
                        cornerRadius={5}
                    >
                        <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 20, marginBottom: 10 }}>過去一個禮拜日營業額</Text>
                        <View>
                            <LineCharts
                                fromZero
                                label={this.state.historyWeekRevenue.date}
                                data={this.state.historyWeekRevenue.revenue}
                                // rotation={35}
                                fromZero={true}
                                width={this.screenWidth - 20}
                            />
                            {/* <LineChart
                                data={this.state.historyHourRevenue}
                                width={this.screenWidth - 20}
                                chartConfig={this.chartConfig}
                                height={240}
                                verticalLabelRotation={35}
                                withVerticalLines={false}
                                withHorizontalLines
                                fromZero
                                withShadow={false}
                                yAxisLabel="$"
                                decorator={() => {
                                    return tooltipPos.visible ? <View>
                                        <Svg>
                                            <Rect x={tooltipPos.x - 15} 
                                                y={tooltipPos.y + 10} 
                                                width="40" 
                                                height="30"
                                                fill="black" />
                                                <TextSVG
                                                    x={tooltipPos.x + 5}
                                                    y={tooltipPos.y + 30}
                                                    fill="white"
                                                    fontSize="16"
                                                    fontWeight="bold"
                                                    textAnchor="middle">
                                                    {tooltipPos.value}
                                                </TextSVG>
                                        </Svg>
                                    </View> : null
                                }}
                
                                onDataPointClick={(data) => {
                
                                    let isSamePoint = (tooltipPos.x === data.x 
                                                        && tooltipPos.y === data.y)
                
                                    isSamePoint ? setTooltipPos((previousState) => {
                                        return { 
                                                  ...previousState,
                                                  value: data.value,
                                                  visible: !previousState.visible
                                               }
                                    })
                                        : 
                                    setTooltipPos({ x: data.x, value: data.value, y: data.y, visible: true });
                
                                }}
                            /> */}
                        </View>
                        <View style={{ margin: 10 }}>
                            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                                <Row data={this.state.historyWeekRevenueHeader} style={styles.head} textStyle={styles.text} />
                                <Rows data={this.state.historyWeekRevenueForTable} textStyle={styles.text} />
                            </Table>
                        </View>
                    </CardView>
                </View>
                <View style={{ marginVertical: 10, margin: 5 }}>
                    <CardView
                        cardElevation={3}
                        cardMaxElevation={3}
                        cornerRadius={5}
                    >
                        <View style={{ margin: 10 }}>
                            <Text style={{ fontSize: 20, marginBottom: 5 }} >當月銷量排行</Text>
                            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                                <Row data={this.state.mealRankingHeader} style={styles.head} textStyle={styles.text} />
                                <Rows data={this.state.mealRanking} textStyle={styles.text} />
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