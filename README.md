## Setup Guide
Note: This section will be removed once final version is published to `npm`.

Firstly need to setup react-native development environment. To get started please follow instructions under section **React Native CLI Quickstart** on this [guide.](https://reactnative.dev/docs/environment-setup) 

1. Clone [Getting Started](https://github.com/situmtech/situm-react-native-plugin) project
2. Clone [Situm Plugin](https://github.com/situmtech/situm-react-native-plugin) Project
3. Place both cloned projects in same workspace directory, e.g. 
    ```
    - workspace
        |-situm-react-native-plugin
        |-situm-react-native-getting-started
4. Checkout to `situm-react-native-getting-started` directory
5. Add Google Maps api key for android in any string resources file. 
	```xml
	<string  name="google_maps_api">MAPS KEY</string>
	```
7. Add a configuration file  `/src/app/config.js`
	```js
	export  const  SITUM_EMAIL='EMAIL'
	export  const  SITUM_API_KEY='API KEY'
	export  const  SITUM_PASS='PASS'
	```
8. Run command `yarn` to install all the dependencies 
9. Checkout to `situm-react-native-getting-started/ios` directory
10. Run command `pod install` to install plugin dependency 
11. On the root directory of the project, run `react-native run-ios` command to launch the project on iOS simulator. 

You can also open iOS project in Xcode to build and launch the project. Same goes for Android. 


