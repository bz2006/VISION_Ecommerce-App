import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Modal, TouchableOpacity, ScrollView, Text, FlatList } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import axios from "axios"
import Ionicons from 'react-native-vector-icons/Ionicons';
import Headernav from './header';

const BottomNav = ({ showHeader = true }) => {

  const navigation = useNavigation();
  const [Category, SetCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);


  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/users/get-category");
      if (data.success) {
        setCategories(data.category);

      }
    } catch (error) {

    }
  };
  useEffect(() => {
    getAllCategory();
  }, []);

  const renderCategory = ({ item }) => (
    <TouchableOpacity onPress={() => { SetCategoryOpen(false); navigation.navigate('ShopPage', { categoryId: item._id }) }} style={styles.categoryContainer}>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <>
        {showHeader && <Headernav />}
        <View style={styles.container}>
          <Ionicons name="home-outline" style={styles.size} color="rgb(0,0,0)" onPress={() => { navigation.navigate("HomePage") }} />
          <Ionicons name="grid-outline" style={styles.size} color="rgb(0,0,0)" onPress={() => SetCategoryOpen(true)} />
          <Ionicons name="cart-outline" style={styles.size} color="rgb(0,0,0)" onPress={() => { navigation.navigate("CartPage") }} />
          <Ionicons name="person-outline" style={styles.size} color="rgb(0,0,0)" onPress={() => { navigation.navigate("Account") }} />
        </View>
      </>

      <>
        <Modal
          animationType="slide"
          transparent={true}
          visible={Category}
          onRequestClose={() => {
            SetCategoryOpen(false);
          }}
        >

          <View style={styles.modalView}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: 30, color: "rgb(0,0,0)" }}>Categories</Text>
              <Ionicons name="close" size={70} color="rgb(0,0,0)" onPress={() => SetCategoryOpen(false)} />
            </View>
            <View >

              <FlatList
                data={categories}
                renderItem={renderCategory}
                keyExtractor={item => item._id}
                numColumns={2}
                contentContainerStyle={styles.flatListContainer}
              />

            </View>
          </View>

        </Modal>
      </>
    </>

  );
};
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff', // background color of the bottom nav
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderTopColor: "rgb(200,200,200)",
    borderTopWidth: 1,
    right: 0,
    height: screenHeight * 0.08,
  },
  categoryContainer:{
    paddingHorizontal:40,
    padding:10,
  },
  categoryName:{
    fontSize:30,
    color:"rgb(0,0,0)"
  },
  modalView: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: "rgb(220,220,220)",
    elevation: 50,
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 30,
    height: screenHeight / 2.5,
  },
  size: {
    fontSize: screenWidth * 0.1
  }
});

export default BottomNav;
