const TIMEZONEDB_API_KEY = 'YOUR_API_HERE';
const TIMEZONEDB_GET_TIME_ZONE_URL =
  'https://api.timezonedb.com/v2.1/get-time-zone?key=' + TIMEZONEDB_API_KEY
  + '&format=json&by=position';

export const environment = {
  production: true,
  TIMEZONEDB_GET_TIME_ZONE_URL
};
