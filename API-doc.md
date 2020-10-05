## URL 格式
### Meals    
- 取得所有meals GET -> /{storeId}/meals
    ``` json
    [
        {
            id: 1,  //MenuType__u.MenuTypeID__u
            type: "米食",   //MenuType__u.MenuTypeName__u
            items: [
                {
                    id: 1,  //Meal__u.MealID__u
                    name: "肉絲炒飯",   //Meal__u.MealName__u
                    price: 65,  //Meal__u.MealPrice__u
                    checked: true   //Meal__u.MealSoldOut__u
                }
            ]
        }
    ]
    ```
- 新增單一個meal POST -> /{storeId}/meals
    ``` json
    {
        foodDescription: "",    //Meal__u.MealDescription__u，可能為空
        todaySpecial: false,    //Meal__u.MealToday__u
        foodName: "肉絲炒飯",   //Meal__u.MealName__u
        foodPrice: 65,  //Meal__u.MealPrice__u
        foodIsSoldOut: true,   //Meal__u.MealSoldOut__u
        foodTypeID: 1,   //Menu__u.MenuTypeID__u
        calories: 666,  //Meal__u.MealCalorie__u，可能為空
        imageUri: "https://i.imgur.com/gSwhoIJ.jpg", //Meal__u.MealImagePath__u，可能為空
        flavors: [
            {
                id: 1,  //FlavorType__u.FlavorTypeID__u
                name: "辣度",   //FlavorType__u.FlavorTypeName__u
                isRequired: false,
                isMultiple: false,
                items: [
                    {
                        flavorID: 1,    //Flavor__u.FlavorID__u
                        flavorName: "不辣", //Flavor__u.FlavorName__u
                        extraPrice: 0   //Flavor__u.ExtraPrice__u
                    },
                    {
                        flavorID: 2,    //Flavor__u.FlavorID__u
                        flavorName: "小辣", //Flavor__u.FlavorName__u
                        extraPrice: 0   //Flavor__u.ExtraPrice__u
                    },
                ]
            }
        ]
    }
    ```
- 取得單一個meal GET -> /{storeId}/meals/{mealId}
    ``` json
    {
        storeName: "store1" //Store__u.StoreName__u
        foodDescription: "",    //Meal__u.MealDescription__u，可能為空
        todaySpecial: false,    //Meal__u.MealToday__u
        foodName: "肉絲炒飯",   //Meal__u.MealName__u
        foodPrice: 65,  //Meal__u.MealPrice__u
        foodIsSoldOut: true,   //Meal__u.MealSoldOut__u
        foodTypeID: 1,   //Menu__u.MenuTypeID__u
        foodType: "麵食",    //Menu__u.MenuTypeName__u
        calories: 666,  //Meal__u.MealCalorie__u，可能為空
        imageUri: "https://i.imgur.com/gSwhoIJ.jpg" //Meal__u.MealImagePath__u，可能為空
    }
    ```
- 修改單一個meal PUT -> /{storeId}/meals/{mealId}
    ``` json
    {
        foodDescription: "",    //Meal__u.MealDescription__u，可能為空
        todaySpecial: false,    //Meal__u.MealToday__u
        foodName: "肉絲炒飯",   //Meal__u.MealName__u
        foodPrice: 65,  //Meal__u.MealPrice__u
        foodIsSoldOut: true,   //Meal__u.MealSoldOut__u
        foodTypeID: 1,   //Menu__u.MenuTypeID__u
        calories: 666,  //Meal__u.MealCalorie__u，可能為空
        imageUri: "https://i.imgur.com/gSwhoIJ.jpg" //Meal__u.MealImagePath__u，可能為空
    }
    ```
- 刪除單一個meal DELETE -> /{storeID}/meals/{mealID}

- 移動一個meal的MenuType PUT -> /{storeID}/meals/{mealID}/menuType
    ``` json
    {
        menuTypeID: 1   //Meal__u.MenuTypeID__u
    }
    ```
- 更改單一個meal的銷售狀態 PUT -> /{store}/meals/{mealID}/mealSoldOut
    ``` json
    {
        mealSoldOut: true   //Meal__u.MealSoldOut__u
    }
    ```
- 顧客端單一餐廳的所有meal一覽 GET > /customer/{storeID}/meals
    ``` json
    {
        storeID: 1,
        stroeName : "通化粉圓冰品",
        menu: [
            {
                mealtype: "今日特餐",
                mealList: [
                    {
                        mealName: "招牌粉圓愛玉檸檬冰",
                        mealID: 1,
                        mealDescription: "",
                        mealPrice: 48,
                        img :  "1.jpg"
                    }
                ],
            },
            {
                mealtype: "冰品",
                mealList: [
                    {
                        mealName: "招牌粉圓愛玉檸檬冰",
                        mealID: 1,
                        mealDescription: "",
                        mealPrice: 48,
                        img :  "1.jpg"
                    },
                    {
                        mealName: "招牌粉圓綠豆冰",
                        mealID: 2,
                        mealDescription: "",
                        mealPrice: 48,
                        img : "2.jpg"
                    },
                    {
                        mealName: "招牌黑砂糖冰",
                        mealID: 3,
                        mealDescription: "",
                        mealPrice: 48,
                        img : "3.jpg"
                    },
                ],
            }
        ]        
    }
    ```
    
- 取得所有餐廳的今日特餐列表 GET -> /todaySpecial
    ``` json
    {
        title: "今日特餐",
        store: [
            {
                storeID: 1,
                storeName: "王記牛肉麵",
                mealList: [
                    {
                        mealName: "招牌粉圓愛玉檸檬冰",
                        mealID: 1,
                        mealDescription: "",
                        mealPrice: 48,
                        img :  "1.jpg"
                    }
                ],
            }
        ]        
    }
    ```

### Analytics
- 取得一間餐廳的分析報表資料 GET -> /{storeID}/analytics
    ``` json
    {
        dayRevenue: 1200,   //當天銷售金額
        monthRevenue: 20000,    //當月銷售金額
        mealRanking: [  //當月銷售排行，可能10個吧
            [1,"蝦仁炒飯",50,3000],  //分別為[排名,餐點名稱,銷售份數,總銷售金額(加上extraPrice的)]
            [2,"拉麵",20, 2000]
        ],
        historyHourRevenue: {   //過去12小時營業額
            hour: ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"]
            revenue: [100,100,100,100,100,100,100,100,100,100,100,100]
        }
        historyWeekRevenue: {    //過去7天的日營業額
            date: ["7/22","7/23","7/24","7/25","7/26","7/27","7/28"],
            revenue: [1200,1200,1200,1200,1200,1200,1200]
        },
        historyDayRevenue: {    //過去一個月的日營業額
            date: [],
            revenue: []
        }
    }
    ```

### MenuType
- 取得一store的所有MenuType GET -> /{storeID}/menuType
    ``` json
    [
        {
            menuTypeID: 1,
            menuTypeName: "米食"
        }
    ]
    ```
- 新增一個MenuType POST -> /{storeID}/menuType
    ``` json
    {
        MenuTypeName:"米食" //MenuType__u.MenuTypeName__u
    }
    ```
- 刪除一個MenuType DELETE -> {storeID}/menuType/{menuTypeID}

### Flavor
- 取得單一meal的flavors GET -> /{storeId}/meals/{mealId}/flavors
    ``` json
    {
        flavors: [
            {
                id: 1,  //FlavorType__u.FlavorTypeID__u
                name: "辣度",   //FlavorType__u.FlavorTypeName__u
                isRequired: false,
                isMultiple: false,
                items: [
                    {
                        flavorID: 1,    //Flavor__u.FlavorID__u
                        flavorName: "不辣", //Flavor__u.FlavorName__u
                        extraPrice: 0   //Flavor__u.ExtraPrice__u
                    },
                    {
                        flavorID: 2,    //Flavor__u.FlavorID__u
                        flavorName: "小辣", //Flavor__u.FlavorName__u
                        extraPrice: 0   //Flavor__u.ExtraPrice__u
                    },
                ]
            }
        ]
    }
    ```
- 新增一meal的單一flavors POST -> /{storeId}/meals/{mealId}/flavors
    ``` json
    {
        name: "辣度",   //FlavorType__u.FlavorTypeName__u
        isRequired: false,  //新欄位，預設值為false，表示必填與否
        isMultiple: false,  //新欄位，預設值為false，表示可複選與否
        items: [
            {
                change:"C",
                flavorName: "不辣", //Flavor__u.FlavorName__u
                extraPrice: 0   //Flavor__u.ExtraPrice__u
            },
            {
                change:"C",
                flavorName: "小辣", //Flavor__u.FlavorName__u
                extraPrice: 0   //Flavor__u.ExtraPrice__u
            },
        ]
    }
    ```
- 編輯一meal的單一flavors PUT -> /{storeId}/meals/{mealId}/flavors/{flavorTypeID}
    ``` json
    [
        {
            change:"C",
            flavorName: "不辣", //Flavor__u.FlavorName__u
            extraPrice: 0   //Flavor__u.ExtraPrice__u
        },
        {
            change:"D",
            flavorID: 2 //Flavor__u.FlavorID__u
            flavorName: "小辣", //Flavor__u.FlavorName__u
            extraPrice: 0   //Flavor__u.ExtraPrice__u
        },
    ]
    ```

### FlavorType
- 刪除一meal的單一flavorType DELETE->/{storeID}/meals/{mealID}/flavors/{flavorTypeID}

- 編輯一meal的單一flavorTtype PUT ->/{storeID}/meals/{mealID}/flavorTypes/{flavorTypeID}
    ``` json
    {
        name: "辣度",   //FlavorType__u.FlavorTypeName__u
        isRequired: false,  //新欄位，預設值為false，表示必填與否
        isMultiple: false,  //新欄位，預設值為false，表示可複選與否
    }
    ```

### Cart
- 將單一meal加入購物車 POST -> /{userID}/cart
    ``` json
    {
        storeID: 1,    //或是storeName("滷肉飯偉琪")，Store__u.storeID__u,
        mealID: 1,   //Meal__u.MealID__u
        flavors: [  //可能會有很多口味選擇，eg.辣度、蔥量、醬料
            {
                flavorTypeID: 1,    //eg.辣度，FlavorType__u.flavorTypeID__u，有可能會重複(因為isMultiple是true的話)
                flavorName: 3 //eg.小辣，Flavor__u.FlavorName__u
            }
        ]
        quantity: 2,
        memo: "不要餐具",   //可能為空
    }
    ```
- 取得一會員所有的購物車內容 GET -> /{userID}/cart
    ``` json
    [
        {
            storeID: 1,
            storeName: "滷肉飯偉琪",
            cartItem:[
                {
                    cartItemID: 1
                    mealID: 1,
                    mealName: "忍者燒肉丼",
                    calories: 666,
                    price: 120, //加上extraPrice後的價格，所以同種mealName可能會因為不同的flavors而有不同的price
                    flavors: [  //可能會有很多口味選擇，eg.辣度、蔥量、醬料
                        {
                            flavorTypeID: 1,    //eg.辣度，FlavorType__u.flavorTypeID__u
                            flavorID: 3 //eg.小辣，Flavor__u.Flavor__ID
                            flavorName: "小辣",
                            extraPrice: 0
                        }
                    ],
                    memo: "不要餐具",
                    quantity: 2,
                    imageUri: "https://i.imgur.com/gSwhoIJ.jpg" //Meal__u.MealImagePath__u
                }
            ]
        },
        {

        }
    ]
    ```
- 將單一meal自購物車移除 DELETE -> /{userID}/cart/{cartItemID}

- 編輯購物車內容(eg.更改數量、備註) PUT -> /{userID}/cart/{cartItemID}
    ``` json
    {
        quantity: 2,
        memo: "不要餐具",
    }
    ```
- 使用者下訂餐點 POST -> /{userID}/orderFromCart
    ``` json
    [
        {
            storeID:1,
            memo:"可樂去冰"
        }
    ]
    ```

### Order
- 取得某一餐廳目前的所有訂單 GET -> /{StoreID}/currentOrders
    ``` json
    {   //多筆, Order_u.status_u須為 0 or 1 or 2
        { 
            id: "#AB0001", // 這個沒有在資料庫裡, 可以用ID加上日期之類的產生
            status: 0, //eg.0, Order_u.Status_u
            orderDate: new Date(), //eg. 2020/6/15 12:00:00, Order_u.CREATED_DATE
            orderPrice:120, //Order_u.Price
            orderItems: [ //Order_u.OrderID_u == OrderItem_u.OrderID, 最多取三筆
                {
                    id: 0, //eg.0, OrderItem_u.OrderItemID_u
                    name: "牛肉麵", //OrderItem_u.MealID_u == Meal_u.MealID, Meal_u.MealName_u
                    memo: "不蔥小辣", //這個沒有在資料庫裡, 可用OrderItem_u.Memo_u or OrderItem_u.Flavor_u
                    quantity: 1, //OrderItem_u.Quantity_u
                    mealPrice: 95, //OrderItem_u.MealID_u = Meal_u.MealID, Meal_u.MealPrice
                    flavors: [
                        {
                            flavorType:"辣度",
                            flavor:"小辣"
                        }
                    ]
                },
            ],
        },
    }
    ```
- 取得某一餐廳歷史的所有訂單 GET -> /{StoreID}/historyOrders
    ``` json
    {   //多筆, Order_u.status_u須 > 2 and != 99
        { 
            id: "#AB0001", // 這個沒有在資料庫裡, 可以用ID加上日期之類的產生
            status: 3, //eg.0, Order_u.Status_u
            orderDate: new Date(), //eg. 2020/6/15 12:00:00, Order_u.CREATED_DATE
            orderPrice: 120, //Order_u.Price
            orderItems: [ //Order_u.OrderID_u == OrderItem_u.OrderID, 最多取三筆
                {
                    id: 0, //eg.0, OrderItem_u.OrderItemID_u
                    name: "牛肉麵", //OrderItem_u.MealID_u == Meal_u.MealID, Meal_u.MealName_u
                    memo: "不蔥小辣", //這個沒有在資料庫裡, 可用OrderItem_u.Memo_u or OrderItem_u.Flavor_u
                    quantity: 1, //OrderItem_u.Quantity_u
                    mealPrice: 95, //OrderItem_u.MealID_u = Meal_u.MealID, Meal_u.MealPrice
                    flavors: [
                        {
                            flavorType:"辣度",
                            flavor:"小辣"
                        }
                    ]
                },
            ],
        },
    }
    ```
- 取得某一訂單的詳細資料 GET -> /{orderID}/orders/detail   
    ``` json
    {
        id: "#AB0001", // 這個沒有在資料庫裡, 可以用ID加上日期之類的產生
        status: 0, //eg.0, Order_u.Status_u
        orderDate: new Date(), //eg. 2020/6/15 12:00:00, Order_u.CREATED_DATE
        orderMemo: "", //Order_u.Memo_u
        orderPrice: 475, //Order_u.Price
        totalOrder: 10, //該使用者所有訂單筆數(status==3 && status==4)
        completeOrder: 10   //使用者已取訂單筆數(status==4, 應該會<=totalOrder)
        orderItems: [ //Order_u.OrderID_u == OrderItem_u.OrderID
            {
                id: 0, //eg.0, OrderItem_u.OrderItemID_u
                name: "牛肉麵", //OrderItem_u.MealID_u == Meal_u.MealID, Meal_u.MealName_u
                memo: "不蔥小辣", //這個沒有在資料庫裡, 可用OrderItem_u.Memo_u or OrderItem_u.Flavor_u
                quantity: 1, //OrderItem_u.Quantity_u
                mealPrice: 95, //OrderItem_u.MealID_u = Meal_u.MealID, Meal_u.MealPrice
                flavors: [
                    {
                        flavorType:"辣度",
                        flavor:"小辣",
                        extraPrice: 0
                    }
                ]
            },
        ],
    }
    ```
- 變更某一訂單的狀態 PUT -> /{orderID}/orders/status 
    ``` json
    {   //只變動status
        id: "#AB0001", // 這個沒有在資料庫裡, 可以用ID加上日期之類的產生
        status: 1, //此為變動項, Order_u.Status_u
        orderDate: new Date(), //eg. 2020/6/15 12:00:00, Order_u.CREATED_DATE
        orderMemo: "", //Order_u.Memo_u
        orderPrice: 475, //Order_u.Price
        orderItems: [ //Order_u.OrderID_u == OrderItem_u.OrderID
            {
                id: 0, //eg.0, OrderItem_u.OrderItemID_u
                name: "牛肉麵", //OrderItem_u.MealID_u == Meal_u.MealID, Meal_u.MealName_u
                memo: "不蔥小辣", //這個沒有在資料庫裡, 可用OrderItem_u.Memo_u or OrderItem_u.Flavor_u
                quantity: 1, //OrderItem_u.Quantity_u
                mealPrice: 95, //OrderItem_u.MealID_u = Meal_u.MealID, Meal_u.MealPrice
            },
        ],
    }
    ``` 

- 刪除某一訂單的 PUT -> /{orderID}/orders/delete
    ``` json
    {   //status變為99
        id: "#AB0001", // 這個沒有在資料庫裡, 可以用ID加上日期之類的產生
        status: 1, //此為變動項, Order_u.Status_u
        orderDate: new Date(), //eg. 2020/6/15 12:00:00, Order_u.CREATED_DATE
        orderMemo: "", //Order_u.Memo_u
        orderPrice: 475, //Order_u.Price
        orderItems: [ //Order_u.OrderID_u == OrderItem_u.OrderID
            {
                id: 0, //eg.0, OrderItem_u.OrderItemID_u
                name: "牛肉麵", //OrderItem_u.MealID_u == Meal_u.MealID, Meal_u.MealName_u
                memo: "不蔥小辣", //這個沒有在資料庫裡, 可用OrderItem_u.Memo_u or OrderItem_u.Flavor_u
                quantity: 1, //OrderItem_u.Quantity_u
                mealPrice: 95, //OrderItem_u.MealID_u = Meal_u.MealID, Meal_u.MealPrice
            },
        ],
    }
    ``` 

- 取得某一顧客目前的所有訂單 GET -> customer/{UserID}/currentOrders
 ``` json
    {   //多筆, Order_u.status_u須為 0 or 1 or 2
        { 
            id: "#AB0001", // 這個沒有在資料庫裡, 可以用ID加上日期之類的產生
            store: "滷肉飯偉琪", //餐廳名稱, StoreName_u
            status: 0, //eg.0, Order_u.Status_u
            orderDate: new Date(), //eg. 2020/6/15 12:00:00, Order_u.CREATED_DATE
            orderItems: [ //Order_u.OrderID_u == OrderItem_u.OrderID, 最多取三筆
                {
                    id: 0, //eg.0, OrderItem_u.OrderItemID_u
                    name: "牛肉麵", //OrderItem_u.MealID_u == Meal_u.MealID, Meal_u.MealName_u
                    memo: "不蔥小辣", //這個沒有在資料庫裡, 可用OrderItem_u.Memo_u or OrderItem_u.Flavor_u
                    quantity: 1, //OrderItem_u.Quantity_u
                    mealPrice: 95, //OrderItem_u.MealID_u = Meal_u.MealID, Meal_u.MealPrice
                    flavors: [
                        {
                            flavorType:"辣度",
                            flavor:"小辣"
                        }
                    ]
                },
            ],
        },
    }
    ```

- 取得顧客某一訂單的詳細資料 GET -> customer/{orderID}/orders/detail   
    ``` json
    {
        id: "#AB0001", // 這個沒有在資料庫裡, 可以用ID加上日期之類的產生
        store: "滷肉飯偉琪", //餐廳名稱, StoreName_u
        status: 0, //eg.0, Order_u.Status_u
        orderDate: new Date(), //eg. 2020/6/15 12:00:00, Order_u.CREATED_DATE
        orderMemo: "", //Order_u.Memo_u
        orderPrice: 475, //Order_u.Price
        orderItems: [ //Order_u.OrderID_u == OrderItem_u.OrderID
            {
                id: 0, //eg.0, OrderItem_u.OrderItemID_u
                name: "牛肉麵", //OrderItem_u.MealID_u == Meal_u.MealID, Meal_u.MealName_u
                memo: "不蔥小辣", //這個沒有在資料庫裡, 可用OrderItem_u.Memo_u or OrderItem_u.Flavor_u
                quantity: 1, //OrderItem_u.Quantity_u
                mealPrice: 95, //OrderItem_u.MealID_u = Meal_u.MealID, Meal_u.MealPrice
                flavors: [
                        {
                            flavorType:"辣度",
                            flavor:"小辣",
                            extraPrice: 0
                        }
                    ]
            },
        ],
    }
```
    
    
### Search
    
- 取得單一個meal POST -> /meals/search
    
``` json
    {
            storeID: 1  //Store__u.StoreID__u
            id: 1,  //Meal__u.MealID__u
            name: "肉絲炒飯",   //Meal__u.MealName__u
            price: 65,  //Meal__u.MealPrice__u
            imageUri: "https://i.imgur.com/gSwhoIJ.jpg" //Meal__u.MealImagePath__u
    }
```

### User
- 修改user密碼 POST -> /password/edit
``` json
    {
        email: user1@gmail.com,
        oldPassword: password1,
        newPassword: asdf1234,
        newPassword_Confirmed: asdf1234
    }
```

- 新增管理者 POST -> /store/addSupervisor
``` json
    {
        storeID:1,  //欲管理的店家ID
        email:"manager@gmail.com",  //欲新增的管理者email
    }
```

- 獲得store的資訊 GET -> /{storeID}/storeInfo
``` json
    {
        storeName: "老王牛肉麵",
        storeImg: "https://i.imgur.com/gSwhoIJ.jpg"
    }
```

- 更新store的資訊 PUT -> /{storeID}/storeInfo
``` json
    {
        storeName: "老王牛肉麵",
        storeImg: "afsafdsafdewwrqr23r" //base64圖片資訊，餐廳照片，原本沒有這欄
    }
```

- 更新帳戶資訊 PUT -> /{userID}/userInfo
``` json
    {
        userName: "user1",
        userAvatar: "afqwr23143wersdf" //base64圖片資訊，使用者的頭貼，原本似乎沒有這欄
    }
```

### Main
- 獲得首頁資料 GET -> /main
目前共4種type

<details><summary>type 0, 可以連結到餐廳頁面</summary>
    
![](https://imgur.com/k2hScMj.png)
</details>

<details><summary>type 1, 可以連結到餐點詳細</summary>
    
![](https://imgur.com/pXFxshM.png)
</details>

<details><summary>type 2, card view, 可以連結到餐廳頁面</summary>
    
![](https://imgur.com/9oUSmH3.png)
</details>

<details><summary>type 3, 餐點排行, 可以連結到餐點詳細</summary>
    
![](https://imgur.com/ExsDtrm.png)
</details>

<details><summary>type 4, 廣告輪播的內容</summary>
    
![](https://i.imgur.com/4N7dFl3.png)
</details>

``` json
    {
        componentArr: [
        {
          type: 0,  //type 0, 可以連結到餐廳頁面
          title: '精選餐廳',    //admin自行設定的title
          data: [
            {
              id: 1,    //storeID
              img: "https://i.imgur.com/gSwhoIJ.jpg",   //餐廳照片，目前好像還沒有
              name: "通化粉圓冰品"  //storeName
            },
            {
              id: 2,
              img: "https://i.imgur.com/gSwhoIJ.jpg",
              name: "好喝珍奶"
            },
          ]
        },
        {
          type: 1,  //type 1, 可以連結到餐點詳細
          title: '永遠吃不膩',  //admin自行設定的title
          data: [
            {
              storeID: 1,   //storeID
              mealID: 1,    //mealID
              img: "https://i.imgur.com/gSwhoIJ.jpg",   //餐點照片
              name: "好吃拉麵"  //mealName
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
          type: 2,  //type 2, card view, 可以連結到餐廳頁面
          data: [
            {
              img: 'https://i.imgur.com/gSwhoIJ.jpg',   //餐廳照片，目前好像還沒有
              subtitle: '第一學生餐廳', //餐廳所在商場
              storeName: '老王牛肉麵',  //storeName
              storeID: 1, //storeID
              memo: '台北CP值超高平價牛肉麵 || 只要129元起' //餐廳的描述，但目前好像沒有
            },
            {
              img: 'https://cdn.walkerland.com.tw/images/upload/subject/2019/12/59108c83df7d408c34161d0999da946c16d40193.jpg',
              subtitle: '第一學生餐廳',
              storeName: '好吃拉麵',
              storeID: 1,
              memo: '東京最夯人氣拉麵 || 不排隊吃不到'
            },
          ]
        },
        {
          type: 3,  //type 3, 餐點排行, 可以連結到餐點詳細
          title: '餐點人氣排行',    //admin自行設定的title
          data: [   //餐點排名，不限數量，但初期可以先傳前5名即可
            {
              storeID: 1,   //storeID
              mealID: 1,  //mealID
              img: "https://i.imgur.com/gSwhoIJ.jpg",   //mealImagePath
              mealName: "好吃拉麵", //mealName
              storeName: "store1",  //storeName
              description: "超好吃的拉麵!!" //mealDescription
            },
            {
              storeID: 1,
              meal: 1,
              img: "https://i.imgur.com/gSwhoIJ.jpg",
              mealName: "好吃拉麵",
              storeName: "store1",
              description: "超好吃的拉麵!!"
            },
            {
              storeID: 1,
              meal: 1,
              img: "https://i.imgur.com/gSwhoIJ.jpg",
              mealName: "好吃拉麵",
              storeName: "store1",
              description: "超好吃的拉麵!!"
            },
            {
              storeID: 1,
              meal: 1,
              img: "https://i.imgur.com/gSwhoIJ.jpg",
              mealName: "好吃拉麵",
              storeName: "store1",
              description: "超好吃的拉麵!!"
            },
            {
              storeID: 1,
              meal: 1,
              img: "https://i.imgur.com/gSwhoIJ.jpg",
              mealName: "好吃拉麵",
              storeName: "store1",
              description: "超好吃的拉麵!!"
            },
          ]
        },
        {
          type: 4,  //輪播動畫
          data: [
            {
              act: "link",  //點擊圖片後可開啟url連結
              img: "https://i.imgur.com/gSwhoIJ.jpg",
              url: "https://google.com"
            },
            {
              act: "img",   //純圖片
              img: "https://i.imgur.com/gSwhoIJ.jpg",
            },
            {
              act: "scene", //可連結到app內的scene
              img: "https://i.imgur.com/gSwhoIJ.jpg",
              sceneName: "mealDetail",  //scene name, 內容物可以是mealDetail或是restaurantPage或其他任何scene
              prop: {   //要傳過去的props，如mealDetail要傳storeID和mealID，restaurantPage要傳storeID
                storeID: 1,
                mealID: 1
              }
            }
          ]
        },
      ]
    }
```

### ChoosingGame

- 獲得ChoosingGame結果 GET -> /choosingGame/store

```json
    {
     img: 'https://i.imgur.com/gSwhoIJ.jpg',   //餐廳照片，目前好像還沒有
     subtitle: '第一學生餐廳', //餐廳所在商場
     storeName: '老王牛肉麵',  //storeName
     storeID: 1, //storeID
     memo: '台北CP值超高平價牛肉麵 || 只要129元起' //餐廳的描述，但目前好像沒有
    }
```

- 獲得ChoosingGame結果 GET -> /choosingGame/meal

```json
    {
     storeID: 1, //storeID
     mealID : 1, //mealID
     img: 'https://i.imgur.com/gSwhoIJ.jpg',   //餐點照片
     mealName : '好吃拉麵'
    }
```
