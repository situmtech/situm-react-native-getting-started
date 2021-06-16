import AsyncStorage from "@react-native-community/async-storage";



const DEFAULT_LOCATION_OPTIONS = {
    useWifi: true,
    useBle: true,
    useGps: false,
    useForegroundService: true,
    useGlobalLocation:true,
    interval: 1000,
    useLocationsCache: false,
    useBatterySaver: false,
    useBarometer: false,
    useDeadReckoning: false,
    ignoreWifiThrottling: true, 
    realtimeUpdateInterval: "REALTIME",
    buildingIdentifier: -1,
    outdoorLocationOptions: {
      buildingDetector: "BLE", 
      updateInterval: 5000,
      computeInterval: 1000,
      backgroundAccuracy: "MAXIMUM",
      useGeofencesinBuildingSelector: false, 
      enableOutdoorPositions: true,
      minimumOutdoorLocationAccuracy: 0,
      scansBasedDetectorAlwaysOn: false, 
      enableOpenSkyDetector: false,
      averageSnrThreshold: 28,
    }
  };

  export const getDefaultLocationOptions = () => {
    return DEFAULT_LOCATION_OPTIONS
  }

  export const setLocationOptions =  (locationOptions) => {
   return new Promise(async (resolve) =>{
      await AsyncStorage.setItem('@location_option', JSON.stringify(locationOptions))
      resolve();
    })
  }

  export function getLocationOptions(): Promise {
    return new Promise(async (resolve) => {
        const options = await AsyncStorage.getItem("@location_option");
        if(options != null){
          resolve(JSON.parse(options));
        }else{
          resolve(DEFAULT_LOCATION_OPTIONS);
        }
    })
}