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

import { Col, Row, Grid } from "react-native-easy-grid";

function Restaurant(props) {
  return (
    <View>
      <Text>{props.img}</Text>
      <Text>{props.name}</Text>
    </View>
  )
}

class SpecialRestaurant extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      restaurant: [
        {
          id: 1,
          img: "restaurant.jpg",
          name: "滷肉飯"
        },
        {
          id: 2,
          img: "restaurant.jpg",
          name: "滷肉麵"
        },
        {
          id: 3,
          img: "restaurant.jpg",
          name: "滷肉麵"
        },
        {
          id: 4,
          img: "restaurant.jpg",
          name: "滷肉麵"
        },
        {
          id: 5,
          img: "restaurant.jpg",
          name: "滷肉麵"
        },
        {
          id: 6,
          img: "restaurant.jpg",
          name: "滷肉麵"
        },
      ]
    }
  }

  render() {
    const first = [];
    const second = [];

    for(var i = 0; i < 3; i++) {
      first.push(this.state.restaurant[i]);
    }

    for(var i = 3; i < 6; i++)
    {
      second.push(this.state.restaurant[i]);
    }

    return (
      <View style={styles.restaurantList}>
        <View style={styles.restaurantRow}>
          {first.map((item) => (
            <Restaurant
              key={item.id}
              img={item.img}
              name={item.name}
            />
          ))}
        </View>
        
        <View style={styles.restaurantRow}>
          {second.map((item) => (
            <Restaurant
              key={item.id}
              img={item.img}
              name={item.name}
            />
          ))}
        </View>
      </View >
    )
  }
};

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '123456'
    };
  }



  render() {
    return (
      <View>
        <Text style={styles.titleText}>精選餐廳</Text>
        <SpecialRestaurant />
        <Text style={styles.titleText}>永遠吃不膩</Text>
        <Text style={styles.titleText}>為你推薦</Text>
      </View>

    )
  }
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
  },

  restaurantList: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },

  restaurantRow:{
    flexDirection: 'row',
  }
});

