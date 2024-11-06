import {CharacterViewModel} from "./character-view-model.ts";
import {AsyncUtils} from "../../../utils/async-utils.ts";

export class Battle {
    public readonly characterA: CharacterViewModel;
    public readonly characterB: CharacterViewModel;

    public constructor(characterA: CharacterViewModel, characterB: CharacterViewModel) {
        this.characterA = characterA;
        this.characterB = characterB;
    }

    public async startAsync(): Promise<void> {
        while (this.characterA.isAlive() && this.characterB.isAlive()) {
            await this.round();
        }

        this.declareWinner();
    }

    private async round(): Promise<void> {
        await AsyncUtils.wait(0.3);
        await this.characterA.attackAsync(this.characterB);

        if (this.characterB.isAlive()) {
            await AsyncUtils.wait(0.3);
            await this.characterB.attackAsync(this.characterA);
        }
    }

    private declareWinner(): void {
        if (this.characterA.isAlive()) {
            console.log("Победил Персонаж 1!");
        } else if (this.characterB.isAlive()) {
            console.log("Победил Персонаж 2!");
        } else {
            console.log("Ничья!");
        }
    }
}