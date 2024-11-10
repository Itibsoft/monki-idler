import {APPLICATION_STATE_TYPE, ApplicationState} from "../../application/application-state.ts";
import {HudPanelController} from "./hud/hud-panel-controller.ts";
import {AssetsBundleManager, PanelManager, Services, ServiceType} from "../../services";
import {Location} from "./location/location.ts";
import {INarrativeBlockBattle, NarrativeController} from "./narrative/narrative-controller.ts";
import {AutoBattlerController} from "./auto-battler/auto-battler-controller.ts";
import {AsyncUtils} from "../../utils/async-utils.ts";
import {GAME_RESULT_TYPE, GameResultPanelController} from "./game-result/game-result-panel-controller.ts";
import {DebugPanelController} from "../shared/debug/debug-panel-controller.ts";
import {IStatValueInfo, STAT_CATEGORY, STAT_TYPE_ATTACK, STAT_TYPE_BASE} from "./auto-battler/stats/stats.ts";
import {CharactersFactory} from "./auto-battler/character/characters-factory.ts";
import {CHARACTER_TYPE} from "./auto-battler/character/character-model.ts";
import {CharacterViewModel} from "./auto-battler/character-view-model.ts";

export class CoreApplicationState extends ApplicationState {
    public type: APPLICATION_STATE_TYPE = APPLICATION_STATE_TYPE.CORE;

    private readonly _panelManager: PanelManager;
    private readonly _assets: AssetsBundleManager;
    private readonly _charactersFactory: CharactersFactory;

    private declare _hud: HudPanelController;
    private declare _gameResult: GameResultPanelController;


    private declare _autoBattler: AutoBattlerController;
    private declare _narrative: NarrativeController;
    private declare _location: Location;

    private declare _character: CharacterViewModel | undefined;

    public constructor() {
        super();

        this._panelManager = Services.get(ServiceType.PANEL_MANAGER);
        this._assets = Services.get(ServiceType.ASSET_BUNDLE_MANAGER);
        this._charactersFactory = Services.get(ServiceType.CHARACTERS_FACTORY);
    }

    public async enterAsync(): Promise<void> {
        await this.initializeHUDAsync();
        await this.initializeGameResultAsync();

        await this.initializeLocationAsync();
        await this.initializeNarrativeAsync();
        await this.initializeAutoBattleAsync();
        await this.createCharacterAsync();

        this._narrative.start();
    }

    public async exitAsync(): Promise<void> {
        this._hud.release();
    }

    private async initializeHUDAsync(): Promise<void> {
        this._hud = await this._panelManager.LoadPanel(HudPanelController);

        this._hud.open();
    }

    private async initializeGameResultAsync(): Promise<void> {
        this._gameResult = await this._panelManager.LoadPanel(GameResultPanelController);

        this._gameResult.onOK.add(this.onGameResultOK, this);
    }

    private async initializeNarrativeAsync(): Promise<void> {
        const container = this._hud.getNarrativeContainer();

        this._narrative = new NarrativeController(this._location, container);

        this._narrative.onBattle.add(this.onBattleAsync, this);
    }

    private async initializeAutoBattleAsync(): Promise<void> {
        this._autoBattler = new AutoBattlerController();

        await this._autoBattler.initializeAsync();
    }

    private async initializeLocationAsync(): Promise<void> {
        this._location = new Location();

        const container = this._hud.getNarrativeContainer();

        const height = container.getBlockHeight();

        await this._location.loadAsync({
            hud_height: height,
            location_prefab: "prefabs/forest",
            location_bundle: "forest-location"
        });

        const debug = await this._panelManager.LoadPanel(DebugPanelController);

        debug.setupLocation(this._location);
    }

    private async createCharacterAsync(): Promise<void> {
        const character_stats_info: IStatValueInfo[] = [
            {
                category: STAT_CATEGORY.BASE,
                type: STAT_TYPE_BASE.ATTACK,
                value: 20
            },
            {
                category: STAT_CATEGORY.BASE,
                type: STAT_TYPE_BASE.HEALTH_MAX,
                value: 500
            },
            {
                category: STAT_CATEGORY.BASE,
                type: STAT_TYPE_BASE.HEALTH_CURRENT,
                value: 500
            },
            {
                category: STAT_CATEGORY.BASE,
                type: STAT_TYPE_BASE.DEFENCE,
                value: 10,
            },

            {
                category: STAT_CATEGORY.ATTACK,
                type: STAT_TYPE_ATTACK.CRIT_ATTACK,
                value: 25
            },

            {
                category: STAT_CATEGORY.ATTACK,
                type: STAT_TYPE_ATTACK.COMBO_ATTACK,
                value: 20
            },

            {
                category: STAT_CATEGORY.ATTACK,
                type: STAT_TYPE_ATTACK.REGEN,
                value: 5
            }
        ];

        this._character = await this._charactersFactory.createAsync(CHARACTER_TYPE.KNIGHT, character_stats_info);

        this._character.setMovableSceneFlow(false);

        this._character.onDead.add(this.onCharacterDead, this);

        await this._location.setupCharacter(this._character);

        this._narrative.setupCharacter(this._character);
    }

    private async restart(): Promise<void> {
        this._autoBattler.release();

        if(!this._character) {
            await this.createCharacterAsync();
        }

        this._narrative.setupCharacter(this._character!);

        this._narrative.start();
    }

    private async onBattleAsync(info: INarrativeBlockBattle): Promise<void> {
        if(!this._character) {
            throw new Error("Not found main character");
        }

        const enemy = await this._charactersFactory.createAsync(CHARACTER_TYPE.KNIGHT, info.enemy.stats);

        enemy.onDead.add((c) => {
            c.release();
        }, this);

        await this._location.setupEnemy(enemy);

        this._location.speed.next(1000);

        await AsyncUtils.wait(1);

        enemy.setMovableSceneFlow(false);

        this._location.speed.next(350);
        this._location.isMove.next(false);

        this._character.idleAnimation();
        enemy.idleAnimation();

        await this._autoBattler.startBattleAsync(this._character, enemy);

        if(this._character && this._character.isAlive()) {
            this._narrative.next();
        }
    }

    private onCharacterDead(character: CharacterViewModel): void {
        this._location.isMove.next(false);

        character.release();

        this._character = undefined;

        const current_day = this._narrative.getCurrentDay();
        const max_day = this._narrative.getMaxDay();

        this._gameResult.openResult(GAME_RESULT_TYPE.LOSE, current_day, max_day)
    }

    private async onGameResultOK(result: GAME_RESULT_TYPE): Promise<void> {
        this._location.isMove.next(false);

        await this.restart();

        this._gameResult.close();
    }
}