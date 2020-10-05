///////////////////
// import React from 'react';
// import {
//   StyleSheet,
//   ScrollView,
//   View,
//   Text,
//   AppRegistry,
//   TouchableOpacity,
//   Image,
//   TextInput
// } from 'react-native';

// import { SearchBar } from 'react-native-elements';
// import { Actions } from 'react-native-router-flux';
// import serverInfo from '../ServerInfo'; 

// class List extends React.Component {
//     constructor(props){
//         super(props);
//         this.state={
//             // search:'ppp',
//             filtered:[],
//         };
//         this.handleChange = this.handleChange.bind(this);
//     }

//     componentDidMount() {
//         this.setState({
//           filtered: this.props.items,
//         });
//     }

//       componentWillReceiveProps(nextProps) {
//           // console.log("in componentWillReceiveProps: " + JSON.stringify(nextProps));
//         this.setState({
//           filtered: nextProps.items,
//         });
//       }
        
      
//         handleChange = (search) => {

//           this.setState({ search });
//           // Variable to hold the original version of the list
//           let currentList = [];
//           // Variable to hold the filtered list before putting into state
//           let newList = [];
            
//           // console.log("search value: ", search.nativeEvent.text);
//           // console.log("search: ", search);

//            // If the search bar isn't empty
//            if (search.nativeEvent.text !== "") {
//            // Assign the original list to currentList
//            currentList = this.props.items;
                
//            // Use .filter() to determine which items should be displayed
//            // based on the search terms
//           newList = currentList.filter(item => {
           
//             const filter = search.nativeEvent.text;
//                     // check to see if the current list item includes the search term
//                     // If it does, it will be added to newList. Using lowercase eliminates
//                     // issues with capitalization in search terms and search content
//             return item.name.includes(filter);
//           });
//         } else {
//                 // If the search bar is empty, set newList to original task list
//           newList = this.props.items;
//         }
//             // Set the filtered state based on what our rules added to newList
//         this.setState({
//           filtered: newList
//         });
//       }

//       render() {
//         var {search} = this.state;
// 		return (
// 			<View>
// 				  <SearchBar
//             lightTheme
//             placeholder="請輸入餐廳或餐點"
//             onChange={this.handleChange}
//             value={ search }
//             placeholderTextColor='#86939e'
//             inputStyle={{color:'black'}}
//           />
					
//           <ScrollView>
// 				  {this.state.filtered.map((item) => (
//             <TouchableOpacity 
//                style={styles.listStyle}
//                onPress={ ()=> { 
//                  Actions.mealDetail({'storeID': item.storeId, 'mealID': item.id})
//                 }}
//             >
//               <View>
//                  <Text style={styles.font}>{item.name}</Text>
//                  <Text style={styles.font}>＄{item.price}</Text>
//               </View>
//               <View>{item.img}</View>
//            </TouchableOpacity>
// 				  ))}
//           </ScrollView>
					
// 		  </View>
// 		)
// 	}
// }

// export default class SearchPage extends React.Component {
//     constructor(props){
//         super(props);
//         this.state={
            
//             list: [
//               // {
//               //   id: 1,  //Meal__u.MealID__u
//               //   name: "黯然銷魂飯",   //Meal__u.MealName__u
//               //   price: 85,  //Meal__u.MealPrice__u
//               //   img: <Image source={require('../../img/soybean_pudding.jpg')} style={{ width: 120, height: 70 }} />,
//               // },
//               // {
//               //   id: 2,  //Meal__u.MealID__u
//               //   name: "瀨尿牛丸",   //Meal__u.MealName__u
//               //   price: 65,  //Meal__u.MealPrice__u
//               //   img: <Image source={require('../../img/soybean_pudding.jpg')} style={{ width: 120, height: 70 }} />,
//               // },
//               // {
//               //   id: 3,  //Meal__u.MealID__u
//               //   name: "紅燒雞翅",   //Meal__u.MealName__u
//               //   price: 60,  //Meal__u.MealPrice__u
//               //   img: <Image source={require('../../img/soybean_pudding.jpg')} style={{ width: 120, height: 70 }} />,
//               // },
//               // {
//               //   id: 4,  //Meal__u.MealID__u
//               //   name: "招牌粉圓愛玉檸檬冰",   //Meal__u.MealName__u
//               //   price: 55,  //Meal__u.MealPrice__u
//               //   img: <Image source={require('../../img/soybean_pudding.jpg')} style={{ width: 120, height: 70 }} />,
//               // },
//             ]
//         }
//     }

//     componentDidMount(){
//       var address = serverInfo.SERVICE_ADDRESS;
//       console.log("this is componentDidMount");
//       address += "meals/search";
//       fetch(address, {
//         method: 'POST',
//         header: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({

//         })
//       })
//         .then((response) => response.json())
//         .then((responseJson) => {
//           console.log(responseJson);
//           for (var i = 0; i < responseJson.length; i++) {
//             // console.log(i);
//             // console.log(responseJson[i].name);
//             this.setState({
//               list : responseJson
//             })
//           }
//         })
//         .catch((error) => {
//           console.log(error);
//         })
//         // .finally(() => {
//         // })
//     }

//     render(){
//         return(
//             <View>
//                 {/* <List items={this.state.list} //list is test data
//                 id={this.state.id} 
//                 name={this.state.name}
//                 price={this.state.price}
//                 img={this.state.img} 
//                 /> */}
//                 <List items={this.state.list} />
//             </View>
//         );
//     }
// }

// const styles = StyleSheet.create({
//   titleText : {
//       fontSize : 30,
//   },
//   cardView: {
//       flexDirection: 'column',
//       borderColor: 'black',
//       borderWidth: 2,
//       padding: 3,
//       margin: 5,
//   },

//   cardView: {
//       flexDirection: 'column',
//       borderWidth: 2,
//       borderColor: '#17202A',
//       padding: 3,
//       margin: 5,
//   },

//   // list: {
//   //     flexDirection: 'row',
//   //     justifyContent: 'space-around',
//   //     padding: 3,
//   // },

//   listStyle: {
//     flexDirection: "row", 
//     justifyContent:"space-between", 
//     margin:5,
//     borderWidth:2, 
//     /*display: "none"*/
//   },

//   font: {
//       fontSize: 18,
//   },

// });


//////////////////////
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  AppRegistry,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import { Toolbar } from 'react-native-material-ui';
import { SearchBar } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

/*function getImage(event) {
  return(
    fetch('https://somesite.com').then((response) => response.text()).then((responseText) => {console.log(responseText);})
  )
}*/

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
    <View>
      <View>{props.img}</View>
      <Text>{props.name}</Text>
    </View>
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

function GreatFood(props) {
  return (
    <TouchableOpacity style={styles.restaurantList} onPress={() => { Actions.restaurantPage() }}>
      <View>
        <View>{props.img}</View>
        <Text>{props.name}</Text>
      </View>
    </TouchableOpacity>
  )
}

class RecommendFood extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      recommendfood: [
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
            {this.state.recommendfood.map((item) => (
              <View>
                <View style={{ margin: 5 }} >
                  <GreatFood
                    key={item.id}
                    img={item.img}
                    name={item.name}
                  />
                </View>
              </View>
            ))}
          </ScrollView>

        </View>
      </View >
    )
  }
};

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

          <Image source={require('../img/title-icon.png')} style={{ width: 410, height: 200 }} />


          <View>
            <Text style={styles.titleText}>精選餐廳</Text>


            <View style={styles.backgroundBlock}>
              <SpecialRestaurant />
            </View>


            <Text style={styles.titleText}>永遠吃不膩</Text>


            <View style={styles.backgroundBlock}>
              <FavorFood />
            </View>


            <Text style={styles.titleText}>為您推薦</Text>

            <View style={styles.backgroundBlock}>
              {/* <Text style={{ fontSize: 20 }}>好好吃飯</Text> */}
              <RecommendFood />
            </View>

          </View>
        </ScrollView>
      </View>

    )
  }
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    marginBottom:5,
    marginLeft:5,
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
  }
});