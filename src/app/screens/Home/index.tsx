import React, {useEffect} from 'react';
import {View, Button} from 'react-native';
import {Navigation} from 'react-native-navigation';

import {NavigationMap} from '../navigation';

import styles from './styles';

import {NativeModules} from 'react-native';

export const Home = (props: {componentId: string}) => {
  const onNavigateToHolidaysList = () => {
    var SitumPlugin = NativeModules.SitumPlugin;
    SitumPlugin.setApiKey('EMAIL', 'KEY');
    SitumPlugin.setUserPass('EMAIL', 'Password');
    SitumPlugin.setCacheMaxAge(100);
    SitumPlugin.fetchBuildingInfo({});
    SitumPlugin.fetchBuildings();
    SitumPlugin.fetchGeofencesFromBuilding({});
    SitumPlugin.fetchFloorsFromBuilding({});
    SitumPlugin.fetchIndoorPOIsFromBuilding({});
    SitumPlugin.fetchEventsFromBuilding({});
    SitumPlugin.fetchPoiCategories({});
    SitumPlugin.fetchPoiCategoryIconNormal({});
    SitumPlugin.fetchPoiCategoryIconSelected({});
    SitumPlugin.fetchMapFromFloor({});
    SitumPlugin.startPositioning("call back id");
    SitumPlugin.stopPositioning("call back id");
    SitumPlugin.requestDirections("call back id");
    SitumPlugin.requestNavigationUpdates("call back id");
    SitumPlugin.removeNavigationUpdates();
    SitumPlugin.updateNavigationWithLocation({});
    SitumPlugin.requestRealTimeUpdates({});
    SitumPlugin.removeRealTimeUpdates();
    SitumPlugin.invalidateCache();
  };

  useEffect(() => {
    Navigation.mergeOptions(props.componentId, {...NavigationMap.Home.options});
  }, [props.componentId]);

  return (
    <View style={styles.container}>
      <Button title="Start" onPress={onNavigateToHolidaysList} />
    </View>
  );
};
