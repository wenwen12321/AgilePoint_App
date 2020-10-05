import React, { useState } from 'react'
import { View, Text, Dimensions } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import { Rect, Text as TextSVG, Svg } from "react-native-svg";

const LineCharts = (props) => {
    let [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0, label: 0, xoffset: 0, yoffset: 0 })
    var arrrr = JSON.parse(JSON.stringify(props.label));
    if(arrrr.length>20){
        for (var i = 0; i < arrrr.length; i++) {
            if (i % 3 != 0) {
                arrrr[i] = "";
            }
        }
    }

    return (
        <View>
            <LineChart
                data={{
                    labels: arrrr,
                    datasets: [
                        {
                            data: props.data
                        }
                    ]
                }}
                width={props.width}
                height={250}
                verticalLabelRotation={props.rotation}
                yAxisInterval={1}
                yAxisLabel="$"
                fromZero={props.fromZero}
                chartConfig={{
                    backgroundColor: "white",
                    backgroundGradientFrom: "#fbfbfb",
                    backgroundGradientTo: "#fbfbfb",
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 0
                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "0",
                        stroke: "#fbfbfb"
                    }
                }}
                style={{
                    marginVertical: 8,
                    borderRadius: 6
                }}

                decorator={() => {
                    return tooltipPos.visible ? <View>
                        <Svg>
                            <Rect x={tooltipPos.x + tooltipPos.xoffset}
                                y={tooltipPos.y + 10 + tooltipPos.yoffset}
                                width="60"
                                height="50"
                                fill="black" />
                            <TextSVG
                                x={tooltipPos.x + 30 + tooltipPos.xoffset}
                                y={tooltipPos.y + 30 + tooltipPos.yoffset}
                                fill="white"
                                fontSize="16"
                                fontWeight="bold"
                                textAnchor="middle">
                                {tooltipPos.label}
                            </TextSVG>
                            <TextSVG
                                x={tooltipPos.x + 30 + tooltipPos.xoffset}
                                y={tooltipPos.y + 50 + tooltipPos.yoffset}
                                fill="white"
                                fontSize="16"
                                fontWeight="bold"
                                textAnchor="middle">
                                {"$" + tooltipPos.value}
                            </TextSVG>
                        </Svg>
                    </View> : null
                }}

                onDataPointClick={(data) => {
                    console.log(data);
                    var tmp = 0;
                    var yoffset = 0;
                    if (data.x/Dimensions.get("window").width > 0.8) {
                        tmp = -60;
                        console.log(data.index + ":" + tmp);
                    }
                    if (data.y > 190) {
                        yoffset = -70;
                    }
                    let isSamePoint = (tooltipPos.x === data.x
                        && tooltipPos.y === data.y)

                    isSamePoint ? setTooltipPos((previousState) => {
                        return {
                            ...previousState,
                            value: data.value,
                            visible: !previousState.visible
                        }
                    })
                        :
                        setTooltipPos({ x: data.x, value: data.value, yoffset: yoffset, xoffset: tmp, label: props.label[data.index], y: data.y, visible: true });

                }}
            />
        </View>
    )
}

export default LineCharts