import {instantiate, Node} from "cc";
import {AssetsBundle, AssetsBundleManager} from "../../asset-bundle-manager";
import {PanelBase} from "../abstracts/panel-base.ts";
import {PanelMeta} from "../meta/panel-meta.ts";
import {Services, ServiceType} from "../../services.ts";

export class PanelFactory {
    private readonly _assets: AssetsBundleManager;

    private _bundles: Map<string, AssetsBundle> = new Map<string, AssetsBundle>();

    public constructor() {
        this._assets = Services.get<AssetsBundleManager>(ServiceType.ASSET_BUNDLE_MANAGER);
    }

    public async create(meta: PanelMeta): Promise<PanelBase> {
        let bundle: AssetsBundle | undefined;

        if(!this._bundles.has(meta.bundle)) {
            bundle = await this._assets.loadBundle(meta.bundle);

            if(!bundle) {
                throw new Error(`Not found bundle for panel loading! bundle: ${meta.bundle}`);
            }
        }

        if(!bundle) {
            bundle = this._bundles.get(meta.bundle);
        }

        if(bundle!.isReleased) {
            bundle = await this._assets.loadBundle(meta.bundle) as AssetsBundle;

            this._bundles.set(meta.bundle, bundle);
        }

        const prefab = await bundle!.loadPrefab(meta.asset_path);

        const instance = instantiate(prefab) as Node;

        return instance.getComponent("PanelBase") as PanelBase;
    }
}