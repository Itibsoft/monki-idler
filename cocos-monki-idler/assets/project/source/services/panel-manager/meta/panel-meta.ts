import {PanelType} from "../enums/panel-type.ts";

export type PanelMeta = {
    Type: PanelType;
    Order: number;
    AssetPath: string;
}