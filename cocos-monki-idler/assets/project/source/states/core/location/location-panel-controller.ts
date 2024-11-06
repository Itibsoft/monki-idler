import { Prefab, Vec3, Widget } from "cc";
import {BUNDLES, PANEL_TYPE, PanelControllerBase, PanelMeta} from "../../../services";
import {LocationPanel} from "./location-panel.ts";
import {CharacterView} from "../auto-battler/character-view.ts";

export class LocationPanelController extends PanelControllerBase<LocationPanel> {
    public readonly meta: PanelMeta = {
        type: PANEL_TYPE.WINDOW,
        order: 0,
        bundle: BUNDLES.CORE,
        asset_path: "ui/location-panel"
    };

    private declare _roadHeight: number;

    public constructor() {
        super();
    }

    async initialize(): Promise<void> {
        return super.initialize();
    }

    public setLocationPrefab(prefab: Prefab): void {
        this.panel.setup(prefab);
    }

    public setBackgroundBottom(height: number): void {
        this._roadHeight = height + 320;

        this.panel.backgroundWidget.bottom = height;
        this.panel.backgroundWidget.updateAlignment();

        this.panel.charactersWidget.bottom = this._roadHeight;
        this.panel.charactersWidget.updateAlignment();
    }

    public setCharacterLeft(character: CharacterView): void {
        character.node.setParent(this.panel.charactersWidget.node);

        character.widget.isAlignLeft = true;
        character.widget.left = 50;

        this.panel.character = character;
    }

    public setCharacterRight(character: CharacterView): void {
        character.node.setParent(this.panel.charactersWidget.node);

        character.widget.isAlignRight = true;
        character.widget.right = -1000;

        character.spine.node.scale = new Vec3(-character.node.scale.x, character.node.scale.y, character.node.scale.z);

        this.panel.enemies.push(character);
    }
}