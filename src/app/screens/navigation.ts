import { Navigation } from "react-native-navigation";
import { Home } from "./Home";
import { IndoorPositioning } from "./IndoorPositioning/index";
import { IndoorOutdoorPositioning } from "./IndoorOutdoorPositioning/index";
import { BuildingsOverMap } from "./BuildingsOverMap/index";
import { PositionOverMap } from "./PositionOverMap/index";
import { PoiOverMap } from "./PoiOverMap/index";
import { RouteOverMap } from "./RouteOverMap/index";
import { RealtimeDevicesOverMap } from "./RealtimeDevicesOverMap/index";
import { PoiFiltering } from "./PoiFiltering/index";
import { EventsOfBuilding } from "./EventsOfBuilding/index";
import { DestinationInstructions } from "./DestinationInstructions/index";
import { AnimatePosition } from "./AnimatePosition/index";
import { UserInsideEvent } from "./UserInsideEvent/index";
import { PointInsideGeofence } from "./PointInsideGeofence/index";
import { UpdateLocation } from "./UpdateLocation/index";
import { BuildingList } from "./BuildingList/index";

export const NavigationMap: any = {
  Home: {
    name: "Home",
    component: Home,
    options: {
      topBar: {
        title: {
          text: "Home",
        },
      },
    },
  },
  BuildingList: {
    name: "BuildingList",
    component: BuildingList,
    options: {
      topBar: {
        title: {
          text: "Select a Buildings",
        },
      },
    },
    passProps: {
      next: "",
    },
  },
  IndoorPositioning: {
    name: "IndoorPositioning",
    component: IndoorPositioning,
    showBuildings: true,
    options: {
      topBar: {
        title: {
          text: "Indoor Positioning",
        },
      },
    },
    passProps: {
      building: {},
    },
  },
  IndoorOutdoorPositioning: {
    name: "IndoorOutdoorPositioning",
    component: IndoorOutdoorPositioning,
    options: {
      topBar: {
        title: {
          text: "Indoor-outdoor Positioning",
        },
      },
    },
  },
  BuildingsOverMap: {
    name: "BuildingsOverMap",
    component: BuildingsOverMap,
    showBuildings: true,
    options: {
      topBar: {
        title: {
          text: "Draw building over map",
        },
      },
    },
    passProps: {
      building: {},
    },
  },
  PositionOverMap: {
    name: "PositionOverMap",
    component: PositionOverMap,
    options: {
      topBar: {
        title: {
          text: "Draw position over map",
        },
      },
    },
  },
  PoiOverMap: {
    name: "PoiOverMap",
    component: PoiOverMap,
    options: {
      topBar: {
        title: {
          text: "Draw POIs over map",
        },
      },
    },
  },
  RouteOverMap: {
    name: "RouteOverMap",
    component: RouteOverMap,
    options: {
      topBar: {
        title: {
          text: "Draw route between two points over map",
        },
      },
    },
  },
  RealtimeDevicesOverMap: {
    name: "RealtimeDevicesOverMap",
    component: RealtimeDevicesOverMap,
    options: {
      topBar: {
        title: {
          text: "Draw realtime devices over map",
        },
      },
    },
  },
  PoiFiltering: {
    name: "PoiFiltering",
    component: PoiFiltering,
    options: {
      topBar: {
        title: {
          text: "Key-Value POIs filtering",
        },
      },
    },
  },
  EventsOfBuilding: {
    name: "EventsOfBuilding",
    component: EventsOfBuilding,
    options: {
      topBar: {
        title: {
          text: "Show all the events of a buildings",
        },
      },
    },
  },
  DestinationInstructions: {
    name: "DestinationInstructions",
    component: DestinationInstructions,
    options: {
      topBar: {
        title: {
          text: "Instructions while going to a destination",
        },
      },
    },
  },
  AnimatePosition: {
    name: "AnimatePosition",
    component: AnimatePosition,
    options: {
      topBar: {
        title: {
          text: "Animate the position while walking",
        },
      },
    },
  },
  UserInsideEvent: {
    name: "UserInsideEvent",
    component: UserInsideEvent,
    options: {
      topBar: {
        title: {
          text: "Show if user is inside an event",
        },
      },
    },
  },
  PointInsideGeofence: {
    name: "PointInsideGeofence",
    component: PointInsideGeofence,
    options: {
      topBar: {
        title: {
          text: "Show if point is inside a geofence",
        },
      },
    },
  },
  UpdateLocation: {
    name: "UpdateLocation",
    component: UpdateLocation,
    options: {
      topBar: {
        title: {
          text: "Update location parameters on the fly",
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

export function getNavigationList() {
  const ignore = [NavigationMap.Home.name, NavigationMap.BuildingList.name];
  const navigations = [];
  for (const key in NavigationMap) {
    if (ignore.includes(key)) continue;

    console.log(NavigationMap[key]);
    navigations.push({
      key: key,
      value: NavigationMap[key].options.topBar.title.text,
    });
  }
  return navigations;
}
