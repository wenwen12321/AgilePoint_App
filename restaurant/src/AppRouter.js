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

import { Router, Scene, Actions, ActionConst } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import OrderDetail from './orderDetail/OrderDetail.js';
import OrderList from './order/OrderList.js';
import BottomBar from './bottomBar/BottomBar';
import MenuList from './menu/MenuList';
import EditMenu from './menu/EditMenu';
import EditFood from './menu/EditFood';
import AddFood from './menu/AddFood';
import AccountSetting from './account/AccountSetting';
import Login from './login/Login';
import Register from './login/Register';
import ForgetPassword from './login/ForgetPassword';
import RegisterSuccess from './login/RegisterSuccess';
import Analytics from './analytics/Analytics';
import DayRevenue from './analytics/DayRevenue';
import MonthRevenue from './analytics/MonthRevenue';
import ChangePassword from './account/ChangePassword';
import AddManager from './account/AddManager';
import changeStoreInfo from './account/changeStoreInfo';
import AccountManagement from './account/AccountManagement';

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

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         status: null,
    //     }
    // }

    // showBottomBar = () => {
    //     this.getStorage().done();
    //     console.log(this.state.status);
    //     if (this.state.status === "main") {
    //         return (
    //             <View style={styles.footer}>
    //                 <BottomBar />
    //             </View>
    //         );
    //     }
    // }

    // componentDidMount() {
    //     this.getStorage().done();
    // }

    // getStorage = async () => {
    //     try {
    //         const value = await AsyncStorage.getItem('initialPage');
    //         console.log(value);
    //         if (value !== null) {
    //             this.setState({
    //                 status: value
    //             });
    //         }
    //     }
    //     catch (error) {
    //         console.log(error);
    //     }
    // }

    resetScene = (props) => {
        // console.log(props.navigation.reset);
        const routeName = props.navigation.state.key;
        if (routeName === "orderPage") {
            Actions.reset('orderList');
        }
        else if (routeName === "menuPage") {
            Actions.reset('menuList');
        }
        else if (routeName === "analyticsPage") {
            Actions.reset('analytics');
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
            // <View style={styles.container}>
            <Router>
                <Scene key='root'>
                    <Scene tabBarOnPress={(props) => { this.resetScene(props) }} key='tabbar' tabs={true} tabBarStyle={styles.tabBar} showLabel={false} hideNavBar={true} >
                        <Scene key='orderPage' titleName="訂單" icon={TabIcon} showLabel={false} iconName="reorder" hideNavBar={true} >
                            <Scene key='orderList' component={OrderList} hideNavBar={true} initial={true} />
                            <Scene key='detail' component={OrderDetail} hideNavBar={true} />
                        </Scene>
                        <Scene key='menuPage' titleName="菜單" icon={TabIcon} iconName="restaurant" hideNavBar={true} >
                            <Scene key='menuList' component={MenuList} hideNavBar={true} initial={true} />
                            <Scene key='editMenu' component={EditMenu} hideNavBar={true} />
                            <Scene key='editFood' component={EditFood} hideNavBar={true} />
                            <Scene key='addFood' component={AddFood} hideNavBar={true} />
                        </Scene>
                        <Scene key='analyticsPage' titleName="分析" icon={TabIcon} iconName="show-chart" hideNavBar={true} >
                            <Scene key='analytics' component={Analytics} hideNavBar={true} initial={true} />
                            <Scene key='dayRevenue' component={DayRevenue} hideNavBar={true} />
                            <Scene key='monthRevenue' component={MonthRevenue} hideNavBar={true} />
                        </Scene>
                        <Scene key='accountPage' titleName="帳戶" icon={TabIcon} iconName="person" hideNavBar={true} >
                            <Scene key='accountSetting' component={AccountSetting} hideNavBar={true} initial={true} />
                            <Scene key='login' component={Login} hideNavBar={true} />
                            <Scene key='register' component={Register} hideNavBar={true} />
                            <Scene key='forgetPassword' component={ForgetPassword} hideNavBar={true} />
                            <Scene key='registerSuccess' component={RegisterSuccess} hideNavBar={true} />
                            <Scene key='changePassword' component={ChangePassword} hideNavBar={true} />
                            <Scene key='addManager' component={AddManager} hideNavBar={true} />
                            <Scene key='changeStoreInfo' component={changeStoreInfo} hideNavBar={true} />
                            <Scene key='accountManagement' component={AccountManagement} hideNavBar={true} />
                        </Scene>
                    </Scene>
                </Scene>
            </Router>
            // </View>
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
        justifyContent: 'space-between',
    }
});