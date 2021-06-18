/**
 * This file was generated from Maps.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { CSSProperties } from "react";
import { ActionValue, DynamicValue, ListValue, ListActionValue, ListAttributeValue, WebImage } from "mendix";
import { Big } from "big.js";

export type LocationTypeEnum = "address" | "latlng";

export type MarkerStyleEnum = "default" | "image";

export interface MarkersType {
    locationType: LocationTypeEnum;
    address?: DynamicValue<string>;
    latitude?: DynamicValue<string>;
    longitude?: DynamicValue<string>;
    title?: DynamicValue<string>;
    onClick?: ActionValue;
    markerStyle: MarkerStyleEnum;
    customMarker?: DynamicValue<WebImage>;
}

export type LocationTypeEnum = "address" | "latlng";

export type MarkerStyleDynamicEnum = "default" | "image";

export interface DynamicMarkersType {
    markersDS?: ListValue;
    locationType: LocationTypeEnum;
    address?: ListAttributeValue<string>;
    latitude?: ListAttributeValue<Big>;
    longitude?: ListAttributeValue<Big>;
    title?: ListAttributeValue<string>;
    onClickAttribute?: ListActionValue;
    markerStyleDynamic: MarkerStyleDynamicEnum;
    customMarkerDynamic?: DynamicValue<WebImage>;
}

export interface DynamicHeatmapsType {
    heatmapDS?: ListValue;
    latitude?: ListAttributeValue<Big>;
    longitude?: ListAttributeValue<Big>;
    heatmapOptions: string;
}

export type WidthUnitEnum = "percentage" | "pixels";

export type HeightUnitEnum = "percentageOfWidth" | "pixels" | "percentageOfParent";

export type ZoomEnum = "automatic" | "world" | "continent" | "zoomlevel6" | "zoomlevel7" | "zoomlevel8" | "zoomlevel9" | "city" | "street" | "buildings";

export type MapProviderEnum = "googleMaps" | "openStreet" | "mapBox" | "hereMaps";

export interface MarkersPreviewType {
    locationType: LocationTypeEnum;
    address: string;
    latitude: string;
    longitude: string;
    title: string;
    onClick: {} | null;
    markerStyle: MarkerStyleEnum;
    customMarker: string;
}

export interface DynamicMarkersPreviewType {
    markersDS: {} | null;
    locationType: LocationTypeEnum;
    address: string;
    latitude: string;
    longitude: string;
    title: string;
    onClickAttribute: {} | null;
    markerStyleDynamic: MarkerStyleDynamicEnum;
    customMarkerDynamic: string;
}

export interface DynamicHeatmapsPreviewType {
    heatmapDS: {} | null;
    latitude: string;
    longitude: string;
    heatmapOptions: string;
}

export interface MapsContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    advanced: boolean;
    markers: MarkersType[];
    dynamicMarkers: DynamicMarkersType[];
    dynamicHeatmaps: DynamicHeatmapsType[];
    apiKey: string;
    apiKeyExp?: DynamicValue<string>;
    geodecodeApiKey: string;
    geodecodeApiKeyExp?: DynamicValue<string>;
    showCurrentLocation: boolean;
    optionDrag: boolean;
    optionScroll: boolean;
    optionZoomControl: boolean;
    attributionControl: boolean;
    optionStreetView: boolean;
    mapTypeControl: boolean;
    fullScreenControl: boolean;
    rotateControl: boolean;
    widthUnit: WidthUnitEnum;
    width: number;
    heightUnit: HeightUnitEnum;
    height: number;
    zoom: ZoomEnum;
    mapProvider: MapProviderEnum;
    mapStyles: string;
    markerClustererEnabled: boolean;
    markerClustererOptions: string;
}

export interface MapsPreviewProps {
    class: string;
    style: string;
    advanced: boolean;
    markers: MarkersPreviewType[];
    dynamicMarkers: DynamicMarkersPreviewType[];
    dynamicHeatmaps: DynamicHeatmapsPreviewType[];
    apiKey: string;
    apiKeyExp: string;
    geodecodeApiKey: string;
    geodecodeApiKeyExp: string;
    showCurrentLocation: boolean;
    optionDrag: boolean;
    optionScroll: boolean;
    optionZoomControl: boolean;
    attributionControl: boolean;
    optionStreetView: boolean;
    mapTypeControl: boolean;
    fullScreenControl: boolean;
    rotateControl: boolean;
    widthUnit: WidthUnitEnum;
    width: number | null;
    heightUnit: HeightUnitEnum;
    height: number | null;
    zoom: ZoomEnum;
    mapProvider: MapProviderEnum;
    mapStyles: string;
    markerClustererEnabled: boolean;
    markerClustererOptions: string;
}
