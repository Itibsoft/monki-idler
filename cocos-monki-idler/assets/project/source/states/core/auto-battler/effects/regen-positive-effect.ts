import {IPositiveEffect, STAT_CATEGORY} from "../stats/stats.ts";
import {CharacterViewModel} from "../character-view-model.ts";

export class RegenPositiveEffect implements IPositiveEffect {
    public category: STAT_CATEGORY;
    public type: number;
    public value: number;

    private readonly _character: CharacterViewModel;

    public constructor(character: CharacterViewModel) {
        this._character = character;
    }

    public use(): void {
       this
    }

}