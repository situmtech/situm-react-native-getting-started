import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Navigation } from "react-native-navigation";

import MapView, { Overlay, Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { NavigationMap } from "../navigation";
import SitumPlugin from "react-native-situm-plugin";

import styles from "./styles";

export const RouteOverMap = (props: { componentId: string; building: any }) => {
  const [building, setBuilding] = useState<any>(props.building);
  const [mapImage, setMapImage] = useState<String | null>(null);
  const [bounds, setBounds] = useState<any>();
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [floor, setFloor] = useState<any>({
    floorIdentifier: "",
    buildingIdentifier: "",
    coordinate: { latitude: 0, longitude: 0 },
  });
  const [mapRegion] = useState<any>({
    latitude: building.center.latitude,
    longitude: building.center.longitude,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003,
  });
  const [points, setPoints] = useState<any[]>([]);
  const [polylineLatlng, setPolylineLatlng] = useState<any[]>([]);

  const getFloorsFromBuilding = () => {
    SitumPlugin.fetchFloorsFromBuilding(
      building,
      (floors: any) => {
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
          setMapImage(floors[0].mapUrl);
          setFloor(floors[0]);
          // getMapFromFloor(floors[0]);
        } else {
          console.log("No floors found!");
        }
      },
      (error: string) => {
        console.log(error);
      }
    );
  };

  const requestDirections = () => {
    setIsLoading(true);
    SitumPlugin.requestDirections(
      [building, ...points],
      (route: any) => {
        setIsLoading(false);
        let latlngs = [];
        for (let segment of route.segments) {
          for (let point of segment.points) {
            latlngs.push({
              latitude: point.coordinate.latitude,
              longitude: point.coordinate.longitude,
            });
          }
        }
        setPolylineLatlng(latlngs);
      },
      (error: string) => {
        setIsLoading(false);
        console.log(error);
      }
    );
  };

  const updateRoutePoints = (latlng: any) => {
    const point = {
      floorIdentifier: floor.floorIdentifier,
      buildingIdentifier: building.buildingIdentifier,
      coordinate: latlng,
    };
    if (points.length == 2) {
      setPolylineLatlng([])
      setPoints([point]);
    } else {
      setPoints([...points, point]);
    }
  };

  useEffect(() => {
    if (points.length == 2) {
      requestDirections();
    }
  }, [points]);

  useEffect(() => {
    getFloorsFromBuilding();
  }, [props.componentId]);

  return (
    <View style={styles.container}>
      <MapView
        style={{ width: "100%", height: "100%" }}
        region={mapRegion}
        onPress={(event) => updateRoutePoints(event.nativeEvent.coordinate)}
        provider={PROVIDER_GOOGLE}
      >
         {polylineLatlng.length > 0 && (
          <Polyline
            key="editingPolyline"
            coordinates={polylineLatlng}
            strokeColor="#F00"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={1}
          />
        )}

        {mapImage != null && (
          <Overlay image={mapImage} bounds={bounds}/>
        )}

        {points[0] != null &&
          points.map((point, index) => (
            <Marker key={index} coordinate={point.coordinate} />
          ))}

      </MapView>
      {isLoading && (
        <View style={{ position: "absolute" }}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}
    </View>
  );
};
