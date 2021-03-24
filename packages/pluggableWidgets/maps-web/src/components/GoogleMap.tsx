import { createElement, Dispatch, ReactElement, SetStateAction, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import {
    GoogleMap as GoogleMapComponent,
    MarkerClusterer,
    Marker as MarkerComponent,
    InfoWindow,
    LoadScript
} from "@react-google-maps/api";
import { MarkerExtended, ClusterIconInfo } from "@react-google-maps/marker-clusterer";
import { Marker, SharedProps } from "../../typings/shared";
import { getGoogleMapsStyles } from "../utils/google";
import { getDimensions } from "../utils/dimension";
import { translateZoom } from "../utils/zoom";
import { Option } from "../utils/data";
import { Alert } from "@widgets-resources/piw-utils";

export interface GoogleMapsProps extends SharedProps {
    mapStyles?: string;
    streetViewControl: boolean;
    mapTypeControl: boolean;
    fullscreenControl: boolean;
    rotateControl: boolean;
}

export function GoogleMap(props: GoogleMapsProps): ReactElement {
    const map = useRef<google.maps.Map>();
    const center = useRef<google.maps.LatLngLiteral>({
        lat: 51.906688,
        lng: 4.48837
    });
    const [selectedMarker, setSelectedMarker] = useState<Option<Marker>>();
    const [error, setError] = useState("");
    const {
        autoZoom,
        className,
        currentLocation,
        fullscreenControl,
        locations,
        mapTypeControl,
        mapsToken,
        mapStyles,
        optionZoomControl: zoomControl,
        optionScroll: scrollwheel,
        optionDrag: draggable,
        rotateControl,
        streetViewControl,
        style,
        zoomLevel
    } = props;

    useEffect(() => {
        if (map.current) {
            const bounds = new google.maps.LatLngBounds();
            locations
                .concat(currentLocation ? [currentLocation] : [])
                .filter(m => !!m)
                .forEach(marker => {
                    bounds.extend({
                        lat: marker.latitude,
                        lng: marker.longitude
                    });
                });
            if (bounds.isEmpty()) {
                bounds.extend(center.current);
            }
            if (autoZoom) {
                map.current.fitBounds(bounds);
            } else {
                map.current.setCenter(bounds.getCenter());
            }
        }
    }, [map.current, locations, currentLocation, autoZoom]);

    return (
        <div className={classNames("widget-maps", className)} style={{ ...style, ...getDimensions(props) }}>
            {error && <Alert bootstrapStyle="danger">{error}</Alert>}
            <div className="widget-google-maps-wrapper">
                <LoadScript
                    googleMapsApiKey={mapsToken ?? ""}
                    id="_com.mendix.widget.custom.Maps.Maps"
                    loadingElement={<div className="spinner" />}
                    onError={error => setError(error.message)}
                >
                    <GoogleMapComponent
                        mapContainerClassName="widget-google-maps"
                        options={{
                            draggable,
                            fullscreenControl,
                            mapTypeControl,
                            maxZoom: 20,
                            minZoom: 1,
                            rotateControl,
                            scrollwheel,
                            streetViewControl,
                            styles: getGoogleMapsStyles(mapStyles),
                            zoomControl
                        }}
                        onLoad={googleMapRef => {
                            map.current = googleMapRef;
                        }}
                        onCenterChanged={() => {
                            if (map.current) {
                                center.current = map.current.getCenter().toJSON();
                            }
                        }}
                        zoom={autoZoom ? translateZoom("city") : zoomLevel}
                        center={center.current}
                    >
                        <MarkerClusterer
                            options={{
                                gridSize: 10,
                                minimumClusterSize: 2,
                                averageCenter: true,
                                enableRetinaIcons: true,
                                zoomOnClick: true
                            }}
                            calculator={setCalculator}
                        >
                            {clusterer =>
                                locations
                                    .concat(currentLocation ? [currentLocation] : [])
                                    .filter(m => !!m)
                                    .map((marker, index) => (
                                        <GoogleMapsMarker
                                            key={`marker_${index}`}
                                            marker={marker}
                                            selectedMarker={selectedMarker}
                                            setSelectedMarker={setSelectedMarker}
                                            clusterer={clusterer}
                                        />
                                    ))
                            }
                        </MarkerClusterer>
                    </GoogleMapComponent>
                </LoadScript>
            </div>
        </div>
    );
}

/**
 * Set our own custom marker cluster calculator.
 * It's important to remember that this function runs for EACH cluster individually.
 * @param {Array} markers Set of markers for this cluster.
 * @param {Number} num Number of styles we have to play with (set in mcOptions).
 */
function setCalculator(markers: MarkerExtended[], num: number): ClusterIconInfo {
    let index: number = 0;
    let count: number = markers.length;
    let dv: number = count;

    /**
     * While we still have markers, divide by a set number and
     * increase the index. Cluster moves up to a new style.
     *
     * The bigger the index, the more markers the cluster contains,
     * so the bigger the cluster.
     */
    while (dv !== 0) {
        dv = parseInt((dv / 5).toString(), 10);
        index++;
    }

    /**
     * Make sure we always return a valid index. E.g. If we only have
     * 5 styles, but the index is 8, this will make sure we return
     * 5. Returning an index of 8 wouldn't have a marker style.
     */
    index = Math.min(index, num);

    /**
     * Return ClusterIconInfo
     */
    return {
        text: count.toString(),
        index: index,
        title: ""
    };
}

function GoogleMapsMarker({
    marker,
    selectedMarker,
    setSelectedMarker,
    clusterer
}: {
    marker: Marker;
    selectedMarker: Option<Marker>;
    setSelectedMarker: Dispatch<SetStateAction<Option<Marker>>>;
    clusterer: any;
}): ReactElement {
    const markerRef = useRef<google.maps.MVCObject>();
    return (
        <MarkerComponent
            clusterer={clusterer}
            position={{
                lat: marker.latitude,
                lng: marker.longitude
            }}
            title={marker.title}
            clickable={!!marker.title || !!marker.onClick}
            onLoad={ref => {
                markerRef.current = ref;
            }}
            onClick={
                marker.title ? () => setSelectedMarker(prev => (prev !== marker ? marker : undefined)) : marker.onClick
            }
            icon={marker.url}
        >
            {selectedMarker === marker && markerRef.current && (
                <InfoWindow
                    anchor={markerRef.current}
                    onCloseClick={() => setSelectedMarker(prev => (prev === marker ? undefined : prev))}
                >
                    <span style={{ cursor: marker.onClick ? "pointer" : "none" }} onClick={marker.onClick}>
                        {marker.title}
                    </span>
                </InfoWindow>
            )}
        </MarkerComponent>
    );
}
