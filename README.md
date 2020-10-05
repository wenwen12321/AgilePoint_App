# 使用須知
- ![Mac OS前置作業](https://medium.com/@mingjunlu/how-to-create-a-react-native-project-ab9a35e2427d)
- clone檔案
- 在project資料夾中執行"npm install"
<details><summary>ios</summary>

## 前備
- cocoapods

## 接續步驟
- `cd ios`
- `pod install`
- `cd ..`
- `react-native run-ios`

## 常見問題
### [圖片沒有出現](https://github.com/facebook/react-native/issues/29279#issuecomment-658244428)
### customer首頁不斷出現warning
- 至`node_modules/react-native-banner-carousel/out/Carousel.js`的第298行下新增`useNativeDrive: false`
- ![](https://i.imgur.com/xpzUTR6.png)

</details>

<details><summary>android</summary>

- `react-native run-anroid`
</details>


## 擴充Component請見各資料夾內