import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react';
import BottomNav from '../../stickynav';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const ShopPage = ({ route }) => {

  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const { categoryId } = route.params;

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/cat-products/${categoryId}`);
      setProducts(data.productList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProducts(categoryId);
  }, [categoryId]);

  const renderProductItem = ({ item }) => (
    <TouchableWithoutFeedback onPress={() => { navigation.navigate("ProductPage",{Productid:item._id}) }}>
      
      <View style={styles.productItem}>
        <Image source={{ uri: `http://52.66.213.190/uploads/${item.images[0]}` }} style={styles.productImage} />
        <View style={styles.productText}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>₹{item.mrp}.00</Text>
          <Text style={styles.productTax}>Sales Tax Included</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mcontainer}>
      <FlatList
        data={products}
        showsVerticalScrollIndicator={false}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
      />
      </View>
      <BottomNav />
    </SafeAreaView>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(240,240,240)',
  },
  mcontainer:{
    marginTop:90,
    marginBottom:70,
    alignItems:"center"
  },
  productItem: {
    
    flexDirection: 'row',
    margin: 10,
    padding: 10,
    minWidth:screenWidth*0.9,
    maxWidth:screenWidth*0.9,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    alignItems: 'center',
  },
  productImage: {
    width: screenWidth * 0.35,
    height: screenWidth * 0.35,
    borderRadius: 10,
  },
  productText: {
    flex: 1,
    marginLeft: 10,
    color:"rgb(0,0,0)"
  },
  productName: {
    fontSize: 25,
    color:"rgb(0,0,0)"
  },
  productPrice: {
    fontSize: 23,
    color: "rgb(201, 66, 0)",
  },
  productTax: {
    fontSize: 14,
    color: "gray",
  },
});

export default ShopPage;
