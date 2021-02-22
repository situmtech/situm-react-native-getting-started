import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Switch, ScrollView } from "react-native";
import { Navigation } from "react-native-navigation";
import { Menu, MenuProvider, MenuTrigger, MenuOption, MenuOptions } from "react-native-popup-menu";

import { NavigationMap } from "../navigation";
import SitumPlugin from "react-native-situm-plugin";

import styles from "./styles";
import ResponseText from "../../components/ResponseText";

let subscriptionId = -1;
export const IndoorOutdoorPositioning = (props: { componentId: string }) => {
  const [response, setResponse] = useState<String>();
  const [status, setStatus] = useState<String>();
  const [isDirectionEnable, setIsDirectionEnable] = useState<Boolean>(false);
  const [useBarometer, setUseBarometer] = useState<Boolean>(false);
  const [realtimeUpdateInterval, setRealtimeUpdateInterval] = useState<string>("REALTIME");

  const locationOptions = {
    useWifi: true,
    useBle: true,
    useForegroundService: true,
    useGlobalLocation:true,
    useBarometer: useBarometer,
    realtimeUpdateInterval: realtimeUpdateInterval,
    outdoorLocationOptions: {
      buildingDetector: "WIFI", // options: WIFI, BLE; default: 
      // minimumOutdoorLocationAccuracy: 10
      averageSnrThreshold: 40
    },
    

  };

  const toggleSwitch = (check: boolean) => {
    if (check) {
      subscriptionId = SitumPlugin.startPositioning(
        (location: any) => {
          setResponse(JSON.stringify(location, null, 3));
        },
        (status: any) => {
          setStatus(JSON.stringify(status, null, 3));
        },
        (error: string) => {
          setStatus(error);
          stopPositioning();
        },
        locationOptions
      );
    } else {
      stopPositioning();
      setStatus("");
      setResponse("");
    }

    setIsDirectionEnable(check);
  };

  const stopPositioning = () => {
    SitumPlugin.stopPositioning(subscriptionId, (success: any) => {
      // setResponse(success);
    });
  };

  useEffect(() => {
    SitumPlugin.requestAuthorization();
    return () => {
      stopPositioning();
    };
  }, [props.componentId]);

  const renderOptions = () => {
    if(isDirectionEnable) return <></>

   return( 
    <>
     <View style={styles.switchContainer}>
        <Text>
          {"useBarometer"}
        </Text>
        <Switch onValueChange={(toggle)=>setUseBarometer(toggle)} value={useBarometer} />
      </View>
      <View style={styles.rowContainer}>
        <Text> {"Outdoor Location Building Detector: "} </Text>
        <Menu  onSelect={value => setRealtimeUpdateInterval(value)}>
          <MenuTrigger text={realtimeUpdateInterval}/>
          <MenuOptions>
          <MenuOption value={"REALTIME"} text='REALTIME' />
          <MenuOption value={"FAST"} text='FAST' />
          <MenuOption value={"NORMAL"} text='NORMAL' />
          <MenuOption value={"SLOW"} text='SLOW' />
          <MenuOption value={"BATTERY_SAVER"} text='BATTERY_SAVER' />
          </MenuOptions>
        </Menu>        
      </View>
    </>
   )
  }

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
      <MenuProvider>
          <View style={styles.switchContainer}>
            <Text>
              {isDirectionEnable ? "Location Started:   " : "Location Stopped: "}
            </Text>
            <Switch onValueChange={toggleSwitch} value={isDirectionEnable} />
          </View>

          {renderOptions()}

          <ResponseText label="Status" value={status} />
          <ResponseText label="Location" value={response} />
        </MenuProvider>
      </SafeAreaView>
    </ScrollView>
  );
};
