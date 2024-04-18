import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react';
import BottomNav from '../../stickynav';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const FeaturedProducts = () => {

  const navigation = useNavigation();
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/shop-products");
      const featuredProducts = data.productList.filter(product => product.isFeatured);
      setProducts(featuredProducts);
    } catch (error) {

    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const renderProductItem = ({ item }) => (
    <TouchableWithoutFeedback onPress={() => { navigation.navigate("ProductPage",{Productid:item._id}) }}>
      
      <View style={styles.productItem}>
        <View style={{alignItems:"center"}}> 
        <Image source={{ uri: `https://bz-vision-web.visionwoodenclocks.com/uploads/${item.images[0]}` }} style={styles.productImage} />
        </View>
        <View style={styles.productText}>
          <View>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>₹{item.mrp}.00</Text>
          <Text style={styles.productTax}>Sales Tax Included</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mcontainer}>
      <FlatList
        data={products}
        horizontal={true}
        renderItem={renderProductItem}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
      />
      </View>
    </SafeAreaView>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mcontainer:{
    marginBottom:40,
    alignItems:"center"
  },
  productItem: {
    elevation:5,
    margin: 10,
    padding: 10,
    minWidth:screenWidth*0.9,
    borderWidth:1,
    maxWidth:screenWidth*0.9,
    backgroundColor: "white",
    borderRadius: 20,
    borderColor:"rgb(0,0,0)",
  },
  productImage: {
    width: screenWidth * 0.75,
    height: screenWidth * 0.75,
    borderRadius: 10,
  },
  productName: {
    color: "rgb(0,0,0)",
    fontSize: 25
  },
  productText:{
   padding:20,
    flexDirection:"row",
    justifyContent:"flex-start"
  },
  productPrice: {
    fontSize: 23,
    color: "rgb(201, 66, 0)",
  },
  productTax: {
    fontSize: 14,
    color: "rgb(0,0,0)",
  },
});

export default FeaturedProducts;
