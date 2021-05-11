export function translateZoom(level: string): number {
    switch (level) {
        case "world":
            return 1;
        case "continent":
            return 5;
        case "zoomlevel6":
            return 6;
        case "zoomlevel7":
            return 7;
        case "zoomlevel8":
            return 8;
        case "zoomlevel9":
            return 9;
        case "city":
            return 10;
        case "street":
            return 15;
        case "buildings":
            return 20;
    }
    return 1;
}
