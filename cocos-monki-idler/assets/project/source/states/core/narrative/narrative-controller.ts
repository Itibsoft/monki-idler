import {HudPanelController} from "../hud/hud-panel-controller.ts";
import {BUNDLES, PanelManager, Services, ServiceType} from "../../../services";
import {NarrativeContainer} from "./narrative-container.ts";
import {Button, Color, Sprite, EventTarget} from "cc";
import {AutoBattlerController} from "../auto-battler/auto-battler-controller.ts";
import {Location} from "../location/location.ts";
import {
    CharacterModel,
    IStat,
    STAT_ATTACK_TYPE,
    STAT_BASE_TYPE,
    STAT_CATEGORY
} from "../auto-battler/character-model.ts";
import {BehaviorSubject} from "../../../utils/behaviour-subject.ts";

export enum REWARD_TYPE {
    CURRENCY,
    STAT
}

export interface IRewardInfo {
    type: REWARD_TYPE
}

export enum NARRATIVE_BLOCK_TYPE {
    INFO = "INFO",
    BATTLE = "BATTLE"
}

export interface INarrativeBlockInfo {
    type: NARRATIVE_BLOCK_TYPE,
    text: string,
    rewards?: IRewardInfo[]
}

export interface INarrativeBlockBattle extends INarrativeBlockInfo {
    enemy: IEnemyInfo
}

export interface IEnemyInfo {
    bundle: string,
    prefab: string,
    stats: IStat[]
}

export const NarrativeBlocks: INarrativeBlockInfo[] = [
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Вы шли по дороге и увидели голубя. В этот момент вы осознали их божество..."
    },
    ({
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Неожиданно на вас напала стая диких птиц, разъяренных вашим присутствием!",
        enemy: {
            bundle: BUNDLES.CORE,
            prefab: "prefabs/characters/knight",
            stats: [
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
            ]
        }
    } as INarrativeBlockBattle),
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Бла бла бла!"
    },
];

export enum NARRATIVE_EVENT {
    BATTLE = "BATTLE"
}

export class NarrativeController {
    public readonly event: EventTarget = new EventTarget();

    private readonly _container: NarrativeContainer;

    private _index: number = -1;
    private _currentBlock: INarrativeBlockInfo | undefined;

    private _location: Location;

    private readonly _nextHandler: () => void =  this.next.bind(this);
    private readonly _battleHandler: () => void =  this.battle.bind(this);

    public constructor(container: NarrativeContainer) {
        this._container = container;
    }

    public start(): void {
        this._index = -1;
        this._currentBlock = undefined;

        this.next();
    }

    public next(): void {
        this._index++;

        if(this._index == NarrativeBlocks.length) {
            this._index = 0;
        }

        this._currentBlock = NarrativeBlocks[this._index];

        switch (this._currentBlock.type) {
            case NARRATIVE_BLOCK_TYPE.INFO:
                this._container.nextButtonLabel.string = "Следующий день";

                this._container.nextButton.getComponent(Sprite)!.color = new Color().fromHEX("#76E694");

                this._container.nextButton.node.on(Button.EventType.CLICK, this._nextHandler);
                this._container.nextButton.node.off(Button.EventType.CLICK, this._battleHandler);
                break;
            case NARRATIVE_BLOCK_TYPE.BATTLE:
                this._container.nextButtonLabel.string = "В бой!";

                this._container.nextButton.getComponent(Sprite)!.color = new Color().fromHEX("#E67676");

                this._container.nextButton.node.on(Button.EventType.CLICK, this._battleHandler);
                this._container.nextButton.node.off(Button.EventType.CLICK, this._nextHandler);
                break;
        }

        this._container.add(this._index + 1, this._currentBlock);
    }

    private async battle(): Promise<void> {
        if(!this._currentBlock) {
            return;
        }

        this.event.emit(NARRATIVE_EVENT.BATTLE, this._currentBlock);
    }
}