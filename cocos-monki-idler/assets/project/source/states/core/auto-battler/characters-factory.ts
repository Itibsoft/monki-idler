import {CHARACTER_TYPE, CharacterModel} from "./character-model.ts";
import {CharacterViewModel} from "./character-view-model.ts";
import {IStat, IStatValueInfo} from "./stats.ts";
import {StatsFactory} from "./stats-factory.ts";
import {AssetsBundleManager, BUNDLES, IService, Services, ServiceType} from "../../../services";
import {CharacterView} from "./character-view.ts";
import {instantiate} from "cc";

export class CharactersFactory implements IService {
    public readonly type: ServiceType = ServiceType.CHARACTERS_FACTORY;

    private readonly _statsFactory: StatsFactory;
    private readonly _assets: AssetsBundleManager;

    public constructor() {
        this._statsFactory = Services.get(ServiceType.STATS_FACTORY);
        this._assets = Services.get(ServiceType.ASSET_BUNDLE_MANAGER);

        Services.add(this);
    }

    public async createAsync(character_type: CHARACTER_TYPE, stats_value_info: IStatValueInfo[]): Promise<CharacterViewModel> {
        const stats: IStat[] = [];

        for (const info of stats_value_info) {
            const stat = this._statsFactory.create(info);

            if(!stat) {
                console.error(`Not found stat for ${info.category} - ${info.type}`);
                continue;
            }

            stats.push(stat);
        }

        const model = new CharacterModel(stats, []);

        const core_bundle = await this._assets.loadBundle(BUNDLES.CORE);

        const character_prefab = await core_bundle!.loadPrefab(character_type);

        const instance = instantiate(character_prefab);

        const view = instance.getComponent(CharacterView)!;

        return new CharacterViewModel(model, view);
    }
}