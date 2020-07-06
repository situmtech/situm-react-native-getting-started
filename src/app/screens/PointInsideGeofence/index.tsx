import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Navigation } from "react-native-navigation";

import { NavigationMap } from "../navigation";
import MapView, { Overlay, PROVIDER_GOOGLE, Polygon } from "react-native-maps";
import SitumPlugin from "react-native-situm-plugin";

import styles from "./styles";

export const PointInsideGeofence = (props: {
  componentId: string;
  building: any;
}) => {
  const [building, setBuilding] = useState<any>(props.building);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [floor, setFloor] = useState<any>();
  const [mapImage, setMapImage] = useState<String>();
  const [bounds, setBounds] = useState<any>();
  const [polygonPoints, setPolygonPoints] = useState<any>();
  const [mapRegion] = useState<any>({
    latitude: building.center.latitude,
    longitude: building.center.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

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
          for (let polygon of building.geofences[0].polygonPoints) {
            points.push(polygon.coordinate);
          }
          setPolygonPoints(points);
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



  useEffect(() => {
    getFloorsFromBuilding();
  }, [props.componentId]);
  return (
    <View style={styles.container}>
      <MapView
        style={{ width: "100%", height: "100%" }}
        region={mapRegion}
        provider={PROVIDER_GOOGLE}
      >
        {mapImage != undefined && (
          <Overlay 
            image={mapImage} 
            bounds={bounds}
            location={[mapRegion.latitude, mapRegion.longitude]} 
            zIndex={1000}
            bearing={building.rotation * 180 / Math.PI}
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
        <View style={{ position: "absolute" }}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}
    </View>
  );
};
