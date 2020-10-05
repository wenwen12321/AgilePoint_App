import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
} from 'react-native';

function Restaurant(props) {
    return (
        <View>
            <View>{props.img}</View>
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
                    img: <Image source={require('../img/restaurant.jpg')} style={{ width: 120, height: 70 }} />,
                    name: "靠臉吃飯"
                },
                {
                    id: 2,
                    img: <Image source={require('../img/restaurant.jpg')} style={{ width: 120, height: 70 }} />,
                    name: "靠臉吃飯"
                },
                {
                    id: 3,
                    img: <Image source={require('../img/restaurant.jpg')} style={{ width: 120, height: 70 }} />,
                    name: "靠臉吃飯"
                },
                {
                    id: 4,
                    img: <Image source={require('../img/restaurant.jpg')} style={{ width: 120, height: 70 }} />,
                    name: "靠臉吃飯"
                },
                {
                    id: 5,
                    img: <Image source={require('../img/restaurant.jpg')} style={{ width: 120, height: 70 }} />,
                    name: "靠臉吃飯"
                },
                {
                    id: 6,
                    img: <Image source={require('../img/restaurant.jpg')} style={{ width: 120, height: 70 }} />,
                    name: "靠臉吃飯"
                },
            ]
        }
    }

    render() {
        const first = [];
        const second = [];

        for (var i = 0; i < 3; i++) {
            first.push(this.state.restaurant[i]);
        }

        for (var i = 3; i < 6; i++) {
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


export default class SelectFoodCourt extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: '123456'
        };
    }

    render() {
        return (
            <View>

                <ScrollView>
                    <Text style={{fontSize:30, backgroundColor: '#FFC300', padding: 8}}>選擇餐廳</Text>
                    <Text />

                    <View style={styles.backgroundBlock}>
                        <Text style={styles.titleText}>第一學生餐廳</Text>
                        <Text />
                        <SpecialRestaurant />
                    </View>
                    <Text />

                    <View style={styles.backgroundBlock}>
                        <Text style={styles.titleText}>教職員工餐廳</Text>
                        <Text />
                        <SpecialRestaurant />
                    </View>
                    <Text />

                    <View style={styles.backgroundBlock}>
                        <Text style={styles.titleText}>第三學生餐廳</Text>
                        <Text />
                        <SpecialRestaurant />
                    </View>
                    <Text />
                </ScrollView>

            </View>

        )
    }
};


const styles = StyleSheet.create({
    titleText: {
        fontSize: 20,
        borderBottomWidth: 2,
        borderBottomColor: 'lightgray',
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
        backgroundColor: '#E4E3E3',
    }
});