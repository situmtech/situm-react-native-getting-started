import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Switch,
  ScrollView,
  TextInput,
  Platform,
  Button,
} from "react-native";

import { Navigation } from "react-native-navigation";

import { NavigationMap } from "../navigation";
import {
  Menu,
  MenuProvider,
  MenuTrigger,
  MenuOption,
  MenuOptions,
} from "react-native-popup-menu";

import SitumPlugin from "react-native-situm-plugin";

import styles from "./styles";
import {
  getLocationOptions,
  setLocationOptions,
  getDefaultLocationOptions,
} from "../../data/settings";

export const Settings = (props: { componentId: string }) => {
  const [locationOptions, updateLocationOptions] = useState<Any>(
    getDefaultLocationOptions()
  );

  const invalidateCache = () => {
    SitumPlugin.invalidateCache();
  };

  const showSdkVersion = () => {
    SitumPlugin.sdkVersions((response) => {
      if (Platform.OS === "ios") {
        alert("SDK Version is: " + response.react_native + "/" + response.ios);
      } else {
        alert(
          "SDK Version is: " + response.react_native + "/" + response.android
        );
      }
      // e.g. {ios: "2.45.0", android: "1.60@aar", react_native:"0.0.3"}
    });
  };

  const onUpdateIntervalChange = (newInterval: string) => {
    const { outdoorLocationOptions } = locationOptions;
    updateLocationOptions({
      ...locationOptions,
      outdoorLocationOptions: {
        ...outdoorLocationOptions,
        updateInterval: +newInterval.replace(/[^0-9]/g, "") * 1000,
      },
    });
  };

  const onComputeIntervalChange = (newInterval: string) => {
    const { outdoorLocationOptions } = locationOptions;
    updateLocationOptions({
      ...locationOptions,
      outdoorLocationOptions: {
        ...outdoorLocationOptions,
        computeInterval: +newInterval.replace(/[^0-9]/g, "") * 1000,
      },
    });
  };
  const onIntervalChange = (newInterval: string) => {
    const { outdoorLocationOptions } = locationOptions;
    updateLocationOptions({
      ...locationOptions,
      interval: +newInterval.replace(/[^0-9]/g, "") * 1000,
    });
  };
  const onMinimumLocationAccuracyChange = (newAccuracy: string) => {
    const { outdoorLocationOptions } = locationOptions;
    updateLocationOptions({
      ...locationOptions,
      outdoorLocationOptions: {
        ...outdoorLocationOptions,
        minimumOutdoorLocationAccuracy: +newAccuracy.replace(/[^0-9]/g, ""),
      },
    });
  };

  const onSNRThresholdChange = (threshold: string) => {
    const { outdoorLocationOptions } = locationOptions;
    updateLocationOptions({
      ...locationOptions,
      outdoorLocationOptions: {
        ...outdoorLocationOptions,
        averageSnrThreshold: +threshold.replace(/[^0-9]/g, ""),
      },
    });
  };

  const onBuildingIdChange = (id: string) => {
    const { outdoorLocationOptions } = locationOptions;
    const integerVal = +id.replace(/[^0-9]/g, "");
    const buildingIdentifier = integerVal == 0 ? -1 : integerVal;
    updateLocationOptions({
      ...locationOptions,
      buildingIdentifier: buildingIdentifier,
    });
  };

  useEffect(() => {
    getLocationOptions().then((options) => {
      updateLocationOptions(options);
    });
  }, [props.componentId]);

  useEffect(() => {
    setLocationOptions(locationOptions);
  }, [locationOptions]);

  const getBuildingDetectorOptions = () => {
    if (Platform.OS == "ios") {
      return (
        <MenuOptions>
          <MenuOption value={"BLE"} text="BLE" />
          <MenuOption value={"GPS"} text="GPS" />
        </MenuOptions>
      );
    } else {
      return (
        <MenuOptions>
          <MenuOption value={"BLE"} text="BLE" />
          <MenuOption value={"WIFI"} text="WIFI" />
          <MenuOption value={"WIFI_AND_BLE"} text="WIFI_AND_BLE" />
          <MenuOption value={"GPS"} text="GPS" />
        </MenuOptions>
      );
    }
  };
  const renderPositioningOptions = () => {
    const { outdoorLocationOptions } = locationOptions;
    return (
      <View>
        <Text style={{ color: "gray", margin: 15 }}>Positioning</Text>

        <View style={styles.switchContainer}>
          <Text>{"Global Location:\t"}</Text>
          <Switch
            onValueChange={(toggle) => {
              updateLocationOptions({
                ...locationOptions,
                useGlobalLocation: toggle,
                buildingIdentifier: -1,
              });
            }}
            value={locationOptions.useGlobalLocation}
          />
        </View>

        {!locationOptions.useGlobalLocation && (
          <View style={styles.rowContainer}>
            <Text> {"Building ID: "} </Text>
            <TextInput
              style={styles.input}
              placeholder="ID"
              onChangeText={(text) => onBuildingIdChange(text)}
              value={
                locationOptions.buildingIdentifier == -1
                  ? ""
                  : locationOptions.buildingIdentifier.toString()
              }
            />
          </View>
        )}

        {locationOptions.useGlobalLocation && (
          <View style={styles.rowContainer}>
            <Text> {"Building Detector:\t"} </Text>
            <Menu
              onSelect={(value) => {
                updateLocationOptions({
                  ...locationOptions,
                  outdoorLocationOptions: {
                    ...outdoorLocationOptions,
                    buildingDetector: value,
                  },
                });
              }}
            >
              <MenuTrigger text={outdoorLocationOptions.buildingDetector} />
              {getBuildingDetectorOptions()}
            </Menu>
          </View>
        )}

        {Platform.OS == "android" && (
          <View style={styles.switchContainer}>
            <Text>{"Use WIFI:\t"}</Text>
            <Switch
              onValueChange={(toggle) => {
                updateLocationOptions({ ...locationOptions, useWifi: toggle });
              }}
              value={locationOptions.useWifi}
            />
          </View>
        )}

        {Platform.OS == "android" && (
          <View style={styles.switchContainer}>
            <Text>{"Use BLE:\t"}</Text>
            <Switch
              onValueChange={(toggle) => {
                updateLocationOptions({ ...locationOptions, useBle: toggle });
              }}
              value={locationOptions.useBle}
            />
          </View>
        )}

        <View style={styles.switchContainer}>
          <Text>{"Use Indoor GPS:\t"}</Text>
          <Switch
            onValueChange={(toggle) => {
              updateLocationOptions({ ...locationOptions, useGps: toggle });
            }}
            value={locationOptions.useGps}
          />
        </View>
      </View>
    );
  };

  const renderAdvancedOptions = () => {
    const { outdoorLocationOptions } = locationOptions;
    return (
      <View>
        <Text style={{ color: "gray", margin: 15 }}>Advanced</Text>

        {Platform.OS == "android" && (
          <View style={styles.switchContainer}>
            <Text>{"Enable open sky detector (Only Android):\t"}</Text>
            <Switch
              onValueChange={(toggle) => {
                updateLocationOptions({
                  ...locationOptions,
                  outdoorLocationOptions: {
                    ...outdoorLocationOptions,
                    enableOpenSkyDetector: toggle,
                  },
                });
              }}
              value={outdoorLocationOptions.enableOpenSkyDetector}
            />
          </View>
        )}

        {Platform.OS == "android" && (
          <View style={styles.rowContainer}>
            <Text> {"SNR Threshold (Only Android):\t"} </Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              onChangeText={(text) => onSNRThresholdChange(text)}
              value={outdoorLocationOptions.averageSnrThreshold.toString()}
            />
          </View>
        )}

        <View style={styles.switchContainer}>
          <Text>{"Use geofence building selector:\t"}</Text>
          <Switch
            onValueChange={(toggle) => {
              updateLocationOptions({
                ...locationOptions,
                outdoorLocationOptions: {
                  ...outdoorLocationOptions,
                  useGeofencesinBuildingSelector: toggle,
                },
              });
            }}
            value={outdoorLocationOptions.useGeofencesinBuildingSelector}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text>{"Use Barometer:\t"}</Text>
          <Switch
            onValueChange={(toggle) => {
              updateLocationOptions({
                ...locationOptions,
                useBarometer: toggle,
              });
            }}
            value={locationOptions.useBarometer}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text>{"Use location cache:\t"}</Text>
          <Switch
            onValueChange={(toggle) => {
              updateLocationOptions({
                ...locationOptions,
                useLocationCache: toggle,
              });
            }}
            value={locationOptions.useLocationCache}
          />
        </View>

        {Platform.OS == "android" && Platform.Version == 29 && (
          <View style={styles.switchContainer}>
            <Text>{"Ignore WIFI throtlling: (Only Android)\t"}</Text>
            <Switch
              onValueChange={(toggle) => {
                updateLocationOptions({
                  ...locationOptions,
                  ignoreWifiThrottling: toggle,
                });
              }}
              value={locationOptions.ignoreWifiThrottling}
            />
          </View>
        )}

        {Platform.OS == "android" && (
          <View style={styles.switchContainer}>
            <Text>{"Use Foreground Service: (Only Android)\t"}</Text>
            <Switch
              onValueChange={(toggle) => {
                updateLocationOptions({
                  ...locationOptions,
                  useForegroundService: toggle,
                });
              }}
              value={locationOptions.useForegroundService}
            />
          </View>
        )}

        <View style={styles.rowContainer}>
          <Text> {"Realtime Update Interval: "} </Text>
          <Menu
            onSelect={(value) =>
              updateLocationOptions({
                ...locationOptions,
                realtimeUpdateInterval: value,
              })
            }
          >
            <MenuTrigger text={locationOptions.realtimeUpdateInterval} />
            <MenuOptions>
              <MenuOption value={"REALTIME"} text="REALTIME" />
              <MenuOption value={"FAST"} text="FAST" />
              <MenuOption value={"NORMAL"} text="NORMAL" />
              <MenuOption value={"SLOW"} text="SLOW" />
              <MenuOption value={"BATTERY_SAVER"} text="BATTERY_SAVER" />
              <MenuOption value={"NEVER"} text="NEVER" />
            </MenuOptions>
          </Menu>
        </View>

        {Platform.OS == "android" && (
          <View style={styles.switchContainer}>
            <Text>{"Use BatterySaver: (Only Android)\t"}</Text>
            <Switch
              onValueChange={(toggle) => {
                updateLocationOptions({
                  ...locationOptions,
                  useBatterySaver: toggle,
                });
              }}
              value={locationOptions.useBatterySaver}
            />
          </View>
        )}

        <View style={styles.switchContainer}>
          <Text>{"Use DeadReckoning:\t"}</Text>
          <Switch
            onValueChange={(toggle) => {
              updateLocationOptions({
                ...locationOptions,
                useDeadReckoning: toggle,
              });
            }}
            value={locationOptions.useDeadReckoning}
          />
        </View>

        {Platform.OS == "android" && (
          <View style={styles.switchContainer}>
            <Text>{"Scan based detector always on:\t"}</Text>
            <Switch
              onValueChange={(toggle) => {
                updateLocationOptions({
                  ...locationOptions,
                  outdoorLocationOptions: {
                    ...outdoorLocationOptions,
                    scansBasedDetectorAlwaysOn: toggle,
                  },
                });
              }}
              value={outdoorLocationOptions.scansBasedDetectorAlwaysOn}
            />
          </View>
        )}

        <View style={styles.rowContainer}>
          <Text> {"Interval (Seconds): "} </Text>
          <TextInput
            style={styles.input}
            placeholder="1000"
            onChangeText={(text) => onIntervalChange(text)}
            value={(locationOptions.interval / 1000).toString()}
          />
        </View>

        {/* <Text>{"TODO CACHE STRATEGY"}</Text> */}
      </View>
    );
  };

  const renderOutdoorPositioningOptions = () => {
    const { outdoorLocationOptions } = locationOptions;
    return (
      <View>
        <Text style={{ color: "gray", margin: 15 }}>Outdoor Positioning</Text>

        <View style={styles.rowContainer}>
          <Text> {"Update Interval (Seconds): "} </Text>
          <TextInput
            style={styles.input}
            placeholder="1000"
            onChangeText={(text) => onUpdateIntervalChange(text)}
            value={(outdoorLocationOptions.updateInterval / 1000).toString()}
          />
        </View>

        <View style={styles.rowContainer}>
          <Text> {"Compute Interval (Seconds): "} </Text>
          <TextInput
            style={styles.input}
            placeholder="1000"
            onChangeText={(text) => onComputeIntervalChange(text)}
            value={(outdoorLocationOptions.computeInterval / 1000).toString()}
          />
        </View>

        <View style={styles.rowContainer}>
          <Text> {"Minimum accuracy to return\n outdoor location:\t"} </Text>
          <TextInput
            style={styles.input}
            placeholder="1000"
            onChangeText={(text) => onMinimumLocationAccuracyChange(text)}
            value={outdoorLocationOptions.minimumOutdoorLocationAccuracy.toString()}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text>{"Use Outdoor Positions:\t"}</Text>
          <Switch
            onValueChange={(toggle) => {
              updateLocationOptions({
                ...locationOptions,
                outdoorLocationOptions: {
                  ...outdoorLocationOptions,
                  enableOutdoorPositions: toggle,
                },
              });
            }}
            value={outdoorLocationOptions.enableOutdoorPositions}
          />
        </View>

        {Platform.OS == "ios" && (
          <View style={styles.rowContainer}>
            <Text> {"Outdoor Background Accuracy: "} </Text>
            <Menu
              onSelect={(value) =>
                updateLocationOptions({
                  ...locationOptions,
                  outdoorLocationOptions: {
                    ...outdoorLocationOptions,
                    backgroundAccuracy: value,
                  },
                })
              }
            >
              <MenuTrigger text={outdoorLocationOptions.backgroundAccuracy} />
              <MenuOptions>
                <MenuOption value={"NAVIGATION"} text="NAVIGATION" />
                <MenuOption value={"HIGH"} text="HIGH" />
                <MenuOption value={"MEDIUM"} text="MEDIUM" />
                <MenuOption value={"LOW"} text="LOW" />
              </MenuOptions>
            </Menu>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <MenuProvider>
          {renderPositioningOptions()}
          {renderAdvancedOptions()}
          {renderOutdoorPositioningOptions()}
        </MenuProvider>
        <View style={styles.rowContainerCenter}>
          <Button
            onPress={() => {
              showSdkVersion();
            }}
            title="SDK Version"
          />

          <Button
            onPress={() => {
              invalidateCache();
            }}
            title="Invalidate Cache"
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};
