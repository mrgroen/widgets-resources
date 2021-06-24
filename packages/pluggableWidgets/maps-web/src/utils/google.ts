import { useRef, useState, useMemo } from "react";
import { ValueStatus } from "mendix";
import deepEqual from "deep-equal";
import { ClustererOptions, ClusterIconStyle } from "@react-google-maps/marker-clusterer";
import { DynamicHeatmapsType } from "../../typings/MapsProps";

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

    if (options && options.trim() != "") {
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

export interface Heatmap {
    data:
        | google.maps.MVCArray<google.maps.LatLng | google.maps.visualization.WeightedLocation>
        | google.maps.LatLng[]
        | google.maps.visualization.WeightedLocation[];
    options?: google.maps.visualization.HeatmapLayerOptions;
}

export function useHeatmapResolver(dynamicHeatmaps: DynamicHeatmapsType[]): [Heatmap[]] {
    const [heatmaps, setHeatmaps] = useState<Heatmap[]>([]);
    const requestedHeatmaps = useRef<Heatmap[]>([]);

    const heatmapList = useMemo(() => {
        let heatmaps = dynamicHeatmaps.reduce(function (result: Heatmap[], dynamicHeatmap) {
            let heatmap = convertDynamicHeatmap(dynamicHeatmap);
            if (heatmap) {
                result.push(heatmap);
            }
            return result;
        }, []);
        return heatmaps;
    }, [dynamicHeatmaps]);

    if (!isIdenticalHeatmap(requestedHeatmaps.current, heatmapList)) {
        requestedHeatmaps.current = heatmapList;
        filterHeatmaps(heatmapList)
            .then(newHeatmap => {
                if (requestedHeatmaps.current === heatmapList) {
                    setHeatmaps(newHeatmap);
                }
            })
            .catch(e => {
                console.error(e);
            });
    }

    return [heatmaps];
}

function isIdenticalHeatmap(previousHeatmaps: Heatmap[], newHeatmap: Heatmap[]): boolean {
    const previousProps = previousHeatmaps.map(({ ...heatmap }) => {
        return heatmap;
    });
    const newProps = newHeatmap.map(({ ...heatmap }) => {
        return heatmap;
    });
    return deepEqual(previousProps, newProps, { strict: true });
}

async function filterHeatmaps(locations?: Heatmap[]): Promise<Heatmap[]> {
    const latitudeLongitudes = locations?.filter(l => l.data != undefined) || [];
    return latitudeLongitudes;
}

function convertDynamicHeatmap(heatmap: DynamicHeatmapsType): Heatmap | undefined {
    if (heatmap.heatmapDS && heatmap.heatmapDS.status === ValueStatus.Available) {
        let { heatmapDataFile: file } = heatmap;
        if (file != undefined) {
            let locations =
                heatmap.heatmapDS.items?.map(item => {
                    let myEval = eval;
                    let str = file ? String(file(item).value) : "";
                    return myEval(str);
                }) ?? [];
            return {
                data: locations.flat(),
                options: getGoogleMapsHeatmapOptions(heatmap.heatmapOptions)
            };
        }
    }
}

function getGoogleMapsHeatmapOptions(options?: string): google.maps.visualization.HeatmapLayerOptions | undefined {
    if (options && options.trim() != "") {
        try {
            let jsonObject: any = JSON.parse(options.trim());
            return jsonObject;
        } catch (error) {
            console.error(`Invalid Heatmap options, ${error.message}`);
        }
    }
}
