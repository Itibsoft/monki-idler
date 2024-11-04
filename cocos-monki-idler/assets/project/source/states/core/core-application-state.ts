import {APPLICATION_STATE_TYPE, ApplicationState} from "../../application/application-state.ts";
import {HudPanelController} from "./hud/hud-panel-controller.ts";
import {AssetsBundle, AssetsBundleManager, BUNDLES, PanelManager, Services, ServiceType} from "../../services";
import {Location} from "./location/location.ts";
import {BehaviorSubject} from "../../utils/behaviour-subject.ts";
import {INarrativeBlockBattle, NARRATIVE_EVENT, NarrativeController} from "./narrative/narrative-controller.ts";
import {CharacterModel, STAT_ATTACK_TYPE, STAT_BASE_TYPE, STAT_CATEGORY} from "./auto-battler/character-model.ts";
import {instantiate} from "cc";
import {CharacterView} from "./auto-battler/character-view.ts";
import {AutoBattlerController} from "./auto-battler/auto-battler-controller.ts";
import {CharacterViewModel} from "./auto-battler/character-view-model.ts";
import {AsyncUtils} from "../../utils/async-utils.ts";

export class CoreConfig {
    public static readonly locationSpeed: BehaviorSubject<number> = new BehaviorSubject<number>(350);
    public static readonly locationIsMove: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

}

export class CoreApplicationState extends ApplicationState {
    public type: APPLICATION_STATE_TYPE = APPLICATION_STATE_TYPE.CORE;

    private readonly _panelManager: PanelManager;
    private readonly _assets: AssetsBundleManager;

    private declare _hud: HudPanelController;
    private declare _autoBattler: AutoBattlerController;
    private declare _narrative: NarrativeController;
    private declare _location: Location;

    private declare _character: CharacterViewModel;

    private readonly _onBattleHandler: () => Promise<void> = this.onBattleAsync.bind(this);

    public constructor() {
        super();

        this._panelManager = Services.get(ServiceType.PANEL_MANAGER);
        this._assets = Services.get(ServiceType.ASSET_BUNDLE_MANAGER);
    }

    public async enterAsync(): Promise<void> {
        await this.initializeHUDAsync();
        await this.initializeNarrativeAsync();
        await this.initializeAutoBattleAsync();
        await this.initializeLocationAsync();
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

    private async initializeNarrativeAsync(): Promise<void> {
        const container = this._hud.getNarrativeContainer();

        this._narrative = new NarrativeController(container);

        this._narrative.event.on(NARRATIVE_EVENT.BATTLE, this._onBattleHandler);
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
    }

    private async createCharacterAsync(): Promise<void> {
        const model = new CharacterModel([
            {
                category: STAT_CATEGORY.BASE,
                type: STAT_BASE_TYPE.ATTACK,
                name: "Атака",
                description: "Наносимый персонажем урон",
                value: new BehaviorSubject<number>(20)
            },
            {
                category: STAT_CATEGORY.BASE,
                type: STAT_BASE_TYPE.HEALTH,
                name: "Здоровье",
                description: "Максимальное здоровье персонажа",
                value: new BehaviorSubject<number>(100)
            },
            {
                category: STAT_CATEGORY.ATTACK,
                type: STAT_ATTACK_TYPE.CRIT,
                name: "Критический удар",
                description: "С некоторой вероятностью наносит 200% урона, эта цифра также может быть улучшена",
                value: new BehaviorSubject<number>(10)
            }
        ]);


        const core_bundle = await this._assets.loadBundle(BUNDLES.CORE);

        const character_prefab = await core_bundle!.loadPrefab("prefabs/characters/knight");

        const instance = instantiate(character_prefab);

        const view = instance.getComponent(CharacterView)!;

        const view_model = new CharacterViewModel(model, view);

        await this._location.setupCharacter(view);

        this._character = view_model;
    }

    private async onBattleAsync(info: INarrativeBlockBattle): Promise<void> {
        const bundle = await this._assets.loadBundle(info.enemy.bundle) as AssetsBundle;

        const prefab = await bundle.loadPrefab(info.enemy.prefab);

        const view = instantiate(prefab).getComponent(CharacterView)!;

        const model = new CharacterModel(info.enemy.stats);

        const view_model = new CharacterViewModel(model, view);

        await this._location.setupEnemy(view);

        await AsyncUtils.wait(1);

        await this._autoBattler.startBattleAsync(this._character, view_model);


        this._narrative.next();
    }
}