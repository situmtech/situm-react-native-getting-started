import React, {useEffect} from 'react';
import {View, Text, FlatList} from 'react-native';
import {Navigation} from 'react-native-navigation';

import { NavigationMap, getNavigationList } from '../navigation';

import {StyleSheet} from 'react-native';

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
        <FlatList
          data={getNavigationList()}
          renderItem={({item}) => (
            <View
            style={{
              padding: 10,
              borderBottomColor: '#eee',
              borderBottomWidth: 1,
            }}>
              <Text style={styles.item}>{item.value}</Text>
              </View>
            )}

          
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})