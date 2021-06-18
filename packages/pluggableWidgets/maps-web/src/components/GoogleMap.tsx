import { createElement, Dispatch, ReactElement, SetStateAction, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import {
    GoogleMap as GoogleMapComponent,
    MarkerClusterer,
    HeatmapLayer,
    Marker as MarkerComponent,
    InfoWindow,
    useLoadScript
} from "@react-google-maps/api";
import { Libraries } from "@react-google-maps/api/dist/utils/make-load-script-url";
import { Marker, SharedProps } from "../../typings/shared";
import { getGoogleMapsMarkerClustererOptions, getGoogleMapsStyles, useHeatmapResolver } from "../utils/google";
import { getDimensions } from "../utils/dimension";
/*import { translateZoom } from "../utils/zoom";*/
import { Option } from "../utils/data";
import { Alert } from "@mendix/piw-utils-internal";
import parse from "html-react-parser";
import { DynamicHeatmapsType } from "../../typings/MapsProps";

class GoogleMapsStatics {
    static libraries: Libraries = ["visualization"];
}

export interface GoogleMapsProps extends SharedProps {
    mapStyles?: string;
    streetViewControl: boolean;
    mapTypeControl: boolean;
    fullscreenControl: boolean;
    rotateControl: boolean;
    markerClustererEnabled?: boolean;
    markerClustererOptions?: string;
    dynamicHeatmaps: DynamicHeatmapsType[];
}

export function GoogleMap(props: GoogleMapsProps): ReactElement {
    const map = useRef<google.maps.Map>();
    const center = useRef<google.maps.LatLngLiteral>({
        /* Utrecht, NL */
        lat: 52.0907374,
        lng: 5.1214201
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
        zoomLevel,
        markerClustererEnabled,
        markerClustererOptions
    } = props;
    const [heatmaps] = props.dynamicHeatmaps ? useHeatmapResolver(props.dynamicHeatmaps) : [];

    useEffect(() => {
        if (map.current && locations) {
            const bounds = new google.maps.LatLngBounds();
            /*
            locations
                .concat(currentLocation ? [currentLocation] : [])
                .filter(m => !!m)
                .forEach(marker => {
                    bounds.extend({
                        lat: marker.latitude,
                        lng: marker.longitude
                    });
                });
            */
            if (locations.length > 0) {
                bounds.extend({
                    lat: locations[0].latitude,
                    lng: locations[0].longitude
                });
            }
            if (bounds.isEmpty()) {
                bounds.extend(center.current);
            }
            if (autoZoom) {
                map.current.fitBounds(bounds);
            } else {
                map.current.setCenter(bounds.getCenter());
                map.current.setZoom(zoomLevel);
            }
        }
    }, [map.current, locations, currentLocation, autoZoom]);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: mapsToken ?? "",
        id: "_com.mendix.widget.custom.Maps.Maps",
        libraries: GoogleMapsStatics.libraries
    });

    if (loadError) {
        setError(loadError.message);
    }

    return (
        <div className={classNames("widget-maps", className)} style={{ ...style, ...getDimensions(props) }}>
            {error && <Alert bootstrapStyle="danger">{error}</Alert>}
            <div className="widget-google-maps-wrapper">
                {isLoaded ? (
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
                        /*zoom={autoZoom ? translateZoom("city") : zoomLevel}*/
                        center={center.current}
                    >
                        <MarkerClusterer /* https://react-google-maps-api-docs.netlify.app/#markerclusterer */
                            options={getGoogleMapsMarkerClustererOptions(markerClustererOptions)}
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
                                            clusterer={markerClustererEnabled ? clusterer : null}
                                        />
                                    ))
                            }
                        </MarkerClusterer>
                        {heatmaps
                            ? heatmaps
                                  .filter(h => !!h)
                                  .map(heatmap => <HeatmapLayer data={heatmap.data} options={heatmap.options} />)
                            : null}
                    </GoogleMapComponent>
                ) : (
                    <div className="spinner" />
                )}
            </div>
        </div>
    );
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
                    <div style={{ cursor: marker.onClick ? "pointer" : "default" }} onClick={marker.onClick}>
                        {parse(marker.title ? marker.title : "")}
                    </div>
                </InfoWindow>
            )}
        </MarkerComponent>
    );
}
