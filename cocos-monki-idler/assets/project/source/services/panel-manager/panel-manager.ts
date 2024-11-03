import {IPanelController, IPanelControllerProcessor} from "./abstracts/panel-controller-base.ts";
import {PanelDispatcher} from "./panel-dispatcher.ts";
import {PanelBase} from "./abstracts/panel-base.ts";
import {PanelFactory} from "./factories/panel-factory.ts";
import {IService, Services, ServiceType} from "../services.ts";

export interface IPanelManagerProcessor {
    open(controller: IPanelController, panel: PanelBase): Promise<void>;

    close(controller: IPanelController, panel: PanelBase): Promise<void>;

    release(controller: IPanelController, panel: PanelBase): Promise<void>;
}

export interface IPanelManager extends IService {
    LoadPanel<TPanelController extends IPanelController>(constructor: Constructor<TPanelController>): Promise<TPanelController>;
}

interface Constructor<T> {
    new(...args: any[]): T;
}

export class PanelManager implements IPanelManager, IPanelManagerProcessor {
    public type: ServiceType = ServiceType.PANEL_MANAGER;
    public panelDispatcher: PanelDispatcher;

    private _cachedPanelControllers: Map<string, IPanelController> = new Map<string, IPanelController>();

    private readonly _panelFactory: PanelFactory;

    public constructor(dispatcher: PanelDispatcher) {
        this.panelDispatcher = dispatcher;
        this._panelFactory = new PanelFactory();

        Services.add(this);
    }

    public async open(controller: IPanelControllerProcessor, panel: PanelBase): Promise<void> {
        await controller.onOpenBefore();
        this.panelDispatcher.activate(panel);
        await controller.onOpenAfter();
    }

    public async close(controller: IPanelControllerProcessor, panel: PanelBase): Promise<void> {
        await controller.onCloseBefore();
        this.panelDispatcher.cache(panel);
        await controller.onCloseAfter();
    }

    public async release(controller: IPanelControllerProcessor, panel: PanelBase): Promise<void> {
        await controller.onUnload();
        this._cachedPanelControllers.delete(panel.meta.asset_path);
        this.panelDispatcher.remove(panel);
    }

    public async LoadPanel<TPanelController extends IPanelController>(constructor: Constructor<TPanelController>): Promise<TPanelController> {
        const controller = new constructor();

        if (this._cachedPanelControllers.has(controller.meta.asset_path)) {
            return this._cachedPanelControllers.get(controller.meta.asset_path) as TPanelController;
        }

        const processor = controller as IPanelControllerProcessor;

        processor.setup(this, this._panelFactory);
        await processor.onLoad();
        await processor.initialize();

        const panel = controller.getPanel();

        this.panelDispatcher.cache(panel);

        this._cachedPanelControllers.set(controller.meta.asset_path, controller);

        return controller;
    }
}