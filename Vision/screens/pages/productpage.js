import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,Dimensions} from 'react-native'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from "@react-navigation/native";
import { useCart } from '../../context/context/cart';
import BottomNav from '../../stickynav'
import Headernav from '../../header';

const ProductPage = ({ route }) => {

  const { Productid } = route.params;
  const [cart, setCart] = useCart()
  const [product, setProducts] = useState([]);
  const navigation = useNavigation();
  const [pid, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mrp, setMrp] = useState("");
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState();
  const [Quantity, setQuantity] = useState(1)

  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/product-page/${Productid}`);
      setProducts(data);
      setId(data.product._id);
      setName(data.product.name);
      setDescription(data.product.description);
      setImages(data.product.images);
      setMrp(data.product.mrp);
      setSelectedImage(data.product.images[0]);



    } catch (error) {

    }
  };
  useEffect(() => {
    getSingleProduct();
  }, [Productid]);

  const handleAddToCart = () => {
    const finalqty = [pid, name, images, mrp, Quantity, 0];
    const updatedCart = Array.isArray(cart) ? [...cart, finalqty] : [finalqty];
    setCart(updatedCart);
  };
  const handleBuyNow = () => {
    const finalqty = [pid, name, images, mrp, Quantity, 0];
    const updatedCart = Array.isArray(cart) ? [...cart, finalqty] : [finalqty];
    setCart(updatedCart);
    navigation.navigate("CartPage")
  };
  return (
    <><Headernav />
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.imageContainer}>
            <Image source={{ uri: `https://bz-vision-web.visionwoodenclocks.com/uploads/${selectedImage}` }} style={styles.mainImage} />
            <ScrollView horizontal>
              {images.map((image, index) => (
                <TouchableOpacity key={index} onPress={() => setSelectedImage(image)} style={styles.thumbnailContainer}>
                  <Image source={{ uri: `https://bz-vision-web.visionwoodenclocks.com/uploads/${image}` }} style={styles.thumbnailImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Product Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.mrp}>₹{mrp}.00</Text>
            <Text style={styles.label}>Sales Tax Included</Text>
            <Text style={styles.qlabel}>Quantity</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={Quantity}
                onValueChange={(itemValue) => setQuantity(itemValue)}
                style={styles.quantityPicker}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <Picker.Item key={num} label={num.toString()} style={{color:"rgb(0,0,0)"}} value={num} />
                ))}
              </Picker>
            </View>
            <View style={styles.btncont}>
            <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
              <Text style={styles.addbuttonText}>Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
              <Text style={styles.buybuttonText}>Buy Now</Text>
            </TouchableOpacity>
            </View>
          </View>

          {/* Product Description */}
          <Text style={styles.description}>{description}</Text>
        </ScrollView>
        <BottomNav showHeader={false} />
      </View>
    </>
  )
}
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 90
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  mainImage: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.9,
    marginBottom: 10,
    marginBottom: 20
  },
  quantityPicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    color: "rgb(0,0,0)",
    marginTop: 5,
    marginBottom: 10,
    fontSize: 20
  },
  pickerContainer: {
    borderRadius: 10,
    backgroundColor: "rgb(231, 231, 231)",
    width: screenWidth * 0.3,
    height: 50,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgb(202, 202, 202)",
    justifyContent: "center",
    overflow: 'hidden',
  },
  thumbnailContainer: {
    marginRight: 10,
    marginBottom: 10
  },
  thumbnailImage: {
    width: screenWidth * 0.2,
    height: screenWidth * 0.2,
  },
  detailsContainer: {
    padding: 40
  },
  title: {
    fontSize: 30,
    color:"rgb(0,0,0)"
  },
  mrp: {
    fontSize: 25,
    marginTop: 5,
    color: 'rgb(201, 66, 0)',
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
    color:"rgb(0,0,0)"
  },
  qlabel: {
    marginTop: 10,
    fontSize: 20,
    marginBottom: 5,
    color:"rgb(0,0,0)"
  },
  addToCartButton: {
    backgroundColor: 'rgb(0,0,0)',
    padding: 15,
    width: screenWidth * 0.85,
    borderRadius: 10,
    marginTop: 5,
    height: 60,
    justifyContent: "center",
    alignItems: 'center',
  },
  buyNowButton: {
    backgroundColor: 'rgb(163, 255, 24)',
    padding: 15,
    width: screenWidth * 0.85,
    borderRadius: 10,
    height: 60,
    justifyContent: "center",
    alignItems: 'center',
    marginTop: 20,
  },
  btncont:{
    alignItems:"center",
    justifyContent:"center"
  },
  addbuttonText: {
    color: 'white',
    fontSize: 25,
  },
  buybuttonText: {
    color: 'rgb(0,0,0)',
    fontSize: 25,
  },
  description: {
    padding: 40,
    fontSize: screenWidth * 0.05,
    marginBottom: 90,
    color:"rgb(0,0,0)"
  },
});
export default ProductPage