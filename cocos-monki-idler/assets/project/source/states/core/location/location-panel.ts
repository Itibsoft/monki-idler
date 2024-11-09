import {PanelBase} from "../../../services";
import {_decorator, instantiate, Node, Prefab, screen, Widget} from "cc";
import {BehaviorSubject} from "../../../utils/behaviour-subject.ts";
import {ParallaxController} from "./parallax-controller.ts";
import {LocationObject} from "./location-object.ts";

@_decorator.ccclass("LocationPanel")
export class LocationPanel extends PanelBase {
    @_decorator.property(Widget) public backgroundWidget: Widget;
    @_decorator.property(Widget) public objectsWidget: Widget;

    private declare _speed: BehaviorSubject<number>;
    private declare _isMove: BehaviorSubject<boolean>;

    private _parallax: ParallaxController;

    private readonly _objects: LocationObject[] = [];

    public setup(prefab: Prefab, isMove: BehaviorSubject<boolean>, speed: BehaviorSubject<number>): void {
        this._isMove = isMove;
        this._speed = speed;

        this._parallax = new ParallaxController(prefab, this.backgroundWidget.node);

        this._isMove.next(true);
    }

    public addLocationObject(object: LocationObject): void {
        this._objects.push(object);
    }

    protected update(dt: number): void {
        if (!this._isMove.value) {
            return;
        }

        const step = dt * this._speed.value;

        this._parallax.moveStep(step);

        for (const object of this._objects) {
            if(!object.isMovable) {
                continue;
            }

            object.moveStep(step);
        }

        /*if(this.enemies.length > 0) {
            this._speed.next(1000);

            let is_moved_enemy: boolean = false;
            for (const enemy of this.enemies) {
                if(!enemy.node) {
                    continue;
                }

                enemy.widget.right += step;

                if(enemy.widget.right >= 50) {
                    is_moved_enemy = true;
                }
            }

            if(is_moved_enemy) {
                for (const enemy of this.enemies) {
                    if(!enemy.node) {
                        continue;
                    }

                    enemy.playAnimation(CHARACTER_ANIMATION_TYPE.IDLE);
                }

                this.character.playAnimation(CHARACTER_ANIMATION_TYPE.IDLE);

                this._speed.next(350)
                this._isMove.next(false);
            }
        }*/
    }
}
