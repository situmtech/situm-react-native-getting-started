import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import { Navigation } from "react-native-navigation";

import { NavigationMap } from "../navigation";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import SitumPlugin from "react-native-situm-plugin";

import styles from "./styles";
// import { ic_direction } from '../../../assets/assets';

let subscriptionId = -1;
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

  const startPositioning = () => {
    if (Platform.OS === "ios") return;

    setIsLoading(true);
    subscriptionId = SitumPlugin.startPositioning(
      (location) => {
        setIsLoading(false);
        setLocation(location);
        setMapRegion({
          latitude: location.coordinate.latitude,
          longitude: location.coordinate.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        });
      },
      (status) => {
        setIsLoading(false);
        console.log(status);
      },
      (error) => {
        setIsLoading(false);
        console.log(error);
        stopPositioning();
      },
      locationOptions
    );
  };

  const stopPositioning = () => {
    if (Platform.OS === "ios") return;

    SitumPlugin.stopPositioning(subscriptionId, (success: any) => {
      console.log(success);
    });
  };

  useEffect(() => {
    Navigation.mergeOptions(props.componentId, {
      ...NavigationMap.PositionOverMap.options,
    });
    SitumPlugin.requestAuthorization();
    startPositioning();
    return () => {
      stopPositioning();
    };
  }, [props.componentId]);

  return (
    <View style={styles.container}>
      <MapView
        style={{ width: "100%", height: "100%" }}
        region={mapRegion}
        showsUserLocation={Platform.OS === "ios"}
        showsMyLocationButton={Platform.OS === "ios"}
        provider={PROVIDER_GOOGLE}
      >
        {location != undefined && (
          <Marker
            rotation = {location.bearing.degrees}
            coordinate={location.coordinate}
            image={require("../../../assets/ic_direction.png")}
          />
        )}
      </MapView>

      {isLoading && (
        <View style={{ position: "absolute" }}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}
    </View>
  );
};

