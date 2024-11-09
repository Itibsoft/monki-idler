import {instantiate, Node, Prefab} from "cc";
import {LocationObject} from "./location-object.ts";
import {LOCATION_OBJECT_MOVE_TYPE} from "./location-panel-controller.ts";

export class ParallaxController {
    private _background_1: LocationObject;
    private _background_2: LocationObject;

    private _width: number;

    public constructor(prefab: Prefab, container: Node) {
        this._background_1 = instantiate(prefab).getComponent(LocationObject)!;
        this._background_2 = instantiate(prefab).getComponent(LocationObject)!;

        this._background_1.node.setParent(container);
        this._background_2.node.setParent(container);

        this._background_1.setupTypeMove(LOCATION_OBJECT_MOVE_TYPE.LEFT);
        this._background_2.setupTypeMove(LOCATION_OBJECT_MOVE_TYPE.LEFT);

        this._width = this._background_2.getWidth();

        this._background_1.setPosition(0);
        this._background_2.setPosition(this._width);
    }

    public moveStep(step: number) {
        this._background_1.moveStep(step);
        this._background_2.moveStep(step);

        if (this._background_1.getPosition() <= -this._width) {
            this._background_1.setPosition(this._background_2.getPosition() + this._width);
        }
        if (this._background_2.getPosition() <= -this._width) {
            this._background_2.setPosition(this._background_1.getPosition() + this._width);
        }
    }
}