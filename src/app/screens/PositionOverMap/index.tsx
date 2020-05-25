import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Navigation } from "react-native-navigation";

import { NavigationMap } from "../navigation";
import MapView, { Marker } from "react-native-maps";
import SitumPlugin from "react-native-situm-plugin";

import styles from "./styles";

export const PositionOverMap = (props: { componentId: string }) => {
  const [location, setLocation] = useState<any>();
  const [mapView, setMapView] = useState<MapView | null>(null);
  const [mapRegion, setMapRegion] = useState<any>({
    latitude: 39.8596584,
    longitude: -12.7036393,
    latitudeDelta: 100,
    longitudeDelta: 100,
  });
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const locationOptions = {
    useWife: true,
    useBle: true,
    useForegroundService: true,
  };

  let subscriptionId = -1;

  const startPositioning = () => {
    setIsLoading(true);
    SitumPlugin.startPositioning(
      (location: any) => {
        setIsLoading(false);
        setLocation(location);
        setMapRegion({
          latitude: location.coordinate.latitude,
          longitude: location.coordinate.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
      },
      (status: any) => {
        setIsLoading(false);
        console.log(status);
      },
      (error: string) => {
        setIsLoading(false);
        console.log(error);
        stopPositioning();
      },
      locationOptions
    ).then((id) => {
      subscriptionId = id;
    });
  };

  const stopPositioning = () => {
    SitumPlugin.stopPositioning(subscriptionId, (success: any) => {
      console.log(success);
    });
  };

  useEffect(() => {
    Navigation.mergeOptions(props.componentId, {
      ...NavigationMap.PositionOverMap.options,
    });
    startPositioning();
    return () => {
      stopPositioning();
    };
  }, [props.componentId]);

  return (
    <View style={styles.container}>
      <MapView style={{ width: "100%", height: "100%" }} region={mapRegion}>
        {location != undefined && <Marker coordinate={location.coordinate} />}
      </MapView>

      {isLoading && (
        <View style={{ position: "absolute" }}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}
    </View>
  );
};
