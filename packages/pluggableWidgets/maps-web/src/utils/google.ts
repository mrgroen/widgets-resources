import { ClustererOptions, ClusterIconStyle } from "@react-google-maps/marker-clusterer";

export function getGoogleMapsStyles(styles?: string): google.maps.MapTypeStyle[] {
    if (styles && styles.trim()) {
        try {
            return JSON.parse(styles);
        } catch (error) {
            console.error(`Invalid Map styles, ${error.message}`);
        }
    }

    return [
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
        }
    ];
}

export function getGoogleMapsMarkerClustererOptions(options?: string): ClustererOptions {
    let clusterIconStyleArray: ClusterIconStyle[] = [
        { height: 53, width: 53, url: require("../ui/m1.png") },
        { height: 56, width: 56, url: require("../ui/m2.png") },
        { height: 66, width: 66, url: require("../ui/m3.png") },
        { height: 77, width: 77, url: require("../ui/m4.png") },
        { height: 88, width: 88, url: require("../ui/m5.png") }
    ];

    if (options && options.trim()) {
        try {
            let jsonObject: any = JSON.parse(options);
            if (jsonObject.styles === undefined && jsonObject.imagePath === undefined) {
                /* Set default cluster icons if none are given. */
                jsonObject.styles = clusterIconStyleArray;
            }
            return jsonObject;
        } catch (error) {
            console.error(`Invalid MarkerClusterer options, ${error.message}`);
        }
    }

    return {
        styles: clusterIconStyleArray
    };
}
