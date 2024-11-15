import {AssetsBundle, AssetsBundleManager, BUNDLES, PanelManager, Services, ServiceType} from "../../../services";
import {LocationPanelController} from "./location-panel-controller.ts";
import {BehaviorSubject} from "../../../utils/behaviour-subject.ts";
import {CharacterViewModel} from "../auto-battler/character-view-model.ts";

export type LocationParameters = {
    hud_height: number,
    location_bundle: string,
    location_prefab: string
}

export class Location {
    private readonly _panelManager: PanelManager;
    private readonly _assets: AssetsBundleManager;

    private declare _locationPanelController: LocationPanelController;

    private _bundle: AssetsBundle;

    public isMove: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public speed: BehaviorSubject<number> = new BehaviorSubject<number>(350);

    public constructor() {
        this._panelManager = Services.get(ServiceType.PANEL_MANAGER);
        this._assets = Services.get(ServiceType.ASSET_BUNDLE_MANAGER);
    }

    public async loadAsync(parameters: LocationParameters): Promise<void> {
        this._locationPanelController = await this._panelManager.LoadPanel(LocationPanelController);

        this._locationPanelController.setBackgroundBottom(parameters.hud_height);

        this._bundle = await this._assets.loadBundle(parameters.location_bundle) as AssetsBundle;

        const location_prefab = await this._bundle.loadPrefab(parameters.location_prefab);

        this._locationPanelController.setLocationPrefab(location_prefab, this.isMove, this.speed);

        this._locationPanelController.open();
    }

    public async setupCharacter(character: CharacterViewModel): Promise<void> {
        const view = character.getView();
        this._locationPanelController.setCharacterLeft(view);
    }

    public async setupEnemy(character: CharacterViewModel): Promise<void> {
        const view = character.getView();
        this._locationPanelController.setCharacterRight(view);
    }
}