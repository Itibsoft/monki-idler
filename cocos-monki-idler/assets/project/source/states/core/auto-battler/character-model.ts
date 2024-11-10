import {BehaviorSubject} from "../../../utils/behaviour-subject.ts";
import {IMutation} from "./mutations.ts";
import {IStat, STAT_CATEGORY, STAT_TYPE_ATTACK, STAT_TYPE_BASE} from "./stats.ts";

export type AttackResult = {
    damage: number,
    is_crit: boolean
}

export enum CHARACTER_TYPE {
    KNIGHT = "prefabs/characters/knight"
}

export class CharacterModel {
    public readonly stats: IStat[];
    public readonly mutations: IMutation[];

    public constructor(stats: IStat[], mutations: IMutation[]) {
        this.stats = stats;
        this.mutations = mutations;
    }

    public getStat(category: STAT_CATEGORY, type: number): BehaviorSubject<number> | undefined {
        return this.stats
            .find(stat => stat.meta.category == category && stat.meta.type == type)
            ?.value;
    }

    public takeDamage(damage: number): void {
        const healthStat = this.getStat(STAT_CATEGORY.BASE, STAT_TYPE_BASE.HEALTH);

        if (healthStat) {
            if (healthStat.value <= 0) {
                return;
            }

            const newHealth = healthStat.value - damage;
            healthStat.next(Math.max(0, newHealth));
            console.log(`Здоровье после урона: ${healthStat.value}`);
        }
    }

    public isAlive(): boolean {
        const stat = this.getStat(STAT_CATEGORY.BASE, STAT_TYPE_BASE.HEALTH);

        if (!stat) {
            return false;
        }

        const health = stat.value;

        return health > 0;
    }

    public attack(_model: CharacterModel): AttackResult {
        const attack_value = this.getStat(STAT_CATEGORY.BASE, STAT_TYPE_BASE.ATTACK)?.value || 0;
        const critical_hit_chance = this.getStat(STAT_CATEGORY.ATTACK, STAT_TYPE_ATTACK.CRIT_ATTACK)?.value || 0;

        const is_critical_hit = Math.random() < (critical_hit_chance / 100);
        const damage = is_critical_hit ? attack_value * 2 : attack_value;

        return {
            damage: damage,
            is_crit: is_critical_hit
        }
    }
}
