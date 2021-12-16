import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { Navigation } from "react-native-navigation";

import { NavigationMap } from "../navigation";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import SitumPlugin from "react-native-situm-plugin";

import styles from "./styles";
import { getLocationOptions } from "../../data/settings";
import {
  check,
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from "react-native-permissions";
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

  const locationPermissions = [
    PERMISSIONS.IOS.LOCATION_ALWAYS,
    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
  ];

  const startPositioning = (locationOptions: any) => {
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
        if (status == "STARTING") {
          setIsLoading(false);
        }
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
    SitumPlugin.stopPositioning(subscriptionId, (success: any) => {
      console.log(success);
    });
  };

  const startLocationUpdates = () => {
    getLocationOptions().then((options) => {
      startPositioning(options);
    });
  };

  const requestLocationPermissions = (result) => {
    requestMultiple(locationPermissions).then((statuses) => {
      for (var permission of locationPermissions) {
        if (statuses[permission] == RESULTS.GRANTED) {
          startLocationUpdates();
        }
      }
    });
  };

  useEffect(() => {
    Navigation.mergeOptions(props.componentId, {
      ...NavigationMap.PositionOverMap.options,
    });
    return () => {
      stopPositioning();
    };
  }, [props.componentId]);

  useEffect(() => {
    requestLocationPermissions();
  }, [props.componentId]);

  return (
    <View style={styles.container}>
      <MapView
        style={{ width: "100%", height: "100%" }}
        region={mapRegion}
        provider={PROVIDER_GOOGLE}
      >
        {location != undefined && (
          <Marker
            rotation={location.bearing.degrees}
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
