import {instantiate} from "cc";
import {AssetsBundle} from "../../asset-bundle-manager";
import {PanelBase} from "../abstracts/panel-base.ts";
import {PanelMeta} from "../meta/panel-meta.ts";

export class PanelFactory {
    private _uiBundle: AssetsBundle;

    constructor(bundle: AssetsBundle) {
        this._uiBundle = bundle;
    }
    public async create(meta: PanelMeta): Promise<PanelBase> {
        const panelPrefab = await this._uiBundle.loadPrefab(meta.AssetPath);

        const panelInstance = instantiate(panelPrefab);

        return panelInstance.getComponent("PanelBase") as PanelBase;
    }
}