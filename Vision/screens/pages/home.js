import { View, Text, StyleSheet, Button, Image, Dimensions, ScrollView } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/context/auth'
import { useNavigation } from "@react-navigation/native";
import BottomNav from '../../stickynav';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Linking } from 'react-native';
import FeaturedProducts from './Featuresproducts';
import { SafeAreaView } from 'react-native-safe-area-context';


const HomePage = () => {


  const openURL = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView >
        <View style={{ alignItems: "center" }}>
          <Image style={styles.mimg} source={{ uri: "http://43.205.242.76/uploads/home_logo_2p.png" }} />
          <Text style={styles.fptx}>Featured Products</Text>
      
          <FeaturedProducts />
          <View style={styles.social}>
            <Ionicons name="logo-instagram" style={styles.size} color="rgb(0,0,0)" onPress={() => { openURL('https://www.instagram.com/visionquartzclocks/'); }} />
            <Ionicons name="logo-facebook" style={styles.size} color="rgb(0,0,0)" onPress={() => { openURL(' https://www.facebook.com/people/Vision-Quartz-Clocks/100066549950071/') }} />
            <Ionicons name="logo-youtube" style={styles.size} color="rgb(0,0,0)" onPress={() => { openURL('https://www.youtube.com/@visionquartzclocks') }} />
            <Ionicons name="logo-amazon" style={styles.size} color="rgb(0,0,0)" onPress={() => { openURL(' https://www.amazon.in/stores/VISION/page/63FB3294-7BFA-48DB-A46C-23A6902067E4?ref_=ast_bln') }} />
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
    flex: 1,
    backgroundColor: '#fff',

    paddingTop: 90,
    fontSize: "40px"
  },
  tx: {
    fontSize: 70,
    color: "rgb(0,0,0)"
  },
  content: {
    flex: 1,
    // Adjust as needed
    alignItems:"center",
  },
  mimg: {
    width: screenWidth * 0.95,
    height: screenHeight * 0.47,
    borderRadius: 20,
  },
  fptx: {
    fontSize: 30,
    margin: 20,
    marginTop: 40,
    color: "rgb(0,0,0)"
  },
  social: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 100,
    paddingHorizontal: 20,
    width: screenWidth * 0.8,
  },
  size: {
    fontSize: 50
  },
})

export default HomePage