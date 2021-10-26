import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Image } from "react-native";

import SitumPlugin from "react-native-situm-plugin";
import styles from "./styles";
import MapView, { PROVIDER_GOOGLE, Overlay, Marker } from "react-native-maps";

export const PoiOverMap = (props: { componentId: string; building: any }) => {
  const [building] = useState<any>(props.building);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [mapImage, setMapImage] = useState<String>();
  const [bounds, setBounds] = useState<any>();
  const [poiAndIconArray, setPoiAndIconArray] = useState<any>([]);
  const [mapRegion] = useState<any>({
    latitude: building.center.latitude,
    longitude: building.center.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  let poiIconsArray = [];

  const getFloorsFromBuilding = () => {
    setIsLoading(true);
    SitumPlugin.fetchFloorsFromBuilding(
      building,
      (floors: any) => {
        setIsLoading(false);

        if (floors.length > 1) {
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
          getPOIsFromBuilding();
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

  const getPOIsFromBuilding = () => {
    setIsLoading(true);
    SitumPlugin.fetchIndoorPOIsFromBuilding(
      building,
      (pois: any) => {
        setIsLoading(false);
        setPoiAndIconArray([]);
        for (let poi of pois) {
          getIconForPOI(poi);
        }
      },
      (error: string) => {
        console.log(error);
        setIsLoading(false);
      }
    );
  };

  const getIconForPOI = (poi) => {
    SitumPlugin.fetchPoiCategoryIconNormal(poi.category, (icon) => {
      poiIconsArray = [
        ...poiIconsArray,
        { poi: poi, icon: "data:image/png;base64," + icon.data },
      ];

      setPoiAndIconArray(poiIconsArray);
    });
  };

  useEffect(() => {
    getFloorsFromBuilding();
  }, [props.componentId]);

  /*
  const getPoiCategoryIconNormal = (category) => {
    // setIsLoading(true);
    // setStep("fetchBuildingInfo");
    SitumPlugin.fetchPoiCategoryIconNormal(
      category,
      (icon: any) => {
        console.log(icon)
        // setBuilding(buildingInfo);
        // setIsLoading(false);
      },
      (error: string) => {
        console.log(error)
        // setStatus("fetchBuildingInfo: " + error);
        // setIsLoading(false);
      }
    );
  };
  useEffect(() => {
    getPoiCategories();
  }, [props.componentId]);
  */
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
            zIndex={1000}
            bearing={(building.rotation * 180) / Math.PI}
          />
        )}

        {poiAndIconArray[0] != null &&
          poiAndIconArray.map((poiAndIcon) => (
            <Marker
              key={poiAndIcon.poi.identifier}
              coordinate={poiAndIcon.poi.coordinate}
              title={poiAndIcon.poi.poiName}
            >
              <Image
                source={{ uri: poiAndIcon.icon }}
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
