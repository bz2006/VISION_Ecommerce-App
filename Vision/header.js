import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Image ,Dimensions,} from 'react-native';
import { useNavigation } from "@react-navigation/native";



const Headernav = () => {
    const navigation = useNavigation();
    return (
        <>

            <View style={styles.container} >
                <TouchableWithoutFeedback onPress={() => { navigation.navigate("HomePage") }}>
                    <Image style={styles.himg} source={{ uri: "https://static.wixstatic.com/media/c1ec53_cdb43083bb05441ca9fb28a5027a7306~mv2.webp" }}></Image>
                </TouchableWithoutFeedback>
               
            </View>
        </>
    );
};
const screenHeight = Dimensions.get('window').height ;
const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    himg: {
        height: screenHeight*0.06,
        width: screenWidth*0.5
    },
    container: {
        backgroundColor: '#fff',
        position: 'absolute',
         padding: 20,
        top: 0,
        left: 0,
        right: 0,
        elevation: 2,
        height: screenHeight*0.092,
    },
});

export default Headernav;
