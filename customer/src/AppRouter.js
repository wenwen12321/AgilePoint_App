import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
    AsyncStorage,
    ActivityIndicator,
} from 'react-native';

import { Router, Scene, Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import BottomBar from './bottomBar/BottomBar';
import Main from './main.js'
import MealDetail from './MealDetail';
import OrderList from './OrderList.js';
import HistoryOrderList from './HistoryOrderList.js';
import CurrentOrderList from './CurrentOrderList.js';
import OrderDetail from './OrderDetail.js';
import Cart from './cart/Cart';
import OrderComplete from './cart/OrderComplete';
import SelectFoodCourt from './selectFoodCourt.js';
import AccountSetting from './accountSetting/AccountSetting.js';
import Home from './login/Home';
import Login from './login/Login';
import Register from './login/Register';
import ForgetPassword from './login/ForgetPassword';
import RestaurantPage from './RestaurantPage';
import SearchPage from './component/SearchPage';
import RegisterSuccess from './login/RegisterSuccess';
import ChangePassword from './accountSetting/ChangePassword';
import Main2 from './main2';
import AccountManagement from './accountSetting/AccountManagement';
import TodaySpecial from './TodaySpecial';

class TabIcon extends React.Component {
    render() {
        var color = this.props.focused ? '#2194f3' : '#757575';

        return (
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', alignSelf: 'center', justifyContent: 'center' }}>
                <Icon style={{ color: color }} name={this.props.iconName || "circle"} size={22} />
                <Text style={{ color: color }}>{this.props.titleName}</Text>
            </View>
        );
    }
}

export default class AppRouter extends React.Component {

    resetScene = (props) => {
        // console.log(props.navigation.reset);
        const routeName = props.navigation.state.key;
        if (routeName === "mainPage") {
            Actions.reset('main2');
        }
        else if (routeName === "ssearchPage") {
            Actions.reset('searchPage');
        }
        else if (routeName === "orderPage") {
            Actions.reset('orderList');
        }
        else if (routeName === "cartPage") {
            Actions.reset('cart');
        }
        else {
            Actions.reset('accountSetting');
        }
        // props.navigation.reset(routeName);
        // var s = scene.navigation.state.routeName;
        // ({ scene, jumpToIndex }) => { jumpToIndex(scene.index); }
    }

    render() {
        return (
            <View style={styles.container}>
                <Router>
                    <Scene key='root'>
                        <Scene tabBarOnPress={(props) => { this.resetScene(props) }} key='tabbar' tabs={true} tabBarStyle={styles.tabBar} showLabel={false} hideNavBar={true} >
                            <Scene key='mainPage' titleName="首頁" icon={TabIcon} iconName="home" hideNavBar={true} >
                                <Scene key='main' component={Main} hideNavBar={true}/>
                                <Scene key='main2' component={Main2} hideNavBar={true} initial={true} />
                                <Scene key='restaurantPage' component={RestaurantPage} hideNavBar={true} />
                                <Scene key='mealDetail' component={MealDetail} hideNavBar={true} />
                                <Scene key='todaySpecial' component={TodaySpecial} hideNavBar={true} />
                            </Scene>
                            <Scene key='ssearchPage' titleName="搜尋" icon={TabIcon} iconName="search" hideNavBar={true} >
                                <Scene key='searchPage' component={SearchPage} hideNavBar={true} initial={true} />
                            </Scene>
                            <Scene key='orderPage' titleName="訂單" icon={TabIcon} iconName="reorder" hideNavBar={true} >
                                <Scene key='orderList' component={OrderList} hideNavBar={true} initial={true} />
                                <Scene key='historyOrderList' component={HistoryOrderList} hideNavBar={true} />
                                <Scene key='currentOrderList' component={CurrentOrderList} hideNavBar={true} />
                                <Scene key='orderDetail' component={OrderDetail} hideNavBar={true} />
                            </Scene>
                            <Scene key='cartPage' titleName="購物車" icon={TabIcon} iconName="shopping-cart" hideNavBar={true} >
                                <Scene key='cart' component={Cart} hideNavBar={true} initial={true} />
                                <Scene key='orderComplete' component={OrderComplete} hideNavBar={true} />
                            </Scene>
                            <Scene key='accountPage' titleName="帳戶" icon={TabIcon} iconName="person" hideNavBar={true} >
                                <Scene key='accountSetting' component={AccountSetting} hideNavBar={true} initial={true} />
                                <Scene key='home' component={Home} hideNavBar={true} />
                                <Scene key='login' component={Login} hideNavBar={true} />
                                <Scene key='register' component={Register} hideNavBar={true} />
                                <Scene key='forgetPassword' component={ForgetPassword} hideNavBar={true} />
                                <Scene key='registerSuccess' component={RegisterSuccess} hideNavBar={true} />
                                <Scene key='changePassword' component={ChangePassword} hideNavBar={true} />
                                <Scene key='accountManagement' component={AccountManagement} hideNavBar={true} />
                            </Scene>
                        </Scene>
                    </Scene>
                </Router>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    footer: {
        justifyContent: 'center',
        marginBottom: 0,
        alignContent: "flex-end",
    },
    container: {
        flexGrow: 2,
        flexDirection: 'column',
    },
    tabBar: {
        height: 60,
        borderTopColor: 'rgba(0,0,0,0.2)',
        borderTopWidth: 1,
        opacity: 1,
        justifyContent: 'space-between'
    }
});