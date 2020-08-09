import React, { useEffect, useState } from "react";
import { Button, View, Text, ActivityIndicator, Alert, Platform } from "react-native";

import { Navigation } from "react-native-navigation";

import { NavigationMap } from "../navigation";

import SitumPlugin from "react-native-situm-plugin";

import styles from "./styles";

export const Settings = (props: { componentId: string;}) => {

    const invalidateCache = () => {
        SitumPlugin.invalidateCache();
        // Alert()
    };

    const showSdkVersion = () => {
        SitumPlugin.sdkVersions(response=>{
            console.log(response)
            if (Platform.OS === 'ios') {
                alert('SDK Version is: ' + response.react_native + "/" + response.ios);
            } else {
                alert('SDK Version is: ' + response.react_native + "/" + response.android);
            }
            // e.g. {ios: "2.45.0", android: "1.60@aar", react_native:"0.0.3"}
        });
    };

    return (
        <View style={styles.container}>
            <Text>Settings configuration</Text>
            <Button
                onPress={() => {
                    invalidateCache();
                    alert('Cache cleared');
                }}
                title="Invalidate Cache"
            />
            <Button
                onPress={() => {
                    showSdkVersion();
                }}
                title="Show SDK Version"
            />
        </View>
    );
};