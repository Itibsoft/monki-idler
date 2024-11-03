import {PANEL_TYPE} from "../enums/panel-type.ts";

export type PanelMeta = {
    type: PANEL_TYPE;
    order: number;
    asset_path: string;
    bundle: string
}