import { Button, EditBox } from "cc";
import {PANEL_TYPE, PanelControllerBase, PanelMeta} from "../../../services";
import {DebugPanel} from "./debug-panel.ts";
import {Location} from "../../core/location/location.ts";
import { IStat } from "../../core/auto-battler/stats/stats.ts";

export class DebugPanelController extends PanelControllerBase<DebugPanel> {
    public readonly meta: PanelMeta = {
        type: PANEL_TYPE.OVERLAY,
        order: 1000,
        bundle: "shared",
        asset_path: "ui/debug-panel"
    };

    private readonly _buttonHandler: () => void = this.onClick.bind(this);

    private _location: Location | undefined;

    public constructor() {
        super();
    }

    public override async initialize(): Promise<void> {
        this.panel.button.node.on(Button.EventType.CLICK, this._buttonHandler);

        this.panel.container.active = false;

        return super.initialize();
    }

    public setupLocation(location: Location): void {
        this._location = location;

        this.panel.startBackgroundButton.node.on(Button.EventType.CLICK, () => {
            this._location?.isMove.next(true);
        })

        this.panel.stopBackgroundButton.node.on(Button.EventType.CLICK, () => {
            this._location?.isMove.next(false);
        });

        this.panel.speedBackgroundEditBox.string =  this._location?.speed.value.toString() ?? "0";

        this.panel.speedBackgroundEditBox.node.on(EditBox.EventType.TEXT_CHANGED, (text: EditBox) => {
            const value = Number.parseInt(text.string);

            if(Number.isNaN(value)) {
                this.panel.speedBackgroundEditBox.string = this._location?.speed.value.toString() ?? "0";
                return;
            }

            this._location?.speed.next(value);
        })
    }

    public setupStats(character_1_stats: IStat[], character_2_stats: IStat[]): void {
        this.panel.statsEditor.setup(character_1_stats, character_2_stats);
    }

    private onClick(): void {
        this.panel.container.active = !this.panel.container.active;
    }
}