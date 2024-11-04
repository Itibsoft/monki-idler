import { PanelBase } from "../../../services";
import { Widget, _decorator, Node, Prefab, instantiate, UITransform, screen } from "cc";
import {LocationBackground} from "./location-background.ts";

@_decorator.ccclass("LocationPanel")
export class LocationPanel extends PanelBase {
    @_decorator.property(Widget) public backgroundWidget: Widget;
    @_decorator.property(Widget) public characterWidget: Widget;
    @_decorator.property(Node) public backgroundContainer: Node;

    private _locationBackground_1: LocationBackground;
    private _locationBackground_2: LocationBackground;

    private _speed: number = 500;
    private _width: number = 0;

    private _init: boolean = false;

    public createLocationInstance(prefab: Prefab): void {
        this._locationBackground_1 = instantiate(prefab).getComponent(LocationBackground)!;
        this._locationBackground_2 = instantiate(prefab).getComponent(LocationBackground)!;

        this._locationBackground_1.node.setParent(this.backgroundContainer);
        this._locationBackground_2.node.setParent(this.backgroundContainer);

        this._width = this._locationBackground_2.getWidth();

        this._locationBackground_1.setPositionLeft(0);
        this._locationBackground_2.setPositionLeft(this._width);

        this._init = true;
    }

    protected update(dt: number): void {
        if (!this._init) {
            return;
        }

        const move_step = dt * this._speed;

        // Перемещение экземпляров фона
        this._locationBackground_1.move(move_step);
        this._locationBackground_2.move(move_step);

        // Определяем ширину экрана
        const screenWidth = screen.windowSize.width;

        // Если экземпляр 1 выходит за экран, переносим его в конец
        if (this._locationBackground_1.getPositionLeft() <= -this._width) {
            this._locationBackground_1.setPositionLeft(this._locationBackground_2.getPositionLeft() + this._width);
        }

        // Если экземпляр 2 выходит за экран, переносим его в конец
        if (this._locationBackground_2.getPositionLeft() <= -this._width) {
            this._locationBackground_2.setPositionLeft(this._locationBackground_1.getPositionLeft() + this._width);
        }
    }
}
