import React, { useState, useEffect, useRef, Component } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Modal, Dimensions, TouchableOpacity, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../../context/context/auth';
import OtpTextInput from 'react-native-text-input-otp'
import BottomNav from '../../stickynav';
import { TextInput } from 'react-native-paper';
let Code = 0



const YourProfile = () => {

    const [auth, setAuth] = useAuth()
    const navigation = useNavigation();
    const [name, setname] = useState("")
    const [pass, setpass] = useState("")
    const [otp, setOtp] = useState('')
    const [VerificationStatus, setVerificationStatus] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [email, setemail] = useState("");


    const GetUser = async () => {
        try {
            const user = await axios.get(`/api/v1/users/get-user/${auth.user._id}`)

            setname(user.data.user.username)
            setemail(user.data.user.email)
        } catch (error) {

        }
    }
    useEffect(() => {
        GetUser()

    }, [])



    const updtaename = async () => {
        try {
 
            await axios.post(`/api/v1/users/update-username/${auth.user._id}`, { name });
            alert("Username Updated")
            GetUser()
        } catch (error) {
    
        }
    }

    const UpdatePass = async () => {
        try {
            await axios.post(`/api/v1/users/update-pass/${auth.user._id}`, { pass });
            GetUser()
            alert("Password Changed")
            setModalVisible(false)
            setVerificationStatus(false)

        } catch (error) {
   
        }
    }



    const handleChangePassword = async () => {
        setModalVisible(true);
        await Verification();
    };

    const Verification = async () => {
        try {
            Code = Math.floor(Math.random() * 9000) + 1000;
            const response = await fetch('http://192.168.1.39:3002/send-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ OTP: Code, Email: email })
            });
        } catch (error) {
    
        }
    }
    const CheckVerification = async () => {
        try {
            if (otp == Code) {
       
                setVerificationStatus(true)
                alert("Verified")
                setOtp("")
                Code = 0
            } else {
                alert("Verification Failed")
                setModalVisible(false)
                setOtp("")
                Code = 0
            }
        } catch (error) {

        }
    }




    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.mainview}>
                <View >


                    <View style={styles.inputView}>
                        <View style={styles.lb}>
                            <Text style={{ fontSize: 20, color: "rgb(0,0,0)" }}>Username</Text>
                        </View>
                        <TextInput placeholder='Username'
                            value={name}
                            style={styles.input}
                            onChangeText={(text) =>
                                setname(text)
                            }
                        />
                        <View style={styles.btns}>
                            <TouchableOpacity style={styles.adrs} activeOpacity={1} onPress={updtaename}>
                                <Text style={{ fontSize: 18, color: "white" }} >Change Username</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.line1}></View>

                    </View>

                    <View style={styles.inputView}>
                        <View style={styles.lb}>
                            <Text style={{ fontSize: 20, color: "rgb(0,0,0)", marginBottom: "30" }}>Address</Text>
                        </View>
                        <TouchableOpacity style={styles.adrs} onPress={() => { navigation.navigate("Address") }} activeOpacity={1}>
                            <Text style={{ fontSize: 20, color: "white" }}>Address</Text>
                        </TouchableOpacity>

                        <View style={styles.line2}></View>

                    </View>

                    <View style={styles.inputView}>

                        <View style={styles.lb}>
                            <Text style={{ fontSize: 18, color: "rgb(0,0,0)" }}>Email</Text>
                        </View>
                        <TextInput placeholder='Email'
                            value={email}
                            readOnly
                            style={styles.input}
                            onChangeText={(text) =>
                                setname(text)
                            }
                        />
                    </View>
                    <View style={styles.inputView}>

                        <View style={styles.lb}>
                            <Text style={{ fontSize: 18, color: "rgb(0,0,0)" }}>Change Password</Text>
                        </View>
                        <TextInput placeholder='Password'
                            value={"samplepasswordinput"}
                            secureTextEntry={true}
                            style={styles.input}
                            onChangeText={(text) =>
                                setname(text)
                            }
                        />

                        <View style={styles.btns}>
                            <TouchableOpacity style={styles.adrs} activeOpacity={1} onPress={handleChangePassword}>
                                <Text style={{ fontSize: 18, color: "white" }} >Change Password</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <BottomNav />
            <>
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
                            <Ionicons name="close" size={70} color="rgb(0,0,0)" onPress={() => {
                             
                                setOtp("");
                                Code = 0;
                                setModalVisible(false);
                            }} />
                        </View>
                        <View style={{ justifyContent: "center", flex: 1 }}>
                            {VerificationStatus === false ? (
                                <View>
                                    <View style={{ textAlign: "center", alignItems: "center" }}>
                                        <Text style={{ fontSize: 25, color: "rgb(0,0,0)", textAlign: "center" }}>{`Enter OTP sent to \n${email}`}</Text>
                                        <OtpTextInput
                                            otp={otp}
                                            setOtp={setOtp}
                                            digits={4}
                                            style={{ borderTopWidth: 0, borderColor: "rgb(0,0,0)", borderLeftWidth: 0, borderRightWidth: 0, borderBottomWidth: 3, borderRadius: 0 }}
                                            fontStyle={{ fontSize: 30, color: "rgb(0,0,0)" }}
                                            focusedStyle={{ borderColor: "rgb(0, 80, 87)" }}
                                        />


                                        <TouchableOpacity style={styles.otpbtn} onPress={CheckVerification}><Text style={{ fontSize: 22, color: "white" }}>Verify</Text></TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <>
                                    <Text style={{ fontSize: 18, color: "rgb(0,0,0)",marginBottom:10 }}>New Password</Text>
                                    <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                        <TextInput type='password' secureTextEntry={true} onChangeText={(text) => setpass(text)} value={pass} placeholder='Password' style={{ width: "95%",borderWidth:0.5,borderRadius:3 }} />
                                        <TouchableOpacity style={styles.chpass} onPress={UpdatePass}><Text style={{ fontSize: 18, color: "white" }}>Change Password</Text></TouchableOpacity>

                                    </View>
                                </>
                            )}
                        </View>
                    </ScrollView>

                </Modal>
            </>
        </SafeAreaView>
    )
}


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    otpview: {
        flex: 1,
        paddingHorizontal: 20,
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "Red"
    },
    otpinput: {
        marginRight: 10,
        backgroundColor: "white",
        borderBottomColor: "rgb(0,0,0)",
        width: 50,
        fontSize: 30
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
        height: screenHeight / 1.8,
    },
    mainview: {
        marginTop: 90
    },
    input: {
        borderWidth: 1,
        height: 35,
        width: screenWidth * 0.85,
        padding: 10,
        color: "rgb(0,0,0)",
        borderRadius: 10,
        borderColor: "rgb(0,0,0)",
        margin: 20
    },
    btns: {
        flexDirection: "row",
        justifyContent: "flex-end",
        width: screenWidth * 0.85,
    },
    inputView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    adrs: {
        backgroundColor: 'rgb(0, 80, 87)',
        padding: 10,
        borderRadius: 10,
        height: 55,
        width: screenWidth * 0.45,
        alignItems: "center",
        justifyContent: "center"
    },
    chpass: {
        backgroundColor: 'rgb(0, 80, 87)',
        padding: 10,
        borderRadius: 10,
        height: 55,
        marginTop:30,
        width: screenWidth * 0.6,
        alignItems: "center",
        justifyContent: "center"
    },
    otpbtn: {
        backgroundColor: 'rgb(0, 80, 87)',
        padding: 10,
        borderRadius: 10,
        height: 55,
        width: screenWidth * 0.6,
        marginTop: 50,
        alignItems: "center",
        justifyContent: "center"
    },
    lb: {
        flexDirection: "row",
        justifyContent: "flex-start",
        width: screenWidth * 0.85,
    },
    line1: {
        borderBottomColor: 'rgb(0,0,0)',
        borderBottomWidth: 0.6,
        marginTop: 25,
        marginBottom: 25,
        width: screenWidth * 0.8,
        marginVertical: 10,
    },
    line2: {
        borderBottomColor: 'rgb(0,0,0)',
        borderBottomWidth: 0.6,
        marginTop: 25,
        marginBottom: 25,
        width: screenWidth * 0.8,
        marginVertical: 10,
    },
});

export default YourProfile