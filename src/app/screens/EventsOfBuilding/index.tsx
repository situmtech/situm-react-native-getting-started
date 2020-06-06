import React, {useEffect, useState} from 'react';
import {View, Image, ActivityIndicator} from 'react-native';

import SitumPlugin from "react-native-situm-plugin";

import styles from './styles';
import MapView, { PROVIDER_GOOGLE, Overlay, Marker } from 'react-native-maps';

export const EventsOfBuilding = (props: {componentId: string; building: any }) => {
  const [building] = useState<any>(props.building);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [mapImage, setMapImage] = useState<String>();
  const [bounds, setBounds] = useState<any>();
  const [events, setEvents] = useState<any>([]);
  const [mapRegion] = useState<any>({
    latitude: building.center.latitude,
    longitude: building.center.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
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
          setMapImage(floors[0].mapUrl);
          getEventsFromBuilding();
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

  const getEventsFromBuilding = () => {
    setIsLoading(true);
    SitumPlugin.fetchEventsFromBuilding(
      building,
      (events: any) => {
        setIsLoading(false);
        setEvents(events);
    
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
          <Overlay image={mapImage} bounds={bounds} zIndex={1000} />
        )}

        {events[0] != null &&
          events.map((event) => (
            <Marker
              key={event.identifier}
              coordinate={event.trigger.center.coordinate}
              title={event.name}
            >
              
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
