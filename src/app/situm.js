
import SitumPlugin from 'react-native-situm-plugin';
import { SITUM_EMAIL, SITUM_API_KEY, SITUM_PASS } from './config';

export function initSitumSdk() {
    SitumPlugin.invalidateCache((responsee)=>{
        console.log("INVALIDATE CACHE:" + JSON.stringify(responsee));
    });
    SitumPlugin.initSitumSDK();
    SitumPlugin.setApiKey(SITUM_EMAIL,SITUM_API_KEY, (response) =>{
        console.log(JSON.stringify(response))
        console.log("Authenticated Succesfully: " + response.success);
    });
    SitumPlugin.setCacheMaxAge(1, (response) =>{ // an hour
        console.log("Cache Age: " + response.success);
    }); 
}