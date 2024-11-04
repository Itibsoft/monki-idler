import {HudPanelController} from "../hud/hud-panel-controller.ts";
import {PanelManager, Services, ServiceType} from "../../../services";
import {NarrativeContainer} from "./narrative-container.ts";
import {Button, Color, Sprite} from "cc";
import {AutoBattlerController} from "../auto-battler/auto-battler-controller.ts";
import {Location} from "../location/location.ts";
import {CharacterModel, STAT_ATTACK_TYPE, STAT_BASE_TYPE, STAT_CATEGORY} from "../auto-battler/character-model.ts";
import {BehaviorSubject} from "../../../utils/behaviour-subject.ts";

export enum NARRATIVE_BLOCK_TYPE {
    INFO = "INFO",
    BATTLE = "BATTLE"
}

export enum REWARD_TYPE {
    CURRENCY,
    STAT
}

export interface IRewardInfo {
    type: REWARD_TYPE
}

export interface INarrativeBlockInfo {
    type: NARRATIVE_BLOCK_TYPE,
    text: string,
}

export interface INarrativeBlockDefault extends INarrativeBlockInfo {

}

export interface INarrativeBlockBattle extends INarrativeBlockInfo {

}

export const NarrativeBlocks: INarrativeBlockInfo[] = [
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Вы шли по дороге и увидели голубя. В этот момент вы осознали их божество..."
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Неожиданно на вас напала стая диких птиц, разъяренных вашим присутствием!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Прогуливаясь по лесной тропинке, вы наткнулись на старую заброшенную хижину."
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "С хижины выскочил призрак старого лесника. Он не любит незваных гостей!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Вы вспомнили, что в детстве любили играть с лианами. Это было весело!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Вдруг из-за кустов выскакивает злая белка, готовая отобрать ваш меч!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Увидев гриб в лесу, вы решили его попробовать. Ничего не случилось."
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Гриб оказался ядовитым! Теперь вам нужно сразиться с галлюцинациями!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Вы заметили, что ваши мутации начинают проявляться в виде пушистого хвоста."
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "На вас напал лесной тролль, охраняющий свои сокровища!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Вы нашли странный амулет, который кажется, начинает светиться при вашем прикосновении."
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Случайно ударив мечом по дереву, вы разбудили злого духа леса!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Вы услышали звук, похожий на смех. Неужели лес смеется над вами?"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Перед вами возникли волшебные существа, защищающие свои территории!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Вы обнаружили, что мох на деревьях имеет странный аромат. Он напоминает вам о бананах."
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "На вас напала стая злобных жаб, недовольных вашей наглостью!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Проходя мимо водопада, вы заметили, что он искрится как золото."
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Никто не ожидал, что в водопаде прячется водяной дух, готовый сразиться!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Вы нашли старую карту, на которой отмечены загадочные места в лесу."
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Из-за вашей невнимательности, вы упали в ловушку и теперь сражаетесь с самыми дикими местными зверями!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Вы услышали шепот листвы, который, кажется, подсказывает вам что-то важное."
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Солнышко начало садиться, и ночные хищники решили вас проверить!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Вы встретили мудрого черепаху, которая рассказала вам о тайнах леса."
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Тайна черепахи оказалась не такой простой, и теперь вам предстоит сразиться с её защитниками!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Вы вспомнили анекдот, который заставил вас громко рассмеяться. Лес отозвался эхом."
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Разбудив зверей смехом, вы теперь должны защищаться от их гнева!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Подняв камень с земли, вы поняли, что это был вовсе не камень, а магический артефакт!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Вас атакуют стражи артефакта, и теперь вам нужно сразиться за свою жизнь!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Вы заметили, что в облаках иногда видятся странные фигуры - возможно, это были другие рыцари?"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Облака начали сгуститься, и вы почувствовали, что к вам спешит буря с врагами!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Вы нашли свой старый шлем, который был утерян много лет назад."
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Ваш старый враг, потерявший шлем, вернулся за местью. Сражение неизбежно!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Вдали вы увидели сияющий источник, который манит вас своей магией."
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Когда вы подошли к источнику, вам навстречу вышел водяной страж!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Вы заметили, что ваши мутации становятся все более странными - у вас появились крылья!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Крылья привлекли внимание охотников за головами. Приготовьтесь к бою!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Вы нашли древние руины, в которых скрыты тайны прошлого."
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Однако, как только вы вошли, вас окружили мертвецы, охраняющие эти руины!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Вы увидели тучу, похожую на банан - вам это понравилось!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Пока вы любуетесь облаком, налетели грозовые духи, которые не оценили ваше внимание!"
    },
    {
        type: NARRATIVE_BLOCK_TYPE.INFO,
        text: "Вы вспомнили свою детскую мечту стать великим воином и решились на приключение."
    },
    {
        type: NARRATIVE_BLOCK_TYPE.BATTLE,
        text: "Судьба не ждет, и прямо сейчас вам предстоит сразиться с лесным чудовищем!"
    }
];


export class NarrativeController {
    private readonly _panelManager: PanelManager;
    private declare _hud: HudPanelController;

    private declare _autoBattlerController: AutoBattlerController;

    private declare _container: NarrativeContainer;

    private _index: number = -1;

    private _location: Location;

    private _character: CharacterModel;

    private readonly _nextHandler: () => void =  this.next.bind(this);
    private readonly _battleHandler: () => void =  this.battle.bind(this);

    public constructor() {
        this._panelManager = Services.get(ServiceType.PANEL_MANAGER);
    }

    public async initializeAsync(): Promise<void> {
        this._autoBattlerController = new AutoBattlerController();

        await this._autoBattlerController.initializeAsync();

        this._hud = await this._panelManager.LoadPanel(HudPanelController);

        this._container = this._hud.getNarrativeContainer();

        this._hud.open();

        this._location = new Location();

        const height = this._hud.getNarrativeBlockHeight();

        await this._location.loadAsync({
            hud_height: height,
            location_prefab: "prefabs/forest",
            location_bundle: "forest-location"
        });

        this._character = new CharacterModel([
            {
                category: STAT_CATEGORY.BASE,
                type: STAT_BASE_TYPE.ATTACK,
                name: "Атака",
                description: "Наносимый персонажем урон",
                value: new BehaviorSubject<number>(20)
            },
            {
                category: STAT_CATEGORY.BASE,
                type: STAT_BASE_TYPE.HEALTH,
                name: "Здоровье",
                description: "Максимальное здоровье персонажа",
                value: new BehaviorSubject<number>(100)
            },
            {
                category: STAT_CATEGORY.ATTACK,
                type: STAT_ATTACK_TYPE.CRIT,
                name: "Критический удар",
                description: "С некоторой вероятностью наносит 200% урона, эта цифра также может быть улучшена",
                value: new BehaviorSubject<number>(10)
            }
        ]);

        await this._location.createCharacter(this._character);

        this.next();
    }

    private next(): void {
        this._index++;

        const block = NarrativeBlocks[this._index];

        switch (block.type) {
            case NARRATIVE_BLOCK_TYPE.INFO:
                this._container.nextButtonLabel.string = "Следующий день";

                this._container.nextButton.getComponent(Sprite)!.color = new Color().fromHEX("#76E694");

                this._container.nextButton.node.on(Button.EventType.CLICK, this._nextHandler);
                this._container.nextButton.node.off(Button.EventType.CLICK, this._battleHandler);
                break;
            case NARRATIVE_BLOCK_TYPE.BATTLE:
                this._container.nextButtonLabel.string = "В бой!";

                this._container.nextButton.getComponent(Sprite)!.color = new Color().fromHEX("#E67676");

                this._container.nextButton.node.on(Button.EventType.CLICK, this._battleHandler);
                this._container.nextButton.node.off(Button.EventType.CLICK, this._nextHandler);
                break;
        }

        this._container.add(this._index + 1, block);
    }

    private async battle(): Promise<void> {
        const enemy = new CharacterModel([
            {
                category: STAT_CATEGORY.BASE,
                type: STAT_BASE_TYPE.ATTACK,
                name: "Атака",
                description: "Наносимый персонажем урон",
                value: new BehaviorSubject<number>(20)
            },
            {
                category: STAT_CATEGORY.BASE,
                type: STAT_BASE_TYPE.HEALTH,
                name: "Здоровье",
                description: "Максимальное здоровье персонажа",
                value: new BehaviorSubject<number>(100)
            },
            {
                category: STAT_CATEGORY.ATTACK,
                type: STAT_ATTACK_TYPE.CRIT,
                name: "Критический удар",
                description: "С некоторой вероятностью наносит 200% урона, эта цифра также может быть улучшена",
                value: new BehaviorSubject<number>(10)
            }
        ]);

        await this._location.createEnemy(enemy);

        this._autoBattlerController.startBattle(this._character, enemy);
    }
}