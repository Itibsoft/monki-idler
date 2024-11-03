import {PanelBase} from "./panel-base.ts";
import {IPanelManagerProcessor, PanelManager} from "../panel-manager.ts";
import {PanelMeta} from "../meta/panel-meta.ts";
import {PanelFactory} from "../factories/panel-factory.ts";
import {Button} from 'cc';

export interface IPanelController extends IPanelControllerProcessor {
    meta: PanelMeta;

    open(): void;

    close(): void;

    release(): void;

    getPanel(): PanelBase;
}

export interface IPanelControllerProcessor {
    setup(panelManager: PanelManager, panelFactory: PanelFactory): void;

    onLoad(): Promise<void>;

    initialize(): Promise<void>;

    onOpenBefore(): Promise<void>;

    onOpenAfter(): Promise<void>;

    onCloseBefore(): Promise<void>;

    onCloseAfter(): Promise<void>;

    onUnload(): Promise<void>;
}

export abstract class PanelControllerBase<TPanel extends PanelBase> implements IPanelController {
    public panel: TPanel;
    public abstract meta: PanelMeta;

    protected manager: PanelManager;

    private _panelFactory: PanelFactory;

    private _processor: IPanelManagerProcessor;

    protected constructor() {
    }

    public open(): void {
        this._processor.open(this, this.panel);
    }

    public close(): void {
        this._processor.close(this, this.panel);
    }

    public release(): void {
        this._processor.release(this, this.panel);
    }

    public getPanel(): PanelBase {
        return this.panel as PanelBase
    }

    public setup(panelManager: PanelManager, panelFactory: PanelFactory): void {
        this.manager = panelManager;
        this._panelFactory = panelFactory;

        this._processor = panelManager as IPanelManagerProcessor;
    }

    public async onLoad(): Promise<void> {
        let panel = await this._panelFactory.create(this.meta);

        panel.setMeta(this.meta);

        this.panel = panel as TPanel;
    }
    public async initialize(): Promise<void> {}
    public async onOpenBefore(): Promise<void> {}
    public async onOpenAfter(): Promise<void> {}
    public async onCloseBefore(): Promise<void> {}
    public async onCloseAfter(): Promise<void> {}
    public async onUnload(): Promise<void> {}
}