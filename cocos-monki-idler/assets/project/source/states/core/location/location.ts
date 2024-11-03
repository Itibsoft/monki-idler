import {PanelManager, Services, ServiceType} from "../../../services";
import {LocationPanelController} from "./location-panel-controller.ts";

export class Location {
    private readonly _panelManager: PanelManager;

    private declare _locationPanelController: LocationPanelController;

    public constructor() {
        this._panelManager = Services.get(ServiceType.PANEL_MANAGER);
    }

    public async loadAsync(): Promise<void> {
        this._locationPanelController = await this._panelManager.LoadPanel(LocationPanelController);

        this._locationPanelController.open();
    }
}