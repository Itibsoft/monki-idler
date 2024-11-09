import {Component, UITransform, Widget, _decorator} from "cc";
import {LOCATION_OBJECT_MOVE_TYPE} from "./location-panel-controller.ts";

@_decorator.ccclass("LocationObject")
export class LocationObject extends Component {
    public isMovable: boolean = true;

    @_decorator.property(Widget) public widget: Widget;
    @_decorator.property(UITransform) public uiTransform: UITransform;

    private _typeMove: LOCATION_OBJECT_MOVE_TYPE;

    public setupTypeMove(type: LOCATION_OBJECT_MOVE_TYPE): void {
        this._typeMove = type;

        switch (this._typeMove) {
            case LOCATION_OBJECT_MOVE_TYPE.LEFT:
                this.widget.isAlignLeft = true;
                break;
            case LOCATION_OBJECT_MOVE_TYPE.RIGHT:
                this.widget.isAlignRight = true;
                break;
        }
    }

    public getWidth(): number {
        return this.uiTransform.contentSize.x;
    }

    public getPosition(): number {
        switch (this._typeMove) {
            case LOCATION_OBJECT_MOVE_TYPE.LEFT:
                return this.widget.left;
            case LOCATION_OBJECT_MOVE_TYPE.RIGHT:
                return this.widget.right;
        }
    }

    public setPosition(position: number): void {
        switch (this._typeMove) {
            case LOCATION_OBJECT_MOVE_TYPE.LEFT:
                this.widget.left = position;
                break;
            case LOCATION_OBJECT_MOVE_TYPE.RIGHT:
                this.widget.right = position;
                break;
        }
    }

    public moveStep(value: number): void {
        switch (this._typeMove) {
            case LOCATION_OBJECT_MOVE_TYPE.LEFT:
                this.widget.left -= value;
                break;
            case LOCATION_OBJECT_MOVE_TYPE.RIGHT:
                this.widget.right += value;
                break;

        }
    }
}