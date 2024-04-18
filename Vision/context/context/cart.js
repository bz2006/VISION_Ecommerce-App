
import React, { useState, useContext, createContext, useEffect } from "react";
 import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./auth";
import axios from "axios";

const CartContext = createContext();
const CartProvider = ({ children }) => {
  const [cartlen, setCartLen] = useState(0);
  const [perm, setPerm] = useState(0);
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useState([]);



  const getCartFromStorage = async () => {
    try {
      const savedCart = await AsyncStorage.getItem("cart");
      if (savedCart !== null) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error retrieving cart from AsyncStorage:", error);
    }
  };

  // const setCartToAsyncStorage = async () => { await AsyncStorage.setItem('cart', JSON.stringify(cart)); }
  //useEffect(() => {getCartFromStorage()},[])
  useEffect(() => {

    if (cart.length > cartlen) {
      const combinedCart = combineCartItems(cart);
      setCart(combinedCart);
      setCartLen(cart.length)
      syncCartWithServer();
    }
    syncCartWithServer();
    //eslint-disable-next-line
  }, [cart]);

  useEffect(() => {
    if (!auth.user) {
    } else {

      if (perm === 0) {

        if (cart.length === 0) {
          getCart();
        } else {
          syncCartWithServer();
        }
      }
      if (cart.length > cartlen) {



        syncCartWithServer()
      }

    }
  }, [cart, auth.user]);
  // added cart to the dependency array


  const combineCartItems = (cartItems) => {
    const combiner = [];
    const ids = [];
    for (let v of cartItems) {
      if (!ids.includes(v[0])) {
        ids.push(v[0]);
        combiner.push(v);
      } else {
        for (let c of combiner) {
          if (v[0] === c[0]) {
            c[4] = c[4] + v[4];
          }
        }
      }
    }
    return combiner;

  };

  const servercombineCartItems = (cartItems) => {
    const combiner = [];
    const ids = [];
    const delid=[]
    for (let v of cartItems[0]) {
      if (!ids.includes(v[0])) {
        ids.push(v[0]);
        combiner.push(v);
      } else {
        for (let index in combiner) {
          let c = combiner[index];
          if (v[0] === c[0]) {
            if (c[5] >= v[5]) {
              combiner[index] = v;
              c[5] = c[5] + 1;
            } else {
              c[5] = c[5] + 1;
            }
          }  else{
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
      } else {
        for (let arr of cart) {
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
      }

    } catch (error) {
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
      if (perm === 0) { setCart(newdata); setPerm(1); }
      return newdata

    } catch (error) {

    }
  }


  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

// custom hook
const useCart = () => useContext(CartContext);

export { useCart, CartProvider };

