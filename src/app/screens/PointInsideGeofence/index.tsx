import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  NativeModules,
  Alert,
  Platform,
  SafeAreaView,
} from "react-native";
import { Navigation } from "react-native-navigation";

import { NavigationMap } from "../navigation";
import MapView, {
  Overlay,
  PROVIDER_GOOGLE,
  Polygon,
  Marker,
} from "react-native-maps";
import SitumPlugin from "react-native-situm-plugin";

import styles from "./styles";

let subscriptionId = -1;
export const PointInsideGeofence = (props: {
  componentId: string;
  building: any;
}) => {
  const [building] = useState<any>(props.building);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [floor, setFloor] = useState<any>();
  const [mapImage, setMapImage] = useState<String>();
  const [bounds, setBounds] = useState<any>();
  const [isUserInGeofence, setUserinGeofence] = useState<Boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<any>();
  const [polygonPoints, setPolygonPoints] = useState<any>();
  const [mapRegion] = useState<any>({
    latitude: building.center.latitude,
    longitude: building.center.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const locationOptions = {
    useWife: true,
    useBle: true,
    useForegroundService: true,
  };

  const getFloorsFromBuilding = () => {
    setIsLoading(true);
    SitumPlugin.fetchFloorsFromBuilding(
      building,
      (floors: any) => {
        setIsLoading(false);

        if (floors.length > 0) {
          setBounds([
            [
              building.bounds.northEast.latitude,
              building.bounds.southWest.longitude,
            ],
            [
              building.bounds.southWest.latitude,
              building.bounds.northEast.longitude,
            ],
          ]);
          setFloor(floors[0]);
          setMapImage(floors[0].mapUrl);
          getGeofenceFromBuilding();
        } else {
          console.log("No floors found!");
        }
      },
      (error: string) => {
        console.log(error);
        setIsLoading(false);
      }
    );
  };

  const getGeofenceFromBuilding = () => {
    setIsLoading(true);
    SitumPlugin.fetchGeofencesFromBuilding(
      building,
      (geofences: any) => {
        console.log(JSON.stringify(geofences));
        setIsLoading(false);
        if (geofences.length > 0) {
          let points = [];
          for (let polygon of geofences[0].polygonPoints) {
            points.push(polygon.coordinate);
          }
          setPolygonPoints(points);

          startPositioning();
        } else {
          console.log("No geofences found!");
        }
      },
      (error: string) => {
        console.log(error);
        setIsLoading(false);
      }
    );
  };

  const startPositioning = () => {
    if (Platform.OS === "ios") return;

    subscriptionId = SitumPlugin.startPositioning(
      (location) => {
        setCurrentLocation(location.coordinate);

        SitumPlugin.checkIfPointInsideGeofence(
          {
            coordinate: location.coordinate,
          },
          (response) => {
            setUserinGeofence(response.isInsideGeofence);
          }
        );
      },
      (status) => {
        console.log(status);
      },
      (error) => {
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

  const onMapPress = (coordinate) => {
    console.log(coordinate);

    SitumPlugin.checkIfPointInsideGeofence(
      {
        coordinate: coordinate,
      },
      (response) => {
        alert(JSON.stringify(response, null, 3));
      }
    );
  };

  useEffect(() => {
    getFloorsFromBuilding();
    SitumPlugin.requestAuthorization();
    return () => {
      stopPositioning();
    };
  }, [props.componentId]);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>
        {isUserInGeofence
          ? "Current position INSIDE geofence"
          : "Current position OUTSIDE geofence"}{" "}
        {"\nClick anywhere on the map"}
      </Text>
      <MapView
        style={styles.mapview}
        region={mapRegion}
        provider={PROVIDER_GOOGLE}
        onPress={(event) => onMapPress(event.nativeEvent.coordinate)}
      >
        {currentLocation != undefined && (
          <Marker coordinate={currentLocation} />
        )}

        {mapImage != undefined && (
          <Overlay image={mapImage} bounds={bounds} zIndex={1000} />
        )}

        {polygonPoints != undefined && (
          <Polygon
            coordinates={polygonPoints}
            strokeColor="#F00"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={1}
            zIndex={1000}
          />
        )}
      </MapView>

      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}
    </SafeAreaView>
  );
};
