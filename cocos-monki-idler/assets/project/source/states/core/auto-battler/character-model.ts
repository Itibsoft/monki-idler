import {BehaviorSubject} from "../../../utils/behaviour-subject.ts";

export enum STAT_CATEGORY {
    NONE = 0,
    BASE = 1,
    PROTECTIVE = 2,
    ATTACK = 3,
    CONTR = 4
}

export enum STAT_BASE_TYPE {
    NONE = 0,
    ATTACK = 1,
    HEALTH = 2,
    LUCK = 3
}

export enum STAT_ATTACK_TYPE {
    NONE = 0,
    CRIT = 1
}

export interface IStat {
    category: STAT_CATEGORY,
    type: number,
    name: string,
    description: string,
    value: BehaviorSubject<number>
}

export class CharacterModel {
    public readonly stats: IStat[];

    public constructor(stats: IStat[]) {
        this.stats = stats;
    }

    public getStat(category: STAT_CATEGORY, type: number): BehaviorSubject<number> | undefined {
        return this.stats
            .find(stat => stat.category == category && stat.type == type)
            ?.value;
    }

    public takeDamage(damage: number): void {
        const healthStat = this.getStat(STAT_CATEGORY.BASE, STAT_BASE_TYPE.HEALTH);
        if (healthStat) {
            const newHealth = healthStat.value - damage;
            healthStat.next(Math.max(0, newHealth));
            console.log(`Здоровье после урона: ${healthStat.value}`);
        }
    }

    public isAlive(): boolean {
        const stat = this.getStat(STAT_CATEGORY.BASE, STAT_BASE_TYPE.HEALTH);

        if(!stat) {
            return false;
        }

        const health =  stat.value;

        return health > 0;
    }
}
