import { View, Text, StyleSheet, RefreshControl, ScrollView, Image, TouchableOpacity, Dimensions,Model } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from "react";
import { useCart } from '../../context/context/cart'
import { useAuth } from '../../context/context/auth';
import { useNavigation } from "@react-navigation/native";
import BottomNav from '../../stickynav'
import axios from "axios";

const CartPage = () => {
  const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();
  const [refresh, setrefresh] = useState(false)
  const [qty, setQty] = useState(0);
  const [amount, setAmount] = useState(0);
  const navigation = useNavigation();
  const [shipmodel, setShipmodel] = useState(false);

  let perm = 0
  let updatedCart =[]
  const refsrc = async () => {
    setrefresh(true)
    perm = 0
    getCart();
    setrefresh(false)

  }
 
  useEffect(() => {
      let totalQuantity = cart.reduce((acc, cartItem) => acc + cartItem[4], 0);
      let totalAmount = cart.reduce((acc, cartItem) => acc + cartItem[3] * cartItem[4], 0);
      setQty(totalQuantity);
      setAmount(totalAmount);
          }, [cart]);



  const handleDelete = async (productId) => {
      updatedCart = cart.filter(item => item[0] !== productId);
      setCart(updatedCart);
      console.log("updatcrta",updatedCart)

      if (auth.user) {

          await axios.delete(`/api/v1/cart/delete-cart/${auth.user._id}`);
          syncdelete(updatedCart)

      }

  };

  const servercombineCartItems = (cartItems) => {
      const combiner = [];
      const ids = [];
      const delid = []
      for (let v of cartItems[0]) {
          if (!ids.includes(v[0])) {
              ids.push(v[0]);
              combiner.push(v);
          } else {
              for (let index in combiner) {
                  let c = combiner[index];
                  if (v[0] === c[0]) {
                      if (c[5] > v[5]) {
                          combiner[index] = v;
                          c[5] = c[5] + 1;
                      } else {
                          c[5] = c[5] + 1;
                      }
                  }else{
                    combiner.slice(index,1)
                  }
              }

          }
      }
      return combiner;

  };

  const syncCartWithServer = async () => {
      try {
          const cartData = { items: [] };

          const cartServer = await getCart()
          if (cartServer.length !== 0) {
              let updatedCart = [cartServer, cart];
              const mergedCart = [updatedCart[0].concat(updatedCart[1])]
              const combinedCart = servercombineCartItems(mergedCart);
              console.log("combi",combinedCart)
              for (let arr of combinedCart) {
                  cartData.items.push({
                      product: arr[0],
                      name: arr[1],
                      image: arr[2],
                      mrp: arr[3],
                      quantity: arr[4],
                      updated: arr[5]

                  });
              }
              await axios.put(`/api/v1/cart/create-up-cart/${auth.user._id}`, cartData);
              localStorage.setItem("cart", JSON.stringify(combinedCart));
              console.log("synced with server cart sevrver")
          } else {
              for (let arr of updatedCart) {
                  cartData.items.push({
                      product: arr[0],
                      name: arr[1],
                      image: arr[2],
                      mrp: arr[3],
                      quantity: arr[4],
                      updated: arr[5]

                  });
              }
console.log("dataaaa",cartData)
              await axios.put(`/api/v1/cart/create-up-cart/${auth.user._id}`, cartData);
              console.log("synced with cart ")
          }

      } catch (error) {
      }
  };
  const syncdelete = async (upcart) => {
      try {
          // Assuming your server expects cart data in a specific format
          const cartData = { items: [] };
          for (let arr of upcart) {
              cartData.items.push({
                  product: arr[0],
                  name: arr[1],
                  image: arr[2],
                  mrp: arr[3],
                  quantity: arr[4]

              });
          }
          await axios.put(`/api/v1/cart/create-up-cart/${auth.user._id}`, cartData);
          console.log("Cart synced with server successfully in cart page.");
      } catch (error) {
          console.error("Error syncing cart with server:", error);
      }
  };
  const getCart = async () => {
      try {
          const { data } = await axios.get(`/api/v1/cart/get-cart/${auth.user._id}`);
          const newdata = [];
          for (let arr of data) {
              for (let dat of arr["items"]) {
                  const darray = [
                      dat["product"],
                      dat["name"],
                      dat["image"],
                      dat["mrp"],
                      dat["quantity"],
                      dat["updated"]]
                  newdata.push(darray)

              }
          }
          console.log("getttt")
          if (perm === 0) { setCart(newdata); perm=1; }
          return newdata

      } catch (error) {

      }
  }

  useEffect(() => {
    getCart();
  }, []);
  useEffect(() => {
    let totalQuantity = cart.reduce((acc, cartItem) => acc + cartItem[4], 0);
    let totalAmount = cart.reduce((acc, cartItem) => acc + cartItem[3] * cartItem[4], 0);
    setQty(totalQuantity);
    setAmount(totalAmount);
  }, [cart]);
  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => { refsrc() }}
            colors={['white']}
            progressBackgroundColor="backgroundColor: 'rgb(0, 80, 87)',"
          />
        }
      >
        <>
          {cart.length > 0 ? (
            <View style={styles.mobcart}>
              <View style={styles.mbtndiv}>
                <TouchableOpacity onPress={() => { navigation.navigate("CheckoutPage") }} style={styles.mbuybtn}>
                  <Text style={styles.btnText}>Proceed To Buy</Text>
                </TouchableOpacity>
              </View>
              {cart.map(cartItem => (
                <View style={styles.cartcrd} key={cartItem[0]}>
                  <View style={styles.card}>
                    <Image source={{ uri: `http://52.66.213.190/uploads/${cartItem[2][0]}` }} style={styles.cardImg} />
                    <View style={styles.cardBody}>
                      <Text style={styles.cardTitle}>{cartItem[1]}</Text>
                      <Text style={styles.cardText}>₹{cartItem[3]}</Text>
                      <Text style={styles.cardpr}>Subtotal : ₹{cartItem[3] * cartItem[4]}.00 </Text>
                    </View>
                  </View>
                  <View style={styles.cartItemContainer} >
                    <Picker
                      style={styles.selqty}
                      selectedValue={cartItem[4]}
                      onValueChange={(itemValue, itemIndex) => {
                        const updatedCart = cart.map(item => {
                          if (item[0] === cartItem[0]) {
                            return [...item.slice(0, 4), itemValue, ...item.slice(5)];
                          }
                          return item;
                        });
                        setCart(updatedCart);
                      }}>
                      {[...Array(9)].map((_, index) => (
                        <Picker.Item key={index + 1} label={(index + 1).toString()} value={index + 1} />
                      ))}
                    </Picker>
                    <TouchableOpacity onPress={() => handleDelete(cartItem[0])} style={styles.delcartm}>
                      <Text style={{color:"rgb(0,0,0)"}}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Image source={require('../../assets/6024626.png')} style={styles.cremty} />
          )}
        </>


      </ScrollView>
      <BottomNav />
    </View>
  )
}
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(240,240,240)',
  },
  mobcart: {
    flex: 1,
    marginTop: 100,
    padding: 20,
    alignItems: "center",
    marginBottom: 60
  },
  cartcrd: {
    marginBottom: 10,
    height: "auto",
    marginTop: 20,
    minWidth: screenWidth * 0.9,
    maxWidth: screenWidth * 0.9,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  card: {
    flexDirection: 'row',
    borderColor: '#fff',
    borderRadius: 10,
    padding: 10
  },
  cardImg: {
    margin: 10,
    width: screenWidth * 0.25,
    height: screenWidth * 0.25,
    marginRight: 30
  },
  cardBody: {
    marginTop: 25,
  },
  cardTitle: {
    fontSize: screenWidth * 0.055,
    color:"rgb(0,0,0)"
  },
  cardText: {
    fontSize: screenWidth * 0.05,
    color:"rgb(0,0,0)"
  },
  cardpr: {
    fontSize: screenWidth * 0.05,
    color:'rgb(160, 0, 0)'
  },

  selqty: {
    width: 110,
    marginTop: 5,
    borderRadius: 5,
    height: 10,
    marginRight: 30,
    marginBottom: 20,
    backgroundColor: '#e7e7e7',
    elevation: 5,
  },
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  delcartm: {
    backgroundColor: '#e7e7e7',
    height: 55,
    marginTop: 5,
    width: 120,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  cremty: {
    width: screenWidth,
    height: screenHeight,
    resizeMode: 'contain',
  },
  mbuybtn: {

    backgroundColor: 'rgb(0, 80, 87)',
    padding: 10,
    borderRadius: 10,
    height: 55,
    width: screenWidth * 0.9,
    alignItems: "center",
    justifyContent: "center"
  },
  btnText: {
    color: "white",
    fontSize: 20
  },
  mbtndiv: {
    padding: 10,
  },
});


export default CartPage
