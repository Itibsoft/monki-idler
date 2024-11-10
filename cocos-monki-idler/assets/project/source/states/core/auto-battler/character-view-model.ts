import {Delegate} from "../../../utils/delegate.ts";
import {CharacterModel} from "./character/character-model.ts";
import {CharacterView} from "./character/character-view.ts";
import {IStat, STAT_CATEGORY, STAT_TYPE_BASE} from "./stats/stats.ts";
import {AsyncUtils} from "../../../utils/async-utils.ts";
import {screen, tween} from "cc";


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

        const health_max =  this._model.getStat(STAT_CATEGORY.BASE, STAT_TYPE_BASE.HEALTH_MAX)!.value;
        const health_current =  this._model.getStat(STAT_CATEGORY.BASE, STAT_TYPE_BASE.HEALTH_CURRENT)!.value;

        this._view.healthBar.setTotalProgress(health_max.value);

        health_max.on(max => {
            this._view.healthBar.setTotalProgress(max);
        });

        health_current.on(current => {
            this._view.healthBar.setCurrentProgress(current);
        });
    }

    public getView(): CharacterView {
        return this._view;
    }

    public getModel(): CharacterModel {
        return this._model;
    }

    public setMovableSceneFlow(is_movable: boolean): void {
        this._view.isMovable = is_movable;
    }

    public getStats(): IStat[] {
        return this._model.stats;
    }

    public getStat(category: STAT_CATEGORY, type: number): IStat | undefined {
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

        this._view.addHitInfo(damage, "negative");

        if(!this._model.isAlive()) {
            await this._view.playAnimationAsync(CHARACTER_ANIMATION_TYPE.DEAD);
            await this._view.fadeAsync();

            this.onDead.invoke(this);

            return;
        }
    }

    public updateTempStats(): void {
        this._model.updateTempStats();
    }

    public async attackAsync(target: CharacterViewModel, access_combo: boolean = true): Promise<void> {
        this._view.node.setSiblingIndex(this._view.node.getSiblingIndex() + 1);

        this._model.regenerateHP();

        const result = this._model.performAttack(target._model);

        this._view.playAnimation(CHARACTER_ANIMATION_TYPE.WALK);

        // Плавно перемещаем персонажа к позиции атаки
        await this.animatePosition(screen.windowSize.x / 2 + 250, 0.1); // 0.5 секунд на перемещение

        const type_anim = result.is_crit ?
            CHARACTER_ANIMATION_TYPE.CRIT_ATTACK :
            CHARACTER_ANIMATION_TYPE.ATTACK;

        await this._view.playAnimationHalfDurationAsync(type_anim);

        await target.takeDamageAsync(result.damage);

        this._view.playAnimation(CHARACTER_ANIMATION_TYPE.WALK);

        // Плавно возвращаем персонажа на исходную позицию
        await this.animatePosition(50, 0.1);

        this._view.playAnimation(CHARACTER_ANIMATION_TYPE.IDLE);

        if(true && access_combo) {
            await target.attackAsync(this, false);
        }

        if(access_combo && result.is_combo && target.isAlive()) {
            await this.attackAsync(target);
        }
    }

    public moveAnimation(): void {
        this._view.playAnimation(CHARACTER_ANIMATION_TYPE.WALK, true);
    }

    public idleAnimation(): void {
        this._view.playAnimation(CHARACTER_ANIMATION_TYPE.IDLE, true);
    }

    public async regenerateHPAsync(): Promise<void> {
        let value = this._model.regenerateHP()

        value = Math.round(value);

        if(value > 0) {
            this._view.addHitInfo(value, "positive");

            await AsyncUtils.wait(0.5);
        }

    }

    public release(): void {
        this._view.node.destroy();
    }

    private animatePosition(targetPosition: number, duration: number): Promise<void> {
        return new Promise((resolve) => {
            const startPosition = this._view.getPosition();

            tween({ position: startPosition })
                .to(duration, { position: targetPosition }, {
                    easing: "linear",
                    onUpdate: (target: {position: number}): void => {
                        this._view.setPosition(target.position);
                    }
                })
                .call(resolve) // Завершаем промис после окончания анимации
                .start();
        });
    }
}