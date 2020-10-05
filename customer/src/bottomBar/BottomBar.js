import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomNavigation } from 'react-native-material-ui';
// import { Actions, Router, Stack, Tabs, Scene } from 'react-native-router-flux';
import App from '../../App.js';
import { Actions } from 'react-native-router-flux';


export default class BottomBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active: 'home'
        }
    }

    handleHomePress() {
        Actions.reset("main");
        this.setState({ active: 'home' });
    }

    handleSearchPress(){
        //Actions.reset("mealDetail");
        Actions.reset("searchPage")
        this.setState({active: 'search'});
    }
    handleOrderPress() {
        Actions.reset("orderList");
        //Actions.replace("currentOrderList");
        this.setState({ active: 'order' });
    }

    handleCartPress(){
        this.setState({active: 'cart'});
        Actions.reset('cart');
    }

    handleAccountPress(){
        Actions.reset('accountSetting');
        this.setState({active: 'account'});
    }

    render() {
        return (

            <BottomNavigation active={this.state.active} hidden={false}>
                <BottomNavigation.Action
                    key="home"
                    icon="home"
                    label="首頁"
                    onPress={() => this.handleHomePress()}
                />
                <BottomNavigation.Action
                    key="search"
                    icon="search"
                    label="搜尋"
                    onPress={() => this.handleSearchPress()}
                />
                <BottomNavigation.Action
                    key="order"
                    icon="reorder"
                    label="訂單"
                    onPress={() => this.handleOrderPress()}
                />
                <BottomNavigation.Action
                    key="cart"
                    icon="shopping-cart"
                    label="購物車"
                    onPress={() => this.handleCartPress()}
                />
                <BottomNavigation.Action
                    key="account"
                    icon="person"
                    label="帳戶"
                    onPress={() => this.handleAccountPress()}
                />
            </BottomNavigation>

        )
    }
}

// const styles = StyleSheet.create({
//     tabBar: {
//         height: 50,
//         borderTopColor: 'darkgrey',
//         borderTopWidth: 1,
//         opacity: 0.98,
//         justifyContent: 'space-between'
//     }
// });