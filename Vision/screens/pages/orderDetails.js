import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Modal, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import BottomNav from '../../stickynav';
import Tracking from './Tracking';




const OrderDetails = ({ route }) => {

    const { Orderid } = route.params;
    const [order, setOrder] = useState([]);
    const [status, setStatus] = useState('');
    const [modalVisible, setModalVisible] = useState(false);


    useEffect(() => {
        getSingleOrder(Orderid);
    }, []);

    const getSingleOrder = async (id) => {
        try {
            const singleOrderResponse = await axios.get(`/api/v1/orders/user-order/${id}`);
            setOrder(singleOrderResponse.data);
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.mobOrderDetails}>
                    {order.length > 0 && order.map(ord => (
                        <View key={ord.orderid}>
                            <View style={styles.ordDet}>
                                <Text style={styles.textord}>Order# {ord.orderid}</Text>
                                <Text style={styles.textord}>Order Date : {ord.orderdate}</Text>
                                <Text style={styles.textord}>Order Total : ₹{ord.total}.00</Text>
                            </View>
                            <View style={styles.ordDiv} >
                                {ord.products.map((product, index) => (
                                    <View key={product[0]} style={styles.ordiv}>
                                        <Image source={{ uri: `http://52.66.213.190/uploads/${product[2]}` }} style={styles.image} />
                                        <View style={{ flexDirection: "column", marginLeft: 30 }}>
                                            <Text style={styles.text}>{product[1]}</Text>
                                            <Text style={styles.text}>{product[3]}   x{product[4]}</Text>
                                            <Text style={{ fontSize: 30, color: "green" }} >{ord.status}</Text>
                                           
                                        </View>
                                       
                                    </View>
                                    
                                ))}
                                <View style={{ alignItems: "center" }}>
                                    <TouchableOpacity activeOpacity={0.9} style={{ marginTop: 30, borderRadius: 10, width: 300, height: 50, backgroundColor: 'rgb(0, 80, 87)', alignItems: "center", justifyContent: "center" }} onPress={() => setModalVisible(true)} ><Text style={{ color: "white", fontSize: 25 }}>Track</Text></TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    ))}
                    {order.length > 0 && order.map(ord => (
                        <View key={ord.orderid} style={styles.ordAdrsDiv}>
                            <View style={styles.userStatusDiv}>
                                <Text style={styles.heading}>Shipping Address</Text>
                                <View>
                                    <Text style={styles.addressText}>{ord.shipaddress.name}</Text>
                                    <Text style={styles.addressText}>{ord.shipaddress.address}</Text>
                                    <Text style={styles.addressText}>{ord.shipaddress.city}</Text>
                                    <Text style={styles.addressText}>{ord.shipaddress.state}</Text>
                                    <Text style={styles.addressText}>{ord.shipaddress.country}</Text>
                                    <Text style={styles.addressText}>{ord.shipaddress.pin}</Text>
                                    <Text style={styles.addressText}>{ord.shipaddress.phone}</Text>
                                </View>
                            </View>
                            <View style={styles.line}></View>
                            <View style={styles.userStatusDiv}>
                                <Text style={styles.heading}>Billing Address</Text>
                                <View>
                                    <Text style={styles.addressText}>{ord.billaddress.name}</Text>
                                    <Text style={styles.addressText}>{ord.billaddress.address}</Text>
                                    <Text style={styles.addressText}>{ord.billaddress.city}</Text>
                                    <Text style={styles.addressText}>{ord.billaddress.state}</Text>
                                    <Text style={styles.addressText}>{ord.billaddress.country}</Text>
                                    <Text style={styles.addressText}>{ord.billaddress.pin}</Text>
                                    <Text style={styles.addressText}>{ord.billaddress.phone}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>


            </ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >

                <ScrollView style={styles.modalView}>
                    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                        <Ionicons name="close" size={70} color="rgb(0,0,0)" onPress={() => setModalVisible(false)} />
                    </View>
                    {order.length > 0 && order.map(ord => (
                        <View key={ord.orderid}>
                            <Tracking status={ord.status} />
                        </View>
                    ))}
                </ScrollView>

            </Modal>
            <BottomNav />
        </SafeAreaView>
    );
};
const screenHeight = Dimensions.get('window').height ;
const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    mobOrderDetails: {
        margin: 10,
        backgroundColor: "white",
        padding: 10
    },
    ordDet: {
        marginTop: 90,
        borderWidth: 1,
        borderRadius: 20,
        minWidth:screenWidth*0.9,
        maxWidth:screenWidth*0.9,
        padding: 30
    },
    blank: {
        marginTop: 50,
      },
    ordDiv: {
        marginTop: 20,
        padding: 20,
        borderWidth: 1,
        borderRadius: 20,
        alignItems: "center",
        minWidth:screenWidth*0.9,
        maxWidth:screenWidth*0.9
    },
    ordiv: {
        flexDirection: "row",
        alignItems: "center",
        minWidth:screenWidth*0.85,
        maxWidth:screenWidth*0.9
    },
    image: {
        width: screenWidth*0.35,
        height: screenWidth*0.35,
    },
    text: {
        fontSize: screenWidth*0.05,
        color:"rgb(0,0,0)"
    },
    textord: {
        fontSize: screenWidth*0.05,
        color:"rgb(0,0,0)"
    },
    ordAdrsDiv: {
        borderWidth: 1,
        marginTop: 20,
        borderRadius: 20,
        padding: 30,
        minWidth:screenWidth*0.9,
        maxWidth:screenWidth*0.9,
        marginBottom: 90
    },
    heading: {
        marginBottom: 10,
        fontSize: 30,
        color:"rgb(0,0,0)"
    },
    addressText: {
        fontSize: screenWidth*0.05,
        fontWeight: '500',
        color:"rgb(0,0,0)"
    },
    line: {
        borderBottomColor: 'rgb(0,0,0)',
        borderBottomWidth: 0.6,
        marginVertical: 10,
    },
    modalView: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        borderWidth:1,
        borderColor:"rgb(220,220,220)",
        elevation:50,
        backgroundColor: 'white',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        padding: 30,
        height: screenHeight/1.2,
    },
});

export default OrderDetails;
