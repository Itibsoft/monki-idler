import {instantiate, Prefab} from "cc";
import {AssetsBundle, AssetsBundleManager, BUNDLES, PanelManager, Services, ServiceType} from "../../../services";
import {LocationPanelController} from "./location-panel-controller.ts";
import {CharacterModel} from "../auto-battler/character-model.ts";
import {CharacterView} from "../auto-battler/character-view.ts";

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

    public constructor() {
        this._panelManager = Services.get(ServiceType.PANEL_MANAGER);
        this._assets = Services.get(ServiceType.ASSET_BUNDLE_MANAGER);
    }

    public async loadAsync(parameters: LocationParameters): Promise<void> {
        this._locationPanelController = await this._panelManager.LoadPanel(LocationPanelController);

        this._locationPanelController.setBackgroundBottom(parameters.hud_height);

        this._bundle = await this._assets.loadBundle(parameters.location_bundle) as AssetsBundle;

        const location_prefab = await this._bundle.loadPrefab(parameters.location_prefab);

        this._locationPanelController.setLocationPrefab(location_prefab);

        this._locationPanelController.open();
    }

    public async createCharacter(character: CharacterModel): Promise<void> {
        const character_view = await this.createCharacterView(character);

        this._locationPanelController.setCharacterLeft(character_view);
    }

    public async createEnemy(character: CharacterModel): Promise<void> {
        const character_view = await this.createCharacterView(character);

        this._locationPanelController.setCharacterRight(character_view);
    }

    private async createCharacterView(character: CharacterModel): Promise<CharacterView> {
        const core_bundle = await this._assets.loadBundle(BUNDLES.CORE);

        const character_prefab = await core_bundle!.loadPrefab("prefabs/characters/knight");

        const instance = instantiate(character_prefab);

        const character_view = instance.getComponent(CharacterView)!;

        character_view.setup(character);

        return character_view;
    }
}