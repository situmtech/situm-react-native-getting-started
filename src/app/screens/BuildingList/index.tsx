import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Navigation } from "react-native-navigation";

import { NavigationMap } from "../navigation";
import SitumPlugin from "react-native-situm-plugin";

import styles from "./styles";

export const BuildingList = (props: { componentId: string; next: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [buildings, setBuildings] = useState<any>();
  const [error, setError] = useState<String>();

  const _onItemPress = (item: any) => {
    var component = NavigationMap[props.next];
    component.passProps.building = item;

    Navigation.push(props.componentId, {
      component: component,
    });
  };

  const getBuildings = () => {
    setIsLoading(true);
    SitumPlugin.fetchBuildings(
      (buildings: any) => {
        setBuildings(buildings);
        setIsLoading(false);
        if (!buildings || buildings.length == 0)
          setError(
            "No buildings, add a few buildings first by going to:\nhttps://dashboard.situm.es/buildings"
          );
        console.log(JSON.stringify(buildings));
      },
      (error: any) => {
        setError(error);
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    Navigation.mergeOptions(props.componentId, {
      ...NavigationMap.BuildingList.options,
    });
    getBuildings();
  }, [props.componentId]);

  const _listEmptyComponent = () => {
    return (
      <View>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.safeAreaView}>
        <FlatList
          data={buildings}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => _onItemPress(item)}>
              <Text style={styles.text}>{item.name}</Text>
              <View style={styles.divider} />
            </TouchableOpacity>
          )}
          refreshing={isLoading}
          onRefresh={() => getBuildings()}
          style={styles.buildingList}
          ListEmptyComponent={_listEmptyComponent}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>
    </>
  );
};
