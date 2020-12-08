/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

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

import { Router, Scene } from 'react-native-router-flux';

import { Provider as PaperProvider } from 'react-native-paper';
import BottomBar from './src/bottomBar/BottomBar';
import Main from './src/main.js'
import MealDetail from './src/MealDetail';
import OrderList from './src/OrderList.js';
import HistoryOrderList from './src/HistoryOrderList.js';
import CurrentOrderList from './src/CurrentOrderList.js';
import OrderDetail from './src/OrderDetail.js';
import Cart from './src/cart/Cart';
import OrderComplete from './src/cart/OrderComplete';
import SelectFoodCourt from './src/selectFoodCourt.js';
import AccountSetting from './src/accountSetting/AccountSetting.js';
import Home from './src/login/Home';
import Login from './src/login/Login';
import Register from './src/login/Register';
import AppRouter from './src/AppRouter';
import ForgetPassword from './src/login/ForgetPassword';
import RestaurantPage from './src/RestaurantPage';
import SearchPage from './src/component/SearchPage';
import RegisterSuccess from './src/login/RegisterSuccess';


const Routes = (props) => (
  <Router>
    <Scene key='root'>
      <Scene key='home' component={Home} hideNavBar={true} />
      <Scene key='main' component={Main} hideNavBar={true} initial />
      <Scene key='restaurantPage' component={RestaurantPage} hideNavBar={true} />
      <Scene key='mealDetail' component={MealDetail} hideNavBar={true} />
      <Scene key='orderList' component={OrderList} hideNavBar={true} />
      <Scene key='historyOrderList' component={HistoryOrderList} hideNavBar={true} />
      <Scene key='currentOrderList' component={CurrentOrderList} hideNavBar={true} />
      <Scene key='orderDetail' component={OrderDetail} hideNavBar={true} />
      <Scene key='cart' component={Cart} hideNavBar={true} />
      <Scene key='orderComplete' component={OrderComplete} hideNavBar={true} />
      <Scene key='accountSetting' component={AccountSetting} hideNavBar={true} />
      <Scene key='login' component={Login} hideNavBar={true} />
      <Scene key='register' component={Register} hideNavBar={true} />
      <Scene key='forgetPassword' component={ForgetPassword} hideNavBar={true} />
      <Scene key='searchPage' component={SearchPage} hideNavBar={true} />
      <Scene key='registerSuccess' component={RegisterSuccess} hideNavBar={true} />
    </Scene>
  </Router>
)

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //text : '123456'
    };
  }

  // showBottomBar = () => {

  //   console.log("show bottom bar");
  //   if (this.state.status === "main") {
  //     return (
  //       <View style={styles.footer}>
  //         <BottomBar />
  //       </View>
  //     );
  //   }
  // }

  // componentDidMount() {
  //   this.getStorage().done();
  // }

  // getStorage = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem('initialPage');
  //     console.log(value);
  //     if (value !== null) {
  //       this.setState({
  //         status: value
  //       });
  //     }
  //   }
  //   catch (error) {
  //     console.log(error);
  //   }
  // }

  render() {
    // if (this.state.status === null) {
    //   return (
    //     <View style={{ flex:1, justifyContent: "center", alignItems:"center", alignSelf: "center", alignContent: "center" }}>
    //       <ActivityIndicator style={{alignSelf:"center"}} size="large" />
    //     </View>
    //   );
    // }
    return (
      // <View style={styles.container}>

      //   <SelectFoodCourt />
      //   <Routes status={this.state.status} />
      //   <View style={styles.footer}>
      //     <BottomBar />
      //   </View>
      // </View>
      <PaperProvider>
        <AppRouter />
      </PaperProvider>
    )
  }
};

const styles = StyleSheet.create({
  footer: {
    justifyContent: 'center',
    marginBottom: 0,
    alignContent: "flex-end",
  },
  container: {
    flexGrow: 2,
    flexDirection: 'column',
  }
});