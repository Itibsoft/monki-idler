import {CharacterModel, IStat, STAT_BASE_TYPE, STAT_CATEGORY} from "./character-model.ts";
import {CharacterView} from "./character-view.ts";
import {BehaviorSubject} from "../../../utils/behaviour-subject.ts";
import {Delegate} from "../../../utils/delegate.ts";

export enum CHARACTER_ANIMATION_TYPE {
    IDLE = "idle_1",
    WALK = "walk",
    HIT = "hit",
    ATTACK = "sword_attack",
    CRIT_ATTACK = "shield_attack",
    DEAD = "dead"
}

const TRACK_ID: Map<CHARACTER_ANIMATION_TYPE, number> = new Map([
   [CHARACTER_ANIMATION_TYPE.IDLE, 0],
   [CHARACTER_ANIMATION_TYPE.WALK, 1],
   [CHARACTER_ANIMATION_TYPE.HIT, 2],
   [CHARACTER_ANIMATION_TYPE.ATTACK, 3],
   [CHARACTER_ANIMATION_TYPE.CRIT_ATTACK, 4],
   [CHARACTER_ANIMATION_TYPE.DEAD, 5],
])


export class CharacterViewModel {
    public onDead: Delegate<CharacterViewModel> = new Delegate<CharacterViewModel>();

    private _model: CharacterModel;
    private _view: CharacterView;

    public constructor(model: CharacterModel, view: CharacterView) {
        this._model = model;
        this._view = view;

        view.setup(this);

        const health_stat =  this._model.getStat(STAT_CATEGORY.BASE, STAT_BASE_TYPE.HEALTH)!;

        const max_health = this.getStat(STAT_CATEGORY.BASE, STAT_BASE_TYPE.HEALTH)?.value ?? 0;

        this._view.healthBar.setTotalProgress(max_health);

        health_stat.on(health => {
            this._view.healthBar.setCurrentProgress(health);
        });
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

    public async takeDamageAsync(damage: number): Promise<void> {
        if(!this.isAlive()) {
            return;
        }

        this._model.takeDamage(damage);

        await this._view.playAnimationHalfDurationAsync(CHARACTER_ANIMATION_TYPE.HIT);

        this._view.addHitInfo(damage);

        if(!this._model.isAlive()) {
            await this._view.playAnimationAsync(CHARACTER_ANIMATION_TYPE.DEAD);
            await this._view.fadeAsync();

            this.onDead.invoke(this);

            return;
        }
    }

    public async attackAsync(target: CharacterViewModel): Promise<void> {
        const result = this._model.attack(target._model);

        const type_anim = result.is_crit ?
            CHARACTER_ANIMATION_TYPE.CRIT_ATTACK :
            CHARACTER_ANIMATION_TYPE.ATTACK;

        await this._view.playAnimationHalfDurationAsync(type_anim);

        await target.takeDamageAsync(result.damage);
    }

    public move(): void {
        this._view.playAnimation(CHARACTER_ANIMATION_TYPE.WALK, true);
    }

    public release(): void {
        this._view.node.destroy();
    }
}