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
let pointsForGeofence ={name: "", points:[]}
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
    useGlobalLocation: true,
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
    SitumPlugin.fetchBuildingInfo(
      building,
      (building: any) => {
        setIsLoading(false);
        if (building.geofences.length > 0) {
          let points = [];
          let geofencePoints = [];
          for (let polygon of building.geofences[0].polygonPoints) {
            points.push(polygon.coordinate);
            geofencePoints.push([
              polygon.coordinate.latitude,
              polygon.coordinate.longitude,
            ]);
          }
          setPolygonPoints(points);
          pointsForGeofence={
            name: building.geofences[0].name,
            points: geofencePoints,
          };

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

    subscriptionId = SitumPlugin.startPositioning(
      (location) => {
        setCurrentLocation(location.coordinate);

        setUserinGeofence(
          inside(location.coordinate, pointsForGeofence.points)
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
    const isInside = inside(coordinate, pointsForGeofence.points);
    if (isInside) {
      alert("Point inside geofence: " + pointsForGeofence.name);
    }
  };

  const inside = (point, vs) => {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    console.log(vs);
    var x = point.latitude,
      y = point.longitude;

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i][0],
        yi = vs[i][1];
      var xj = vs[j][0],
        yj = vs[j][1];

      var intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
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
          <Overlay
            image={mapImage}
            bounds={bounds}
            location={[mapRegion.latitude, mapRegion.longitude]}
            zIndex={1000}
            bearing={(building.rotation * 180) / Math.PI}
            anchor={[0.5, 0.5]}
            width={building.dimensions.width}
            height={building.dimensions.height}
          />
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
