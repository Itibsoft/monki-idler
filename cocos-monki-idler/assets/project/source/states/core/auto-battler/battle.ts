import {Character} from "./character.ts";

export class Battle {
    public readonly characterA: Character;
    public readonly characterB: Character;

    public constructor(characterA: Character, characterB: Character) {
        this.characterA = characterA;
        this.characterB = characterB;
    }

    public start(): void {
        while (this.characterA.isAlive() && this.characterB.isAlive()) {
            this.round();
        }
        this.declareWinner();
    }

    private round(): void {
        this.characterA.attack(this.characterB);
        if (this.characterB.isAlive()) {
            this.characterB.attack(this.characterA);
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