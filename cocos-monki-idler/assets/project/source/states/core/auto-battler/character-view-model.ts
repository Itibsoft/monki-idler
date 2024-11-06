import {CharacterModel, IStat, STAT_ATTACK_TYPE, STAT_BASE_TYPE, STAT_CATEGORY} from "./character-model.ts";
import {CharacterView} from "./character-view.ts";
import {BehaviorSubject} from "../../../utils/behaviour-subject.ts";
import {AsyncUtils} from "../../../utils/async-utils.ts";

export enum CHARACTER_ANIMATION_TYPE {
    IDLE = "idle_1",
    WALK = "walk",
    HIT = "hit",
    ATTACK = "sword_attack",
    CRIT_ATTACK = "shield_attack",
    DEAD = "dead"
}

export class CharacterViewModel {
    private _model: CharacterModel;
    private _view: CharacterView;

    public constructor(model: CharacterModel, view: CharacterView) {
        this._model = model;
        this._view = view;

        view.setup(this);

        this._model.getStat(STAT_CATEGORY.BASE, STAT_BASE_TYPE.HEALTH)?.on(value => {
            if(value <= 0) {
                this._view.playAnimation(CHARACTER_ANIMATION_TYPE.DEAD, false);
            }
        })
    }

    public getStats(): IStat[] {
        return this._model.stats;
    }

    public getStat(category: STAT_CATEGORY, type: number): BehaviorSubject<number> | undefined {
        return this._model.getStat(category, type);
    }

    public isAlive(): boolean {
        return this._model.isAlive();
    }

    public takeDamage(damage: number): void {
        this._view.playAnimation(CHARACTER_ANIMATION_TYPE.HIT, false)
        this._view.addHitInfo(damage);

        this._model.takeDamage(damage);
    }

    public async attackAsync(target: CharacterViewModel): Promise<void> {
        const attack_value = this.getStat(STAT_CATEGORY.ATTACK, STAT_BASE_TYPE.ATTACK)?.value || 0;
        const critical_hit_chance = this.getStat(STAT_CATEGORY.ATTACK, STAT_ATTACK_TYPE.CRIT)?.value || 0;

        const is_critical_hit = Math.random() < (critical_hit_chance / 100);
        const damage = is_critical_hit ? attack_value * 2 : attack_value;

        console.log(`Атака: ${attack_value} (Критический удар: ${is_critical_hit})`);

        this._view.playAnimation(is_critical_hit ? CHARACTER_ANIMATION_TYPE.CRIT_ATTACK : CHARACTER_ANIMATION_TYPE.ATTACK, false);

        await AsyncUtils.wait(0.5);

        target.takeDamage(damage);

        await AsyncUtils.wait(0.5);
    }
}