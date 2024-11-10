import {SpriteAtlas} from "cc";

import {BehaviorSubject} from "../../../utils/behaviour-subject.ts";

import {
    IStat,
    IStatMetaInfo,
    IStatValueInfo,
    STAT_CATEGORY,
    STAT_TYPE_ATTACK,
    STAT_TYPE_BASE,
    STAT_TYPE_CONTR,
    STAT_TYPE_PROTECTIVE
} from "./stats.ts";

import {AssetsBundle, AssetsBundleManager, BUNDLES, IService, Services, ServiceType} from "../../../services";

const STATS_ICONS_ATLAS_PATH: string = "sprites/stats-icons/texture";

export class StatsFactory implements IService {
    public readonly type: ServiceType = ServiceType.STATS_FACTORY;

    private readonly _assets: AssetsBundleManager;

    private readonly _meta: Map<STAT_CATEGORY, Map<number, IStatMetaInfo>>;
    private declare _statsAtlas: SpriteAtlas;

    public constructor() {
        this._assets = Services.get(ServiceType.ASSET_BUNDLE_MANAGER);

        this._meta = new Map<STAT_CATEGORY, Map<number, IStatMetaInfo>>();

        Services.add(this);
    }

    public async initializeAsync(): Promise<void> {
        const stats_meta: IStatMetaInfo[] = [
            //Base stats
            {
                category: STAT_CATEGORY.BASE,
                type: STAT_TYPE_BASE.HEALTH,
                name: "Здоровье",
                description: "Максимальное здоровье персонажа",
                icon_asset_path: "stats-icons/icon_1"
            },
            {
                category: STAT_CATEGORY.BASE,
                type: STAT_TYPE_BASE.ATTACK,
                name: "Атака",
                description: "Наносимый персонажем урон",
                icon_asset_path: "stats-icons/icon_2"
            },
            {
                category: STAT_CATEGORY.BASE,
                type: STAT_TYPE_BASE.LUCK,
                name: "Удача",
                description: "Показатель, отвечающий за вероятности, а также шансы срабатывания всех навыков",
                icon_asset_path: "stats-icons/icon_3"
            },

            //Attack stats
            {
                category: STAT_CATEGORY.ATTACK,
                type: STAT_TYPE_ATTACK.CRIT_ATTACK,
                name: "Критический удар",
                description: "С некоторой вероятностью наносит 200% урона, эта цифра также может быть улучшена",
                icon_asset_path: "stats-icons/icon_4"
            },
            {
                category: STAT_CATEGORY.ATTACK,
                type: STAT_TYPE_ATTACK.COMBO_ATTACK,
                name: "Комбо атака",
                description: "Шанс повторного удара, после каждого повторного удара в одном раунде % уменьшается вдвое.",
                icon_asset_path: "stats-icons/icon_1"
            },
            {
                category: STAT_CATEGORY.ATTACK,
                type: STAT_TYPE_ATTACK.DISSECT,
                name: "Рассечение",
                description: "Шанс нанести кровотечение, в течение 3х ходов отнимающее 5% здоровья противника",
                icon_asset_path: "stats-icons/icon_1"
            },
            {
                category: STAT_CATEGORY.ATTACK,
                type: STAT_TYPE_ATTACK.REGEN,
                name: "Регенерация",
                description: "Каждый раунд восстанавливает % здоровья",
                icon_asset_path: "stats-icons/icon_1"
            },
            {
                category: STAT_CATEGORY.ATTACK,
                type: STAT_TYPE_ATTACK.STUN,
                name: "Оглушение",
                description: "Шанс заставить соперника пропустить свой ход",
                icon_asset_path: "stats-icons/icon_1"
            },
            {
                category: STAT_CATEGORY.ATTACK,
                type: STAT_TYPE_ATTACK.POISON,
                name: "Отравление",
                description: "Шанс наложить отравление, которое в течение 3х раундов в начале хода противника будет наносить ему 5% от макс. здоровья.",
                icon_asset_path: "stats-icons/icon_1"
            },

            //Protective stats
            {
                category: STAT_CATEGORY.PROTECTIVE,
                type: STAT_TYPE_PROTECTIVE.CONTR_ATTACK,
                name: "Контратака",
                description: "При получении прямой атаки наносит ответную атаку, на которой не срабатывает шанс комбо атаки, если нет такой мутации.",
                icon_asset_path: "stats-icons/icon_1"
            },
            {
                category: STAT_CATEGORY.PROTECTIVE,
                type: STAT_TYPE_PROTECTIVE.BLOCK,
                name: "Блокирование",
                description: "Шанс заблокировать % от входящего урона",
                icon_asset_path: "stats-icons/icon_1"
            },
            {
                category: STAT_CATEGORY.PROTECTIVE,
                type: STAT_TYPE_PROTECTIVE.DODGE,
                name: "Уворот",
                description: "Уворот позволяет полностью избежать урона",
                icon_asset_path: "stats-icons/icon_1"
            },

            // Contr stats
            {
                category: STAT_CATEGORY.CONTR,
                type: STAT_TYPE_CONTR.CONTR_CRIT_ATTACK,
                name: "Контркрит",
                description: "Снижает вероятность получения критического урона от атак противника.",
                icon_asset_path: "stats-icons/icon_1"
            },
            {
                category: STAT_CATEGORY.CONTR,
                type: STAT_TYPE_CONTR.CONTR_COMBO,
                name: "Контркомбо",
                description: "Снижает вероятность того, что противник сможет нанести последовательные атаки (комбо) по персонажу.",
                icon_asset_path: "stats-icons/icon_1"
            },
            {
                category: STAT_CATEGORY.CONTR,
                type: STAT_TYPE_CONTR.CONTR_STUN,
                name: "Контроглушение",
                description: "Снижает шанс оглушения, защищая персонажа от пропуска хода при удачной атаке противника.",
                icon_asset_path: "stats-icons/icon_1"
            },
            {
                category: STAT_CATEGORY.CONTR,
                type: STAT_TYPE_CONTR.CONTR_POISON,
                name: "Сопротивление отравлению",
                description: "Снижает вероятность наложения эффекта отравления, уменьшая урон от яда.",
                icon_asset_path: "stats-icons/icon_1"
            },
            {
                category: STAT_CATEGORY.CONTR,
                type: STAT_TYPE_CONTR.CONTR_DISSECT,
                name: "Сопротивление кровотечению",
                description: "Снижает вероятность получения эффекта кровотечения от атак противника, сокращая постепенную потерю здоровья.",
                icon_asset_path: "stats-icons/icon_1"
            },
            {
                category: STAT_CATEGORY.CONTR,
                type: STAT_TYPE_CONTR.CONTR_DODGE,
                name: "Контруворот",
                description: "Снижает шанс уклонения противника от атак персонажа, увеличивая вероятность успешного попадания.",
                icon_asset_path: "stats-icons/icon_1"
            },
            {
                category: STAT_CATEGORY.CONTR,
                type: STAT_TYPE_CONTR.CONTR_CONTR_ATTACK,
                name: "Контрконтратака",
                description: "Снижает вероятность получения урона от контратак противника при собственных атаках.",
                icon_asset_path: "stats-icons/icon_1"
            },
            {
                category: STAT_CATEGORY.CONTR,
                type: STAT_TYPE_CONTR.CONTR_BLOCK,
                name: "Контрблок",
                description: "Уменьшает шанс того, что противник сможет заблокировать атаки персонажа.",
                icon_asset_path: "stats-icons/icon_1"
            }
        ];

        for (const meta of stats_meta) {
            if (!this._meta.has(meta.category)) {
                const type_map: Map<number, IStatMetaInfo> = new Map<number, IStatMetaInfo>();
                type_map.set(meta.type, meta);
                this._meta.set(meta.category, type_map);
                continue;
            }

            const type_map = this._meta.get(meta.category)!;
            type_map.set(meta.type, meta);
        }

        const core_bundle = await this._assets.loadBundle(BUNDLES.CORE) as AssetsBundle;

        this._statsAtlas = await core_bundle.loadSpriteAtlas(STATS_ICONS_ATLAS_PATH);
    }

    public create(info: IStatValueInfo): IStat | undefined {
        const categoryMeta = this._meta.get(info.category);

        if (!categoryMeta) {
            console.error(`Category ${info.category} not found.`);
            return undefined;
        }

        const metaInfo = categoryMeta.get(info.type);

        if (!metaInfo) {
            console.error(`Type ${info.type} not found for category ${info.category}.`);
            return undefined;
        }

        const stat_icon = this._statsAtlas.getSpriteFrame(metaInfo.icon_asset_path);

        if (!stat_icon) {
            console.error(`Type ${info.type} not found stat icon: ${metaInfo.icon_asset_path}.`);
            return undefined;
        }

        return {
            meta: metaInfo,
            icon: stat_icon,
            value: new BehaviorSubject<number>(info.value)
        };
    }
}