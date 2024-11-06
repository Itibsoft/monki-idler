import {PanelBase} from "../../../services";
import {_decorator, instantiate, Node, Prefab, screen, Widget} from "cc";
import {LocationBackground} from "./location-background.ts";
import {BehaviorSubject} from "../../../utils/behaviour-subject.ts";
import {CharacterView} from "../auto-battler/character-view.ts";
import { CHARACTER_ANIMATION_TYPE } from "../auto-battler/character-view-model.ts";

@_decorator.ccclass("LocationPanel")
export class LocationPanel extends PanelBase {
    @_decorator.property(Widget) public backgroundWidget: Widget;
    @_decorator.property(Widget) public charactersWidget: Widget;
    @_decorator.property(Node) public backgroundContainer: Node;

    private _locationBackground_1: LocationBackground;
    private _locationBackground_2: LocationBackground;

    private _width: number = 0;

    private declare _speed: BehaviorSubject<number>;
    private declare _isMove: BehaviorSubject<boolean>;

    public enemies: CharacterView[] = [];
    public character: CharacterView;

    public setup(prefab: Prefab, isMove: BehaviorSubject<boolean>, speed: BehaviorSubject<number>): void {
        this._isMove = isMove;
        this._speed = speed;

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

        if(this.enemies.length > 0) {
            this._speed.next(1000);

            let is_moved_enemy: boolean = false;
            for (const enemy of this.enemies) {
                enemy.widget.right += move_step;

                if(enemy.widget.right >= 50) {
                    is_moved_enemy = true;
                }
            }

            if(is_moved_enemy) {
                for (const enemy of this.enemies) {
                    enemy.playAnimation(CHARACTER_ANIMATION_TYPE.IDLE);
                }

                this.enemies = [];

                this.character.playAnimation(CHARACTER_ANIMATION_TYPE.IDLE);

                this._speed.next(350)
                this._isMove.next(false);
            }
        }

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
