import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TextInput, TouchableOpacity, Dimensions } from 'react-native'
import axios from "axios";
import Ionicons from 'react-native-vector-icons/Ionicons';
import OtpTextInput from 'react-native-text-input-otp'
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/context/auth';
import { useNavigation } from "@react-navigation/native";
let Code = 0
const Login = () => {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [auth, setAuth] = useAuth();
    const [pass, setpass] = useState("")
    const [otp, setOtp] = useState('')
    const [VerificationStatus, setVerificationStatus] = useState(false);
    const [VerificationInit, setVerificationInit] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    const Handlelogin = async () => {
        try {
            console.log(email,password)
            const res = await axios.post("/api/v1/auth/login", { email, password });
            console.log(email,res)
            if (res && res.data.success) {
                alert("Login successful");
                setEmail("")
                
                setPassword("")
                setAuth(res.data)
                await AsyncStorage.setItem('auth', JSON.stringify(res.data));
                navigation.navigate("HomePage")
            } else {
                setEmail("")
                setPassword("")
                alert("User not found")

            }
        } catch (error) {
            setEmail("")
            setPassword("")
            alert("An error occured, please try again")
        }

    }

    const UpdatePass = async () => {
        try {
            await axios.post(`/api/v1/users/forgot-pass/${email}`, { pass });
            alert("Password Updated")
            setModalVisible(false)
            setVerificationInit(false)
            setVerificationStatus(false)
            setOtp("")
            Code = 0
        } catch (error) {
        }
    }

    const HandleVerificationInit = async () => {
        setVerificationInit(true)
        await Verification();
    }

    const handleChangePassword = async () => {
        setModalVisible(true);
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
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: '#fff',
        }}>
            <View style={styles.container} >
                <Text style={styles.tx} >Log In</Text>
                <Text style={styles.tx1} >New to this site?
                    <Text style={styles.tx12} onPress={() => { navigation.navigate("Signup") }}> Sign Up</Text></Text>
                <TextInput
                    style={styles.input}
                    keyboardType="email-address"
                    placeholder='Email'
                    value={email}
                    onChangeText={text => setEmail(text)}
                />
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    placeholder='Password'
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
                <Text style={styles.forgotp} onPress={handleChangePassword}>Forgot Password?</Text>
                <TouchableOpacity style={styles.btn} onPress={Handlelogin}>
                    <Text style={styles.btnt}>Log In</Text>
                </TouchableOpacity>

            </View >
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
                                setVerificationInit(false)
                                setOtp("");
                                Code = 0;
                                setModalVisible(false);
                            }} />
                        </View>
                        <View style={{ justifyContent: "center", flex: 1 }}>

                            {VerificationInit === false ? (
                                <>
                                    <Text style={{ fontSize: 18, color: "rgb(0,0,0)",marginBottom:10 }}>New Password</Text>
                                    <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                        <TextInput keyboardType="email-address" onChangeText={(text) => setEmail(text)} value={email} placeholder='Email' style={{ width: "95%",borderWidth:0.5,borderRadius:3 }} />
                                        <TouchableOpacity style={styles.chpass} onPress={HandleVerificationInit}>
                                            <Text style={{ fontSize: 18, color: "white" }} >Send OTP</Text>

                                        </TouchableOpacity>
                                    </View>
                                </>
                            ) : (
                                <>
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
                                                <TextInput type='password' secureTextEntry={true} onChangeText={(text) => setpass(text)} value={pass} placeholder='Password' style={{ width: "95%",borderWidth:0.5,borderRadius:3 }}/>
                                                <TouchableOpacity style={styles.chpass} onPress={UpdatePass}><Text style={{ fontSize: 18, color: "white" }}>Change Password</Text></TouchableOpacity>

                                            </View>
                                        </>
                                    )}
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
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: "40px"
    },
    forgotp: {
        marginTop: 10,
        fontSize: 20,
        color: "rgb(0, 80, 87)"
    },
    otpview: {
        flex: 1,
        paddingHorizontal: 20,
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "Red"
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
    tx: {
        fontSize: 60,
        color: "rgb(0,0,0)"
    },
    tx1: {
        fontSize: 20,
        color: "rgb(0,0,0)",
        marginBottom: 50
    },
    tx12: {
        fontSize: 22,
        color: "green",
        marginBottom: 50
    },
    authcontainer: {
        backgroundColor: "green",
        marginTop: 80,
        justifyContent: 'center',
        padding: 30,
    },
    input: {
        width: screenWidth * 0.8,
        borderColor: 'rgb(0,0,0)',
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 5,
        height: screenHeight * 0.07,
        margin: 20,
        paddingHorizontal: 10,
    },
    btn: {
        height: screenHeight * 0.07,
        borderColor: 'rgb(0,0,0)',
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 5,
        width: screenWidth * 0.8,
        margin: 20,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "rgb(0,0,0)",
    },
    btnt: {
        color: "white",
        fontSize: 20
    }

});
export default Login