import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

import MapView, { Overlay, PROVIDER_GOOGLE } from "react-native-maps";
import SitumPlugin from "react-native-situm-plugin";
import { Dimensions } from 'react-native'


import styles from "./styles";


export const BuildingsOverlap = (props: {
  componentId: string;
}) => {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [step, setStep] = useState<String>();

  const [primaryBuildingInfo, setPrimaryBuildingInfo] = useState<any>({});
  const [secondaryBuildingInfo, setSecondaryBuildingInfo] = useState<any>({})
  const [allowedZoom, setAllowedZoom] = useState<number>(16);

  const Z_INDEX_CUSTOM_FIELD_KEY = "z_index"
  const Z_INDEX_SECONDARY = 1
  const Z_INDEX_PRIMARY = 0
  const LATITUDE_CUSTOM_FIELD_KEY = "lat"
  const LONGITUDE_CUSTOM_FIELD_KEY = "lng"

  const MIN_ZOOM = 17
  const MAX_ZOOM = 20

  const MIN_SCREEN_RATIO_SECBUILDING = 15


  //Retrives the information of the buildings in the account, and 
  // 1 - Filters those buildings that have Z_INDEX_CUSTOM_FIELD. Classifies one of them as primary and the
  // other as secondary (depending on Z_INDEX_SECONDARY value). Secondary will be shown on top of primary.
  // 2 - Modifies the center, bounds and rotatedBounds of the secondary building, based on the
  // LATITUDE_CUSTOM_FIELD_KEY and LONGITUDE_CUSTOM_FIELD_KEY
  // NOTE: This method does A LOT OF THINGS and assumes certain custom-field structures in place.
  // DO NOT take this as a good architecture for your app, we kept it simple just for sake of the example
  const getSelectedBuildingsInfo = () => {
    setStep("getSelectedBuildingInfo")
    SitumPlugin.fetchBuildings(
      (buildings: any) => {


        for (const building of buildings) {

          if (building.customFields.hasOwnProperty(Z_INDEX_CUSTOM_FIELD_KEY)) {


            SitumPlugin.fetchBuildingInfo(
              building,
              (buildingInfo: any) => {
                if (building.customFields[Z_INDEX_CUSTOM_FIELD_KEY] == Z_INDEX_SECONDARY
                  && building.customFields.hasOwnProperty(LATITUDE_CUSTOM_FIELD_KEY) &&
                  building.customFields.hasOwnProperty(LONGITUDE_CUSTOM_FIELD_KEY)) {

                  const diffCenterLat = parseFloat(buildingInfo.building.customFields.lat) - buildingInfo.building.center.latitude
                  const diffCenterLng = parseFloat(buildingInfo.building.customFields.lng) - buildingInfo.building.center.longitude

                  //Set the new building center according to the configuration in the custom fields
                  buildingInfo.building.center.latitude = parseFloat(buildingInfo.building.customFields.lat)
                  buildingInfo.building.center.longitude = parseFloat(buildingInfo.building.customFields.lng)


                  //Move boundsRotated towards the new center 
                  buildingInfo.building.boundsRotated.northEast.latitude += diffCenterLat
                  buildingInfo.building.boundsRotated.northWest.latitude += diffCenterLat
                  buildingInfo.building.boundsRotated.southEast.latitude += diffCenterLat
                  buildingInfo.building.boundsRotated.southWest.latitude += diffCenterLat
                  buildingInfo.building.boundsRotated.northEast.longitude += diffCenterLng
                  buildingInfo.building.boundsRotated.northWest.longitude += diffCenterLng
                  buildingInfo.building.boundsRotated.southEast.longitude += diffCenterLng
                  buildingInfo.building.boundsRotated.southWest.longitude += diffCenterLng

                  //Move bounds towards the new center
                  buildingInfo.building.bounds.northEast.latitude += diffCenterLat
                  buildingInfo.building.bounds.northWest.latitude += diffCenterLat
                  buildingInfo.building.bounds.southEast.latitude += diffCenterLat
                  buildingInfo.building.bounds.southWest.latitude += diffCenterLat
                  buildingInfo.building.bounds.northEast.longitude += diffCenterLng
                  buildingInfo.building.bounds.northWest.longitude += diffCenterLng
                  buildingInfo.building.bounds.southEast.longitude += diffCenterLng
                  buildingInfo.building.bounds.southWest.longitude += diffCenterLng


                  setSecondaryBuildingInfo(buildingInfo)
                }
                else {

                  setPrimaryBuildingInfo(buildingInfo)

                }
              },
              (error: any) => {
                console.error("Error retrieving building info of " + building.id)
              },
            );
          }
        }

      },

      (error: any) => {
        console.log("No selected buildings")
      },
    );
  };

  
  const regionToBounds = (region) =>{

    const bounds = {
      "northWest": { "latitude": region.latitude + region.latitudeDelta / 2, "longitude": region.longitude - region.longitudeDelta / 2 },
      "northEast": { "latitude": region.latitude + region.latitudeDelta / 2, "longitude": region.longitude + region.longitudeDelta / 2 },
      "southEast": { "latitude": region.latitude - region.latitudeDelta / 2, "longitude": region.longitude + region.longitudeDelta / 2 },
      "southWest": { "latitude": region.latitude - region.latitudeDelta / 2, "longitude": region.longitude - region.longitudeDelta / 2 }
    }
    return bounds
  }

  //Checks if a point lies within a rectangle region
  const pointInBounds = (point, bounds) => {

    const withinBounds = (point.longitude >= bounds.northWest.longitude) &&
      (point.longitude <= bounds.northEast.longitude) &&
      (point.latitude >= bounds.southWest.latitude) &&
      (point.latitude <= bounds.northWest.latitude)

    return withinBounds

  }


  //If any corner or the center of the secondary building is within view, and the 
  //secondary building occupies a significant space of the shown region, 
  //allows to increase the zoom. Otherwise, decreases the maximum allowed zoom
  const modifyZoom = (region: any) => {
    if (secondaryBuildingInfo != undefined && secondaryBuildingInfo.building != undefined) {
      const { height, width } = Dimensions.get('window')
      const zoom = Math.log2(360 * ((width / 256) / region.longitudeDelta))

      const screenBounds = regionToBounds(region)
      const withinBounds =
        pointInBounds(secondaryBuildingInfo.building.boundsRotated.northEast, screenBounds) ||
        pointInBounds(secondaryBuildingInfo.building.boundsRotated.northWest, screenBounds) ||
        pointInBounds(secondaryBuildingInfo.building.boundsRotated.southEast, screenBounds) ||
        pointInBounds(secondaryBuildingInfo.building.boundsRotated.southWest, screenBounds) ||
        pointInBounds(screenBounds.northEast, secondaryBuildingInfo.building.boundsRotated)  ||
        pointInBounds(screenBounds.northWest, secondaryBuildingInfo.building.boundsRotated)  ||
        pointInBounds(screenBounds.southEast, secondaryBuildingInfo.building.boundsRotated)  ||
        pointInBounds(screenBounds.southWest, secondaryBuildingInfo.building.boundsRotated)  

      

      const wScreen = region.longitudeDelta / 0.00000904371732957115
      const hScreen = region.latitudeDelta / 0.00000904371732957115
      const wBuilding = secondaryBuildingInfo.building.dimensions.width
      const hBuilding = secondaryBuildingInfo.building.dimensions.height
      const screenRatio = (wScreen * hScreen) / (wBuilding * hBuilding)
 
      
      if ((withinBounds && screenRatio < MIN_SCREEN_RATIO_SECBUILDING)) {
        setAllowedZoom(MAX_ZOOM)
      }
      else {
        setAllowedZoom(MIN_ZOOM)
      }

    }
  }

  const handleRegionChange = (region: any) => {
    modifyZoom(region)
  }

  useEffect(() => {
    getSelectedBuildingsInfo();
  }, [props.componentId]);
  return (


    <View style={styles.container}>
      {
        primaryBuildingInfo != undefined &&
        primaryBuildingInfo.building != undefined && (
          <MapView
            style={{ width: "100%", height: "100%" }}
            initialRegion={{
              latitude: primaryBuildingInfo.building.center.latitude,
              longitude: primaryBuildingInfo.building.center.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            provider={PROVIDER_GOOGLE}
            onRegionChangeComplete={handleRegionChange}
            maxZoomLevel={allowedZoom}
          >

            {primaryBuildingInfo != undefined &&
              primaryBuildingInfo.floors != undefined &&
              primaryBuildingInfo.floors.length > 0 &&
              primaryBuildingInfo.building != undefined && (
                <Overlay
                  image={primaryBuildingInfo.floors[0].mapUrl}
                  zIndex={1}
                  location={[primaryBuildingInfo.building.center.latitude, primaryBuildingInfo.building.center.longitude]}
                  bearing={primaryBuildingInfo.building.rotation * 180 / Math.PI}
                  anchor={[0.5, 0.5]}
                  width={primaryBuildingInfo.building.dimensions.width}
                  height={primaryBuildingInfo.building.dimensions.height}
                />
              )}



            {secondaryBuildingInfo != undefined &&
              secondaryBuildingInfo.floors != undefined &&
              secondaryBuildingInfo.floors.length > 0 &&
              secondaryBuildingInfo.building != undefined &&
              secondaryBuildingInfo.building.center != undefined && (
                <Overlay
                  image={secondaryBuildingInfo.floors[0].mapUrl}
                  zIndex={2}
                  location={[secondaryBuildingInfo.building.center.latitude, secondaryBuildingInfo.building.center.longitude]}
                  bearing={secondaryBuildingInfo.building.rotation * 180 / Math.PI}
                  anchor={[0.5, 0.5]}
                  width={secondaryBuildingInfo.building.dimensions.width}
                  height={secondaryBuildingInfo.building.dimensions.height}
                />
              )}


          </MapView>
        )}

      {isLoading && (
        <View style={{ position: "absolute" }}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}
    </View>
  );
};
