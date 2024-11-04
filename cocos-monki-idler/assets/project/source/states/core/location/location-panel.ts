import { PanelBase } from "../../../services";
import { Widget, _decorator, Node, Prefab, instantiate, UITransform, screen } from "cc";
import {LocationBackground} from "./location-background.ts";
import {BehaviorSubject} from "../../../utils/behaviour-subject.ts";
import {CoreConfig} from "../core-application-state.ts";

@_decorator.ccclass("LocationPanel")
export class LocationPanel extends PanelBase {
    @_decorator.property(Widget) public backgroundWidget: Widget;
    @_decorator.property(Widget) public characterWidget: Widget;
    @_decorator.property(Node) public backgroundContainer: Node;

    private _locationBackground_1: LocationBackground;
    private _locationBackground_2: LocationBackground;

    private _width: number = 0;

    private declare _speed: BehaviorSubject<number>;
    private declare _isMove: BehaviorSubject<boolean>;

    public setup(prefab: Prefab): void {
        this._speed = CoreConfig.locationSpeed;
        this._isMove = CoreConfig.locationIsMove;

        this._locationBackground_1 = instantiate(prefab).getComponent(LocationBackground)!;
        this._locationBackground_2 = instantiate(prefab).getComponent(LocationBackground)!;

        this._locationBackground_1.node.setParent(this.backgroundContainer);
        this._locationBackground_2.node.setParent(this.backgroundContainer);

        this._width = this._locationBackground_2.getWidth();

        this._locationBackground_1.setPositionLeft(0);
        this._locationBackground_2.setPositionLeft(this._width);

        this._isMove.next(true);
    }

    protected update(dt: number): void {
        if (!this._isMove.value) {
            return;
        }

        const move_step = dt * this._speed.value;

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
