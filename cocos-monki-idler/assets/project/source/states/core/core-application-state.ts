import {APPLICATION_STATE_TYPE, ApplicationState} from "../../application/application-state.ts";
import {HudPanelController} from "./hud/hud-panel-controller.ts";
import {PanelManager, Services, ServiceType} from "../../services";
import {Location} from "./location/location.ts";
import {BehaviorSubject} from "../../utils/behaviour-subject.ts";
import {NarrativeController} from "./narrative/narrative-controller.ts";

export class CoreConfig {
    public static readonly locationSpeed: BehaviorSubject<number> = new BehaviorSubject<number>(350);
    public static readonly locationIsMove: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

}

export class CoreApplicationState extends ApplicationState {
    public type: APPLICATION_STATE_TYPE = APPLICATION_STATE_TYPE.CORE;

    private readonly _panelManager: PanelManager;

    private declare _hudPanelController: HudPanelController;

    public constructor() {
        super();

        this._panelManager = Services.get(ServiceType.PANEL_MANAGER);
    }

    public async enterAsync(): Promise<void> {
        this._hudPanelController = await this._panelManager.LoadPanel(HudPanelController);

        this._hudPanelController.open();

        const location = new Location();

        const height =  this._hudPanelController.getNarrativeBlockHeight();

        await location.loadAsync({
            hud_height: height,
            location_prefab: "prefabs/forest",
            location_bundle: "forest-location"
        });

        const narrative_controller = new NarrativeController();

        await narrative_controller.initializeAsync();
    }
    public async exitAsync(): Promise<void> {
        this._hudPanelController.release();
    }

}