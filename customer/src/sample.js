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
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text : '123456'
    };
  }

  render() {
    return (
      <View>
        <Text style={styles.titleText}>精選餐廳</Text>

        <Text style={styles.titleText}>永遠吃不膩</Text>
        <Text style={styles.titleText}>為你推薦</Text>
      </View>
  
    )
  } 
};

const styles = StyleSheet.create({
    titleText : {
        fontSize : 20,
    }
});