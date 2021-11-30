import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Image, Dimensions, Platform } from "react-native";

import SitumPlugin from "react-native-situm-plugin";
import styles from "./styles";
import MapView, { PROVIDER_GOOGLE, Overlay, Marker } from "react-native-maps";


//This example shows how to display/hide a POI based on the current zoom level of the camera view.
//We assume that you have created at least some POIs with a custom field  like {min_zoom_level: 16 }
// where 16 could be any zoom level from 1 to 20, meaning that the POI would only be displayed if 
// the camera zoom level is ABOVE that number.

const ZOOMLEVEL_CUSTOM_FIELD = "min_zoom_level"
 

export const PoiFilterOnZoom = (props: { componentId: string; building: any }) => {
  const [building] = useState<any>(props.building);
  const [buildingInfo, setBuildingInfo] = useState<any>();
  const [poisToShow, setPoisToShow] = useState<any>();
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [bounds, setBounds] = useState<any>();
   
   const [mapRegion] = useState<any>({
    latitude: building.center.latitude,
    longitude: building.center.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  //Retrieve the information of the building
  const getInfoFromBuilding = () => {
    setIsLoading(true);
    SitumPlugin.fetchBuildingInfo(
      building,
      (buildingInfo: any) => {
        console.log(buildingInfo)

        if (buildingInfo.floors.length > 0) {
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
        } else {
          console.log("No floors found!");
        }

        setIsLoading(false);

        setBuildingInfo(buildingInfo)
         

        //Sets the POIs in a different state variable which will be modified on every zoom level change.
        //This is how we will update the POIs that will be displayed 
        setPoisToShow((Platform.OS === "ios") ? buildingInfo.indoorPois : buildingInfo.indoorPOIs);
   
      },
      (error: string) => {
        console.log(error);
        setIsLoading(false);
      }
    );
  };
 
  
  const handleRegionChange = (region: any) => {
  
    console.log("handle On Region change")
    
    //Filter out every POIs that has a custom-field "min_zoom_level" and its value is below the current zoom level
    if (buildingInfo!=undefined && poisToShow!=undefined){
      const { height, width } = Dimensions.get('window')
      const zoom = Math.log2(360 * ((width / 256) / region.longitudeDelta))
      
      const poisToFilter = (Platform.OS === "ios") ? buildingInfo.indoorPois : buildingInfo.indoorPOIs;

      const poisToShow = poisToFilter.filter( (p: any)=>{
       return (p.customFields.hasOwnProperty(ZOOMLEVEL_CUSTOM_FIELD)==false) || (p.customFields.hasOwnProperty(ZOOMLEVEL_CUSTOM_FIELD) && parseFloat(p.customFields.min_zoom_level)<zoom)
      })

      console.log(zoom, poisToShow)
      
      setPoisToShow(poisToShow)
    } else {
      console.log("Building Info or indoor pois not defined")
    }
  }      

  useEffect(() => {
    getInfoFromBuilding();
    
  }, [props.componentId]);

  // console.log("building Info: " + JSON.stringify(buildingInfo.floors));
  
  return (
    <View style={styles.container}>
      <MapView
        style={{ width: "100%", height: "100%" }}
        initialRegion={mapRegion}
        provider={PROVIDER_GOOGLE}
        onRegionChangeComplete={handleRegionChange}
      >
        {buildingInfo != undefined &&
        buildingInfo.floors!=undefined &&
        buildingInfo.floors.length>0 && (
          
          <Overlay
            image={buildingInfo.floors[0].mapUrl}
            bounds={bounds}
            zIndex={1000}
            anchor={[0.5, 0.5]}
            bearing={(building.rotation * 180) / Math.PI}
          />
        )}

        {poisToShow!=undefined && 
          poisToShow.map((poi: any) => (
            <Marker
              key={poi.identifier}
              zIndex={1001}
              coordinate={poi.coordinate}
              title={poi.poiName}
              >
              <Image
                source={{ uri: "https://dashboard.situm.es/uploads/poicategory/148/8ac8e04f-a6a0-4da5-a08d-02ec33ffdcfb.png" }}
                style={{ width: 40, height: 40 }}
              />
            </Marker>
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
