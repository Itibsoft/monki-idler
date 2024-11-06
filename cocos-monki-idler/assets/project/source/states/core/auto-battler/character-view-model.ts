import {CharacterModel, IStat, STAT_ATTACK_TYPE, STAT_BASE_TYPE, STAT_CATEGORY} from "./character-model.ts";
import {CharacterView} from "./character-view.ts";
import {BehaviorSubject} from "../../../utils/behaviour-subject.ts";
import {AsyncUtils} from "../../../utils/async-utils.ts";
import {Delegate} from "../../../utils/delegate.ts";

export enum CHARACTER_ANIMATION_TYPE {
    IDLE = "idle_1",
    WALK = "walk",
    HIT = "hit",
    ATTACK = "sword_attack",
    CRIT_ATTACK = "shield_attack",
    DEAD = "dead"
}

export class CharacterViewModel {
    public onDead: Delegate<CharacterViewModel> = new Delegate<CharacterViewModel>();

    private _model: CharacterModel;
    private _view: CharacterView;

    public constructor(model: CharacterModel, view: CharacterView) {
        this._model = model;
        this._view = view;

        view.setup(this);

        const health_stat =  this._model.getStat(STAT_CATEGORY.BASE, STAT_BASE_TYPE.HEALTH)!;

        health_stat.on(this.onHealthChanged.bind(this));
    }

    private async onHealthChanged(health: number): Promise<void> {
        if(health <= 0) {
            await this._view.playAnimationAsync(CHARACTER_ANIMATION_TYPE.DEAD);

            this.onDead.invoke(this);

            return;
        }
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
        this._model.takeDamage(damage);

        this._view.playAnimation(CHARACTER_ANIMATION_TYPE.HIT, false)
        this._view.addHitInfo(damage);
    }

    public async attackAsync(target: CharacterViewModel): Promise<void> {
        const result = this._model.attack(target._model);

        this._view.playAnimation(result.is_crit ? CHARACTER_ANIMATION_TYPE.CRIT_ATTACK : CHARACTER_ANIMATION_TYPE.ATTACK, false);

        await AsyncUtils.wait(0.5);

        target.takeDamage(result.damage);

        await AsyncUtils.wait(0.5);
    }

    public release(): void {
        this._view.node.destroy();
    }
}