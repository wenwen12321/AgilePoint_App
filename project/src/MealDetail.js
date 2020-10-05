import React, { Component } from 'react';
import { View, StyleSheet, Alert, Image, ImageBackground, TouchableHighlight, ScrollView } from 'react-native';
import { TextInput, Divider, Text, Switch, Button, Chip, IconButton } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import UIStepper from 'react-native-ui-stepper';


export default class EditMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            foodDescription: "滿滿的肉!!敲擊好吃!!\n活力滿滿!!喵喵喵喵!!",

            food: {
                id: 1,
                name: "忍者燒肉丼",
                price: 120
            },

            flavors: [
                {
                    id: 1,
                    name: "醬汁",
                    items: [
                        {
                            name: "不醬",
                            selected: false
                        },
                        {
                            name: "少醬",
                            selected: false
                        },
                        {
                            name: "正常",
                            selected: false
                        },
                        {
                            name: "多醬",
                            selected: false
                        }
                    ]
                },
                {
                    id: 2,
                    name: "蔥",
                    items: [
                        {
                            name: "少蔥",
                            selected: false
                        },
                        {
                            name: "不蔥",
                            selected: false
                        },
                        {
                            name: "大蔥",
                            selected: false
                        }
                    ]
                }
            ],

            notes: "",

            calories: 666,

            quantity: 1,

            imageUri: "https://i.imgur.com/gSwhoIJ.jpg"

        }
    }

    _handleChipPress = (flavorIndex, index) => {

        this.setState(state => {
            const list = state.flavors.map((item,findex) => {
                if (flavorIndex === findex) {
                    const foodList = item.items.map((chip,cindex) => {
                        if (index === cindex) {
                            chip.selected = true;
                        }
                        else{
                            chip.selected = false;
                        }
                        return chip;
                    })
                }
                return item;
            });
            return { flavors: list };
        });
    };




    _imagePress = () => {

    };

    render() {



        return (
            <ScrollView>
                <View style={styles.root}>
                    <View style={styles.title}>
                        <Text style={styles.titleText}>滷肉飯偉琪</Text>
                    </View>
                    <TouchableHighlight activeOpacity={0.85} underlayColor="#ffffff" onPress={() => { this._imagePress() }}>
                        <View style={styles.imageGroup}>
                            <ImageBackground style={{ backgroundColor: "#d7d7d7", width: "100%", height: "100%" }} resizeMode="cover" source={{ uri: this.state.imageUri }}>
                            </ImageBackground>
                        </View>
                    </TouchableHighlight>
                    <View style={styles.nameAndPrice}>
                        <Text style={{ fontSize: 28 }}>{this.state.food.name}</Text>
                        <Text style={{ fontSize: 28 }}>$ {this.state.food.price}</Text>
                    </View>
                    <View style={styles.nameAndPrice}>
                        <Text>{this.state.foodDescription}</Text>
                        <Text style={{ alignSelf: "flex-end" }}>熱量：{this.state.calories} kcal</Text>
                    </View>

                    <View style={[styles.divider, { paddingBottom: -5 }]}>
                        <Divider />
                    </View>



                    <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", paddingHorizontal: 20, marginBottom: 5 }}>
                        <Text style={{ fontSize: 22 }}>口味調整</Text>
                    </View>
                    <View style={styles.flavorGroup}>
                        {this.state.flavors.map((flavor, flavorIndex) => (

                            <View style={styles.flavor}>
                                <Text style={{ justifyContent: "flex-start", width: 60, fontSize: 18, marginRight: 2, alignSelf: "center" }}>{flavor.name}</Text>
                                <ScrollView horizontal={true}>
                                    <View style={{ flexDirection: "row" }}>
                                        {flavor.items.map((item, index) => (
                                            <View style={{ alignSelf: "center", marginRight: 3, marginVertical: 2 }}>
                                                <Chip onPress={() => this._handleChipPress(flavorIndex, index)} selected={item.selected}>{item.name}</Chip>
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>
                        ))}
                    </View>
                    <View style={styles.divider}>
                        <Divider />
                    </View>

                    <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", paddingHorizontal: 20 }}>
                        <Text style={{ fontSize: 22 }}>備註</Text>
                    </View>
                    <TextInput
                        label=""
                        mode="outlined"
                        value={this.state.notes}
                        onChangeText={notes => this.setState({ notes })}
                        numberOfLines={2}
                        multiline={true}
                        style={{ paddingHorizontal: 20, fontSize: 20, paddingTop: 5 }}
                    />

                    <View style={styles.divider}>
                        <Divider />
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, alignContent: "center" }}>
                        <Text style={{ fontSize: 22, alignSelf: "center" }}>份數　{this.state.quantity}</Text>
                        <UIStepper
                            onValueChange={(quantity) => { this.setState({ quantity }) }}
                            initialValue={this.state.quantity}
                            minimumValue={1}
                            maximumValue={99}
                            tintColor="#6300ee"
                            borderColor="#6300ee"
                            height={40}
                        />
                    </View>

                    <View style={styles.divider}>
                        <Divider />
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20 }}>
                        <Text style={{ fontSize: 25 }}>總價</Text>
                        <Text style={{ fontSize: 25 }}>NT $ {(this.state.quantity) * (this.state.food.price)}</Text>
                    </View>



                    <View style={styles.divider}>
                        <Divider />
                    </View>


                    <View style={{ paddingHorizontal: 20 }}>
                        <Button style={{ elevation: 0 }} labelStyle={{ fontSize: 18 }} mode="contained" onPress={() => this._addToCartPress(this.state.item, this.state.food)}>加入購物車</Button>
                    </View>
                </View>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({

    root: {
        // paddingTop:5,
        padding: 10
    },

    divider: {
        height: 10,
        padding: 10,
        justifyContent: "center"
    },

    title: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center"
    },

    titleText: {
        fontSize: 30,
        paddingLeft: 20,
        paddingTop: 10
    },

    nameAndPrice: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginBottom: 10
    },

    foodName: {
        flexGrow: 10
    },

    foodPrice: {
        flexGrow: 5
    },

    todaySpecialGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20
    },

    imageGroup: {
        paddingHorizontal: 20,
        // paddingVertical:10,
        marginVertical: 10,
        height: 250
    },

    flavorGroup: {
        paddingHorizontal: 20
    },

    flavor: {
        flexDirection: "row",
        alignContent: "center",
        marginVertical: 3
    }
});