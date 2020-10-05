import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

/*function PersonalProfileComponent() {
  const PersonalProfileUserName = () => {
    const [text, setText] = React.useState('');
    const onChangeText = text => setText(text);

    const hasErrors = () => {
      return !text.includes('@');
    };

    return (
      <View>
        <TextInput label="姓名" value={text} onChangeText={onChangeText} />
        <HelperText type="error" visible={hasErrors()}>
          Email address is invalid!
   </HelperText>
      </View>
    );
  };
}*/

const PersonalProfileUserName = () => {
  const [text, setText] = React.useState('');

   const onChangeText = text => setText(text);
   const onChangeUserName = userName => setText(userName);
   const onChangeEmail = email => setText(email);
   const onChangePhoneNumber = phoneNumber => setText(phoneNumber);

  const hasErrors = () => {
    return !text.includes('@');
  };

 return (
    <View>
      <TextInput label="姓名" value={text} onChangeText={onChangeText} />
      {/*<TextInput label="Email" value={text} onChangeText={onChangeText} />
      <TextInput label="電話號碼" value={text} onChangeText={onChangeText} />
      <HelperText type="error" visible={hasErrors()}>
        Email address is invalid!
 </HelperText>*/}
    </View>
  );
};

const PersonalProfileEmail = () => {
  const [text, setText] = React.useState('');

   const onChangeText = text => setText(text);
   const onChangeEmail = email => setText(email);
   const onChangePhoneNumber = phoneNumber => setText(phoneNumber);

  const hasErrors = () => {
    return !text.includes('@');
  };

 return (
    <View>
      <TextInput label="Email" value={text} onChangeText={onChangeText} />
      {/*<HelperText type="error" visible={hasErrors()}>
        Email address is invalid!
 </HelperText>*/}
    </View>
  );
};

const PersonalProfilePhoneNumber = () => {
  const [text, setText] = React.useState('');

   const onChangeText = text => setText(text);

  const hasErrors = () => {
    return !text.includes('@');
  };

 return (
    <View>
      <TextInput label="電話號碼" value={text} onChangeText={onChangeText} />
 
     {/*} <HelperText type="error" visible={hasErrors()}>
        Email address is invalid!
 </HelperText>*/}
    </View>
  );
};

const PersonalProfileAddress = () => {
  const [text, setText] = React.useState('');

   const onChangeText = text => setText(text);

  const hasErrors = () => {
    return !text.includes('@');
  };

 return (
    <View>
      <TextInput label="我的地址" value={text} onChangeText={onChangeText} />

     {/*} <HelperText type="error" visible={hasErrors()}>
        Email address is invalid!
 </HelperText>*/}
    </View>
  );
};

export default class PersonalProfile extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        text : '123456'
      };
    }

    render() {
        return (
          <View>
            <Text style={styles.titleText}>聯絡資訊</Text>  
            <PersonalProfileUserName/>
            <PersonalProfileEmail/>
            <PersonalProfilePhoneNumber/>
            
            <Text style={styles.titleText}>我的地址</Text>
            <PersonalProfileAddress/>

            <View style={{display: "flex", flexDirection: "row" ,justifyContent: "center"}}>
              <Button contentStyle={styles.saveButton} labelStyle={{ fontSize: 22 }} style={styles.saveButton} mode="contained">儲存</Button>
            </View>
          </View>
      
        )
      } 
    };

    const styles = StyleSheet.create({
        titleText : {
            fontSize : 20,
            backgroundColor: 'lightgray',
            textAlign: "center",
        },

        saveButton: {
          height: 50,
          width: 150,
          backgroundColor: 'gray',
      }
    });