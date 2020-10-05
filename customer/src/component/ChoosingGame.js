import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    AppRegistry,
    TouchableOpacity,
    Image,
    Button,
    Dimensions,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGift, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome5'
import serverInfo from '../ServerInfo'; 

const { height, width } = Dimensions.get('window');

export default class ChoosingGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            isModalVisibleFR: false,
            RandomNumber: 1,
            foodlist: [
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
            ],
            storeID: 1,
            storeName: "Store1",
            img: 'https://i.imgur.com/gSwhoIJ.jpg',
            mealID: 1,
            mealName: "肉絲炒飯",
            memo: '東京最夯人氣拉麵 || 不排隊吃不到',
            subtitle: "第一學生餐廳"
        }
    }

    choosingGameForStore = () => {
        var address = serverInfo.SERVICE_ADDRESS;
        address += "choosingGame/store";
        console.log(address);
        fetch(address, {
            method: 'GET',
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson)
            this.setState({
                storeID: responseJson.storeID,
                storeName: responseJson.storeName,
                //img: responseJson.img,
                img: 'https://lh5.ggpht.com/_o9h1grcT4Ok/SUTsgdKnhhI/AAAAAAAAA3g/kAWEcrYQKms/s400/CIMG1856.JPG',
                subtitle: responseJson.subtitle,
                //memo: responseJson.memo
            });
        })
    }

    choosingGameForMeal = () => {
        var address = serverInfo.SERVICE_ADDRESS;
        address += "choosingGame/meal";
        console.log(address);
        fetch(address, {
            method: 'GET',
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            //console.log(responseJson.mealName);
            this.setState({
                storeID: responseJson.storeID,
                //storeName: responseJson.storeName,  
                img: responseJson.img,
                mealID: responseJson.mealID,
                mealName: responseJson.mealName,
            })
        }) 
    }

    //function for choosing meal
    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
        this.choosingGameForMeal();
    };

    gotoMeal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
        Actions.mealDetail({ storeID: this.state.storeID, mealID: this.state.mealID}); //storeID: props.storeID, mealID: props.mealID////////////////////////////
    };

    GenerateRandomNumber = () => {
        var tempNumber = Math.floor(Math.random() * 3);
        console.log(tempNumber);
        this.setState({ RandomNumber: tempNumber });
    };

    //function for choosing restaurant
    toggleModalFR = () => {
        this.setState({ isModalVisibleFR: !this.state.isModalVisibleFR });
        this.choosingGameForStore();
    } 

    gotoRestaurant = () => {
        this.setState({ isModalVisibleFR: !this.state.isModalVisibleFR });
        Actions.restaurantPage({ storeID: this.state.storeID });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>

                <View style={styles.toolRow}>
                  {/* choosingGame for meal */}
                <TouchableOpacity style={{ backgroundColor: "orange", width: 160, borderRadius: 30, margin: 10, }} onPress={this.toggleModal} >
                    <Text style={{ padding: 15, fontSize: 15, color: 'white' }}>
                        {/* <FontAwesomeIcon icon={faGift} size={20} color="white" /> */}
                        <Icon name="gift" size={20} />
                    &nbsp;今天吃什麼?
                    </Text>
                </TouchableOpacity>

                  {/* choosingGame for restaurant */}
                  <TouchableOpacity style={{ backgroundColor: "brown", width: 160, borderRadius: 30, margin: 10, }} onPress={this.toggleModalFR} >
                    <Text style={{ padding: 15, fontSize: 15, color: 'white' }}>
                        <Icon name="gift" size={20} />
                    &nbsp;今天吃哪間?
                    </Text>
                </TouchableOpacity>
                </View>

                {/* choosingGame Modal for meal */}
                <Modal isVisible={this.state.isModalVisible} onBackButtonPress={() => this.toggleModal()} onBackdropPress={() => this.toggleModal()}>
                    <Animatable.View animation="tada" useNativeDriver="true">
                        <View backgroundColor={'white'}>
                            <TouchableOpacity style={styles.cancel} onPress={this.toggleModal}>
                                <FontAwesomeIcon icon={faTimesCircle} size={20}/>
                            </TouchableOpacity>

                            <Text style={styles.title}>歡樂轉食</Text>
                            <Text style={styles.subTitle}>再也不用為下一餐吃什麼而煩惱</Text>
                            <Text style={styles.subTitle}>你的肚子，交給我罩！！</Text>

                            <View style={{ margin: 10 }}>
                                {/* <Image style={{ height: 200, resizeMode: "cover" }} source={{ uri: this.state.foodlist[this.state.RandomNumber]['img'] }} />
                                <Text style={styles.cardTitle}>{this.state.foodlist[this.state.RandomNumber]['storeName']}</Text>
                                <Text style={styles.cardAddress}>第一學生餐廳</Text>
                                <Text style={styles.cardMemo}>{this.state.foodlist[this.state.RandomNumber]['memo']}</Text> */}
                                <Image style={{ height: 200, resizeMode: "cover" }} source={{ uri: this.state.foodlist[this.state.RandomNumber]['img'] }} />
                                <Text style={styles.cardTitle}>{this.state.mealName}</Text>
                                <Text style={styles.cardAddress}>{this.state.subtitle}</Text>
                                <Text style={styles.cardMemo}>{this.state.foodlist[this.state.RandomNumber]['memo']}</Text>
                            </View>

                            <View style={styles.buttonView}>
                                {/* <Button title="不想吃這個！！再轉一次！！" onPress={this.GenerateRandomNumber} /> */}
                                <Button title="不想吃這個！！再轉一次！！" onPress={this.choosingGameForMeal} />
                                <Button title="這就是我想吃的，立即前往" color={'orange'} 
                                style={styles.buttonStyle}
                                onPress={this.gotoMeal} 
                                 />
                            </View>
                        </View>
                    </Animatable.View>
                </Modal>

                {/* choosingGame Modal for restaurant */}
                <Modal isVisible={this.state.isModalVisibleFR} onBackButtonPress={() => this.toggleModalFR()} onBackdropPress={() => this.toggleModalFR()}>
                <Animatable.View animation="tada" useNativeDriver="true">
                <View backgroundColor={'white'}>
                            <TouchableOpacity style={styles.cancel} onPress={this.toggleModalFR}>
                                <FontAwesomeIcon icon={faTimesCircle} size={20}/>
                            </TouchableOpacity>

                            <Text style={styles.title}>歡樂轉餐廳</Text>
                            <Text style={styles.subTitle}>再也不用為下一餐吃什麼而煩惱</Text>
                            <Text style={styles.subTitle}>你的肚子，交給我罩！！</Text>

                            <View style={{ margin: 10 }}>
                                {/* <Image style={{ height: 200, resizeMode: "cover" }} source={{ uri: this.state.foodlist[this.state.RandomNumber]['img'] }} />
                                <Text style={styles.cardTitle}>{this.state.foodlist[this.state.RandomNumber]['storeName']}</Text>
                                <Text style={styles.cardAddress}>第一學生餐廳</Text>
                                <Text style={styles.cardMemo}>{this.state.foodlist[this.state.RandomNumber]['memo']}</Text> */}
                                <Image style={{ height: 200, resizeMode: "cover" }} source={{ uri: this.state.img}} />
                                <Text style={styles.cardTitle}>{this.state.storeName}</Text>
                                <Text style={styles.cardAddress}>{this.state.subtitle}</Text>
                                <Text style={styles.cardMemo}>{this.state.foodlist[this.state.RandomNumber]['memo']}</Text>
                            </View>

                            <View style={styles.buttonView}>
                                {/* <Button title="不想吃這間！！再轉一次！！" onPress={this.GenerateRandomNumber} /> */}
                                <Button title="不想吃這間！！再轉一次！！" onPress={this.choosingGameForStore} />
                                <Button title="這間就是我想吃的，立即前往" color={'orange'} 
                                style={styles.buttonStyle}
                                onPress={this.gotoRestaurant} 
                                 />
                            </View>
                        </View>

                </Animatable.View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        color: 'gray',
        textAlign: "center",
    },
    subTitle: {
        fontSize: 15,
        color: 'gray',
        textAlign: "center",
    },
    cardTitle: {
        color: 'black',
        fontSize: 25,
    },
    cardAddress: {
        color: 'rgba(0 ,0 ,0 , 0.38)',
    },
    cardMemo: {
        color: 'rgba(0 ,0 ,0 , 0.54)',
    },
    cancel: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    buttonView: {
        //fontSize: 30,
        // margin: 200,
        // display: "flex",
        // flexDirection: "column",
        // justifyContent: "flex-end",
    },
    buttonStyle: {
        //fontSize: 30,
        // margin: 200,
    },
    toolRow: {
        display: 'flex',
        flexDirection: 'row'
    }
})