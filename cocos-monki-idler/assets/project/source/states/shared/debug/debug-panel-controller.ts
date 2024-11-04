import { Button } from "cc";
import {PANEL_TYPE, PanelControllerBase, PanelMeta} from "../../../services";
import {DebugPanel} from "./debug-panel.ts";

export class DebugPanelController extends PanelControllerBase<DebugPanel> {
    public readonly meta: PanelMeta = {
        type: PANEL_TYPE.OVERLAY,
        order: 1000,
        bundle: "shared",
        asset_path: "ui/debug-panel"
    };

    private readonly _buttonHandler: () => void = this.onClick.bind(this);

    public constructor() {
        super();
    }

    public override async initialize(): Promise<void> {
        this.panel.button.node.on(Button.EventType.CLICK, this._buttonHandler);

        return super.initialize();
    }

    private onClick(): void {
        this.panel.container.active = !this.panel.container.active;
    }
}