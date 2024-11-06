import {Button, Color } from "cc";
import {BUNDLES, PANEL_TYPE, PanelControllerBase, PanelMeta} from "../../../services";
import {GameResultPanel} from "./game-result-panel.ts";
import {Delegate} from "../../../utils/delegate.ts";

export enum GAME_RESULT_TYPE {
    LOSE = 0,
    WIN = 1
}

export class GameResultPanelController extends PanelControllerBase<GameResultPanel> {
    public readonly meta: PanelMeta = {
        type: PANEL_TYPE.OVERLAY,
        order: 1,
        bundle: BUNDLES.GAME_RESULT,
        asset_path: "ui/game-result-panel"
    };

    public onOK: Delegate<GAME_RESULT_TYPE> = new Delegate<GAME_RESULT_TYPE>();

    private declare _resultType: GAME_RESULT_TYPE;

    public constructor() {
        super();
    }

    public override async initialize(): Promise<void> {
        this.panel.okButton.node.on(Button.EventType.CLICK, this.OK.bind(this));
        return super.initialize();
    }

    public openResult(type: GAME_RESULT_TYPE, current_day: number, max_day: number): void {
        this._resultType = type;

        switch (type) {
            case GAME_RESULT_TYPE.LOSE:
                this.panel.titleLabel.color = new Color().fromHEX("#FF6868");
                this.panel.backSprite.color = new Color().fromHEX("#513872");
                break;
            case GAME_RESULT_TYPE.WIN:
                this.panel.titleLabel.color = new Color().fromHEX("#98FF68");
                this.panel.titleLabel.color = new Color().fromHEX("#C85164");
                break;
        }

        this.panel.currentDay.string = `${current_day} Деней`;
        this.panel.maxDay.string = `Макс: ${max_day} Деней`;
    }

    private OK(): void {
        this.onOK.invoke(this._resultType);
    }
}