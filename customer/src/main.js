import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards';

function Restaurant(props) {
  return (
    <TouchableOpacity onPress={() => { Actions.restaurantPage({ storeID: 1 }) }}>
      <View>{props.img}</View>
      <Text>{props.name}</Text>
    </TouchableOpacity>
  )
}

class SpecialRestaurant extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurant: [
        {
          id: 1,
          img: <Image source={require('../img/soybean_pudding.jpg')} style={{ width: 120, height: 70 }} />,
          name: "通化粉圓冰品"
        },
        {
          id: 2,
          img: <Image source={require('../img/bubble_milk_tea.jpg')} style={{ width: 120, height: 70 }} />,
          name: "好喝珍奶"
        },
        {
          id: 3,
          img: <Image source={require('../img/restaurant.jpg')} style={{ width: 120, height: 70 }} />,
          name: "靠臉吃飯"
        },
        {
          id: 4,
          img: <Image source={require('../img/Food.jpg')} style={{ width: 120, height: 70 }} />,
          name: "好吃拉麵"
        },
        {
          id: 5,
          img: <Image source={require('../img/soybean_pudding.jpg')} style={{ width: 120, height: 70 }} />,
          name: "通化粉圓冰品"
        },
      ]
    }
  }

  render() {
    return (
      <ScrollView horizontal={true}>
        {this.state.restaurant.map((item) => (
          <View style={{ margin: 5 }}>
            <Restaurant
              key={item.id}
              img={item.img}
              name={item.name}
            />
          </View>
        ))}
      </ScrollView>
    )
  }
};

function HabitFood(props) {
  return (
    <TouchableOpacity onPress={() => { Actions.restaurantPage({ storeID: 1 }) }}>
      <View>{props.img}</View>
      <Text>{props.name}</Text>
    </TouchableOpacity>
  )
}

class FavorFood extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favorfood: [
        {
          id: 1,
          img: <Image source={require('../img/Food.jpg')} style={{ width: 120, height: 70 }} />,
          name: "好吃拉麵"
        },
        {
          id: 2,
          img: <Image source={require('../img/Food.jpg')} style={{ width: 120, height: 70 }} />,
          name: "好吃拉麵"
        },
        {
          id: 3,
          img: <Image source={require('../img/Food.jpg')} style={{ width: 120, height: 70 }} />,
          name: "好吃拉麵"
        },
        {
          id: 4,
          img: <Image source={require('../img/Food.jpg')} style={{ width: 120, height: 70 }} />,
          name: "好吃拉麵"
        },
        {
          id: 5,
          img: <Image source={require('../img/Food.jpg')} style={{ width: 120, height: 70 }} />,
          name: "好吃拉麵"
        },
      ]
    }
  }

  render() {
    return (
      <View style={styles.restaurantList}>
        <View style={styles.restaurantRow}>

          <ScrollView horizontal={true}>
            {this.state.favorfood.map((item) => (
              <View style={{ margin: 5 }}>
                <HabitFood
                  key={item.id}
                  img={item.img}
                  name={item.name}
                />
              </View>
            ))}
          </ScrollView>

        </View>
      </View >
    )
  }
};

class CardViewList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantCardList: [
        {
          img: 'https://i.imgur.com/gSwhoIJ.jpg',
          storeName: '老王牛肉麵',
          storeID: '1',
          memo: '台北CP值超高平價牛肉麵 || 只要129元起'
        },
        {
          img: 'https://cdn.walkerland.com.tw/images/upload/subject/2019/12/59108c83df7d408c34161d0999da946c16d40193.jpg',
          storeName: '好吃拉麵',
          storeID: '1',
          memo: '東京最夯人氣拉麵 || 不排隊吃不到'
        },
        {
          img: 'https://farm66.static.flickr.com/65535/50011791628_4aa36cec57_o.jpg',
          storeName: '晴子冰室',
          storeID: '1',
          memo: 'IG 爆紅冰品店 || 冰品飲料'
        },
      ]
    }
  }

  render() {
    return (
      <View style={styles.cardView}>
        {this.state.restaurantCardList.map(item => (
          <TouchableOpacity onPress={() => { Actions.restaurantPage({ storeID: item.storeID }) }}>
            <Card>
              <CardImage
                source={{ uri: item.img }}
              />
              <CardTitle
                title={item.storeName}
                subtitle="第一學生餐廳"
              />
              <CardContent text={item.memo} />
              <CardAction
                separator={true}
                inColumn={false}>
                <CardButton
                  onPress={() => { Actions.restaurantPage({ storeID: item.storeID }) }}
                  title="收藏"
                  color="blue"
                />
                <CardButton
                  onPress={() => { Actions.restaurantPage({ storeID: item.storeID }) }}
                  title="餐廳資訊 >"
                  color="blue"
                />
              </CardAction>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    )
  }
}

export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isUpdating: false,
    }
  }

  updateData = () => {
    this.setState({
      isUpdating: false,
    })
  };

  render() {
    const window = Dimensions.get("window").height;
    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#ECECEE' }}>
        {/*        searchBar View       */}
        <TouchableOpacity onPress={() => { Actions.searchPage() }}>
          <View style={{ backgroundColor: "#E5E7E9" }}>
            <Text style={{ backgroundColor: "#BDC3C7", padding: 15, margin: 10, fontSize: 17, color: '#86939e', borderRadius: 10 }}><FontAwesomeIcon style={{ color: '#86939e' }} icon={faSearch} />  請輸入餐廳或餐點</Text>
          </View>
        </TouchableOpacity>

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={this.state.isUpdating} onRefresh={() => { this.updateData() }} />
          }
        >

          {/* <Image source={require('../img/title-icon.png')} style={{ width: 410, height: 200 }} /> */}

          {/* choosingGame View */}
          <ChoosingGame />

          <View>
            <Text style={styles.titleText}>精選餐廳</Text>
            <View style={styles.backgroundBlock}>
              <SpecialRestaurant />
            </View>

            <Text style={styles.titleText}>永遠吃不膩</Text>
            <View style={styles.backgroundBlock}>
              <FavorFood />
            </View>

            <CardViewList />

          </View>
        </ScrollView>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    marginBottom: 5,
    marginLeft: 5,
    //color: 'red'
  },

  restaurantList: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },

  restaurantRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  backgroundBlock: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#E4E3E3',
  },
  cardView: {
    padding: 10,
  },
  cardButtonStyle: {
    textAlign: "right"
  },
});