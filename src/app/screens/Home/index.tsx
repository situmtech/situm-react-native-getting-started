import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Button } from "react-native";
import { Navigation } from "react-native-navigation";

import { NavigationMap, getNavigationList } from "../navigation";

import styles from "./styles";
import { BuildingList } from '../BuildingList/index';

export const Home = (props: { componentId: string }) => {

  const _onItemPress = (key: string) => {  
    var component = NavigationMap[key];
    
    if(component.showBuildings){
      component = NavigationMap.BuildingList;
      component.passProps.next = NavigationMap[key].name
    }
    
    Navigation.push(props.componentId, {
      component: component,
    });
  };

  const test = () => {
   
  };
  useEffect(() => {
    Navigation.mergeOptions(props.componentId, {
      ...NavigationMap.Home.options,
    });
  }, [props.componentId]);

  return (
    <View style={styles.container}>
      <Button
          title="Press me"
          onPress={() => test()}
        />
      <FlatList
        data={getNavigationList()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => _onItemPress(item.key)}>
            <Text style={styles.text}>{item.value}</Text>
            <View style={styles.divider} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
