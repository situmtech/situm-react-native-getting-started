
import SitumPlugin from 'react-native-situm-plugin';
import { SITUM_EMAIL, SITUM_API_KEY, SITUM_PASS } from './config';

export function initSitumSdk() {
    SitumPlugin.initSitumSDK();
    SitumPlugin.setApiKey(SITUM_EMAIL,SITUM_API_KEY, (response) =>{
        console.log("Authenticated Succesfully: " + response.success);
    });
    SitumPlugin.setCacheMaxAge(1*60*60, (response) =>{ // an hour
        console.log("Cache Age: " + response.success);
    }); 
}