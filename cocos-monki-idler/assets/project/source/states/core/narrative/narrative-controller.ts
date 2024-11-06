import {BUNDLES} from "../../../services";
import {NarrativeContainer} from "./narrative-container.ts";
import {Button, Color, Sprite} from "cc";
import {Location} from "../location/location.ts";
import {STAT_ATTACK_TYPE, STAT_BASE_TYPE, STAT_CATEGORY} from "../auto-battler/character-model.ts";
import {Delegate} from "../../../utils/delegate.ts";
import {LocalStorage} from "../../../utils/local-storage.ts";
import {CharacterViewModel} from "../auto-battler/character-view-model.ts";

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
    stats: IStatInfo[]
}

export interface IStatInfo {
    category: STAT_CATEGORY,
    type: number,
    name: string,
    description: string,
    value: number
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
                    value: 20
                },
                {
                    category: STAT_CATEGORY.BASE,
                    type: STAT_BASE_TYPE.HEALTH,
                    name: "Здоровье",
                    description: "Максимальное здоровье персонажа",
                    value: 100
                },
                {
                    category: STAT_CATEGORY.ATTACK,
                    type: STAT_ATTACK_TYPE.CRIT,
                    name: "Критический удар",
                    description: "С некоторой вероятностью наносит 200% урона, эта цифра также может быть улучшена",
                    value: 10
                }
            ]
        }
    } as INarrativeBlockBattle),
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Бла бла бла!"
    },
];

const MAX_DAY_COUNT_KEY: string = "max_day_count";

export class NarrativeController {
    public onBattle: Delegate<INarrativeBlockBattle> = new Delegate<INarrativeBlockBattle>();

    private readonly _container: NarrativeContainer;

    private _index: number = -1;
    private _currentBlock: INarrativeBlockInfo | undefined;

    private _location: Location;
    private _character: CharacterViewModel;

    private readonly _nextHandler: () => void =  this.next.bind(this);
    private readonly _battleHandler: () => void =  this.battle.bind(this);

    public constructor(location: Location, container: NarrativeContainer) {
        this._location = location;
        this._container = container;
    }

    public setupCharacter(character: CharacterViewModel): void {
        this._character = character;
    }

    public start(): void {
        this._index = -1;
        this._currentBlock = undefined;

        this._container.clear();

        this.next();
    }

    public getCurrentDay(): number {
        return this._index + 1;
    }

    public getMaxDay(): number {
        return LocalStorage.getData<number>(MAX_DAY_COUNT_KEY, 0)! + 1;
    }

    public next(): void {
        this._location.isMove.next(true);

        if(this._character.isAlive()) {
            this._character.move();
        }


        this._index++;

        if(this._index == NarrativeBlocks.length) {
            this._index = 0;
        }

        if(this.getCurrentDay() > this.getMaxDay()) {
            LocalStorage.setData<number>(MAX_DAY_COUNT_KEY, this._index);
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
            throw new Error("Not found narrative block for battle");
        }

        if(this._currentBlock.type !== NARRATIVE_BLOCK_TYPE.BATTLE) {
            throw new Error("Narrative block no correct for battle");
        }

        const battle_block = this._currentBlock as INarrativeBlockBattle;

        this.onBattle.invoke(battle_block)
    }
}