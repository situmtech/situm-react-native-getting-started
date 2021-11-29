import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Image, Dimensions } from "react-native";

import SitumPlugin from "react-native-situm-plugin";
import styles from "./styles";
import MapView, { PROVIDER_GOOGLE, Overlay, Marker , UrlTile} from "react-native-maps";




//This example shows how to display a tiled floorplan hosted in Situm Platform.
//Floorplans are not stored in tiles by default, but Situm Support Team can tile your floorplans & upload them to Situm Platform (ask us: support@situm.com)
//Change TILES_URL to the URL provided by Situm Support.
 

const MAX_ZOOM_LEVEL = 20


// This URL will be provided by Situm Support. {building_id} and {floor_id} will be the ID of the building and that you want to display, respectivelly.
// {z},{y}, {x} are the tile selection variables that will be auto-filled at runtime by react-native-maps
const TILES_URL = "https://dashboard.situm.com/uploads/{building_id}/{floor_id}/{z}/{x}/{y}.png" 


export const TiledBuilding = (props: { componentId: string; building: any }) => {
  const [building] = useState<any>(props.building);

  const [isLoading, setIsLoading] = useState<Boolean>(false);
   
   const [mapRegion] = useState<any>({
    latitude: building.center.latitude,
    longitude: building.center.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
 
  useEffect(() => {
   }, [props.componentId]);

  
  return (
    <View style={styles.container}>
      <MapView
        style={{ width: "100%", height: "100%" }}
        initialRegion={mapRegion}
        provider={PROVIDER_GOOGLE}
        maxZoomLevel={MAX_ZOOM_LEVEL}
      >

<UrlTile
 
    urlTemplate={"https://ztileserver.blob.core.windows.net/tileservice/gptiles_slim/{z}/{x}/{y}.png"}
    flipY={false}
  />
      
      </MapView>

      {isLoading && (
        <View style={{ position: "absolute" }}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}
    </View>
  );
};
