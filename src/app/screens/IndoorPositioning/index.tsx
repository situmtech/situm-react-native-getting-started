import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Switch,
  SafeAreaView,
} from "react-native";

import { Navigation } from "react-native-navigation";

import { NavigationMap } from "../navigation";
import SitumPlugin from "react-native-situm-plugin";

import styles from "./styles";
import ResponseText from "../../components/ResponseText";

let subscriptionId = -1;
export const IndoorPositioning = (props: {
  componentId: string;
  building: string;
}) => {
  const [building, setBuilding] = useState<any>(props.building);
  const [response, setResponse] = useState<String>();
  const [status, setStatus] = useState<String>();
  const [isDirectionEnable, setIsDirectionEnable] = useState<Boolean>(false);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [step, setStep] = useState<String>();
  const [mapImage, setMapImage] = useState<String>();

  const locationOptions = {
    buildingIdentifier: building.buildingIdentifier,
  };

  const getBuildingInfo = () => {
    setIsLoading(true);
    setStep("fetchBuildingInfo");
    SitumPlugin.fetchBuildingInfo(
      building,
      (buildingInfo: any) => {
        setBuilding(buildingInfo);
        setIsLoading(false);
      },
      (error: string) => {
        setStatus("fetchBuildingInfo: " + error);
        setIsLoading(false);
      }
    );
  };

  const getFloorsFromBuilding = () => {
    setIsLoading(true);
    setStep("fetchFloorsFromBuilding");
    SitumPlugin.fetchFloorsFromBuilding(
      building,
      (floors: any) => {
        console.log(floors)
        setIsLoading(false);
        if (floors.length > 0) {
          getMapFromFloor(floors[0]);
        } else {
          console.log("No floors found!");
        }
      },
      (error: string) => {
        setStatus("fetchFloorsFromBuilding: " + error);
        setIsLoading(false);
      }
    );
  };

  const getMapFromFloor = (floor: any) => {
    setIsLoading(true);
    setStep("fetchMapFromFloor");
    SitumPlugin.fetchMapFromFloor(
      floor,
      (map: any) => {
        setIsLoading(false);
        setMapImage("data:image/png;base64," + map);
      },
      (error: string) => {
        setStatus("fetchMapFromFloor: " + error);
        setIsLoading(false);
      }
    );
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
      )
    } else {
      stopPositioning();
      setStatus("");
      setResponse("");
    }

    setIsDirectionEnable(check);
  };

  const stopPositioning = () => {
    SitumPlugin.stopPositioning(subscriptionId, (success: any) => {
      // setStatus(JSON.stringify(success, null, 3));
    });
  };

  useEffect(() => {
    Navigation.mergeOptions(props.componentId, {
      ...NavigationMap.IndoorPositioning.options,
    });
    SitumPlugin.requestAuthorization();
    getFloorsFromBuilding();
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
        {isLoading && (
          <View>
            <ActivityIndicator size="large" color="#aaaaaa" />
            <Text style={{ textAlign: "center", marginTop: 15 }}>{step}</Text>
          </View>
        )}

        <Image
          style={{
            marginTop: 100,
            resizeMode: "contain",
          }}
          width={Dimensions.get("window").width - 100}
          height={200}
          source={{ uri: mapImage }}
        />
      </SafeAreaView>
    </ScrollView>
  );
};
