import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomNavigation } from 'react-native-material-ui';
// import { Actions, Router, Stack, Tabs, Scene } from 'react-native-router-flux';
import App from '../../App.js';


export default class BottomBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active: 'home'
        }
    }

    handleHomePress() {
        // Actions.replace("menuList");
        this.setState({ active: 'home' });
    }

    handleSearchPress(){
        this.setState({active: 'search'});
    }
    handleOrderPress() {
        // Actions.replace("orderList");
        this.setState({ active: 'order' });
    }

    handleCartPress(){
        this.setState({active: 'cart'});
    }

    handleAccountPress(){
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