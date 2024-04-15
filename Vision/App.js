import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from './context/context/auth';
import { CartProvider } from './context/context/cart';
import Login from './screens/auth/login';
import Signup from './screens/auth/signup';
import axios from "axios";
import HomePage from './screens/pages/home';
import ShopPage from './screens/pages/shop';
import ProductPage from './screens/pages/productpage';
import CartPage from './screens/pages/cart';
import Account from './screens/pages/account';
import Orders from './screens/pages/orders';
import OrderDetails from './screens/pages/orderDetails';
import Address from './screens/pages/Aaddress';
import CheckoutPage from './screens/pages/Checkout';
import YourProfile from './screens/pages/Login&security';

const Stack = createNativeStackNavigator();
axios.defaults.baseURL = "http://192.168.1.39:3002"


export default function App() {

  return (
    <NavigationContainer>
      <AuthProvider>
        <CartProvider>
        <AppNavigator />
        </CartProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}

const AppNavigator = () => {
  const [auth] = useAuth();
  return (
    <Stack.Navigator initialRouteName='HomePage'>
      {auth.user ? (
        <>
          <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
          <Stack.Screen name="ShopPage" component={ShopPage} options={{ headerShown: false }} />
          <Stack.Screen name="ProductPage" component={ProductPage} options={{ headerShown: false }} />
          <Stack.Screen name="CartPage" component={CartPage} options={{ headerShown: false }} />
          <Stack.Screen name="Account" component={Account} options={{ headerShown: false }} />
          <Stack.Screen name="Orders" component={Orders} options={{ headerShown: false }} />
          <Stack.Screen name="OrderDetails" component={OrderDetails} options={{ headerShown: false }} />
          <Stack.Screen name="Address" component={Address} options={{ headerShown: false }} />
          <Stack.Screen name="CheckoutPage" component={CheckoutPage} options={{ headerShown: false }} />
          <Stack.Screen name="YourProfile" component={YourProfile} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}
