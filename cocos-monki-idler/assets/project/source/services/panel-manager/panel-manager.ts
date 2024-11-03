import {IPanelController, IPanelControllerProcessor} from "./abstracts/panel-controller-base.ts";
import {PanelDispatcher} from "./panel-dispatcher.ts";
import {PanelBase} from "./abstracts/panel-base.ts";
import {AssetsBundle} from "../asset-bundle-manager";
import {instantiate} from "cc";
import {PanelFactory} from "./factories/panel-factory.ts";
import {IService, ServiceType} from "../services.ts";

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
    private readonly _uiBundle: AssetsBundle;

    private readonly _panelFactory: PanelFactory;

    public constructor(bundle: AssetsBundle) {
        this._uiBundle = bundle;

        this._panelFactory = new PanelFactory(bundle);
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
        this._cachedPanelControllers.delete(panel.meta.AssetPath);
        this.panelDispatcher.remove(panel);
    }

    /*public async CreatePanelDispatcher(): Promise<void> {
        const panelDispatcherPrefab = await this._uiBundle?.loadPrefab("panel-dispatcher");

        if (panelDispatcherPrefab === undefined) {
            console.error("Not found panel_dispatcher in _uiBundle");
            return;
        }

        const node = instantiate(panelDispatcherPrefab);

        const panelDispatcher = node.getComponent("PanelDispatcher") as PanelDispatcher;

        if (Application.canvas === undefined || Application.canvas.uiContainer === undefined) {
            console.error("Root canvas in undefined");
            return;
        }

        panelDispatcher.node.setParent(Application.canvas.uiContainer);
        this.panelDispatcher = panelDispatcher;
    }*/

    public async LoadPanel<TPanelController extends IPanelController>(constructor: Constructor<TPanelController>): Promise<TPanelController> {
        const controller = new constructor();

        if (this._cachedPanelControllers.has(controller.meta.AssetPath)) {
            return this._cachedPanelControllers.get(controller.meta.AssetPath) as TPanelController;
        }

        const processor = controller as IPanelControllerProcessor;

        processor.setup(this, this._panelFactory);
        await processor.onLoad();
        await processor.initialize();

        const panel = controller.getPanel();

        this.panelDispatcher.cache(panel);

        this._cachedPanelControllers.set(controller.meta.AssetPath, controller);

        return controller;
    }
}