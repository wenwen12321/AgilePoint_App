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
  TouchableWithoutFeedback,
  Linking
} from 'react-native';
import serverInfo from './ServerInfo';
import { Actions } from 'react-native-router-flux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards';
import { Divider } from 'react-native-paper';
import ChoosingGame from './component/ChoosingGame';
import Carousel from 'react-native-banner-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';

function Restaurant(props) {
  // console.log(props);
  return (
    <TouchableOpacity onPress={() => { Actions.restaurantPage({ storeID: props.id }) }}>
      <View><Image style={{ width: 120, height: 70, resizeMode: "cover" }} source={{ uri: props.img }} /></View>
      <Text>{props.name}</Text>
    </TouchableOpacity>
  )
}

class SpecialRestaurant extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurantData: props.restaurantData,
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
    // console.log(this.state.restaurantData[0].id);
    return (
      <ScrollView horizontal={true}>
        {this.state.restaurantData.map((item) => (
          <View style={{ margin: 5 }}>
            <Restaurant
              id={item.id}
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
    <TouchableOpacity onPress={() => { Actions.mealDetail({ storeID: props.storeID, mealID: props.mealID }) }}>
      <View><Image source={{ uri: props.img }} style={{ width: 120, height: 70, resizeMode: "cover" }} /></View>
      <Text>{props.name}</Text>
    </TouchableOpacity>
  )
}

class FavorFood extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favorfoodData: props.data,
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
            {this.state.favorfoodData.map((item) => (
              <View style={{ margin: 5 }}>
                <HabitFood
                  storeID={item.storeID}
                  mealID={item.mealID}
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
      restaurantCardListData: props.data,
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
        {this.state.restaurantCardListData.map(item => (
          <TouchableOpacity onPress={() => { Actions.restaurantPage({ storeID: item.storeID }) }}>
            <Card>
              <CardImage
                source={{ uri: item.img }}
              />
              <CardTitle
                title={item.storeName}
                subtitle={item.subtitle}
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

export default class Main2 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isUpdating: false,
      isNeedUpdate: true,
      componentArr: [
        {
          type: 4,
          data: [
            {
              act: "link",
              img: "https://i.imgur.com/MmV8VTn.png",
              url: "https://google.com"
            },
            {
              act: "scene",
              img: "https://i.imgur.com/3V9rSpP.jpg",
              sceneName: "todaySpecial"
            },
            {
              act: "scene",
              img: "https://i.imgur.com/gSwhoIJ.jpg",
              sceneName: "mealDetail",
              prop: {
                storeID: 1,
                mealID: 1
              }
            }
          ]
        },
        {
          type: 0,
          title: '精選餐廳',
          data: [
            {
              id: 1,
              img: "https://i.imgur.com/gSwhoIJ.jpg",
              name: "通化粉圓冰品"
            },
            {
              id: 2,
              img: "https://i.imgur.com/gSwhoIJ.jpg",
              name: "好喝珍奶"
            },
          ]
        },
        {
          type: 1,
          title: '永遠吃不膩',
          data: [
            {
              storeID: 1,
              mealID: 1,
              img: "https://i.imgur.com/gSwhoIJ.jpg",
              name: "好吃拉麵"
            },
            {
              id: 2,
              mealID: 4,
              img: "https://i.imgur.com/gSwhoIJ.jpg",
              name: "好吃拉麵"
            },
          ]
        },
        {
          type: 3,
          title: '餐點人氣排行',
          data: [
            {
              storeID: 1,
              mealID: 1,
              img: "https://i.imgur.com/gSwhoIJ.jpg",
              mealName: "好吃拉麵",
              storeName: "store1",
              description: "超好吃的拉麵!!"
            },
            {
              storeID: 1,
              mealID: 1,
              img: "https://i.imgur.com/gSwhoIJ.jpg",
              mealName: "好吃拉麵",
              storeName: "store1",
              description: "超好吃的拉麵!!"
            },
            {
              storeID: 1,
              mealID: 1,
              img: "https://i.imgur.com/gSwhoIJ.jpg",
              mealName: "好吃拉麵",
              storeName: "store1",
              description: "超好吃的拉麵!!"
            },
            {
              storeID: 1,
              mealID: 1,
              img: "https://i.imgur.com/gSwhoIJ.jpg",
              mealName: "好吃拉麵",
              storeName: "store1",
              description: "超好吃的拉麵!!"
            },
            {
              storeID: 1,
              mealID: 1,
              img: "https://i.imgur.com/gSwhoIJ.jpg",
              mealName: "好吃拉麵",
              storeName: "store1",
              description: "超好吃的拉麵!!"
            },
          ]
        },
        {
          type: 2,
          data: [
            {
              img: 'https://i.imgur.com/gSwhoIJ.jpg',
              subtitle: '第一學生餐廳',
              storeName: '老王牛肉麵',
              storeID: '1',
              memo: '台北CP值超高平價牛肉麵 || 只要129元起'
            },
            {
              img: 'https://cdn.walkerland.com.tw/images/upload/subject/2019/12/59108c83df7d408c34161d0999da946c16d40193.jpg',
              subtitle: '第一學生餐廳',
              storeName: '好吃拉麵',
              storeID: '1',
              memo: '東京最夯人氣拉麵 || 不排隊吃不到'
            },
          ]
        }
      ]
    }
  }

  componentDidMount (){
    var address = serverInfo.SERVICE_ADDRESS;
    address += "main";
    console.log(address);
    fetch(address, {
      method: 'GET',
    })
    .then((response) => response.json)
    .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          
        })
    })
  }

  renderComponent = (cIndex) => {
    if (this.state.componentArr[cIndex].type === 0) {
      // console.log(this.state.componentArr[cIndex].data);
      return (
        <>
          <Text style={styles.titleText}>{this.state.componentArr[cIndex].title}</Text>
          <View style={styles.backgroundBlock}>
            <SpecialRestaurant restaurantData={this.state.componentArr[cIndex].data} />
          </View>
        </>
      )
    }
    else if (this.state.componentArr[cIndex].type === 1) {
      return (
        <>
          <Text style={styles.titleText}>{this.state.componentArr[cIndex].title}</Text>
          <View style={styles.backgroundBlock}>
            <FavorFood data={this.state.componentArr[cIndex].data} />
          </View>
        </>
      )
    }
    else if (this.state.componentArr[cIndex].type === 2) {
      return (
        <>
          <CardViewList data={this.state.componentArr[cIndex].data} />
        </>
      )
    }
    else if (this.state.componentArr[cIndex].type === 3) {
      return (
        <>
          {/* <Divider style={{ height: 10, backgroundColor: "#f7f7f7" }} /> */}
          <Text style={{ margin: 5, marginTop: 0, fontSize: 20 }}>{this.state.componentArr[cIndex].title}</Text>
          <View style={{ backgroundColor: "#e4e3e3" }}>
            <View style={{ margin: 10 }}>
              {this.state.componentArr[cIndex].data.map((item, index) => (
                <TouchableOpacity style={{ margin: 2 }} onPress={() => Actions.mealDetail({ mealID: item.mealID, storeID: item.storeID })}>
                  <View style={{ flexDirection: "row" }}>
                    <Image style={{ height: 80, width: 80, resizeMode: "cover" }} source={{ uri: item.img }} />
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ marginHorizontal: 8, fontWeight: "bold" }}>{index + 1}</Text>
                      <View style={{ alignContent: "center" }}>
                        <Text>{item.mealName}</Text>
                        <Text style={{ color: "#818181" }}>{item.storeName}</Text>
                        <Text style={{ color: "#818181" }}>{item.description}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* <Divider style={{ height: 10, backgroundColor: "#f7f7f7" }} /> */}
        </>
      )
    }
    else if (this.state.componentArr[cIndex].type === 4) {
      return (
        <>
          <View style={{ margin: 10, flex:1 }}>
            <Carousel
              autoplay
              autoplayTimeout={3000}
              loop
              index={0}
              pageSize={Dimensions.get('window').width - 20}
            >
              {this.state.componentArr[cIndex].data.map((item, index) =>  this.renderCarousel(item, index) )}
            </Carousel>
          </View>
        </>
      )
    }
  };

  renderCarousel = (item, index) => {
    console.log(item);
    const bannerWidth = Dimensions.get("window").width - 20;
    if (item.act === "link") {
      return (
        <View key={index}>
          <TouchableWithoutFeedback onPress={() => { Linking.openURL(item.url) }}>
            <Image style={{ resizeMode: "cover", height:200, width:bannerWidth }} source={{ uri: item.img }} />
          </TouchableWithoutFeedback>
        </View>
      )
    }
    else if (item.act === "img") {
      return (
        <View style={{flex:1}} key={index}>
          <Image style={{ height:200, width:bannerWidth, resizeMode: "cover"}} source={{ uri: item.img }} />
        </View>
      )
    }
    else if (item.act === "scene") {
      return (
        <View style={{flex:1}} key={index}>
          <TouchableWithoutFeedback onPress={() => { Actions.push(item.sceneName, item.prop) }}>
            <Image style={{  height:200, width:bannerWidth, resizeMode: "cover" }} source={{ uri: item.img }} />
          </TouchableWithoutFeedback>
        </View>
      )
    }
  }

  componentDidMount() {

    setTimeout(() => {
      this.setState({
        isNeedUpdate: true,
      })
    }, 0);
  }

  updateData() {
    if (this.state.isNeedUpdate && (!this.state.isUpdating)) {
      setTimeout(() => {
        this.setState({
          isUpdating: true,
        })
      }, 0);
      var address = serverInfo.SERVICE_ADDRESS;
      address += ("main");
      console.log(address);
      fetch(address, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            componentArr: responseJson.componentArr
          })
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setTimeout(() => {
            this.setState({
              isNeedUpdate: false,
              isUpdating: false,
            });
          }, 0);
        });
    }
  }

  // updateData = () => {
  //   this.setState({
  //     isUpdating: false,
  //   })
  // };

  render() {
    const window = Dimensions.get("window").height;
    { this.updateData() }
    return (
      <SafeAreaView style={{ flex: 1, flexDirection: 'column', backgroundColor: '#ECECEE' }}>

        {/*        searchBar View       */}
        <TouchableOpacity style={{ marginBottom: 5 }} onPress={() => { Actions.searchPage() }}>
          <View style={{ backgroundColor: "#E5E7E9" }}>
            <Text style={{ backgroundColor: "#BDC3C7", padding: 15, margin: 10, fontSize: 17, color: '#86939e', borderRadius: 10 }}>
              {/* <FontAwesomeIcon style={{ color: '#86939e' }} icon={faSearch} />   */}
              <Icon name="search" size={20}/> &nbsp;
              請輸入餐廳或餐點
              </Text>
          </View>
        </TouchableOpacity>

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={this.state.isUpdating} onRefresh={() => { this.setState({ isNeedUpdate: true }) }} />
          }
        >

          <ChoosingGame />

          {this.state.componentArr.map((component, cIndex) => (
            <>{this.renderComponent(cIndex)}</>
          ))}

          {/* <Image source={require('../img/title-icon.png')} style={{ width: 410, height: 200 }} /> */}

          {/* <View>
            <Text style={styles.titleText}>精選餐廳</Text>
            <View style={styles.backgroundBlock}>
              <SpecialRestaurant />
            </View>

            <Text style={styles.titleText}>永遠吃不膩</Text>
            <View style={styles.backgroundBlock}>
              <FavorFood />
            </View>

            <CardViewList />

          </View> */}
        </ScrollView>
      </SafeAreaView>
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