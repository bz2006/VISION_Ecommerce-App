import { View, Text, Image, StyleSheet, ScrollView, Button, Modal, Dimensions, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { RadioButton } from 'react-native-paper';
import { useAuth } from '../../context/context/auth';
import RazorpayCheckout from 'react-native-razorpay';
import { useNavigation } from "@react-navigation/native";
import { useCart } from '../../context/context/cart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const CheckoutPage = () => {

    const navigation = useNavigation();
    const [defid, setdefid] = useState("");
    const [defbid, setdefbillid] = useState("");
    const [auth, setAuth] = useAuth();
    const [orderId, setOrderId] = useState('');
    const [cart, setCart] = useCart([])
    const [qty, setQty] = useState(0);
    const [amount, setAmount] = useState(0);
    const [Alladdress, setallAdrs] = useState([])
    const [Shipaddress, setShipaddress] = useState([])
    const [billaddress, setBilladdress] = useState([])
    const [selectedaddress, setSelectedadrs] = useState([])
    let key_id = "rzp_test_HR0OOE6FLlHVg8"
    let key_secret = "sPu8htjwrlQ0KZLBCpqpQwr3"


    //Model Controls
    const [shipmodel, setShipmodel] = useState(false);
    const [billmodel, setBillmodel] = useState(false);

    const synccart = async () => {
        await axios.put(`/api/v1/cart/create-up-cart/${auth.user._id}`, cart);
    }
    const Getallddress = async () => {
        try {
            const alladrs = await axios.get(`/api/v1/users/getall-address/${auth.user._id}`);
            setallAdrs(alladrs.data.Alladdres)
            setdefid(alladrs.data.defadrs)
            setdefbillid(alladrs.data.defadrs)
            console.log("keriget")
            if (alladrs.data.Alladdres.length === 0 || defid === "") {
                setBillmodel(true)
                setShipmodel(true)
            }


        } catch (error) {
            console.log("something went wrong");

        }
    }
    useEffect(() => {
        Getallddress()
    }, [])


    useEffect(() => {
        let totalQuantity = cart.reduce((acc, cartItem) => acc + cartItem[4], 0);
        let totalAmount = cart.reduce((acc, cartItem) => acc + cartItem[3] * cartItem[4], 0);
        setQty(totalQuantity);
        setAmount(totalAmount);
    }, [cart]);

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
            if (perm === 0) { setCart(newdata); perm = 1; }
            return newdata

        } catch (error) {

        }
    }
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
                console.log("synced with cart sevrver")
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
                console.log("synced with cart sevrver")
            }

        } catch (error) {
        }
    };

    const handleDelete = async (productId) => {
        const updatedCart = cart.filter(item => item[0] !== productId);
        setCart(updatedCart);
        if (auth.user) {

            if (updatedCart.length === 0) {
                await axios.delete(`/api/v1/cart//delete-cart/${auth.user._id}`);
                syncCartWithServer(updatedCart)
            }
            else if (cart.length === 0) {
                getCart()
            }
        }


    };
    const Navtoadrs = async () => {
        navigation.pop()
        navigation.navigate("Address")
        await AsyncStorage.setItem('redirectSrc', "CheckoutPage");
    }


    // Function to handle payment
    const handlePayment = async () => {
        var options = {
            description: 'Credits towards consultation',
            image: 'https://i.imgur.com/3g7nmJC.jpg',
            currency: 'INR',
            key: key_id,
            amount: amount * 100,
            name: 'VISION',
            order_id: orderId,
            prefill: {
                name: auth.user.username,
                email: 'test@example.com',
            },
            theme: { color: 'rgb(0, 80, 87)' }
        }
        RazorpayCheckout.open(options).then((data) => {
            // handle success
            Placeorder()
            alert(`Success: ${data.razorpay_payment_id}`);
        }).catch((error) => {
            // handle failure
            alert(`Error: ${error.code} | ${error.description}`);
        });
    };

    const Placeorder = async () => {


        try {

            const currentDate = new Date();
            const orddate = currentDate.toDateString()
            const orderid = "240" + Date.now();
            const usrid = auth.user._id
            const prod = []
            for (let pr of cart) {
                prod.push([pr[0], pr[1], pr[2][0], pr[3], pr[4]])
            }
            const orderData = {
                userid: usrid,
                orderId: orderid,
                Orderdate: orddate,
                Shipaddress: Shipaddress,
                billaddress: billaddress,
                total: amount,
                products: prod
            };
            const { data } = await axios.post("/api/v1/orders/create-order", orderData);
            await axios.put(`/api/v1/users/user_ordersno/${auth.user._id}`);
            setCart([])
            navigation.navigate("Orders")
            syncCartWithServer()
        } catch (error) {
            alert("something went wrong");

        }
    }



    return (
        <SafeAreaView style={styles.container}>
            <ScrollView >
                <Text style={{ fontSize: 30, margin: 30,color:"rgb(0,0,0)" }}>Review Your Order</Text>
                <View style={{ alignItems: "center" }}>
                    <TouchableOpacity onPress={() => {
                        setShipmodel(true)
                    }} style={styles.billadr}>
                        <Text style={{color:"rgb(0,0,0)"}}>Shipping Address</Text>
                        {Alladdress.length > 0 && Alladdress.map(adr => {

                            if (adr._id === defid) {
                                if (Shipaddress.length === 0) {
                                    setShipaddress(adr)
                                }

                                return (
                                    <View key={adr._id}>
                                        <Text style={{color:"rgb(0,0,0)"}}>{adr.name}</Text>
                                        <Text style={{color:"rgb(0,0,0)"}}>{adr.address} {adr.state} {adr.country} {adr.pin}</Text>

                                    </View>
                                );
                            }
                            return null

                        })}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setBillmodel(true)
                    }} style={styles.shipadr}>
                        <Text style={{color:"rgb(0,0,0)"}}>Billing Address</Text>
                        {Alladdress.length > 0 && Alladdress.map(adr => {

                            if (adr._id === defbid) {
                                if (billaddress.length === 0) {
                                    setBilladdress(adr)
                                }

                                return (
                                    <View key={adr._id}>
                                        <Text style={{color:"rgb(0,0,0)"}}>{adr.name}</Text>
                                        <Text style={{color:"rgb(0,0,0)"}}>{adr.address} {adr.state} {adr.country} {adr.pin}</Text>

                                    </View>
                                );
                            }
                            return null

                        })}
                    </TouchableOpacity>

                    <View style={styles.maindiv}>
                        {cart.length > 0 && cart.map(cartItem => (
                            <View style={styles.cartcrd} key={cartItem[0]}>
                                <View style={styles.card} >
                                    <Image source={{ uri: `http://52.66.213.190/uploads/${cartItem[2][0]}` }} style={styles.Img} />
                                    <View >
                                        <Text style={styles.cardTitle}>{cartItem[1]}</Text>
                                        <Text style={styles.cardText}>₹{cartItem[3]}</Text>
                                        <Text style={styles.cardText}>Subtotal : ₹{cartItem[3] * cartItem[4]}.00 </Text>
                                    </View>
                                </View>
                                <View style={styles.cartItemContainer}>
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
                                        {[...Array(10)].map((_, index) => (
                                            <Picker.Item key={index + 1} label={(index + 1).toString()} value={index + 1} style={{color:"rgb(0,0,0)"}}/>
                                        ))}
                                    </Picker>
                                    <TouchableOpacity onPress={() => handleDelete(cartItem[0])} style={styles.delcartm}>
                                        <Text style={{color:"rgb(0,0,0)"}}>Delete</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>))}
                    </View>
                </View>
                <View style={{ alignItems: "center", marginBottom: 90 }}>
                    <View style={styles.ordsumry}>
                        <Text style={styles.heading}>Order Summary</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Sub Total</Text>
                            <Text style={styles.amount}>₹{amount}.00</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Delivery</Text>
                            <Text style={styles.amount}>Free</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.row}>
                            <Text style={styles.grandTotalLabel}>Grand Total</Text>
                            <Text style={styles.grandTotalAmount}>₹{amount}.00</Text>
                        </View>
                        <Text style={styles.taxText}>Taxes Included</Text>

                    </View>
                </View>
            </ScrollView>
            <View style={styles.prbuybtn}>
                <TouchableOpacity style={styles.buyButton} onPress={handlePayment}>
                    <Text style={styles.buytx}>PROCEED TO BUY</Text>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={shipmodel}
                onRequestClose={() => {
                    setShipmodel(false);
                }}
            >

                <ScrollView style={styles.modalView}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ fontSize: 30,color:"rgb(0,0,0)" }}>Shipping Address</Text>
                        <Ionicons name="close" size={70} color="rgb(0,0,0)" onPress={() => setShipmodel(false)} />
                    </View>
                    <View >
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <TouchableOpacity style={styles.adrschangebtn}><Text style={{ color: "white", fontSize: 18 }} onPress={Navtoadrs}>Add new</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.adrschangebtn}><Text style={{ color: "white", fontSize: 18 }} onPress={Navtoadrs}>Update existing</Text></TouchableOpacity>
                        </View>
                        {Alladdress.length > 0 && Alladdress.map(adr => (
                            <View key={adr._id} style={styles.adrschange}>
                                <RadioButton
                                    value={adr._id}
                                    status={defbid === adr._id ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setdefid(adr._id);
                                        setShipmodel(false);
                                    }}
                                />
                                <View style={{ border: 1, borderColor: 'rgb(0,0,0)', margin: 10, padding: 10, borderRadius: 10 }}>
                                    <Text style={{ fontSize: 18 ,color:"rgb(0,0,0)"}}>
                                        <Text style={{ fontSize: 25, fontWeight: 'bold',color:"rgb(0,0,0)" }}>{adr.name}</Text>{'\n'}
                                        {adr.address}, {adr.state}, {adr.country}{'\n'}
                                        PIN - {adr.pin} PHONE - {adr.phone}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>

            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={billmodel}
                onRequestClose={() => {
                    setBillmodel(false);
                }}
            >

                <ScrollView style={styles.modalView}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ fontSize: 30 ,color:"rgb(0,0,0)"}}>Billing Address</Text>
                        <Ionicons name="close" size={70} color="rgb(0,0,0)" onPress={() => setBillmodel(false)} />
                    </View>
                    <View >
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <TouchableOpacity style={styles.adrschangebtn}><Text style={{ color: "white", fontSize: 18 }} onPress={Navtoadrs}>Add new</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.adrschangebtn}><Text style={{ color: "white", fontSize: 18 }} onPress={Navtoadrs}>Update existing</Text></TouchableOpacity>
                        </View>
                        {Alladdress.length > 0 && Alladdress.map(adr => (
                            <View key={adr._id} style={styles.adrschange}>
                                <RadioButton
                                    value={adr._id}
                                    status={defbid === adr._id ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setdefbillid(adr._id);
                                        setBillmodel(false);
                                    }}
                                />
                                <View style={{ border: 1, borderColor: 'rgb(0,0,0)', margin: 10, padding: 10, borderRadius: 10 }}>
                                    <Text style={{ fontSize: 18,color:"rgb(0,0,0)" }}>
                                        <Text style={{ fontSize: 25, fontWeight: 'bold',color:"rgb(0,0,0)" }}>{adr.name}</Text>{'\n'}
                                        {adr.address}, {adr.state}, {adr.country}{'\n'}
                                        PIN - {adr.pin} PHONE - {adr.phone}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </Modal>
        </SafeAreaView>
    )
}

export default CheckoutPage

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(240,240,240)',
    },
    adrschange: {
        flexDirection: "row",
        alignItems: "center"
    },
    adrschangebtn: {
        backgroundColor: 'rgb(0, 80, 87)',
        height: 50,
        width: "auto",
        borderRadius: 10,
        marginRight: 20,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
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
        height: screenHeight / 1.5,
    },
    billadr: {
        backgroundColor: "white",
        width: screenWidth * 0.9,
        padding: 20,
        borderRadius: 15,
        marginBottom: 5
    },
    shipadr: {
        backgroundColor: "white",
        width: screenWidth * 0.9,
        padding: 20,
        borderRadius: 15,
        margin: 10,
        marginBottom: 15
    },
    cartcrd: {
        height: "auto",
        minWidth: screenWidth * 0.9,
        maxWidth: screenWidth * 0.9,
        marginBottom: 20
    },
    maindiv: {
        alignItems: "center",
        borderRadius: 15,
        maxWidth: screenWidth * 0.9,
        backgroundColor: "white",
        marginBottom: 15
    },
    card: {
        flexDirection: 'row',
        borderColor: '#fff',
        borderRadius: 10,
        padding: 10
    },
    Img: {
        margin: 10,
        width: screenWidth * 0.30,
        height: screenWidth * 0.30,
        marginRight: 30
    },
    cardBody: {
        marginTop: 25,
    },
    cardTitle: {
        marginTop: 25,
        fontSize: screenWidth * 0.05,
        color:"rgb(0,0,0)"
    },
    cardText: {
        fontSize: screenWidth * 0.045,
        color:"rgb(0,0,0)"
    },

    selqty: {
        width: 110,
        marginTop: -20,
        borderRadius: 5,
        height: 10,
        marginRight: 30,
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
        marginTop: -20,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    cremty: {
        width: screenWidth,
        height: screenHeight,
        resizeMode: 'contain',
    },
    ordsumry: {
        width: screenWidth * 0.9,
        backgroundColor: "white",
        borderRadius: 15,
        padding: 20,
    },
    heading: {
        fontSize: 25,
        color:"rgb(0,0,0)"
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        marginTop: 10
    },
    label: {
        fontSize: 18,
        color:"rgb(0,0,0)"
    },
    amount: {
        fontSize: 18,
        color:"rgb(0,0,0)"
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
    },
    grandTotalLabel: {
        fontSize: 22,
        color: 'rgb(160, 0, 0)',
        fontWeight: 'bold',
    },
    grandTotalAmount: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'rgb(160, 0, 0)',
    },
    taxText: {
        fontSize: 12,
        color: 'rgb(0,0,0)',
    },
    buyButton: {
        backgroundColor: 'rgb(0, 80, 87)',
        padding: 10,
        borderRadius: 10,
        height: 55,
        width: screenWidth * 0.8,
        alignItems: "center",
        justifyContent: "center"
    },
    buytx: {
        color: "white",
        fontSize: 15
    },
    prbuybtn: {
        alignItems: "center",
        position: 'absolute',
        bottom: 0,
        height: 80,
        backgroundColor: "white",
        justifyContent: "center",
        padding: 20,
        width: screenWidth
    }

})