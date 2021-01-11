import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Switch, ScrollView, TextInput } from "react-native";
import { Navigation } from "react-native-navigation";

import { NavigationMap } from "../navigation";
import SitumPlugin from "react-native-situm-plugin";

import styles from "./styles";
import ResponseText from "../../components/ResponseText";
import { Menu, MenuProvider, MenuTrigger, MenuOption, MenuOptions } from "react-native-popup-menu";

let subscriptionId = -1;
export const OutdoorPositioning = (props: { componentId: string }) => {
  const [response, setResponse] = useState<String>();
  const [status, setStatus] = useState<String>();
  const [isDirectionEnable, setIsDirectionEnable] = useState<Boolean>(false);
  const [updateInterval, setUpdateInterval] = useState<number>(5);
  const [computeInterval, setComputeInterval] = useState<number>(1);
  const [backgroundAccuracy, setBackgroundAccuracy] = useState<string>("MAXIMUM");
  const [buildingDetector, setBuildingDetector] = useState<string>("WIFI");

  let locationOptions = {
    useWifi: true,
    useBle: true,
    useForegroundService: true,
    useGlobalLocation:true,
    outdoorLocationOptions: {
      buildingDetector: buildingDetector, 
      updateInterval: updateInterval*1000, //toMillis
      computeInterval: computeInterval*1000, //toMillis 
      backgroundAccuracy: backgroundAccuracy 
    }
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

 const onUpdateIntervalChange = (newInterval: string) => {
    setUpdateInterval(+newInterval.replace(/[^0-9]/g, "") )
  };

  const onComputeIntervalChange = (newInterval: string) => {
    setComputeInterval(+newInterval.replace(/[^0-9]/g, "") )
  };


  useEffect(() => {
    SitumPlugin.requestAuthorization();
    return () => {
      stopPositioning();
    };
  }, [props.componentId]);

  const renderOptions = () => {
    if(isDirectionEnable) return <></>

    return <View> 
            <View style={styles.rowContainer}>
              <Text> {"Outdoor Location Update\n Interval (Seconds): "} </Text>
              <TextInput
                style={styles.input}
                placeholder="1000"
                onChangeText={(text)=> onUpdateIntervalChange(text)}
                value={updateInterval.toString()}
              />
            </View>

            <View style={styles.rowContainer}>
              <Text> {"Outdoor Location Compute\n Interval (Seconds): "} </Text>
              <TextInput
                style={styles.input}
                placeholder="1000"
                onChangeText={(text)=> onComputeIntervalChange(text)}
                value={computeInterval.toString()}
              />
            </View>

            <View style={styles.rowContainer}>
              <Text> {"Outdoor Location Building Detector: "} </Text>
              <Menu  onSelect={value => setBuildingDetector(value)}>
                <MenuTrigger text={buildingDetector}/>
                <MenuOptions>
                  <MenuOption value={"WIFI"} text='WIFI' />
                  <MenuOption value={"BLE"} text='BLE' />
                  <MenuOption value={"WIFI_AND_BLE"} text='WIFI_AND_BLE' />
                  <MenuOption value={"GPS"} text='GPS' />
                </MenuOptions>
              </Menu>
                
            </View>

            <View style={styles.rowContainer}>
              <Text> {"Outdoor Background Accuracy: "} </Text>
              <Menu  onSelect={value => setBackgroundAccuracy(value)}>
                <MenuTrigger text={backgroundAccuracy}/>
                <MenuOptions>
                  <MenuOption value={"MAXIMUM"} text='MAXIMUM' />
                  <MenuOption value={"HIGH"} text='HIGH' />
                  <MenuOption value={"MEDIUM"} text='MEDIUM' />
                  <MenuOption value={"LOW"} text='LOW' />
                </MenuOptions>
              </Menu>
                
            </View>
          </View>
  }

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <MenuProvider>
            {renderOptions()}
          <View style={styles.switchContainer}>
            <Text>
              {isDirectionEnable ? "Location Started:   " : "Location Stopped: "}
            </Text>
            <Switch onValueChange={toggleSwitch} value={isDirectionEnable} />
          </View>
          <ResponseText label="Status" value={status} />
          <ResponseText label="Location" value={response} />
        </MenuProvider>
      </SafeAreaView>
    </ScrollView>
  );
};
