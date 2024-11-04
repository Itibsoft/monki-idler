import { PanelBase } from "../../../services";
import { Widget, _decorator, Node, Prefab, instantiate, UITransform, screen } from "cc";

@_decorator.ccclass("LocationPanel")
export class LocationPanel extends PanelBase {
    @_decorator.property(Widget) public backgroundWidget: Widget;
    @_decorator.property(Widget) public characterWidget: Widget;
    @_decorator.property(Node) public backgroundContainer: Node;

    private _locationPrefab: Prefab;
    private _locationInstance_1: Widget;
    private _locationInstance_2: Widget;
    private _width: number;
    private _speed: number = 500;
    private _init: boolean = false;

    public createLocationInstance(prefab: Prefab): void {
        this._locationPrefab = prefab;

        this._locationInstance_1 = instantiate(prefab).getComponent(Widget)!;
        this._locationInstance_2 = instantiate(prefab).getComponent(Widget)!;

        this._locationInstance_1.node.setParent(this.backgroundContainer);
        this._locationInstance_2.node.setParent(this.backgroundContainer);

        this._width = this._locationInstance_1.node.getComponent(UITransform)!.contentSize.x;

        // Изначальное положение
        this._locationInstance_1.left = 0;
        this._locationInstance_2.left = this._width;

        this._init = true;
    }

    protected update(dt: number): void {
        if (!this._init) {
            return;
        }

        // Перемещение экземпляров фона
        this._locationInstance_1.left -= dt * this._speed;
        this._locationInstance_2.left -= dt * this._speed;

        // Определяем ширину экрана
        const screenWidth = screen.windowSize.width;

        // Если экземпляр 1 выходит за экран, переносим его в конец
        if (this._locationInstance_1.left <= -this._width) {
            this._locationInstance_1.left = this._locationInstance_2.left + this._width;
        }

        // Если экземпляр 2 выходит за экран, переносим его в конец
        if (this._locationInstance_2.left <= -this._width) {
            this._locationInstance_2.left = this._locationInstance_1.left + this._width;
        }
    }
}
