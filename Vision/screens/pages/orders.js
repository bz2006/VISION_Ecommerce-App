import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useAuth } from '../../context/context/auth';
import { useNavigation } from "@react-navigation/native";
import BottomNav from '../../stickynav';

const Orders = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [auth] = useAuth()
    const navigation = useNavigation();

    const getOrders = async () => {
        try {
            const response = await axios.get(`/api/v1/orders/get-orders/${auth.user._id}`);
            setAllOrders(response.data);
        } catch (error) {
            console.log('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        getOrders();
    }, []);

    const renderOrderItem = ({ item }) => (
        <TouchableOpacity
            key={item.orderid}
            activeOpacity={1}
            onPress={() => { navigation.navigate("OrderDetails", { Orderid: item.orderid }) }}
            style={styles.orderContainer}
        >
            {item.products.map(product => (
                <View key={product[0]} style={styles.productContainer}>
                    <Image source={{ uri: `http://43.205.242.76/uploads/${product[2]}` }} style={styles.image} />
                    <View style={styles.detailsContainer}>
                        <Text style={styles.productName}>{product[1]}</Text>
                        <Text style={styles.status}>{item.status}</Text>
                    </View>
                </View>
            ))}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {allOrders.length === 0 ? (
                <View style={styles.noOrdersContainer}>
                    <Image source={require('../../assets/no-result-data-document-file-260nw-2318617293.png')} style={styles.noOrdersImage} />
                    <Text style={styles.noOrdersText}>No orders found</Text>
                    <TouchableOpacity style={styles.btn} activeOpacity={1} onPress={()=>{navigation.navigate("HomePage")}}>
                        <Text style={styles.btnText}>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={allOrders}
                    renderItem={renderOrderItem}
                    keyExtractor={(item) => item.orderid.toString()}
                />
            )}
            <View style={{ marginBottom: 60 }}></View>
            <BottomNav />
        </SafeAreaView>
    );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        paddingTop: 90
    },
    tx: {
        fontSize: 50,
        color: "rgb(0,0,0)"
    },
    noOrdersContainer:{
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    },
    noOrdersImage: {
        width: screenWidth * 0.7,
        height: screenHeight * 0.3,
    },
    noOrdersText: {
color:"rgb(0,0,0)",
fontSize:25
    },
    btn:{
        backgroundColor: 'rgb(0, 80, 87)',
        padding: 10,
        borderRadius: 10,
        height: 55,
        width: screenWidth * 0.7,
        marginTop:30,
        alignItems: "center",
        justifyContent: "center"
    },
    btnText: {
        color: "white",
        fontSize: 20
      },
    orderContainer: {
        borderWidth: 1,
        margin: 10,
        borderRadius: 20,
    },
    productContainer: {
        flexDirection: 'row',
        padding: 20,
    },
    image: {
        width: screenWidth * 0.35,
        height: screenWidth * 0.35,
        marginRight: 15,
    },
    detailsContainer: {
        flex: 1,
        alignItems: "center",

    },
    productName: {
        fontSize: screenWidth * 0.05,
        marginTop: 45,
        color: "rgb(0,0,0)"
    },
    status: {
        fontSize: screenWidth * 0.05,
        color: 'green',
    },
});

export default Orders;