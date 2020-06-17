import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {Navigation} from 'react-native-navigation';

import {NavigationMap} from '../navigation';
import SitumPlugin from "react-native-situm-plugin";
import styles from './styles';

export const PoiOverMap = (props: {componentId: string}) => {
  const getPoiCategories = () => {
    // setIsLoading(true);
    // setStep("fetchBuildingInfo");
    SitumPlugin.fetchPoiCategories(
      (categories: any) => {
        console.log(categories)
        getPoiCategoryIconNormal(categories[0]);
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
  return (
    <View style={styles.container}>
      <Text >TODO</Text>
    </View>
  );

};

