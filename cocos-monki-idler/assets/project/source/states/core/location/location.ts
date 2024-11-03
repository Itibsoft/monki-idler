import {PanelManager, Services, ServiceType} from "../../../services";
import {LocationPanelController} from "./location-panel-controller.ts";

export type LocationParameters = {
    hud_height: number
}

export class Location {
    private readonly _panelManager: PanelManager;

    private declare _locationPanelController: LocationPanelController;

    public constructor() {
        this._panelManager = Services.get(ServiceType.PANEL_MANAGER);
    }

    public async loadAsync(parameters: LocationParameters): Promise<void> {
        this._locationPanelController = await this._panelManager.LoadPanel(LocationPanelController);

        this._locationPanelController.open();

        this._locationPanelController.setBackgroundBottom(parameters.hud_height);
    }
}