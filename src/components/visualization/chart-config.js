/**
 * @param {Object} vm vue实例化对象this   畅销
 */
let bestOptions = function (vm) {
    return {
        grid: {
            left: 40,
            top:20,
            bottom:80,
            right: 0,
        },
        trigger: 'axis',
        legend: {
            data: vm.name,
            textStyle:{//图例文字的样式
                color:'#fff',
                fontSize:14,
            },
            x:"center",
            y:"top",
        },
        // toolbox: {
        //     show : true,
        //     feature : {
        //         dataView : {show: true, readOnly: false},
        //         magicType : {show: true, type: ['line', 'bar']},
        //         restore : {show: true},
        //         saveAsImage : {show: true}
        //     }
        // },
        tooltip: {  // 鼠标悬浮提示
            trigger: 'item',
            axisPointer: {
                animation: false,
                type: 'none'                                // 去掉提示线
            },
        },
        calculable : true,
        animation: true,
        xAxis : [
            {
                type : 'category',
                data : vm.map(ele => ele.item_name),
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#87a0dc',                  // 更改坐标轴文字颜色
                        fontSize : 10,                     // 更改坐标轴文字大小
                    },
                    interval: 0,
                    rotate:25,
                },
                axisTick: {
                    show: false
                },
                axisLine:{
                    lineStyle:{
                        color:'#6076ad'                   // 更改坐标轴颜色
                    }
                }
            },
            
                
        ],
        yAxis : [
            {
                type : 'value',
                splitLine: {
                    lineStyle: {
                        color: ['#1a2a42']               // 使用深浅的间隔色
                    }
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                    color: '#87a0dc',                    // 更改坐标轴文字颜色
                    fontSize : 12,                       // 更改坐标轴文字大小
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine:{
                    lineStyle:{
                        color:'#6076ad'                // 更改坐标轴颜色
                    }
                }
            }
        ],
        series : [
            {
                name:vm.name,
                barWidth : 30,//柱图宽度
                type:'bar',
                data: vm.map(ele => ele.money),
                itemStyle: {
                    normal: {
        　　　　　　　　//这里是重点
                        // color: function(params) {
                        //     //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                        //     var colorList = [ '#ca8622','#249cf9', '#67e0e3','#fdb628','#30ace1','#2f646e','#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',];
                        //     return colorList[params.dataIndex]
                        // }
                        //每个柱子的颜色即为colorList数组里的每一项,如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                  //每个柱子的颜色即为colorList数组里的每一项,如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                    color: function(params) {
                        var index = params.dataIndex;
                        var colorList = [
                        // 渐变颜色的色值和透明度
                        //透明度从0
                        ['rgba(15,235,255,0)','rgba(15,235,255,0)','rgba(15,235,255,0)','rgba(15,235,255,0)','rgba(15,235,255,0)','rgba(15,235,255,0)','rgba(15,235,255,0)','rgba(13,94,208,0)','rgba(255,155,15,0)','rgba(253,103,96,0)'],
                        //到透明度1 ,如果需要不同的颜色直接修改不同颜色即可
                        ['rgba(15,235,255,0.6)','rgba(15,235,255,0.6)','rgba(15,235,255,0.6)','rgba(15,235,255,0.6)','rgba(15,235,255,0.6)','rgba(15,235,255,0.6)','rgba(15,235,255,0.6)','rgba(13,94,208,0.6)','rgba(255,155,15,0.6)','rgba(253,103,96,0.6)']
                        ];
                        return {
                            colorStops: [
                                {
                                    offset: 0,   //颜色的开始位置
                                    color: colorList[0][index] // 0% 处的颜色
                                },
                                {
                                    offset:0.6,    //颜色的结束位置
                                    color: colorList[1][index] // 100% 处的颜色
                                }
                            ]}
                        }
                    }
                },
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ],
                    label: {
                        color: '#fe536c', // 最大值最小值的标注颜色
                        fontWeight: 'bold',
                    }
                },
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            },
        ]
    }
    // return{
    //     tooltip : {
    //         trigger: 'axis',
    //         axisPointer: {
    //             type: 'cross',
    //             label: {
    //                 backgroundColor: '#6a7985'
    //             }
    //         }
    //     },
    //     legend: {
    //     data:['销售额'],
    //     textStyle:{//图例文字的样式
    //         color:'#ca8622',
    //         fontSize:14,
    //     },
    //         x:"center",
    //         y:"top",
    //     },
    //     toolbox: {
    //         show : true,
    //         feature : {
    //             dataView : {show: true, readOnly: false},
    //             magicType : {show: true, type: ['line', 'bar']},
    //             restore : {show: true},
    //             saveAsImage : {show: true}
    //         }
    //     },
    //     grid: {
    //         left: '3%',
    //         right: '4%',
    //         bottom: '3%',
    //         containLabel: true
    //     },
    //     xAxis : [
    //         {
    //             type : 'category',
    //             boundaryGap : false,
    //             data : vm.map(ele => ele.item_name),
    //             axisLabel: {
    //             show: true,
    //             textStyle: {
    //                 color: '#87a0dc',  //更改坐标轴文字颜色
    //                 fontSize : 12     //更改坐标轴文字大小
    //                 }
    //             },
    //             axisTick: {
    //                 show: false
    //             },
    //             axisLine:{
    //                 lineStyle:{
    //                     color:'#6076ad' //更改坐标轴颜色
    //                 }
    //             }
    //         }
    //     ],
    //     yAxis : [
    //         {
    //             type : 'value',
    //             splitLine: {
    //                 lineStyle: {
    //                     // 使用深浅的间隔色
    //                     color: ['#1a2a42']
    //                 }
    //             },
    //             axisLabel: {
    //                 show: true,
    //                  textStyle: {
    //                    color: '#87a0dc',  //更改坐标轴文字颜色
    //                    fontSize : 12,      //更改坐标轴文字大小
    //                  }
    //               },
    //               axisTick: {
    //                   show: false
    //               },
    //               axisLine:{
    //                   lineStyle:{
    //                      color:'#6076ad' //更改坐标轴颜色
    //                   }
    //             }
    //         }
    //     ],
    //     series : [
    //         {
    //             name:'销售额',
    //             type:'line',
    //             stack: '总量',
    //             symbolSize:8,   //拐点圆的大小
    //             color:['#16fa89'],  //折线条的颜色
    //             label: {
    //                 normal: {
    //                     show: true,
    //                     position: 'top',
    //                     color: '#ca8622'
    //                 }
    //             },
    //             // areaStyle: {normal: {}},
    //             data: vm.map(ele => ele.realamt)
    //         }
    //     ]
    // }
}

/**
 * 滞销
 */
let unsalableOptions = function (vm) {
    return {
        grid: {
            left: 40,
            top:45,
            bottom:20,
            right: 20
        },
        trigger: 'axis',
        legend: {
            data:['销售额'],
            textStyle:{//图例文字的样式
                color:'#fff',
                fontSize:14,
            },
            x:"center",
            y:"top",
        },
        toolbox: {
            show : true,
            feature : {
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        tooltip: {  // 鼠标悬浮提示
            trigger: 'axis',
            axisPointer: {
                animation: false,
                type: 'none'  // 去掉提示线
            }
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                axisLabel: {
                    show: true,
                     textStyle: {
                       color: '#87a0dc',  //更改坐标轴文字颜色
                       fontSize : 12     //更改坐标轴文字大小
                     }
                  },
                  axisTick: {
                      show: false
                  },
                  axisLine:{
                    lineStyle:{
                        color:'#6076ad' //更改坐标轴颜色
                    }
                }
            },
            
                
        ],
        yAxis : [
            {
                type : 'value',
                splitLine: {
                    lineStyle: {
                        // 使用深浅的间隔色
                        color: ['#1a2a42']
                    }
                },
                axisLabel: {
                    show: true,
                     textStyle: {
                       color: '#87a0dc',  //更改坐标轴文字颜色
                       fontSize : 12,      //更改坐标轴文字大小
                     }
                  },
                  axisTick: {
                      show: false
                  },
                  axisLine:{
                      lineStyle:{
                         color:'#6076ad' //更改坐标轴颜色
                      }
                }
            }
        ],
        series : [
            {
                name:'销售额',
                type:'bar',
                barWidth : 30,//柱图宽度
                data:[56.3,13,65,98,45,62,5,48,23,58,15,24,],
                itemStyle: {
                    normal: {
        　　　　　　　　//这里是重点
                        color: function(params) {
                            //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                            var colorList = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83', '#ca8622','#249cf9', '#67e0e3','#fdb628','#30ace1','#2f646e'];
                            return colorList[params.dataIndex]
                        }
                    }
                },
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ],
                    label: {
                        color: '#000', // 最大值最小值的标注颜色
                        fontWeight: 'bold'
                    }
                },
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            },
        ]
    }
}

/**
 * 目标完成率
 */
let goalRateOptions = function(vm) {
    return {
        tooltip : {
            formatter: "{a} <br/>{c} {b}"
        },
        calculable : true,
        series : [
            {
                name:'完成率',
                type:'gauge',
                min:0,
                max:100,
                radius: '90%',
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: [[0.09, 'lime'],[0.82, '#1e90ff'],[1, '#ff4500']],
                        width: 3,
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisLabel: {            // 坐标轴小标记
                    textStyle: {       // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length :8,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                splitLine: {           // 分隔线
                    length :10,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        width:1,
                        color: '#fff',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                pointer: {           // 分隔线
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 5
                },
                title : {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 14,
                        fontStyle: 'italic',
                        color: '#fff',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                detail : {
                    backgroundColor: 'rgba(30,144,255,0.8)',
                    borderWidth: 1,
                    borderColor: '#fff',
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 5,
                    offsetCenter: [0, '60%'],       // x, y，单位px
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        // fontWeight: 'bolder',
                        color: '#fff',
                        fontSize: 18
                    }
                },
                data:[{value: 99.9, name: '目标完成率'}]
            },
        ]
    }
}

/**
 * 大宗交易占比
 */
let transactionOptions = function(vm) {
    return {
        tooltip : {
            formatter: "{a} <br/>{c} {b}"
        },
        calculable : true,
        series : [
            {
                name:'大宗交易占比',
                type:'gauge',
                min:0,
                max:100,
                radius: '90%',
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: [[0.09, 'lime'],[0.82, '#1e90ff'],[1, '#ff4500']],
                        width: 3,
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisLabel: {            // 坐标轴小标记
                    textStyle: {       // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length :8,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                splitLine: {           // 分隔线
                    length :10,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        width:1,
                        color: '#fff',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                pointer: {           // 分隔线
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 5
                },
                title : {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 14,
                        fontStyle: 'italic',
                        color: '#fff',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                detail : {
                    backgroundColor: 'rgba(30,144,255,0.8)',
                    borderWidth: 1,
                    borderColor: '#fff',
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 5,
                    offsetCenter: [0, '80%'],       // x, y，单位px
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        // fontWeight: 'bolder',
                        color: '#fff',
                        fontSize: 18
                    }
                },
                data:[{value: vm.substring(0,vm.length-1), name: '大宗交易占比'}]
            },
        ]
    }
}



/**
 * 库存TOP10
 */
let stockOptions = function(vm) {
    return {
        grid: {
            left: 50,
            top:40,
            bottom:80,
            right: 0,
        },
        trigger: 'axis',
        legend: {
            data:vm.name,
            textStyle:{//图例文字的样式
                color:'#fff',
                fontSize:14,
            },
            x:"center",
            y:"top",
        },
        // toolbox: {
        //     show : true,
        //     feature : {
        //         dataView : {show: true, readOnly: false},
        //         magicType : {show: true, type: ['line', 'bar']},
        //         restore : {show: true},
        //         saveAsImage : {show: true}
        //     }
        // },
        tooltip: {  // 鼠标悬浮提示
            trigger: 'item',
            axisPointer: {
                animation: false,
                type: 'none'                                // 去掉提示线
            },
        },
        // tooltip: {  // 鼠标悬浮提示
        //     trigger: 'axis',
        //     axisPointer: {
        //         animation: false,
        //         type: 'none'  // 去掉提示线
        //     }
        // },
        calculable : true,
        animation: true,
        xAxis : [
            {
                type : 'category',
                data : vm.map(ele => ele.NAME),
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#87a0dc',  //更改坐标轴文字颜色
                        fontSize : 10,     //更改坐标轴文字大小
                    },
                    interval: 0,
                    rotate:20,
                  },
                  axisTick: {
                      show: false
                  },
                  axisLine:{
                    lineStyle:{
                        color:'#6076ad' //更改坐标轴颜色
                    }
                }
            },
            
                
        ],
        yAxis : [
            {
                type : 'value',
                splitLine: {
                    lineStyle: {
                        // 使用深浅的间隔色
                        color: ['#1a2a42']
                    }
                },
                axisLabel: {
                    show: true,
                     textStyle: {
                       color: '#87a0dc',  //更改坐标轴文字颜色
                       fontSize : 12,      //更改坐标轴文字大小
                     }
                  },
                  axisTick: {
                      show: false
                  },
                  axisLine:{
                      lineStyle:{
                         color:'#6076ad' //更改坐标轴颜色
                      }
                }
            }
        ],
        series : [
            {
                name:vm.NAME,
                barWidth : 30,//柱图宽度
                type:'bar',
                data: vm.map(ele => ele.QTY),
                itemStyle: {
                    normal: {
        　　　　　　　　//这里是重点
                        color: function(params) {
                            //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                            var colorList = ['#34ff31','#fe536c','#249cf9','#ff6302','#adff2f', '#00ffff', '#61a0a8', '#d48265', '#d19cff', '#c3f9f9']
                            // var colorList = [ '#ca8622','#249cf9', '#67e0e3','#fdb628','#30ace1','#2f646e','#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',];
                            return colorList[params.dataIndex]
                        }
                        //每个柱子的颜色即为colorList数组里的每一项,如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                  //每个柱子的颜色即为colorList数组里的每一项,如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                    // color: function(params) {
                    //     var index = params.dataIndex;
                    //     var colorList = [
                    //     // 渐变颜色的色值和透明度
                    //     //透明度从0
                    //     ['rgba(254,83,108,0)','rgba(254,83,108,0)','rgba(254,83,108,0)','rgba(254,83,108,0)','rgba(254,83,108,0)','rgba(254,83,108,0)','rgba(254,83,108,0)','rgba(13,94,208,0)','rgba(255,155,15,0)','rgba(253,103,96,0)'],
                    //     //到透明度1 ,如果需要不同的颜色直接修改不同颜色即可
                    //     ['rgba(254,83,108,0.6)','rgba(254,83,108,0.6)','rgba(254,83,108,0.6)','rgba(254,83,108,0.6)','rgba(254,83,108,0.6)','rgba(254,83,108,0.6)','rgba(254,83,108,0.6)','rgba(13,94,208,0.6)','rgba(255,155,15,0.6)','rgba(253,103,96,0.6)']
                    //     ];
                    //     return {
                    //         colorStops: [
                    //             {
                    //                 offset: 0,   //颜色的开始位置
                    //                 color: colorList[0][index] // 0% 处的颜色
                    //             },
                    //             {
                    //                 offset:0.6,    //颜色的结束位置
                    //                 color: colorList[1][index] // 100% 处的颜色
                    //             }
                    //         ]}
                    //     }
                    }
                },
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ],
                    label: {
                        color: '#fe536c', // 最大值最小值的标注颜色
                        fontWeight: 'bold',
                    }
                },
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            },
        ]
    }
    // return {
    //     tooltip : {
    //         trigger: 'axis',
    //         axisPointer: {
    //             type: 'cross',
    //             label: {
    //                 backgroundColor: '#6a7985'
    //             }
    //         }
    //     },
    //     legend: {
    //     data:['库存量'],
    //     textStyle:{//图例文字的样式
    //         color:'#d4237a',
    //         fontSize:14,
    //     },
    //         x:"center",
    //         y:"top",
    //     },
    //     toolbox: {
    //         show : true,
    //         feature : {
    //             dataView : {show: true, readOnly: false},
    //             magicType : {show: true, type: ['line', 'bar']},
    //             restore : {show: true},
    //             saveAsImage : {show: true}
    //         }
    //     },
    //     grid: {
    //         left: 30,
    //         top:40,
    //         bottom:100,
    //         right: 10,
    //         // left: '3%',
    //         // right: '4%',
    //         // bottom: '3%',
    //         // containLabel: true
    //     },
    //     xAxis : [
    //         {
    //             type : 'category',
    //             boundaryGap : false,
    //             data : vm.map(ele => ele.NAME),
    //             axisLabel: {
    //                 show: true,
    //                 textStyle: {
    //                     color: '#87a0dc',  //更改坐标轴文字颜色
    //                     fontSize: 10    //更改坐标轴文字大小
    //                 },
    //                 interval: 0,
    //                 rotate:30,   
    //             },
    //             axisTick: {
    //                 show: false
    //             },
    //             axisLine:{
    //                 lineStyle:{
    //                     color:'#6076ad' //更改坐标轴颜色
    //                 },
    //             }
    //         }
    //     ],
    //     yAxis : [
    //         {
    //             type : 'value',
    //             splitLine: {
    //                 lineStyle: {
    //                     // 使用深浅的间隔色
    //                     color: ['#1a2a42']
    //                 }
    //             },
    //             axisLabel: {
    //                 show: true,
    //                 textStyle: {
    //                 color: '#87a0dc',  //更改坐标轴文字颜色
    //                 fontSize : 12,      //更改坐标轴文字大小
    //                 }
    //             },
    //             axisTick: {
    //                 show: false
    //             },
    //             axisLine:{
    //                 lineStyle:{
    //                     color:'#fff' //更改坐标轴颜色
    //                 }
    //             }
    //         }
    //     ],
    //     series : [
    //         {
    //             name:'库存量',
    //             type:'line',
    //             stack: '总量',
    //             symbolSize:8,   //拐点圆的大小
    //             color:['#efda4d'],  //折线条的颜色
    //             label: {
    //                 normal: {
    //                     show: true,
    //                     position: 'top',
    //                     color: '#d4237a'
    //                 }
    //             },
    //             //折线平滑
    //             smooth : true,
    //             symbol : 'circle',
    //             symbolSize : 6,
    //             //线条样式
    //             lineStyle : {
    //                 color : {
    //                     type : 'linear',
    //                     x : 0,
    //                     y : 0,
    //                     x2 : 0,
    //                     y2 : 1,
    //                     colorStops : [ {
    //                         offset : 0,
    //                         // 0% 处的颜色
    //                         color : '#6ae6dd'
    //                     }, {
    //                         offset : 1,
    //                         // 100% 处的颜色
    //                         color : '#efda4d'
    //                     } ],
    //                     globalCoord : false
    //                 },
    //                 width : 2,
    //                 type : 'solid',
    //             },
    //             //折线连接点样式
    //             itemStyle : {
    //                 color : '#249cf9',
    //             },
    //             //折线堆积区域样式
    //             areaStyle : {
    //                 color : '#004c5E'
    //             },
    //             data: vm.map(ele => ele.QMQTY)
    //         }
    //     ]
    // }
}

/**
 * 连带率
 */
let jointOptions = function(vm) {
    return {
        tooltip : {
            formatter: "{a} <br/>{c} {b}"
        },
        calculable : true,
        animation: true,
        series : [
            {
                name:'连带率',
                type:'gauge',
                min:0,
                max:100,
                radius: '85%',
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: [[0.09, 'lime'],[0.82, '#1e90ff'],[1, '#ff4500']],
                        width: 3,
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisLabel: {            // 坐标轴小标记
                    textStyle: {       // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length :8,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                splitLine: {           // 分隔线
                    length :10,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        width:1,
                        color: '#fff',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                pointer: {           // 分隔线
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 5
                },
                title : {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 14,
                        fontStyle: 'italic',
                        color: '#fff',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                detail : {
                    backgroundColor: 'rgba(30,144,255,0.8)',
                    borderWidth: 1,
                    borderColor: '#fff',
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 5,
                    offsetCenter: [0, '55%'],       // x, y，单位px  
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        // fontWeight: 'bolder',
                        color: '#fff',
                        fontSize: 18
                    }
                },
                data:[{value: vm, name: '连带率'}]
            },
        ]
    }
}

/**
 * 动销率
 */
let movableOptions = function(vm) {
    return {
        tooltip : {
            formatter: "{a} <br/>{c} {b}"
        },
        calculable : true,
        series : [
            {
                name:'动销率',
                type:'gauge',
                min:0,
                max:100,
                radius: '90%',  // 仪表盘大小
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: [[0.09, 'lime'],[0.82, '#1e90ff'],[1, '#ff4500']],
                        width: 3,
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisLabel: {            // 坐标轴小标记
                    textStyle: {       // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length :8,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                splitLine: {           // 分隔线
                    length :10,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        width:1,
                        color: '#fff',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                pointer: {           // 分隔线
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 5
                },
                title : {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 14,
                        fontStyle: 'italic',
                        color: '#fff',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                detail : {
                    backgroundColor: 'rgba(30,144,255,0.8)',
                    borderWidth: 1,
                    borderColor: '#fff',
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 5,
                    offsetCenter: [0, '80%'],       // x, y，单位px
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        // fontWeight: 'bolder',
                        color: '#fff',
                        fontSize: 18
                    }
                },
                data:[{value: vm.substring(0,vm.length-1), name: '动销率'}]
            },
        ]
    }
}

/**
 * 
 * 品类结构大类占比 
 */
let categoryOptions = function(vm) {
    return {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            bottom: 20,
            left: 'center',
            textStyle: {
                color: '#fff'
            },
            data:vm.map(ele =>ele.name)
        },
        color:['#34ff31','#fe536c','#249cf9','#ff6302','#adff2f', '#00ffff', '#61a0a8', '#d48265', '#d19cff', '#c3f9f9'],
        series: [
            // {
            //     name:'分类结构占比',
            //     type:'pie',
            //     selectedMode: 'single',
            //     radius: [0, '30%'],
            //     center : ['45%', '35%'],
            //     label: {
            //         normal: {
            //             position: 'inner'
            //         }
            //     },
            //     labelLine: {
            //         normal: {
            //             show: false
            //         }
            //     },
            //     data:[
            //         {value:335, name:'家居百货', selected:true},
            //         {value:679, name:'健康美容'},
            //         {value:1548, name:'饰品系列'}
            //     ]
            // },
            {
                name:'品类结构大类占比',
                type:'pie',
                radius: ['20%', '55%'],
                center : ['55%', '40%'],
                data: vm,
            }
        ]
    }
}

/**
 * 品类结构中类占比
 */
let middleOptions = function(vm) {
    return {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            bottom: 20,
            left: 'center',
            textStyle: {
                color: '#fff'
            },
            data:vm.map(ele =>ele.name)
        },
        color:['#34ff31','#fe536c','#249cf9','#ff6302','#adff2f', '#00ffff', '#61a0a8', '#d48265', '#d19cff', '#c3f9f9'],
        series: [
            // {
            //     name:'分类结构占比',
            //     type:'pie',
            //     selectedMode: 'single',
            //     radius: [0, '30%'],
            //     center : ['45%', '35%'],
            //     label: {
            //         normal: {
            //             position: 'inner'
            //         }
            //     },
            //     labelLine: {
            //         normal: {
            //             show: false
            //         }
            //     },
            //     data:[
            //         {value:335, name:'家居百货', selected:true},
            //         {value:679, name:'健康美容'},
            //         {value:1548, name:'饰品系列'}
            //     ]
            // },
            {
                name:'品类结构中类占比',
                type:'pie',
                radius: ['20%', '55%'],
                center : ['55%', '40%'],
                data: vm,
            }
        ]
    }
}


/**
 *  品类结构小类占比
 */
let subgroupOptions = function(vm) {
    return {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            bottom: 20,
            left: 'center',
            textStyle: {
                color: '#fff'
            },
            data:vm.map(ele =>ele.name)
        },
        color:['#ff6302','#adff2f','#34ff31','#fe536c','#61a0a8', '#d48265', '#d19cff', '#c3f9f9','#249cf9', '#00ffff'],
        series: [
            // {
            //     name:'分类结构占比',
            //     type:'pie',
            //     selectedMode: 'single',
            //     radius: [0, '30%'],
            //     center : ['45%', '35%'],
            //     label: {
            //         normal: {
            //             position: 'inner'
            //         }
            //     },
            //     labelLine: {
            //         normal: {
            //             show: false
            //         }
            //     },
            //     data:[
            //         {value:335, name:'家居百货', selected:true},
            //         {value:679, name:'健康美容'},
            //         {value:1548, name:'饰品系列'}
            //     ]
            // },
            {
                name:'品类结构小类占比',
                type:'pie',
                radius: ['20%', '45%'],
                center : ['55%', '40%'],
                data: vm,
            }
        ]
    }
}



/**
 *  价位段占比
 */
let priceRatioOptions = function(vm) {
    return {
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            bottom: 10,
            left: 'center',
            textStyle: {
                color: '#fff'
            },
            data: vm.map(ele => ele.name)
        },
        color: ['#fe536c', '#01feff', '#34ff31', '#ffff77', '#c3f9f9','#249cf9', '#d19cff'],
        series : [
            {
                name: '价位段占比',
                type: 'pie',
                selectedMode: 'single',
                radius : '55%',
                center: ['50%', '45%'],
                data: vm,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }
} 

/**
 * 区域总销售额走势
 */
let salesTrendOptions = function(vm,bm) {
    return {
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            // formatter: "{a} <br/>{c} {b}",
            formatter:function(params){ 
                let value=params[1].value;
                switch(value) {
                    case 0:
                       params[1].value='工作日';
                        break;
                    case 1:
                        params[1].value='法定节假日'
                        break;
                    case 2:
                        params[1].value='节假日调休补班'
                        break;
                    case 3:
                       params[1].value='休息日'
                        break;
                }
                return '<p>销售额：'+params[0].value+'</p><p>'+params[1].value+'</p>';
            }
        },
        calculable : true,
        animation: true,
        legend: {
        data:['销售额','假日'],
        textStyle:{//图例文字的样式
            color:'#fff',
            fontSize: 22,
        },
            x:"center",
            y:"top",
        },
        toolbox: {
            show : true,
            feature : {
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        grid: {
            left: 80,
            top:80,
            bottom:120,
            right: 50,
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : vm.map(ele => ele.fildate),
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#87a0dc',  //更改坐标轴文字颜色
                        fontSize: 10    //更改坐标轴文字大小
                    },
                    interval: 0,
                    rotate:30,   
                },
                axisTick: {
                    show: false
                },
                axisLine:{
                    lineStyle:{
                        color:'#6076ad' //更改坐标轴颜色
                    },
                }
            }
        ],
        yAxis : [
            {
                type : 'value',
                splitLine: {
                    lineStyle: {
                        // 使用深浅的间隔色
                        color: ['#1a2a42']
                    }
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                    color: '#87a0dc',  //更改坐标轴文字颜色
                    fontSize : 12,      //更改坐标轴文字大小
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine:{
                    lineStyle:{
                        color:'#fff' //更改坐标轴颜色
                    }
                }
            }
        ],
        
        series : [
            {
                name:'销售额',
                type:'line',
                stack: '总量',
                symbolSize:8,   //拐点圆的大小
                color:['#efda4d'],  //折线条的颜色
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        color: '#d4237a'
                    }
                },
                //折线平滑
                smooth : true,
                symbol : 'circle',
                symbolSize : 6,
                //线条样式
                lineStyle : {
                    color : {
                        type : 'linear',
                        x : 0,
                        y : 0,
                        x2 : 0,
                        y2 : 1,
                        colorStops : [ {
                            offset : 0,
                            // 0% 处的颜色
                            color : '#fff'
                        }, {
                            offset : 1,
                            // 100% 处的颜色
                            color : '#efda4d'
                        } ],
                        globalCoord : false
                    },
                    width : 2,
                    type : 'solid',
                },
                //折线连接点样式
                itemStyle : {
                    color : '#249cf9',
                },
                //折线堆积区域样式
                areaStyle : {
                    color : '#004c5E'
                },
                data: vm.map(ele => ele.realamt),
            },
            {
                name:'假日',
                type:'line',
                data: bm.map(ele =>ele.code), 
                
            }
        ]
    }
}
/**
 * 门店总销售额走势
 */
let vsalesTrendOptions = function(vm,bm,cm) {
    return {
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            // formatter: function (params) { 
            //     console.log(params,params.length)
            // }               
            formatter:function(params){ 
                let value=params[2].value;
                let weather=params[1].value;
                switch(value) {
                    case 0:
                       params[2].value='工作日';
                        break;
                    case 1:
                        params[2].value='法定节假日'
                        break;
                    case 2:
                        params[2].value='节假日调休补班'
                        break;
                    case 3:
                       params[2].value='休息日'
                        break;
                }
                switch(weather) {
                    case 1:
                       params[1].value='晴';
                        break;
                    case 2:
                        params[1].value='多云'
                        break;
                    case 3:
                        params[1].value='阴'
                        break;
                    case 4:
                       params[1].value='小雨'
                        break;
                    case 5:
                       params[1].value='阵雨'
                        break;
                    case 6:
                       params[1].value='大雨'
                        break;
                }
                return '<p>销售额：'+params[0].value+'</p><p>'+params[2].value+'</p><p>天气:'+params[1].value;
            }
        },
        calculable : true,
        animation: true,
        legend: {
        data:['销售额','天气','假日'],
        textStyle:{//图例文字的样式
            color:'#fff',
            fontSize: 22,
        },
            x:"center",
            y:"top",
        },
        toolbox: {
            show : true,
            feature : {
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        grid: {
            left: 80,
            top:80,
            bottom:120,
            right: 50,
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : vm.map(ele => ele.fildate),
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#87a0dc',  //更改坐标轴文字颜色
                        fontSize: 10    //更改坐标轴文字大小
                    },
                    interval: 0,
                    rotate:30,   
                },
                axisTick: {
                    show: false
                },
                axisLine:{
                    lineStyle:{
                        color:'#6076ad' //更改坐标轴颜色
                    },
                }
            }
        ],
        yAxis : [
            {
                type : 'value',
                splitLine: {
                    lineStyle: {
                        // 使用深浅的间隔色
                        color: ['#1a2a42']
                    }
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                    color: '#87a0dc',  //更改坐标轴文字颜色
                    fontSize : 12,      //更改坐标轴文字大小
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine:{
                    lineStyle:{
                        color:'#fff' //更改坐标轴颜色
                    }
                }
            }
        ],
        
        series : [
            {
                name:'销售额',
                type:'line',
                stack: '总量',
                symbolSize:8,   //拐点圆的大小
                color:['#efda4d'],  //折线条的颜色
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        color: '#d4237a'
                    }
                },
                //折线平滑
                smooth : true,
                symbol : 'circle',
                symbolSize : 6,
                //线条样式
                lineStyle : {
                    color : {
                        type : 'linear',
                        x : 0,
                        y : 0,
                        x2 : 0,
                        y2 : 1,
                        colorStops : [ {
                            offset : 0,
                            // 0% 处的颜色
                            color : '#fff'
                        }, {
                            offset : 1,
                            // 100% 处的颜色
                            color : '#efda4d'
                        } ],
                        globalCoord : false
                    },
                    width : 2,
                    type : 'solid',
                },
                //折线连接点样式
                itemStyle : {
                    color : '#249cf9',
                },
                //折线堆积区域样式
                areaStyle : {
                    color : '#004c5E'
                },
                data: vm.map(ele => ele.realamt),
            },
            {
                name:'天气',
                type:'line',
                stack: '总量',
                data: cm.map(ele =>ele.weather), 
                
            },
            {
                name:'假日',
                type:'line',
                stack: '总量',
                data: bm.map(ele =>ele.code), 
                
            },
            
        ]
    }
}
/**
 * 畅销TOP 10单个商品销售额走势和总销售额走势
 */
let goodsTrendOptions = function(vm) {
    let goodsName = vm.goods_trend[0].item_name;
    return {
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        calculable : true,
        animation: true,
        legend: {
        data:['总销售额',goodsName ],
        textStyle:{//图例文字的样式
            color:'#fff',
            fontSize: 22,
        },
            x:"center",
            y:"top",
        },
        toolbox: {
            show : true,
            feature : {
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        grid: {
            left: 80,
            top:80,
            bottom:120,
            right: 50,
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : vm.total_trend.map(ele => ele.rvctime),
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#87a0dc',  //更改坐标轴文字颜色
                        fontSize: 10    //更改坐标轴文字大小
                    },
                    interval: 0,
                    rotate:30,   
                },
                axisTick: {
                    show: false
                },
                axisLine:{
                    lineStyle:{
                        color:'#6076ad' //更改坐标轴颜色
                    },
                }
            }
        ],
        yAxis : [
            {
                type : 'value',
                splitLine: {
                    lineStyle: {
                        // 使用深浅的间隔色
                        color: ['#1a2a42']
                    }
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                    color: '#87a0dc',  //更改坐标轴文字颜色
                    fontSize : 12,      //更改坐标轴文字大小
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine:{
                    lineStyle:{
                        color:'#fff' //更改坐标轴颜色
                    }
                }
            }
        ],
        series : [
            {
                name:'总销售额',
                type:'line',
                color:['#fe536c'],  //折线条的颜色
                //折线平滑
                smooth : true,
                symbol : 'circle',
                symbolSize : 6,
                data:vm.total_trend.map(ele => ele.realamt),
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
            {
                name: goodsName,
                type:'line',
                color:['#01feff'],  //折线条的颜色
                //折线平滑
                smooth : true,
                symbol : 'circle',
                symbolSize : 6,
                data: vm.goods_trend.map(ele => ele.realamt),
                markPoint: {
                    data: [
                        {name: '最低', value: -2, xAxis: 1, yAxis: -1.5}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'},
                        [{
                            symbol: 'none',
                            x: '90%',
                            yAxis: 'max'
                        }, {
                            symbol: 'circle',
                            label: {
                                normal: {
                                    position: 'start',
                                    formatter: '最大值'
                                }
                            },
                            type: 'max',
                            name: '最高点'
                        }]
                    ]
                }
            }
        ]
    }
}

export{
    unsalableOptions,         // 滞销
    bestOptions,              // 畅销
    goalRateOptions,          // 目标完成率
    stockOptions,             // 库存TOP10
    transactionOptions,       // 大宗交易占比
    jointOptions,             // 连带率
    priceRatioOptions,        // 价位段占比
    movableOptions,           // 动销率
    categoryOptions,          // 品类结构大类占比
    middleOptions,            // 品类结构中类占比
    subgroupOptions,          // 品类结构小类占比
    salesTrendOptions,        // 区域总销售额走势
    vsalesTrendOptions,        // 门店总销售额走势
    goodsTrendOptions,        // 畅销TOP 10单个商品销售额走势和总销售额走势
    kuncun,
}