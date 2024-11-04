import {BehaviorSubject} from "../../../utils/behaviour-subject.ts";
import {DebugPanelController} from "../../shared/debug/debug-panel-controller.ts";
import {PanelManager, Services, ServiceType} from "../../../services";

export enum STAT_TYPE {
    NONE = "NONE",
    BASE = "BASE",
    PROTECTIVE = "PROTECTIVE",
    ATTACK = "ATTACK",
    CONTR = "CONTR"
}

export interface IStat {
    type: STAT_TYPE,
    name: string,
    description: string,
    value: BehaviorSubject<number>
}

export class StatsController {
    private readonly _panelManager: PanelManager;
    private declare _debug: DebugPanelController;

    public constructor() {
        this._panelManager = Services.get(ServiceType.PANEL_MANAGER);
    }

    public async initialize(): Promise<void> {
        this._debug = await this._panelManager.LoadPanel(DebugPanelController);

        this._debug.setupStats([
            {
                type: STAT_TYPE.BASE,
                name: "Атака",
                description: "Наносимый персонажем урон",
                value: new BehaviorSubject<number>(100)
            },
            {
                type: STAT_TYPE.BASE,
                name: "Здоровье",
                description: "Максимальное здоровье персонажа",
                value: new BehaviorSubject<number>(100)
            },
            {
                type: STAT_TYPE.BASE,
                name: "Удача",
                description: "Показатель, отвечающий за вероятности в мини-играх аля казино, шанс выпадения более редких мутаций и более благоприятных исходов событий, а также шансы срабатывания всех навыков",
                value: new BehaviorSubject<number>(100)
            },
            {
                type: STAT_TYPE.BASE,
                name: "Критический удар",
                description: "С некоторой вероятностью наносит 200% урона, эта цифра также может быть улучшена",
                value: new BehaviorSubject<number>(100)
            }
        ], [{
            type: STAT_TYPE.BASE,
            name: "Атака",
            description: "Наносимый персонажем урон",
            value: new BehaviorSubject<number>(100)
        },
            {
                type: STAT_TYPE.BASE,
                name: "Здоровье",
                description: "Максимальное здоровье персонажа",
                value: new BehaviorSubject<number>(100)
            },
            {
                type: STAT_TYPE.BASE,
                name: "Удача",
                description: "Показатель, отвечающий за вероятности в мини-играх аля казино, шанс выпадения более редких мутаций и более благоприятных исходов событий, а также шансы срабатывания всех навыков",
                value: new BehaviorSubject<number>(100)
            },
            {
                type: STAT_TYPE.BASE,
                name: "Критический удар",
                description: "С некоторой вероятностью наносит 200% урона, эта цифра также может быть улучшена",
                value: new BehaviorSubject<number>(100)
            }])
    }
}