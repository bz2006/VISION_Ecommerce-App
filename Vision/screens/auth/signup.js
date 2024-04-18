import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native'
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../../context/context/auth';

const Signup = () => {

    const navigation = useNavigation();
    const [username, setusername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const formdata = {};
    const [auth, setAuth] = useAuth();

    const Handlesignup = async () => {

        try {
            const res = await axios.post("/api/v1/auth/signup", { username, email, password });
            if (res && res.data.success) {
                const Login = await axios.post("/api/v1/auth/login", { email, password });
                if (Login && Login.data.success) {
                    setAuth(res.data)
                    await AsyncStorage.setItem('auth', JSON.stringify(res.data));
                    formdata.name = username;
                    formdata.email = email;
                    await welcomeMail()
                    setusername("")
                    setEmail("")
                    setPassword("")
                    alert("Sign Up Successful");
                    navigation.navigate("HomePage")
                }
            } else {
                alert("Sign Up failed")
                setusername("")
                setEmail("")
                setPassword("")
            }
        } catch (error) {
        }
    }

    const welcomeMail = async () => {
        try {
            const response = await fetch('https://app-api.visionwoodenclocks.com/send-welcome-mail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formdata)
            });
            if (response.ok) {
            } else {
            }
        } catch (error) {
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.tx} >Sign Up</Text>
            <Text style={styles.tx1} >Already a member?
                <Text style={styles.tx12} onPress={() => { navigation.navigate("Login") }}> Log In</Text></Text>

            <View style={styles.authcontainer}>
                <TextInput
                    style={styles.input}
                    placeholder='User name'
                    value={username}
                    onChangeText={text => setusername(text)}
                />
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
                <TouchableOpacity style={styles.btn} onPress={Handlesignup}>
                    <Text style={styles.btnt}>Sign Up</Text>
                </TouchableOpacity>
            </View>
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
    tx: {
        fontSize: 60,
        color: "rgb(0,0,0)"
    },
    tx1: {
        fontSize: 20,
        color: "rgb(0,0,0)",
    },
    tx12: {
        fontSize: 22,
        color: "green",
    },
    authcontainer: {
        marginTop: 10,
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
export default Signup