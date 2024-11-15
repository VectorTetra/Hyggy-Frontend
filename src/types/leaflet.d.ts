import "leaflet";

declare module "react-leaflet" {
    import { Icon } from "leaflet";

    interface MarkerProps {
        icon?: Icon;
    }
    interface TileLayerProps {
        attribution?: string;
    }
    interface MapContainerProps {
        center: number[];
        zoom: number;
        maxZoom: number;
    }
}