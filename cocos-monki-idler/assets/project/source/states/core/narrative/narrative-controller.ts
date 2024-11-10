import {BUNDLES} from "../../../services";
import {NarrativeContainer} from "./narrative-container.ts";
import {Button, Color, Sprite} from "cc";
import {Location} from "../location/location.ts";
import {Delegate} from "../../../utils/delegate.ts";
import {LocalStorage} from "../../../utils/local-storage.ts";
import {CharacterViewModel} from "../auto-battler/character-view-model.ts";
import {IStatValueInfo, STAT_CATEGORY, STAT_TYPE_BASE} from "../auto-battler/stats.ts";
import { MUTATION_CATEGORY, MUTATION_TYPE } from "../auto-battler/mutations.ts";

export enum REWARD_TYPE {
    CURRENCY,
    STAT,
    MUTATION
}

export interface IRewardInfo {
    type: REWARD_TYPE
}

export interface IRewardMutationInfo extends IRewardInfo {
    mutation_category: MUTATION_CATEGORY,
    mutation_type: MUTATION_TYPE,
}

export interface IRewardStatInfo extends IRewardInfo {
    stat_category: STAT_CATEGORY,
    stat_type: number,
    value: number
}

export enum NARRATIVE_BLOCK_TYPE {
    INFO = "INFO",
    BATTLE = "BATTLE",
    YES_NO = "YES_NO"
}

export interface INarrativeBlockInfo {
    type: NARRATIVE_BLOCK_TYPE,
    text: string,
    rewards?: IRewardInfo[]
}

export interface INarrativeBlockBattle extends INarrativeBlockInfo {
    enemy: IEnemyInfo
}

export interface INarrativeEventResult {
    text: string,
    rewards?: IRewardInfo[]
}

export interface INarrativeYesNo extends INarrativeBlockInfo {
    positive: INarrativeEventResult,
    negative: INarrativeEventResult
}

export interface IEnemyInfo {
    bundle: string,
    prefab: string,
    stats: IStatValueInfo[]
}

export const NarrativeBlocks: INarrativeBlockInfo[] = [
    // Начало путешествия
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Вы шли по дороге и заметили голубя с яркими перьями. В этот момент осознали, что он — символ древнего божества."
    },
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Вдруг стая птиц атаковала вас, разъяренная вашим присутствием. Вы почувствовали, что их действия контролируются."
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Стая птиц атакует! Используйте свои силы, чтобы отбиться от них.",
        enemy: {
            bundle: BUNDLES.CORE,
            prefab: "prefabs/characters/knight",  // Оставляем один и тот же префаб
            stats: [
                {
                    category: STAT_CATEGORY.BASE,
                    type: STAT_TYPE_BASE.ATTACK,
                    value: 5
                },
                {
                    category: STAT_CATEGORY.BASE,
                    type: STAT_TYPE_BASE.HEALTH_MAX,
                    value: 30
                },
                {
                    category: STAT_CATEGORY.BASE,
                    type: STAT_TYPE_BASE.HEALTH_CURRENT,
                    value: 30
                }
            ]
        }
    } as INarrativeBlockBattle,

    // После первой битвы
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "После победы голубь присел на ваше плечо, и перед вами открылся путь в забытый храм, скрытый в лесу."
    },

    {
        type: NARRATIVE_BLOCK_TYPE.YES_NO,
        text: "Среди кочек на чистом поле Монки увидел подозрительный грибочек. Может, бахнем?",
        positive: {
            text: "Монки съедает подозрительный гриб. После осознания вечного и бесконечного Монки осознает, что бить надо было по голове!",
            rewards: []
        },
        negative: {
            text: "Монки всю ночь дрался с пальмами.",
            rewards: [
                {
                    type: REWARD_TYPE.STAT,
                    stat_category: STAT_CATEGORY.BASE,
                    stat_type: STAT_TYPE_BASE.HEALTH_MAX,
                    value: -15
                } as IRewardStatInfo
            ]
        },
        rewards: [
            {
                type: REWARD_TYPE.MUTATION,
                mutation_category: MUTATION_CATEGORY.INTELLECTUAL,
                mutation_type: MUTATION_TYPE.INSIGHT
            } as IRewardMutationInfo
        ]
    } as INarrativeYesNo,

    // Вторая битва (враги немного сильнее)
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Перед вами появились лесные монстры. Они смотрят на вас с яростью и готовятся атаковать."
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Эти монстры стали сильнее, будьте готовы к более агрессивной атаке!",
        enemy: {
            bundle: BUNDLES.CORE,
            prefab: "prefabs/characters/knight",  // Оставляем тот же префаб
            stats: [
                {
                    category: STAT_CATEGORY.BASE,
                    type: STAT_TYPE_BASE.ATTACK,
                    value: 10
                },
                {
                    category: STAT_CATEGORY.BASE,
                    type: STAT_TYPE_BASE.HEALTH_MAX,
                    value: 50
                },
                {
                    category: STAT_CATEGORY.BASE,
                    type: STAT_TYPE_BASE.HEALTH_CURRENT,
                    value: 50
                }
            ]
        }
    } as INarrativeBlockBattle,

    // После второй битвы
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Вы победили монстров и обнаружили древний камень, который излучает странный свет. Он ведет вас дальше в храм."
    },

    // Третья битва (враги еще сильнее)
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Появился лесной дух. Он охраняет путь в храм и готов вступить в бой."
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Лесной дух использует магию, будьте осторожны и не поддавайтесь его хитрым атакам.",
        enemy: {
            bundle: BUNDLES.CORE,
            prefab: "prefabs/characters/knight",  // Оставляем тот же префаб
            stats: [
                {
                    category: STAT_CATEGORY.BASE,
                    type: STAT_TYPE_BASE.ATTACK,
                    value: 15
                },
                {
                    category: STAT_CATEGORY.BASE,
                    type: STAT_TYPE_BASE.HEALTH_MAX,
                    value: 80
                },
                {
                    category: STAT_CATEGORY.BASE,
                    type: STAT_TYPE_BASE.HEALTH_CURRENT,
                    value: 80
                }
            ]
        }
    } as INarrativeBlockBattle,

    // После победы
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Дух повержен. Портал открылся, и вы вошли в храм, полный загадок и магии. Путь ведет в темные глубины."
    },

    // Внутри храма
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Внутри храма стены покрыты рунами, а воздух насыщен древней магией. Кажется, что место наблюдает за вами."
    },

    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "В одном углу храма вы видите мерцающий камень. Его свет притягивает вас, словно зовет внутрь."
    },

    // Четвертая битва (враги сильные, с магией)
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Камень активировал темных стражей, которые охраняют путь. Вы готовы к последней битве?"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Темные стражи вооружены магическими мечами и могут атаковать с силой. Это будет трудный бой!",
        enemy: {
            bundle: BUNDLES.CORE,
            prefab: "prefabs/characters/knight",  // Оставляем тот же префаб
            stats: [
                {
                    category: STAT_CATEGORY.BASE,
                    type: STAT_TYPE_BASE.ATTACK,
                    value: 20
                },
                {
                    category: STAT_CATEGORY.BASE,
                    type: STAT_TYPE_BASE.HEALTH_MAX,
                    value: 120
                },
                {
                    category: STAT_CATEGORY.BASE,
                    type: STAT_TYPE_BASE.HEALTH_CURRENT,
                    value: 120
                }
            ]
        }
    } as INarrativeBlockBattle,

    // Завершающий этап путешествия
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Стражи побеждены, и перед вами открылся главный алтарь храма, полный загадочных символов."
    },

    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "В тот момент, когда вы подошли к алтарю, пространство вокруг вас начало меняться. Магия охватила вас."
    },

    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Вы стоите перед выбором: взять силу божества или оставить её в этом забытом месте навсегда."
    }
];

const MAX_DAY_COUNT_KEY: string = "max_day_count";

export class NarrativeController {
    public onBattle: Delegate<INarrativeBlockBattle> = new Delegate<INarrativeBlockBattle>();

    private readonly _container: NarrativeContainer;

    private _index: number = -1;
    private _currentBlock: INarrativeBlockInfo | undefined;

    private _location: Location;
    private _character: CharacterViewModel;

    private readonly _nextHandler: () => void = this.next.bind(this);
    private readonly _battleHandler: () => void = this.battle.bind(this);

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

        if (this._character.isAlive()) {
            this._character.moveAnimation();
        }

        this._index++;

        if (this._index == NarrativeBlocks.length) {
            this._index = 0;
        }

        if (this.getCurrentDay() > this.getMaxDay()) {
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
        if (!this._currentBlock) {
            throw new Error("Not found narrative block for battle");
        }

        if (this._currentBlock.type !== NARRATIVE_BLOCK_TYPE.BATTLE) {
            throw new Error("Narrative block no correct for battle");
        }

        const battle_block = this._currentBlock as INarrativeBlockBattle;

        this._container.nextButton.node.off(Button.EventType.CLICK, this._battleHandler);

        this.onBattle.invoke(battle_block)
    }
}