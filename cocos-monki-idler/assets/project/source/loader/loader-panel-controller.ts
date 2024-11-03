import {PanelControllerBase, PanelMeta, PANEL_TYPE, BUNDLES} from "../services";
import {LoaderPanel} from "./loader-panel.ts";

export class LoaderPanelController extends PanelControllerBase<LoaderPanel> {
    public readonly meta: PanelMeta = {
        type: PANEL_TYPE.OVERLAY,
        order: 100,
        bundle: BUNDLES.LOADER,
        asset_path: "ui/loader-panel"
    };

    public constructor() {
        super();
    }

}