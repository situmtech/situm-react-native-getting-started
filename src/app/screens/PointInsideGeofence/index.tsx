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
let pointsForGeofences: { name: any; points: any[][] }[] = [];
export const PointInsideGeofence = (props: {
  componentId: string;
  building: any;
}) => {
  const [building] = useState<any>(props.building);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [floor, setFloor] = useState<any>();
  const [mapImage, setMapImage] = useState<String>();
  const [bounds, setBounds] = useState<any>();
  const [userInGeofence, setUserInGeofence] = useState<any>({});
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
    useGlobalLocation: true,
    useBle: true,
    useForegroundService: true,
    interval: 7000,
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
          let allPolygonPoints = [];
          let geofencePoints = [];
          pointsForGeofences = [];

          for (let geofence of building.geofences) {
            let points = [];
            let geofencePoints = [];
            for (let polygon of geofence.polygonPoints) {
              points.push(polygon.coordinate);
              geofencePoints.push([
                polygon.coordinate.latitude,
                polygon.coordinate.longitude,
              ]);
            }

            allPolygonPoints.push(points);
            pointsForGeofences.push({
              name: geofence.name,
              points: geofencePoints,
            });
          }

          setPolygonPoints(allPolygonPoints);
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

        for (let geofence of pointsForGeofences) {
          if (inside(location.coordinate, geofence.points)) {
            setUserInGeofence({ isInside: true, name: geofence.name });
            break;
          }
        }
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
    for (let geofence of pointsForGeofences) {
      console.log(JSON.stringify(geofence));
      if (inside(coordinate, geofence.points)) {
        alert("Point inside geofence: " + geofence.name);
        break;
      }
    }
  };

  const inside = (point, vs) => {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
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

  const randomColor = () => {
    const color =
      "rgba(" +
      Math.round(Math.random() * 255) +
      "," +
      Math.round(Math.random() * 255) +
      "," +
      Math.round(Math.random() * 255) +
      "," +
      0.5 +
      ")";
    return color;
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
        {userInGeofence.isInside
          ? "Current position INSIDE geofence: " + userInGeofence.name
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

        {polygonPoints != undefined &&
          polygonPoints.map((points, index) => (
            <Polygon
              key={index}
              coordinates={points}
              strokeColor="#F00"
              fillColor={randomColor()}
              strokeWidth={1}
              zIndex={1000}
            />
          ))}
      </MapView>

      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}
    </SafeAreaView>
  );
};
