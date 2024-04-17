import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/context/auth'
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";
import Gif from 'react-native-gif';
import BottomNav from '../../stickynav';

const Account = () => {

  const [auth, setAuth] = useAuth()
  const navigation = useNavigation();
  const [name, setname] = useState("")

  const handleLogout = async () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    await AsyncStorage.removeItem('auth');
  };

  const GetUser = async () => {
    try {
      const user = await axios.get(`/api/v1/users/get-user/${auth.user._id}`)
      console.log("auth.user._id")
      setname(user.data.user.username)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    GetUser()

  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View >
          <View style={styles.top}>
            <View style={styles.topcontainer}>
              <Image style={styles.img} source={require("../../assets/appacc.gif")} />
              <Text style={styles.topacctx}>Hi, {name}</Text>
            </View>
          </View>
          <View style={styles.bottemcontainer}>
            <View style={styles.blank}></View>
            <TouchableOpacity style={styles.accbtns} activeOpacity={1} onPress={() => { navigation.navigate("Orders") }}>
              <Text style={styles.acctx}>Your Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.accbtns} activeOpacity={1} onPress={() => { navigation.navigate("Address") }}>
              <Text style={styles.acctx}>Your Addresses</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.accbtns} activeOpacity={1} onPress={() => { navigation.navigate("YourProfile") }}>
              <Text style={styles.acctx}>Login & Security</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.accbtns} onPress={handleLogout} activeOpacity={1}>
              <Text style={styles.acctxlg}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  )
}
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: "#004d4d",
    fontSize: "40px",
  },
  img: {
    width: 135,
    height: 100,
    marginLeft: 50,
    marginBottom: 20
  },
  topcontainer: {
    height: 350,
    width: screenWidth,
    marginTop: 80,
    backgroundColor: "#004d4d",
    alignItems: "center",
    justifyContent: "center",
  },
  topacctx: {
    color: "white",
    fontSize: screenWidth * 0.10,
    textAlign:"center"
  },
  bottemcontainer: {
    backgroundColor: "white",
    width: screenWidth,
    alignItems: "center",
    height: 700,
    borderTopLeftRadius: screenWidth * 0.15,
    borderTopRightRadius: screenWidth * 0.15,
    padding: 30
  },
  blank: {
    marginTop: 50,
  },
  accbtns: {
    borderWidth:1,
    borderColor: "	rgb(200,200,200)",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    width: screenWidth * 0.85,
    height: screenWidth * 0.20,
    borderRadius: 10,
  },
  acctx: {
    color: "rgb(0,0,0)",
    fontSize: 30
  },
  acctxlg: {
    color: "rgb(0,0,0)",
    fontSize: 30,
    color: "red"
  },
  tx: {
    fontSize: 70
  },
})

export default Account