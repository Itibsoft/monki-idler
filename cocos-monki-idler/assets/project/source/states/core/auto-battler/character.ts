import {BehaviorSubject} from "../../../utils/behaviour-subject.ts";

export enum STAT_CATEGORY {
    NONE = 0,
    BASE = 1,
    PROTECTIVE = 2,
    ATTACK = 3,
    CONTR = 4
}

export enum STAT_BASE_TYPE {
    NONE = 0,
    ATTACK = 1,
    HEALTH = 2,
    LUCK = 3
}

export enum STAT_ATTACK_TYPE {
    NONE = 0,
    CRIT = 1
}

export interface IStat {
    category: STAT_CATEGORY,
    type: number,
    name: string,
    description: string,
    value: BehaviorSubject<number>
}

export class Character {
    public readonly stats: IStat[];

    public constructor(stats: IStat[]) {
        this.stats = stats;
    }

    public getStat(category: STAT_CATEGORY, type: number): BehaviorSubject<number> | undefined {
        return this.stats
            .find(stat => stat.category == category && stat.type == type)
            ?.value;
    }

    public attack(opponent: Character): void {
        const attackValue = this.getStat(STAT_CATEGORY.ATTACK, STAT_BASE_TYPE.ATTACK)?.value || 0;
        const criticalHitChance = this.getStat(STAT_CATEGORY.ATTACK, STAT_ATTACK_TYPE.CRIT)?.value || 0;

        const isCriticalHit = Math.random() < (criticalHitChance / 100);
        const damage = isCriticalHit ? attackValue * 2 : attackValue;

        console.log(`Атака: ${this.getStat(STAT_CATEGORY.BASE, STAT_BASE_TYPE.ATTACK)?.value} (Критический удар: ${isCriticalHit})`);
        opponent.takeDamage(damage);
    }

    public takeDamage(damage: number): void {
        const healthStat = this.getStat(STAT_CATEGORY.BASE, STAT_BASE_TYPE.HEALTH);
        if (healthStat) {
            const newHealth = healthStat.value - damage;
            healthStat.next(Math.max(0, newHealth));
            console.log(`Здоровье после урона: ${healthStat.value}`);
        }
    }

    public isAlive(): boolean {
        const stat = this.getStat(STAT_CATEGORY.BASE, STAT_BASE_TYPE.HEALTH);

        if(!stat) {
            return false;
        }

        const health =  stat.value;

        return health > 0;
    }
}

/*
* [
            {
                category: STAT_CATEGORY.BASE,
                type: STAT_BASE_TYPE.ATTACK,
                name: "Атака",
                description: "Наносимый персонажем урон",
                value: new BehaviorSubject<number>(100)
            },
            {
                category: STAT_CATEGORY.BASE,
                type: STAT_BASE_TYPE.HEALTH,
                name: "Здоровье",
                description: "Максимальное здоровье персонажа",
                value: new BehaviorSubject<number>(100)
            },
            {
                category: STAT_CATEGORY.BASE,
                type: STAT_BASE_TYPE.LUCK,
                name: "Удача",
                description: "Показатель, отвечающий за вероятности в мини-играх аля казино, шанс выпадения более редких мутаций и более благоприятных исходов событий, а также шансы срабатывания всех навыков",
                value: new BehaviorSubject<number>(100)
            },
            {
                category: STAT_CATEGORY.ATTACK,
                type: STAT_ATTACK_TYPE.CRIT,
                name: "Критический удар",
                description: "С некоторой вероятностью наносит 200% урона, эта цифра также может быть улучшена",
                value: new BehaviorSubject<number>(100)
            }
        ]*/
