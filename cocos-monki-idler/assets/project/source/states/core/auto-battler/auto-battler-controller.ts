import {Battle} from "./battle.ts";
import {PanelManager, Services, ServiceType} from "../../../services";
import {DebugPanelController} from "../../shared/debug/debug-panel-controller.ts";
import {CharacterViewModel} from "./character-view-model.ts";

export class AutoBattlerController {
    private readonly _panelManager: PanelManager;
    private declare _debug: DebugPanelController;

    private _currentBattle: Battle | undefined;

    public constructor() {
        this._panelManager = Services.get(ServiceType.PANEL_MANAGER);
    }

    public async initializeAsync(): Promise<void> {
        this._debug = await this._panelManager.LoadPanel(DebugPanelController);
    }

    public async startBattleAsync(characterA: CharacterViewModel, characterB: CharacterViewModel): Promise<void> {
        this._debug.setupStats(characterA.getStats(), characterB.getStats());

        const battle = new Battle(characterA, characterB);

        this._currentBattle = battle;

        await battle.startAsync();
    }

    public release(): void {
        if(!this._currentBattle) {
            return;
        }

        this._currentBattle.characterB.release();
    }
}