import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Tracking({ status }) {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.tracking}>
                    <View style={{ alignItems: "center", justifyContent: "center", marginRight: 20, }}>
                        <View style={[styles.circle, (status === "Proccesing" || status === "Shipped" || status === "Out for delivery" || status === "Delivered") && styles.completed]} />
                        <View style={[styles.verticalLine, (status === "Proccesing" || status === "Shipped" || status === "Out for delivery" || status === "Delivered") && styles.completed]} />
                    </View>
                    <Text style={[styles.statusText, (status === "Proccesing" || status === "Shipped" || status === "Out for delivery" || status === "Delivered") && styles.completedText]}>Order Placed</Text>
                </View>


                <View style={styles.tracking}>
                    <View style={{ alignItems: "center", justifyContent: "center", marginRight: 20, }}>
                        <View style={[styles.circle, (status === "Proccesing" || status === "Shipped" || status === "Out for delivery" || status === "Delivered") && styles.completed]} />
                        <View style={[styles.verticalLine, (status === "Shipped" || status === "Out for delivery" || status === "Delivered") && styles.completed]} />
                    </View>
                    <Text style={[styles.statusText, (status === "Proccesing" || status === "Shipped" || status === "Out for delivery" || status === "Delivered") && styles.completedText]}>Proccesing</Text>
                </View>


                <View style={styles.tracking}>
                    <View style={{ alignItems: "center", justifyContent: "center", marginRight: 20, }}>
                        <View style={[styles.circle, (status === "Shipped" || status === "Out for delivery" || status === "Delivered") && styles.completed]} />
                        <View style={[styles.verticalLine, (status === "Out for delivery" || status === "Delivered") && styles.completed]} />
                    </View>
                    <Text style={[styles.statusText, (status === "Shipped" || status === "Out for delivery" || status === "Delivered") && styles.completedText]}>Shipped</Text>
                </View>


                <View style={styles.tracking}>
                    <View style={{ alignItems: "center", justifyContent: "center", marginRight: 20, }}>
                        <View style={[styles.circle, (status === "Out for delivery" || status === "Delivered") && styles.completed]} />
                        <View style={[styles.verticalLine, (status === "Delivered") && styles.completed]} />
                    </View>
                    <Text style={[styles.statusText, (status === "Out for delivery" || status === "Delivered") && styles.completedText]}>Out for delivery</Text>
                </View>


                <View style={styles.tracking}>
                    <View style={{ alignItems: "center", justifyContent: "center", marginRight: 20, }}>
                        <View style={[styles.circle, status === "Delivered" && styles.completed]} />
                    </View>
                    <Text style={[styles.statusText, status === "Delivered" && styles.completedText]}>Delivered</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 80
    },
    row: {
        flexDirection: 'column',
        marginLeft:30
    },
    tracking: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginVertical: 10,
    },
    circle: {
        width: 35,
        height: 35,
        backgroundColor: '#f7be16',

    },
    verticalLine: {
        height: 70,
        width: 5,
        marginTop: 10,
        backgroundColor: '#f7be16',
        marginBottom: -10
    },
    completed: {
        backgroundColor: '#27aa80',
    },
    statusText: {
        fontSize: 25,
        color: '#A4A4A4',
    },
    completedText: {
        color: 'rgb(0,0,0)',
    },
});
