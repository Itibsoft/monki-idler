import { SpriteFrame } from "cc";
import {BehaviorSubject} from "../../../../utils/behaviour-subject.ts";

export enum STAT_CATEGORY {
    NONE = 0,
    BASE = 1,
    PROTECTIVE = 2,
    ATTACK = 3,
    CONTR = 4
}

export enum STAT_TYPE_BASE {
    NONE = 0,
    ATTACK = 1,
    HEALTH_MAX = 2,
    HEALTH_CURRENT = 3,
    LUCK = 4,
    DEFENCE = 5,
}

export enum STAT_TYPE_ATTACK {
    NONE = 0,
    CRIT_ATTACK = 1,
    COMBO_ATTACK = 2,
    STUN = 3,
    POISON = 4,
    DISSECT = 5,
    REGEN = 6,
}

export enum STAT_TYPE_PROTECTIVE {
    NONE = 0,
    DODGE = 1,
    CONTR_ATTACK = 2,
    BLOCK = 3,
}

export enum STAT_TYPE_CONTR {
    NONE = 0,
    CONTR_CRIT_ATTACK,
    CONTR_COMBO,
    CONTR_STUN,
    CONTR_POISON,
    CONTR_DISSECT,
    CONTR_DODGE,
    CONTR_CONTR_ATTACK,
    CONTR_BLOCK
}

export interface IStatMetaInfo {
    category: STAT_CATEGORY,
    type: number,
    name: string,
    description: string,
    icon_asset_path: string
}

export interface IStatValueInfo {
    category: STAT_CATEGORY,
    type: number,
    value: number
}

export interface IStat {
    meta: IStatMetaInfo,
    icon: SpriteFrame
    value: BehaviorSubject<number>
}

export interface INegativeEffect {
    category: STAT_CATEGORY,
    type: number,
    value: number

    use(): void,
    isCompleted(): void,
}

export interface IPositiveEffect {
    category: STAT_CATEGORY,
    type: number,
    value: number,

    use(): void,
}




