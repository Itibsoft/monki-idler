import { Prefab, Widget } from "cc";
import {BUNDLES, PANEL_TYPE, PanelControllerBase, PanelMeta} from "../../../services";
import {LocationPanel} from "./location-panel.ts";

export class LocationPanelController extends PanelControllerBase<LocationPanel> {
    public readonly meta: PanelMeta = {
        type: PANEL_TYPE.WINDOW,
        order: 0,
        bundle: BUNDLES.CORE,
        asset_path: "ui/location-panel"
    };

    public constructor() {
        super();
    }

    async initialize(): Promise<void> {
        return super.initialize();
    }

    public setLocationPrefab(prefab: Prefab): void {
        this.panel.setup(prefab);
    }

    public setBackgroundBottom(height: number): void {
        this.panel.backgroundWidget.bottom = height;
        this.panel.backgroundWidget.updateAlignment();

        this.panel.characterWidget.bottom = height + 320;
        this.panel.characterWidget.updateAlignment();
    }
}