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
  Dimensions
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import BottomBar from './src/bottomBar/BottomBar';
import { Router, Scene } from 'react-native-router-flux';

import Main from './src/main.js'
import MealDetail from './src/MealDetail';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Routes = (props) => (
  <Router>
    <Scene key='root'>
      <Scene key='main' component={Main} hideNavBar={true} />
      <Scene key='mealDetail' component={MealDetail} hideNavBar={true} initial={true}/>
    </Scene>
  </Router>
)

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '123456'
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Routes />
        <View style={styles.footer}>
          <BottomBar />
        </View>
      </View>

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

