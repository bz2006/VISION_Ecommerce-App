import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Modal, Button, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useAuth } from "../../context/context/auth";
import BottomNav from "../../stickynav";




const Address = () => {

    const navigation = useNavigation();
    const [auth, setAuth] = useAuth();
    const [defid, setdefid] = useState("");
    const [defset, setDefset] = useState(0);
    const [name, setName] = useState("");
    const [upname, setupName] = useState("");
    const [address, setaddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setProvince] = useState("");
    const [country, setCountry] = useState("");
    const [pin, setPin] = useState();
    const [phone, setPhone] = useState();
    const [Alladdress, setallAdrs] = useState([])
    const [selectedaddress, setSelectedadrs] = useState([])

    //Model Controls
    const [modalVisible, setModalVisible] = useState(false);
    const [updatemodel, setupdatemodel] = useState(false);

    const Getallddress = async () => {
        try {
            const alladrs = await axios.get(`/api/v1/users/getall-address/${auth.user._id}`);
            setallAdrs(alladrs.data.Alladdres)
            setdefid(alladrs.data.defadrs)


        } catch (error) {

        }
    }
    const Getallddressnod = async () => {
        try {
            const alladrs = await axios.get(`/api/v1/users/getall-address/${auth.user._id}`);
            const lastArray = alladrs.data.Alladdres[alladrs.data.Alladdres.length - 1];
            const la_id = lastArray._id
            await axios.post(`/api/v1/users/user-def-adres/${auth.user._id}`, { la_id });
            Getallddress()

        } catch (error) {

        }
    }



    useEffect(() => {
        Getallddress()
    }, [])

    const Handlecreate = async () => {

        setModalVisible(false)
        try {

            const Data = [];
            Data.push({
                name: name,
                address: address,
                city: city,
                state: state,
                country: country,
                pin: pin,
                phone: phone,
            })
            await axios.post(`/api/v1/users/update-user/${auth.user._id}`, Data);
            await Getallddressnod()

            const redirectSrc = "CheckoutPage"
            if (redirectSrc === "CheckoutPage") {
                navigation.navigate(redirectSrc)
                await AsyncStorage.removeItem("redirectSrc");
            }

        } catch (error) {

        }

    }

    const handleUpdateinit = async (seladrs) => {
        setSelectedadrs(seladrs)
        setupdatemodel(true)
    }

    const handleUpdate = async () => {
        setupdatemodel(false)
        try {
            const adrsid = selectedaddress._id
            const Data = selectedaddress;
            await axios.put(`/api/v1/users/update-user-adrs/${auth.user._id}`, { adrsid, selectedaddress });

            const redirectSrc = "CheckoutPage"
            if (redirectSrc === "CheckoutPage") {
                await AsyncStorage.removeItem("redirectSrc");
                navigation.navigate("CheckoutPage")

            }


        } catch (error) {


        }
    }

    const handleDelete = async (seladrs) => {

        try {
            await axios.post(`/api/v1/users/delete-user-adrs/${auth.user._id}`, { seladrs });
            Getallddress()

        } catch (error) {


        }
    }

    const setDefault = async (id) => {
        setdefid(id)
        setDefset(1)
    }
    useEffect(() => {
        if (defset === 1) {
            const updatedefadrs = async () => {
                await axios.post(`/api/v1/users/user-def-adres/${auth.user._id}`, { defid });
            }
            updatedefadrs()
        }
    }, [defid])


    return (
        <SafeAreaView style={styles.container}>


            {/* ----------------------------------- Display All Address  --------------------------*/}
            <ScrollView style={styles.adrmain} >
                <View style={{ alignItems: "center" }}>
                    <TouchableOpacity activeOpacity={0.9} style={styles.addadrs} onPress={() => setModalVisible(true)} >
                        <Text style={{ color: "	rgb(0,0,0)", fontSize: 40 }}>
                            +
                        </Text>
                    </TouchableOpacity>
                    {Alladdress.length > 0 && Alladdress.map(adr => (
                        < View key={adr._id} style={styles.adrsdiv}>
                            <Text style={styles.adrstx}>{adr.name}</Text>
                            <Text style={styles.adrstx}>{adr.address}</Text>
                            <Text style={styles.adrstx}>{adr.city}</Text>
                            <Text style={styles.adrstx}>{adr.state}</Text>
                            <Text style={styles.adrstx}>{adr.country}</Text>
                            <Text style={styles.adrstx}>{adr.pin}</Text>
                            <Text style={styles.adrstx}>{adr.phone}</Text>
                            <View style={{ flexDirection: "row", marginTop: 10 }}>
                                <TouchableOpacity onPress={() => handleUpdateinit(adr)}>
                                    <Text style={styles.adrmenu}>Edit | </Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => handleDelete(adr._id)}>
                                    <Text style={styles.adrmenu}>Delete</Text>
                                </TouchableOpacity>

                                {adr._id == defid ? null : (
                                    <TouchableOpacity onPress={() => setDefault(adr._id)}>
                                        <Text style={styles.adrmenu}> | Set as default</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))
                    }
                </View>
            </ScrollView>
            <BottomNav />
            <>
                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={updatemodel}
                    onRequestClose={() => {
                        setupdatemodel(false);
                    }}
                >

                    <ScrollView style={styles.modalView}>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                            <Ionicons name="close" size={70} color="rgb(0,0,0)" onPress={() => setupdatemodel(false)} />
                        </View>
                        <View style={styles.adrsinput}>
                            <Text style={{ fontSize: 35,color:"rgb(0,0,0)" }}>Update address</Text>
                            <TextInput
                                placeholder="Name"
                                style={styles.input}
                                value={selectedaddress.name}
                                onChangeText={(text) =>
                                    setSelectedadrs({ ...selectedaddress, name: text })
                                }
                            />
                            <TextInput
                                placeholder="Address"
                                style={styles.input}
                                value={selectedaddress.address}
                                onChangeText={(text) =>
                                    setSelectedadrs({ ...selectedaddress, address: text })
                                }
                            />
                            <TextInput
                                placeholder="City"
                                style={styles.input}
                                value={selectedaddress.city}
                                onChangeText={(text) =>
                                    setSelectedadrs({ ...selectedaddress, city: text })
                                }
                            />
                            <TextInput
                                placeholder="State"
                                style={styles.input}
                                value={selectedaddress.state}
                                onChangeText={(text) =>
                                    setSelectedadrs({ ...selectedaddress, state: text })
                                }
                            />
                            <TextInput
                                placeholder="Country"
                                style={styles.input}
                                value={selectedaddress.country}
                                onChangeText={(text) =>
                                    setSelectedadrs({ ...selectedaddress, country: text })
                                }
                            />
                            <TextInput
                                placeholder="Pin"
                                keyboardType="numeric"
                                style={styles.input}
                                value={selectedaddress.pin ? selectedaddress.pin.toString() : ""}
                                onChangeText={(text) =>
                                    setSelectedadrs({ ...selectedaddress, pin: text })
                                }
                            />
                            <TextInput
                                placeholder="Phone Number"
                                keyboardType="numeric"
                                style={styles.input}
                                value={selectedaddress.phone ? selectedaddress.phone.toString() : ""}
                                onChangeText={(text) =>
                                    setSelectedadrs({ ...selectedaddress, phone: text })
                                }
                            />

                            <TouchableOpacity onPress={handleUpdate} style={styles.inputsave}>
                                <Text style={{ color: "white", fontSize: 30 }}>Save</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>

                </Modal>
            </>
            <>
                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}
                >

                    <ScrollView style={styles.modalView}>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                            <Ionicons name="close" size={70} color="rgb(0,0,0)" onPress={() => setModalVisible(false)} />
                        </View>
                        <View style={styles.adrsinput}>
                            <Text style={{ fontSize: 35,color:"rgb(0,0,0)" }}>Add new address</Text>
                            <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={(e) => setName(e)}></TextInput>
                            <TextInput placeholder="Address" style={styles.input} value={address} onChangeText={(e) => setaddress(e)}></TextInput>
                            <TextInput placeholder="City" style={styles.input} value={city} onChangeText={(e) => setCity(e)}></TextInput>
                            <TextInput placeholder="State" style={styles.input} value={state} onChangeText={(e) => setProvince(e)}></TextInput>
                            <TextInput placeholder="Country" style={styles.input}></TextInput>
                            <TextInput placeholder="Pin" keyboardType="numeric" style={styles.input} value={country} onChangeText={(e) => setCountry(e)}></TextInput>
                            <TextInput placeholder="Phone Number" keyboardType="numeric" style={styles.input} value={pin} onChangeText={(e) => setPin(e)}></TextInput>
                            <TouchableOpacity onPress={Handlecreate} style={styles.inputsave}><Text style={{ color: "white", fontSize: 30 }}>Save</Text></TouchableOpacity>
                        </View>
                    </ScrollView>

                </Modal>
            </>

        </ SafeAreaView>
    )
}
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    adrmain: {
        marginTop: 90,
        padding: 15,
        marginBottom: screenHeight * 0.1,


    },
    adrsdiv: {
        borderWidth: 1,
        margin: 15,
        width: screenWidth * 0.9,
        padding: 10,
        borderRadius: 7,

    },
    addadrs:{
        width:screenWidth*0.9,
        height:screenHeight*0.15,
        borderWidth:1,
        borderStyle:"dashed",
        borderRadius:10,
        borderColor:"rgb(24,24,24)",
        alignItems:"center",
        justifyContent:"center"
    },
    adrstx: {
        fontSize: 25,
        margin: 5,
        color:"rgb(0,0,0)"
    },
    adrsinput: {
        padding: 30,
        alignItems: "center",
        justifyContent: "center",
        color:"rgb(0,0,0)"
    },
    input: {
        borderWidth: 1,
        height: 70,
        width: screenWidth * 0.85,
        padding: 10,
        color:"rgb(0,0,0)",
        borderRadius: 10,
        borderColor:"rgb(0,0,0)",
        margin: 20
    },
    inputsave: {
        height: 60,
        width: screenWidth * 0.85,
        padding: 10,
        borderRadius: 10,
        margin: 20,
        backgroundColor: 'rgb(0, 80, 87)',
        alignItems: "center",
        justifyContent: "center",
    },
    adrmenu: {
        color: "#3399ff",
        fontSize: screenWidth * 0.06
    }

})

export default Address

