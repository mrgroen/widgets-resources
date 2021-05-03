// This file was generated by Mendix Studio Pro.
//
// WARNING: Only the following code will be retained when actions are regenerated:
// - the code between BEGIN USER CODE and END USER CODE
// Other code you write will be lost the next time you deploy the project.

import { Big } from "big.js";
import Geolocation, {
    GeolocationError,
    GeolocationOptions,
    GeolocationResponse
} from "@react-native-community/geolocation";

/**
 * This action retrieves the current geographical position of a user/device.
 *
 * Since this can compromise privacy, the position is not available unless the user approves it. The web browser will request the permission at the first time the location is requested. When denied by the user it will not prompt a second time.
 *
 * On hybrid and native platforms the permission can be requested with the `RequestLocationPermission` action.
 *
 * Best practices:
 * https://developers.google.com/web/fundamentals/native-hardware/user-location/
 * @param {Big} timeout - The maximum length of time (in milliseconds) the device is allowed to take in order to return a location. If empty, there is no timeout.
 * @param {Big} maximumAge - The maximum age (in milliseconds) of a possible cached position that is acceptable to return. If set to 0, it means that the device cannot use a cached position and must attempt to retrieve the real current position. By default the device will always return a cached position regardless of its age.
 * @param {boolean} highAccuracy - Use a higher accuracy method to determine the current location. Setting this to false saves battery life.
 * @returns {Promise.<MxObject>}
 */
export async function GetCurrentLocation(
    timeout?: Big,
    maximumAge?: Big,
    highAccuracy?: boolean
): Promise<mendix.lib.MxObject> {
    // BEGIN USER CODE

    if (navigator && navigator.product === "ReactNative" && !navigator.geolocation) {
        (navigator.geolocation as any) = Geolocation;
    }

    return new Promise((resolve, reject) => {
        const options = getOptions();
        navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

        function onSuccess(position: GeolocationResponse): void {
            mx.data.create({
                entity: "NanoflowCommons.Geolocation",
                callback: mxObject => {
                    const geolocation = mapPositionToMxObject(mxObject, position);
                    resolve(geolocation);
                },
                error: () =>
                    reject(new Error("Could not create 'NanoflowCommons.Geolocation' object to store location"))
            });
        }

        function onError(error: GeolocationError): void {
            return reject(new Error(error.message));
        }

        function getOptions(): GeolocationOptions {
            const timeoutNumber = timeout && Number(timeout.toString());
            const maximumAgeNumber = maximumAge && Number(maximumAge.toString());

            return {
                timeout: timeoutNumber,
                maximumAge: maximumAgeNumber,
                enableHighAccuracy: highAccuracy
            };
        }

        function mapPositionToMxObject(
            mxObject: mendix.lib.MxObject,
            position: GeolocationResponse
        ): mendix.lib.MxObject {
            mxObject.set("Timestamp", new Date(position.timestamp));
            mxObject.set("Latitude", new Big(position.coords.latitude.toFixed(8)));
            mxObject.set("Longitude", new Big(position.coords.longitude.toFixed(8)));
            mxObject.set("Accuracy", new Big(position.coords.accuracy.toFixed(8)));
            if (position.coords.altitude != null) {
                mxObject.set("Altitude", new Big(position.coords.altitude.toFixed(8)));
            }
            if (position.coords.altitudeAccuracy != null && position.coords.altitudeAccuracy !== -1) {
                mxObject.set("AltitudeAccuracy", new Big(position.coords.altitudeAccuracy.toFixed(8)));
            }
            if (position.coords.heading != null && position.coords.heading !== -1) {
                mxObject.set("Heading", new Big(position.coords.heading.toFixed(8)));
            }
            if (position.coords.speed != null) {
                mxObject.set("AltitudeAccuracy", new Big(position.coords.speed.toFixed(8)));
            }
            return mxObject;
        }
    });

    // END USER CODE
}
