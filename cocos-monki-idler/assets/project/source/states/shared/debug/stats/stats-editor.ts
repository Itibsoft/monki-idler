import {_decorator, Button, Component, Node, Prefab, instantiate, Sprite, Color} from "cc";
import {IStat} from "../../../core/auto-battler/StatsController.ts";
import {StatItem} from "./stat-item.ts";

const GRAY: string = "#BBBBBB";
const GREEN: string = "#A5CF7E";

@_decorator.ccclass("StatsEditor")
export class StatsEditor extends Component {
    @_decorator.property(Prefab) public statItemPrefab: Prefab;
    @_decorator.property(Node) public statsContainer: Node;
    @_decorator.property(Button) public playerStatsButton: Button;
    @_decorator.property(Button) public enemyStatsButton: Button;

    @_decorator.property(Sprite) public playerStatsSprite: Sprite;
    @_decorator.property(Sprite) public enemyStatsSprite: Sprite;

    private _statItems: StatItem[] = [];

    private _playerStats: IStat[] = [];
    private _enemyStats: IStat[] = []

    protected start(): void {
        this.playerStatsButton.node.on(Button.EventType.CLICK, () => {
            this.setStats(this._playerStats);

            this.enemyStatsSprite.color = new Color().fromHEX(GRAY);
            this.playerStatsSprite.color = new Color().fromHEX(GREEN);
        });

        this.enemyStatsButton.node.on(Button.EventType.CLICK, () => {
            this.setStats(this._enemyStats);

            this.enemyStatsSprite.color = new Color().fromHEX(GREEN);
            this.playerStatsSprite.color = new Color().fromHEX(GRAY);
        });
    }

    public setup(player_stats: IStat[], enemy_stats: IStat[]): void {
        this._playerStats = player_stats;
        this._enemyStats = enemy_stats;

        this.enemyStatsSprite.color = new Color().fromHEX(GRAY);
        this.playerStatsSprite.color = new Color().fromHEX(GREEN);

        this.setStats(this._playerStats);
    }

    private setStats(stats: IStat[]): void {
        for (const stat_item of this._statItems) {
            stat_item.node.destroy();
        }

        this._statItems = [];

        for (const stat of stats) {
            this.createStatItem(stat);
        }
    }

    private createStatItem(stat: IStat): void {
        const instance = instantiate(this.statItemPrefab);

        instance.setParent(this.statsContainer);

        const stat_item = instance.getComponent(StatItem)!;

        stat_item.setup(stat);

        this._statItems.push(stat_item)
    }
}