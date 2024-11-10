import { Prefab, Vec3, Widget } from "cc";
import {BUNDLES, PANEL_TYPE, PanelControllerBase, PanelMeta} from "../../../services";
import {LocationPanel} from "./location-panel.ts";
import {CharacterView} from "../auto-battler/character/character-view.ts";
import {BehaviorSubject} from "../../../utils/behaviour-subject.ts";

export enum LOCATION_OBJECT_MOVE_TYPE {
    LEFT,
    RIGHT
}

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

    public setLocationPrefab(prefab: Prefab, isMove: BehaviorSubject<boolean>, speed: BehaviorSubject<number>): void {
        this.panel.setup(prefab, isMove, speed);
    }

    public setBackgroundBottom(height: number): void {
        this._roadHeight = height + 320;

        this.panel.backgroundWidget.bottom = height;
        this.panel.backgroundWidget.updateAlignment();

        this.panel.objectsWidget.bottom = this._roadHeight;
        this.panel.objectsWidget.updateAlignment();
    }

    public setCharacterLeft(character: CharacterView): void {
        character.node.setParent(this.panel.objectsWidget.node);

        character.setupTypeMove(LOCATION_OBJECT_MOVE_TYPE.LEFT);

        character.setPosition(50);

        this.panel.addLocationObject(character)
    }

    public setCharacterRight(character: CharacterView): void {
        character.node.setParent(this.panel.objectsWidget.node);

        character.setupTypeMove(LOCATION_OBJECT_MOVE_TYPE.RIGHT);

        character.setPosition(-1000);

        character.spine.node.scale = new Vec3(-character.node.scale.x, character.node.scale.y, character.node.scale.z);

        this.panel.addLocationObject(character)
    }
}