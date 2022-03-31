Situm React Native Plugin Sample app
=======================
  
# Table of contents

#### Setup
1. [Step 1: Configure our SDK in your react-native project](#configureproject)
3. [Step 2: Set your credentials](#config)
4. [Step 3: Setup Google Maps](#mapsapikey)

#### Samples

1. [Positioning](https://github.com/situmtech/situm-react-native-getting-started/blob/master/src/app/screens/IndoorPositioning/index.tsx): Download the buildings in your account and how to start the positioning in a building.
2. [Indoor-Outdoor](https://github.com/situmtech/situm-react-native-getting-started/blob/master/src/app/screens/IndoorOutdoorPositioning/index.tsx): Use the indoor-outdoor positioning.
3. [Draw building](https://github.com/situmtech/situm-react-native-getting-started/blob/master/src/app/screens/BuildingsOverMap/index.tsx): Draw the floorplan of a building over a map.
4. [Draw position](https://github.com/situmtech/situm-react-native-getting-started/blob/master/src/app/screens/PositionOverMap/index.tsx): Draw the position you obtain from the SDK in the map.
5. [Draw pois](https://github.com/situmtech/situm-react-native-getting-started/blob/master/src/app/screens/PositionOverMap/index.tsx): Draw the pois of a building over the map
6. [Draw route](https://github.com/situmtech/situm-react-native-getting-started/blob/master/src/app/screens/PoiOverMap/index.tsx): Draw a route between to points over the map
7. [Building events](https://github.com/situmtech/situm-react-native-getting-started/blob/master/src/app/screens/EventsOfBuilding/index.tsx): Get the events of a building.
8. [Point inside geofence](https://github.com/situmtech/situm-react-native-getting-started/blob/master/src/app/screens/PointInsideGeofence/index.tsx): Draw geofences and calculate if a point is inside them.
9. [Overlapping Buildings](https://github.com/situmtech/situm-react-native-getting-started/blob/feature/building_overlap/src/app/screens/BuildingsOverlap/index.tsx): Based on special custom-fields, shows 2 overlapping buildings by: 1) selecting one as basemap, 2) selecting another as secondary.
10. [Display POIs based on zoom](https://github.com/situmtech/situm-react-native-getting-started/blob/feature/building_overlap/src/app/screens/PoiFilterOnZoom/index.tsx): Displays different POIs based on the zoom level of the camera's view, using custom-field properties.
11. [Display tiled floorplans](https://github.com/situmtech/situm-react-native-getting-started/blob/feature/building_overlap/src/app/screens/TiledBuilding/index.tsx): Displays tiled floorplans downloaded from an URL.

### Introduction <a name="introduction"></a>

Situm SDK is a set of utilities that allow any developer to build location based apps using Situm's indoor positioning system. 
Among many other capabilities, apps developed with Situm SDK will be able to:

1. Obtain information related to buildings where Situm's positioning system is already configured: 
floor plans, points of interest, geotriggered events, etc.
2. Retrieve the location of the smartphone inside these buildings (position, orientation, and floor 
where the smartphone is).
3. Compute a route from a point A (e.g. where the smartphone is) to a point B (e.g. any point of 
interest within the building).
4. Trigger notifications when the user enters a certain area.


In this tutorial, we will guide you step by step to set up your first react-native application using Situm SDK. 
Before starting to write code, we recommend you to set up an account in our Dashboard 
(https://dashboard.situm.es), retrieve your API KEY and configure your first building.

1. Go to the [sign in form](http://dashboard.situm.es/accounts/register) and enter your username 
and password to sign in.
2. Go to the [account section](https://dashboard.situm.es/accounts/profile) and on the bottom, click 
on "generate one" to generate your API KEY.
3. Go to the [buildings section](http://dashboard.situm.es/buildings) and create your first building.
4. Download [Situm Mapping Tool](https://play.google.com/store/apps/details?id=es.situm.maps) 
Android application. With this application you will be able to configure and test Situm's indoor 
positioning system in your buildings.

Perfect! Now you are ready to develop your first indoor positioning application.

NOTE: More information on how to use the official React Native plugin and the set of APIs, the functions, parameters and results each function accepts and provides can be found in our [Cordova JSDoc](https://developers.situm.com/sdk_documentation/cordova/jsdoc/latest/situm) which shares interfaces.

### <a name="configureproject"></a> Step 1: Configure project and install dependencies

First of all, you must install all dependencies required to run the project. You can do that by executing any of the following commands. 

```shell
yarn

#OR

npm install

```



After that, you must configure Situm SDK in your project. *This has been already done for you in the sample application, but nonetheless we will walk you through the process.*

* Add the SDK to your project directly using your favorite package manager. 

```shell
yarn add react-native-situm-plugin

#OR

npm install --save react-native-situm-plugin
```

* You must initialize the SDK before using any of its features:


```js
import SitumPlugin from 'react-native-situm-plugin';

SitumPlugin.initSitumSDK();

```

### <a name="config"></a> Step 2: set your credentials

In the code, you can set the the user and API key with:

```js
SitumPlugin.setApiKey(SITUM_EMAIL,SITUM_API_KEY, (response) =>{})
```

or you can set the user and password with:

```js
SitumPlugin.setUserPass(SITUM_EMAIL,SITUM_PASS, (response) =>{})
```

NOTE: In this project you can do this by setting the properties on the config.js file, like so:

```js
export const SITUM_EMAIL='EMAIL_GOES_HERE'
export const SITUM_API_KEY='SITUM_API_KEY_GOES_HERE'
export const SITUM_PASS='SITUM_USER_PASS_GOES_HERE'
```

### <a name="mapsapikey"></a> Step 3: Setup Google Maps

You may need to configure an API KEY in order to be able to use Google Maps on your app.

Please follow steps provided on [Google Maps for iOS](https://developers.
google.com/maps/documentation/ios-sdk/get-api-key?hl=en) to generate an API 
Key. 

Note: When generating an API key, you can restrict only to iOS & Android to 
use same key for both platforms. 
     
* **iOS**

    When you've successfully generated the key, go to `AppDelegate.m` file and initialize Google Maps as shown:
        

```objc
#import <GoogleMaps/GoogleMaps.h>
...

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    [GMSServices provideAPIKey:@"HERE_GOES_GOOGLE_MAPS_API_KEY"];
}
```

Note: In this project, you will find `ios/conf.plist`, there you can sent API key as follows: 

```xml
<dict>
    <key>GoogleMapsAPIKey</key>
    <string>MAP_API_KEY_GOES_HERE</string>
</dict>
```
* **Android**

    Go to `AndroidManifest.xml` file and add Google Maps API key as a `meta-data`. 

```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="HERE_GOES_GOOGLE_MAPS_API_KEY" />
```

Note: In this project, you will find `res/values/situm_conf.xml`, there you can sent API key as follows: 

```xml
<resources>
    <string name="google_maps_api">MAPS_API_KEY_GOES_HERE</string>
</resources>
```

### Run Android Version <a name="run-android-version"></a>

* **Run from command line:** `$ react-native run-android`
* **Run from Android Studio:** Open `root/android` folder in Android Studio and run project. 

### Run iOS Version <a name="run-ios-version"></a>

* **Run from command line:** `$ react-native run-ios`
* **Run from XCode:** Go to `root/ios` folder and open `SitumRNGettingStarted.xcworkspace` or run command `xed ios` from root directory. 

### Support Information <a name="support-info"></a>
For any questions or bug report, please send an email to support@situm.es   

## Submitting Contributions

You will need to sign a Contributor License Agreement (CLA) before making a submission. 
[Learn more here.](https://situm.com/contributions/)





















































































































































































































































































