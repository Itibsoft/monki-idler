import {IService, PanelManager, Services, ServiceType} from "../services";
import {LoaderPanelController} from "./loader-panel-controller.ts";

export class Loader implements IService {
    public readonly type: ServiceType = ServiceType.LOADER;

    private _loaderPanelController: LoaderPanelController;

    public async initializeAsync(): Promise<void> {
        const panel_manager = Services.get<PanelManager>(ServiceType.PANEL_MANAGER);

        this._loaderPanelController = await panel_manager.LoadPanel(LoaderPanelController);

        Services.add(this);
    }

    public open(): void {
        this._loaderPanelController.open();
    }

    public close(): void {
        this._loaderPanelController.close();
    }
}