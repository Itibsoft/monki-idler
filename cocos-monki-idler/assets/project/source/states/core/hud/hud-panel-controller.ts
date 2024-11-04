import {BUNDLES, PANEL_TYPE, PanelControllerBase, PanelMeta} from "../../../services";
import {HudPanel} from "./hud-panel.ts";
import {NarrativeContainer} from "../narrative/narrative-container.ts";

export class HudPanelController extends PanelControllerBase<HudPanel> {
    public readonly meta: PanelMeta = {
        type: PANEL_TYPE.OVERLAY,
        order: 0,
        bundle: BUNDLES.CORE,
        asset_path: "ui/hud-panel"
    };

    public constructor() {
        super();
    }

    public getNarrativeBlockHeight(): number {
        return this.panel.narrativeBlockTransform.contentSize.y;
    }

    public getNarrativeContainer(): NarrativeContainer {
        return this.panel.narrativeContainer;
    }
}