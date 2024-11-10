import {INegativeEffect, STAT_CATEGORY} from "../stats/stats.ts";
import {CharacterViewModel} from "../character-view-model.ts";

export class StunNegativeEffect implements INegativeEffect {
    public category: STAT_CATEGORY;
    public type: number;
    public value: number;

    private readonly _character: CharacterViewModel;

    private _currentValue: number;

    public constructor(character: CharacterViewModel, count_round: number) {
        this._character = character;
        this.value = count_round;
    }

    public use(): void {
        this._currentValue++;
    }

    public isCompleted(): boolean {
        return this._currentValue >= this.value;
    }

}