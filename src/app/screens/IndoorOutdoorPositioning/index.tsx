import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Switch, ScrollView } from "react-native";
import { Navigation } from "react-native-navigation";

import { NavigationMap } from "../navigation";
import SitumPlugin from "react-native-situm-plugin";

import styles from "./styles";
import ResponseText from "../../components/ResponseText";

export const IndoorOutdoorPositioning = (props: { componentId: string, subscriptionId: number }) => {
  const [response, setResponse] = useState<String>();
  const [status, setStatus] = useState<String>();
  const [isDirectionDisable, setIsDirectionDisable] = useState<Boolean>(false);
  const [subscriptionId, setSubscriptionId] = useState<Number>(-1);

  const locationOptions = {
    useWife: true,
    useBle: true,
    useForegroundService: true,
  };

  

  const toggleSwitch = () => {
    setIsDirectionDisable((previousState) => !previousState);
    if (!isDirectionDisable) {
      SitumPlugin.startPositioning(
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
      ).then((id: number) => {
        setSubscriptionId(id);
      });
    } else {
      stopPositioning();
      setStatus("");
      setResponse("");
    }
  };

  const stopPositioning = () => {
    SitumPlugin.stopPositioning(subscriptionId, (success: any) => {
      setResponse(success);
    });
  };

  useEffect(() => {
    Navigation.mergeOptions(props.componentId, {
      ...NavigationMap.IndoorOutdoorPositioning.options,
    });
    return () => {
      stopPositioning();
    };
  }, [props.componentId]);
  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View style={styles.switchContainer}>
          <Text>
            {isDirectionDisable ? "Location Started:   " : "Location Stopped: "}
          </Text>
          <Switch onValueChange={toggleSwitch} value={isDirectionDisable} />
        </View>
        <ResponseText label="Status" value={status} />
        <ResponseText label="Location" value={response} />
      </SafeAreaView>
    </ScrollView>
  );
};
