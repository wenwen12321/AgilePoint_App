import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomNavigation } from 'react-native-material-ui';
import { Actions, Router, Stack, Tabs, Scene } from 'react-native-router-flux';
import App from '../../App.js';
import MenuList from '../menu/MenuList.js';


export default class BottomBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active: 'order'
        }
    }

    handleOrderPress() {
        Actions.reset("orderList");
        this.setState({ active: 'order' });
    }

    handleMenuPress() {
        Actions.reset("menuList");
        this.setState({ active: 'menu' });
    }

    handleAnalyzePress(){
        this.setState({active: 'analyze'});
        Actions.reset("analytics");
    }

    handleAccountPress(){
        this.setState({active: 'account'});
        Actions.reset('accountSetting');
    }

    render() {
        return (

            <BottomNavigation active={this.state.active} hidden={false}>
                <BottomNavigation.Action
                    key="order"
                    icon="reorder"
                    label="訂單"
                    onPress={() => this.handleOrderPress()}
                />
                <BottomNavigation.Action
                    key="menu"
                    icon="restaurant"
                    label="菜單"
                    onPress={() => this.handleMenuPress()}
                />
                <BottomNavigation.Action
                    key="analyze"
                    icon="show-chart"
                    label="分析"
                    onPress={() => this.handleAnalyzePress()}
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