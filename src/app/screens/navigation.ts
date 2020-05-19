import {Navigation} from 'react-native-navigation';
import {Home} from './Home';

export const NavigationMap = {
  Home: {
    name: 'Home',
    component: Home,
    options: {
      topBar: {
        title: {
          text: 'Home',
        },
      },
    },
  },
  IndoorPositioning: {
    name: 'IndoorPositioning',
    component: Home,
    options: {
      topBar: {
        title: {
          text: 'Indoor Positioning',
        },
      },
    },
  },
  IndoorOutdoorPositioning: {
    name: 'IndoorOutdoorPositioning',
    component: Home,
    options: {
      topBar: {
        title: {
          text: 'Indoor-outdoor Positioning',
        },
      },
    },
  },
  BuildingsOverMap: {
    name: 'BuildingsOnMap',
    component: Home,
    options: {
      topBar: {
        title: {
          text: 'Draw buildings over map',
        },
      },
    },
  },
  PositionOverMap: {
    name: 'PositionOnMap',
    component: Home,
    options: {
      topBar: {
        title: {
          text: 'Draw position over map',
        },
      },
    },
  },
  PoiOverMap: {
    name: 'PoiOverMap',
    component: Home,
    options: {
      topBar: {
        title: {
          text: 'Draw POIs over map',
        },
      },
    },
  },
  RouteOverMap: {
    name: 'RouteOverMap',
    component: Home,
    options: {
      topBar: {
        title: {
          text: 'Draw route between two points over map',
        },
      },
    },
  },
  RealtimeDevicesOverMap: {
    name: 'RealtimeDevicesOverMap',
    component: Home,
    options: {
      topBar: {
        title: {
          text: 'Draw realtime devices over map',
        },
      },
    },
  },
  PoiFiltering: {
    name: 'PoiFiltering',
    component: Home,
    options: {
      topBar: {
        title: {
          text: 'Key-Value POIs filtering',
        },
      },
    },
  },
  EventsOfBuilding: {
    name: 'EventsOfBuilding',
    component: Home,
    options: {
      topBar: {
        title: {
          text: 'Show all the events of a buildings',
        },
      },
    },
  },
  DestinationInstructions: {
    name: 'DestinationInstructions',
    component: Home,
    options: {
      topBar: {
        title: {
          text: 'Instructions while going to a destination',
        },
      },
    },
  },
  AnimatePosition: {
    name: 'AnimatePosition',
    component: Home,
    options: {
      topBar: {
        title: {
          text: 'Animate the position while walking',
        },
      },
    },
  },
  UserInsideEvent: {
    name: 'UserInsideEvent',
    component: Home,
    options: {
      topBar: {
        title: {
          text: 'Show if user is inside an event',
        },
      },
    },
  },
  PointInsideGeofence: {
    name: 'PointInsideGeofence',
    component: Home,
    options: {
      topBar: {
        title: {
          text: 'Show if point is inside a geofence',
        },
      },
    },
  },
  UpdateLocation: {
    name: 'UpdateLocation',
    component: Home,
    options: {
      topBar: {
        title: {
          text: 'Update location parameters on the fly',
        },
      },
    },
  },
  
};

export function registerScreens() {
  for (const key in NavigationMap) {
    Navigation.registerComponent(key, () => NavigationMap[key].component);
  }
}

export function getNavigationList(){
  const navigations = []
  for (const key in NavigationMap){
    console.log(NavigationMap[key])
      navigations.push({key: key, value: NavigationMap[key].options.topBar.title.text})
  }
  return navigations;
}
