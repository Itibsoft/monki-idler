import {IStatValueInfo, STAT_CATEGORY, STAT_TYPE_ATTACK} from "./stats.ts";

export enum MUTATION_CATEGORY {
    INTELLECTUAL = "INTELLECTUAL"
}

export enum MUTATION_TYPE {
    INSIGHT = "INSIGHT",
}

export interface IMutation {
    category: MUTATION_CATEGORY,
    type: MUTATION_TYPE,
    name: string,
    description: string,
    stats: IStatValueInfo[]
}

export interface IMutationInfo {
    category: MUTATION_CATEGORY,
    type: MUTATION_TYPE,
    name: string,
    description: string,
    stats: IStatValueInfo[]
}

export const Mutations: IMutationInfo[] = [{
    category: MUTATION_CATEGORY.INTELLECTUAL,
    type: MUTATION_TYPE.INSIGHT,
    name: "",
    description: "",
    stats: [
        {
            category: STAT_CATEGORY.ATTACK,
            type: STAT_TYPE_ATTACK.CRIT_ATTACK,
            value: 25
        }
    ]
}]