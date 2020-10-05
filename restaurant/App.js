import React from 'react';

import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
} from 'react-native';

import { Router, Scene } from 'react-native-router-flux';
import { Provider as PaperProvider } from 'react-native-paper';
import OrderDetail from './src/orderDetail/OrderDetail.js';
import OrderList from './src/order/OrderList.js';
import BottomBar from './src/bottomBar/BottomBar';
import MenuList from './src/menu/MenuList';
import EditMenu from './src/menu/EditMenu';
import EditFood from './src/menu/EditFood';
import AddFood from './src/menu/AddFood';
import AccountSetting from './src/account/AccountSetting';
import Login from './src/login/Login';
import Register from './src/login/Register';
import ForgetPassword from './src/login/ForgetPassword';
import RegisterSuccess from './src/login/RegisterSuccess';
import Analytics from './src/analytics/Analytics';
import AppRouter from './src/AppRouter';

const Routes = (props) => (
    <Router>
        <Scene key='root'>
            <Scene key='orderList' component={OrderList} hideNavBar={true} initial={true} />
            <Scene key='detail' component={OrderDetail} hideNavBar={true} />
            <Scene key='menuList' component={MenuList} hideNavBar={true} />
            <Scene key='editMenu' component={EditMenu} hideNavBar={true} />
            <Scene key='editFood' component={EditFood} hideNavBar={true} />
            <Scene key='addFood' component={AddFood} hideNavBar={true} />
            <Scene key='accountSetting' component={AccountSetting} hideNavBar={true} />
            <Scene key='login' component={Login} hideNavBar={true} />
            <Scene key='register' component={Register} hideNavBar={true} />
            <Scene key='forgetPassword' component={ForgetPassword} hideNavBar={true} />
            <Scene key='registerSuccess' component={RegisterSuccess} hideNavBar={true} />
            <Scene key='analytics' component={Analytics} hideNavBar={true} />
        </Scene>
    </Router>
)

export default class App extends React.Component {
    constructor(props) {
        super(props);

    };

    render() {
        return (
            <PaperProvider>
                <View style={styles.container}>
                    <AppRouter />
                    {/* <Routes />
                    <View style={styles.footer}>
                        <BottomBar />
                    </View> */}
                </View>
            </PaperProvider>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 2,
        flexDirection: 'column',
    },
    footer: {
        justifyContent: 'flex-end',
        marginBottom: 0
    },
    tabBar: {
        height: 50,
        borderTopColor: 'darkgrey',
        borderTopWidth: 1,
        opacity: 0.98,
        justifyContent: 'space-between'
    }
});
