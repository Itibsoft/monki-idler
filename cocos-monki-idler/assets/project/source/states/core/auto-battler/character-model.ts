import {BehaviorSubject} from "../../../utils/behaviour-subject.ts";
import {IStatInfo} from "../narrative/narrative-controller.ts";

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

export type AttackResult = {
    damage: number,
    is_crit: boolean
}

export class CharacterModel {
    public readonly stats: IStat[];

    public constructor(stats: IStatInfo[]) {
        this.stats = [];

        for (const stat of stats) {
            this.stats.push({
                category: stat.category,
                type: stat.type,
                name: stat.name,
                description: stat.description,
                value: new BehaviorSubject<number>(stat.value)
            });
        }
    }

    public getStat(category: STAT_CATEGORY, type: number): BehaviorSubject<number> | undefined {
        return this.stats
            .find(stat => stat.category == category && stat.type == type)
            ?.value;
    }

    public takeDamage(damage: number): void {
        const healthStat = this.getStat(STAT_CATEGORY.BASE, STAT_BASE_TYPE.HEALTH);

        if (healthStat) {
            if(healthStat.value <= 0) {
                return;
            }

            const newHealth = healthStat.value - damage;
            healthStat.next(Math.max(0, newHealth));
            console.log(`Здоровье после урона: ${healthStat.value}`);
        }
    }

    public isAlive(): boolean {
        const stat = this.getStat(STAT_CATEGORY.BASE, STAT_BASE_TYPE.HEALTH);

        if (!stat) {
            return false;
        }

        const health = stat.value;

        return health > 0;
    }

    public attack(_model: CharacterModel): AttackResult {
        const attack_value = this.getStat(STAT_CATEGORY.BASE, STAT_BASE_TYPE.ATTACK)?.value || 0;
        const critical_hit_chance = this.getStat(STAT_CATEGORY.ATTACK, STAT_ATTACK_TYPE.CRIT)?.value || 0;

        const is_critical_hit = Math.random() < (critical_hit_chance / 100);
        const damage = is_critical_hit ? attack_value * 2 : attack_value;

        return {
            damage: damage,
            is_crit: is_critical_hit
        }
    }
}
