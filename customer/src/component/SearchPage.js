import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  AppRegistry,
  TouchableOpacity,
  Image,
  TextInput, 
  SafeAreaView
} from 'react-native';

import { SearchBar } from 'react-native-elements';
import { Chip } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import serverInfo from '../ServerInfo'; 

export default class SearchPage extends React.Component {
  constructor(props){
      super(props);
      this.state={
          // search:'',
          filtered:[],
          searchFail: false,
          mealChip:["炒飯", "拉麵", "奶茶", "紅茶"],
      };
      this.handleChange = this.handleChange.bind(this);
  } 

  handleChange = (search) => {
  this.setState({search});
    var address = serverInfo.SERVICE_ADDRESS;
    address += "meals/search";
    fetch(address, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            searchString: search
        })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      //console.log(search);
      if(responseJson == "" && search != ""){
        console.log("not found");
        this.setState({ searchFail : true});
      }
      else{
        this.setState({ 
          searchFail: false,
        });
      }
      this.setState({
        filtered : responseJson
      })
    })
    .catch((error) => {
        console.log(error);
    })
  }

  render() {
  var {search} = this.state;
  console.log("search: ",search);
		  return (
        <SafeAreaView style={{flex:1}}>		  
				  <SearchBar
            lightTheme
            placeholder="請輸入餐廳或餐點"
            onChangeText={this.handleChange}
            value={ search }
            placeholderTextColor='#86939e'
            inputStyle={{color:'black'}}
          />
					
          <ScrollView>
          <View>
              <View>{this.state.searchFail ? 
                <View>
                  <Text style={styles.searchFail}>查無此餐廳/餐點</Text>
                  <Text style={styles.chipTitle}>您可以嘗試以下搜尋</Text>
                </View>
              : null}
              </View>
          </View>

          <View>
              <View>{this.state.searchFail ? null : <Text style={styles.chipTitle}>熱門搜尋</Text>}</View>
              <View style={{display: "flex", flexDirection: "row"}}>
                {this.state.mealChip.map((c, i)=> 
                  // console.log(c, i)
                  <Chip style={{margin: 5}} onPress={()=> 
                    {
                    //   this.setState({search: {c}}),
                      console.log({c}.c)
                      if({c} != undefined){
                        this.handleChange({c}.c)
                      // console.log("test", {c});
                      }
                    }
                  }>{c}</Chip>
                )}
              </View>
          </View>

				  {this.state.filtered.map((item) => (
            <TouchableOpacity 
               style={styles.listStyle}
               onPress={ ()=> { 
                 Actions.mealDetail({'storeID': item.storeId, 'mealID': item.id})
                }}
            >
              <View>
                 <Text style={styles.font}>{item.name}</Text>
                 <Text style={styles.font}>＄{item.price}</Text>
              </View>
              <View>{item.img}</View>
           </TouchableOpacity>
				  ))}
          </ScrollView>
					
        </SafeAreaView>
		)
	}
}

const styles = StyleSheet.create({
  chipTitle: {
    fontSize: 20,
    margin: 10,
    // marginTop: 20,
    //color: 'red'
  },
  cardView: {
      flexDirection: 'column',
      borderColor: 'black',
      borderWidth: 2,
      padding: 3,
      margin: 5,
  },
  cardView: {
      flexDirection: 'column',
      borderWidth: 2,
      borderColor: '#17202A',
      padding: 3,
      margin: 5,
  },
  listStyle: {
    flexDirection: "row", 
    justifyContent:"space-between", 
    margin:5,
    borderWidth:2, 
    /*display: "none"*/
  },
  font: {
      fontSize: 18,
  },
  searchFail: {
      textAlign: "center",
      color: "gray",
      fontSize: 20,
      marginTop: 30,
  }

});