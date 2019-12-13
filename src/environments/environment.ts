// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const TIMEZONEDB_API_KEY = 'U5BLU4ZHAL0P';
const TIMEZONEDB_GET_TIME_ZONE_URL =
  'https://api.timezonedb.com/v2.1/get-time-zone?key=' + TIMEZONEDB_API_KEY
  + '&format=json&by=position';

export const environment = {
  production: false,
  TIMEZONEDB_GET_TIME_ZONE_URL
};

