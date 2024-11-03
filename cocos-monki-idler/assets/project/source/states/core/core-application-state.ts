import {APPLICATION_STATE_TYPE, ApplicationState} from "../../application/application-state.ts";
import {HudPanelController} from "./hud/hud-panel-controller.ts";
import {PanelManager, Services, ServiceType} from "../../services";

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
    }
    public async exitAsync(): Promise<void> {
        this._hudPanelController.release();
    }

}