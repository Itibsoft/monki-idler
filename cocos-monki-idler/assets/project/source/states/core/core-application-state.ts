import {APPLICATION_STATE_TYPE, ApplicationState} from "../../application/application-state.ts";
import {HudPanelController} from "./hud/hud-panel-controller.ts";
import {AssetsBundleManager, BUNDLES, PanelManager, Services, ServiceType} from "../../services";
import {Location} from "./location/location.ts";
import {BehaviorSubject} from "../../utils/behaviour-subject.ts";
import {NarrativeController} from "./narrative/narrative-controller.ts";
import {CharacterModel, STAT_ATTACK_TYPE, STAT_BASE_TYPE, STAT_CATEGORY} from "./auto-battler/character-model.ts";
import {instantiate} from "cc";
import {CharacterView} from "./auto-battler/character-view.ts";

export class CoreConfig {
    public static readonly locationSpeed: BehaviorSubject<number> = new BehaviorSubject<number>(350);
    public static readonly locationIsMove: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

}

export class CoreApplicationState extends ApplicationState {
    public type: APPLICATION_STATE_TYPE = APPLICATION_STATE_TYPE.CORE;

    private readonly _panelManager: PanelManager;
    private readonly _assets: AssetsBundleManager;

    private declare _hudPanelController: HudPanelController;

    public constructor() {
        super();

        this._panelManager = Services.get(ServiceType.PANEL_MANAGER);
        this._assets = Services.get(ServiceType.ASSET_BUNDLE_MANAGER);
    }

    public async enterAsync(): Promise<void> {
        const narrative_controller = new NarrativeController();

        await narrative_controller.initializeAsync();
    }

    public async exitAsync(): Promise<void> {
        this._hudPanelController.release();
    }

}