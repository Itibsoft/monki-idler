import {BehaviorSubject} from "../../../../utils/behaviour-subject.ts";
import {IMutation} from "../mutations/mutations.ts";
import {
    INegativeEffect,
    IStat,
    STAT_CATEGORY,
    STAT_TYPE_ATTACK,
    STAT_TYPE_BASE,
    STAT_TYPE_CONTR, STAT_TYPE_PROTECTIVE
} from "../stats/stats.ts";
import {MATH_CLAMP} from "../../../../utils/math-utils.ts";

export type AttackResult = {
    damage: number,
    is_crit: boolean,
    is_stunned: boolean,
    is_dissected: boolean,
    is_combo: boolean,
    is_contr_attack: boolean,
}

export enum CHARACTER_TYPE {
    KNIGHT = "prefabs/characters/knight"
}

export class CharacterModel {
    public readonly stats: IStat[];
    public readonly mutations: IMutation[];

    public tempStats: IStat[] = [];

    public constructor(stats: IStat[], mutations: IMutation[]) {
        this.stats = stats;
        this.mutations = mutations;
    }

    public updateTempStats(): void {
        this.tempStats = [];

        const combo_stat = this.getStat(STAT_CATEGORY.ATTACK, STAT_TYPE_ATTACK.COMBO_ATTACK);

        if (combo_stat) {
            this.tempStats.push({
                meta: combo_stat.meta,
                icon: combo_stat.icon,
                value: new BehaviorSubject(combo_stat.value.value)
            })
        }
    }

    public getStat(category: STAT_CATEGORY, type: number): IStat | undefined {
        return this.stats
            .find(stat => stat.meta.category == category && stat.meta.type == type);
    }

    public getTempStat(category: STAT_CATEGORY, type: number): IStat | undefined {
        return this.tempStats
            .find(stat => stat.meta.category == category && stat.meta.type == type);
    }

    public takeDamage(damage: number): void {
        const health_current = this.getStat(STAT_CATEGORY.BASE, STAT_TYPE_BASE.HEALTH_CURRENT);
        const health_max = this.getStat(STAT_CATEGORY.BASE, STAT_TYPE_BASE.HEALTH_MAX)!;

        if (health_current) {
            if (health_current.value.value <= 0) {
                return;
            }

            const current = MATH_CLAMP(health_current.value.value - damage, 0, health_max.value.value);

            health_current.value.next(Math.max(0, current));
            console.log(`Здоровье после урона: ${health_current.value}`);
        }
    }

    public isAlive(): boolean {
        const stat = this.getStat(STAT_CATEGORY.BASE, STAT_TYPE_BASE.HEALTH_CURRENT);

        if (!stat) {
            return false;
        }

        const health = stat.value;

        return health.value > 0;
    }

    public isCriticalHit(enemy: CharacterModel): boolean {
        const crit_chance = this.getStat(STAT_CATEGORY.ATTACK, STAT_TYPE_ATTACK.CRIT_ATTACK)?.value.value || 0;
        const enemy_crit_contr = enemy.getStat(STAT_CATEGORY.CONTR, STAT_TYPE_CONTR.CONTR_CRIT_ATTACK)?.value.value || 0;
        const finalCritChance = MATH_CLAMP(crit_chance - enemy_crit_contr, 0, 100);
        return Math.random() < (finalCritChance / 100);
    }

    public isStun(enemy: CharacterModel): boolean {
        const stunChance = this.getStat(STAT_CATEGORY.ATTACK, STAT_TYPE_ATTACK.STUN)?.value.value || 0;
        const enemyStunContr = enemy.getStat(STAT_CATEGORY.CONTR, STAT_TYPE_CONTR.CONTR_STUN)?.value.value || 0;
        const finalStunChance = MATH_CLAMP(stunChance - enemyStunContr, 0, 100);
        return Math.random() < (finalStunChance / 100);
    }

    public isDissect(enemy: CharacterModel): boolean {
        const dissectChance = this.getStat(STAT_CATEGORY.ATTACK, STAT_TYPE_ATTACK.DISSECT)?.value.value || 0;
        const enemyDissectContr = enemy.getStat(STAT_CATEGORY.CONTR, STAT_TYPE_CONTR.CONTR_DISSECT)?.value.value || 0;
        const finalDissectChance = MATH_CLAMP(dissectChance - enemyDissectContr, 0, 100);
        return Math.random() < (finalDissectChance / 100);
    }

    public isComboAttack(enemy: CharacterModel): boolean {
        const comboChance = this.getTempStat(STAT_CATEGORY.ATTACK, STAT_TYPE_ATTACK.COMBO_ATTACK)?.value.value || 0;
        const enemyComboContr = enemy.getStat(STAT_CATEGORY.CONTR, STAT_TYPE_CONTR.CONTR_COMBO)?.value.value || 0;
        const finalComboChance = MATH_CLAMP(comboChance - enemyComboContr, 0, 100);
        return Math.random() < (finalComboChance / 100);
    }

    public isContrAttack(enemy: CharacterModel): boolean {
        const contra_attack_chance = enemy.getStat(STAT_CATEGORY.PROTECTIVE, STAT_TYPE_PROTECTIVE.CONTR_ATTACK)?.value.value || 0;

        return Math.random() < (contra_attack_chance / 100);
    }

    public pushNegativeEffect(effect: INegativeEffect): void {

    }

    public performAttack(enemy: CharacterModel): AttackResult {
        const attackValue = this.getStat(STAT_CATEGORY.BASE, STAT_TYPE_BASE.ATTACK)?.value.value || 0;

        const isCriticalHit = this.isCriticalHit(enemy);
        let damage = isCriticalHit ? attackValue * 2 : attackValue;

        const defence_stat = enemy.getStat(STAT_CATEGORY.BASE, STAT_TYPE_BASE.DEFENCE)?.value.value || 0;

        damage = MATH_CLAMP(damage - defence_stat, 0, Number.MAX_VALUE);

        const isStunned = this.isStun(enemy);
        const isDissected = this.isDissect(enemy);
        const isCombo = this.isComboAttack(enemy);
        const isContrAttack = this.isContrAttack(enemy);

        if (isCombo) {
            const combo_stat = this.getTempStat(STAT_CATEGORY.ATTACK, STAT_TYPE_ATTACK.COMBO_ATTACK)!;

            const new_combo_value = combo_stat.value.value / 2;

            console.log(new_combo_value);

            combo_stat.value.next(new_combo_value);
        }

        return {
            damage: damage,
            is_crit: isCriticalHit,
            is_stunned: isStunned,
            is_dissected: isDissected,
            is_combo: isCombo,
            is_contr_attack: isContrAttack
        };
    }

    public regenerateHP(): number {
        const health_value = this.getStat(STAT_CATEGORY.ATTACK, STAT_TYPE_ATTACK.REGEN)?.value.value || 0;

        const health_current = this.getStat(STAT_CATEGORY.BASE, STAT_TYPE_BASE.HEALTH_CURRENT)!.value;
        const health_max = this.getStat(STAT_CATEGORY.BASE, STAT_TYPE_BASE.HEALTH_MAX)!.value;

        if (health_current.value === health_max.value) {
            return 0;
        }

        const add_health = health_current.value * health_value / 100;

        const current = MATH_CLAMP(health_current.value + add_health, 0, health_max.value);

        health_current.next(current);

        return add_health;
    }
}
