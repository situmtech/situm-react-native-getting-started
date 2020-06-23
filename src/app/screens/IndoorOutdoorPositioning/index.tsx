import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Switch, ScrollView } from "react-native";
import { Navigation } from "react-native-navigation";

import { NavigationMap } from "../navigation";
import SitumPlugin from "react-native-situm-plugin";

import styles from "./styles";
import ResponseText from "../../components/ResponseText";

let subscriptionId = -1;
export const IndoorOutdoorPositioning = (props: { componentId: string }) => {
  const [response, setResponse] = useState<String>();
  const [status, setStatus] = useState<String>();
  const [isDirectionEnable, setIsDirectionEnable] = useState<Boolean>(false);

  const locationOptions = {
    useWife: true,
    useBle: true,
    useForegroundService: true,
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

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View style={styles.switchContainer}>
          <Text>
            {isDirectionEnable ? "Location Started:   " : "Location Stopped: "}
          </Text>
          <Switch onValueChange={toggleSwitch} value={isDirectionEnable} />
        </View>
        <ResponseText label="Status" value={status} />
        <ResponseText label="Location" value={response} />
      </SafeAreaView>
    </ScrollView>
  );
};
