// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const urlRoot = 'https://mrbinh.link';
export const environment = {
  production: false,
  apiTennatv1: `${urlRoot}/tenant/api/v1/`,
  apiPublicv1: `${urlRoot}/api/public/v1/`,
  apifake: 'https://651da02744e393af2d5a1b47.mockapi.io/categories/',
  location_id : 1
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
