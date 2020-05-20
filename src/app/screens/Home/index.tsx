import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Navigation } from "react-native-navigation";

import { NavigationMap, getNavigationList } from "../navigation";

import { NativeModules } from "react-native";

import styles from "./styles";

export const Home = (props: { componentId: string }) => {
  const _onItemPress = (key: string) => {
    Navigation.push(props.componentId, {
      component: NavigationMap[key],
    });
  };

  useEffect(() => {
    Navigation.mergeOptions(props.componentId, {
      ...NavigationMap.Home.options,
    });
  }, [props.componentId]);

  return (
    <View style={styles.container}>
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