import { Component, Label, Prefab, Widget, _decorator, instantiate, sp, Node, UITransform, tween, UIOpacity, Vec3} from "cc";
import {CHARACTER_ANIMATION_TYPE, CharacterViewModel} from "./character-view-model.ts";
import {AsyncUtils} from "../../../utils/async-utils.ts";
import {CustomProgressBar} from "../../../utils/custom-progress-bar.ts";

@_decorator.ccclass("CharacterView")
export class CharacterView extends Component {
    @_decorator.property(Widget) public widget: Widget;
    @_decorator.property(sp.Skeleton) public spine: sp.Skeleton;
    @_decorator.property(Node) public messageBox: Node;

    @_decorator.property(Prefab) public hitPrefab: Prefab;
    @_decorator.property(UIOpacity) public uiOpacity: UIOpacity;

    @_decorator.property(CustomProgressBar) public healthBar: CustomProgressBar;

    private _viewModel: CharacterViewModel;

    public setup(viewModel: CharacterViewModel) {
        this._viewModel = viewModel;
    }

    public playAnimation(animation: CHARACTER_ANIMATION_TYPE, loop?: boolean): void {
        this.spine.clearTracks();
        this.spine.setAnimation(0, animation, loop);
    }

    public async playAnimationAsync(animation: CHARACTER_ANIMATION_TYPE): Promise<void> {
        this.spine.clearTracks();
        this.spine.setAnimation(1, animation, false);

        const state = this.spine.getState()!;

        const track = state.getCurrent(1);

        await AsyncUtils.wait(track.animation.duration);
    }

    public async playAnimationHalfDurationAsync(animation: CHARACTER_ANIMATION_TYPE): Promise<void> {
        this.spine.clearTracks();
        this.spine.setAnimation(3, animation, false);

        const state = this.spine.getState()!;

        const track = state.getCurrent(3);

        await AsyncUtils.wait(track.animation.duration / 2);
    }

    public async fadeAsync(): Promise<void> {
        const duration: number = 0.5;

        tween(this.uiOpacity)
            .to(duration, { opacity: 0 })
            .start();

        await AsyncUtils.wait(duration)
    }

    public addHitInfo(hit: number): void {
        const instance = instantiate(this.hitPrefab);
        instance.setParent(this.messageBox);

        const label = instance.getComponent(Label)!;
        label.string = `- ${hit}`;

        const transform = this.messageBox.getComponent(UITransform)!;
        const width = transform.contentSize.width;
        const height = transform.contentSize.height;

        // Генерируем случайную позицию для появления
        const randomX = Math.random() * width - width / 2;
        const randomY = Math.random() * height - height / 2;

        // Устанавливаем начальную позицию
        instance.setPosition(randomX, randomY, 0);
        this.messageBox.addChild(instance);

        // Получаем компонент UIOpacity для изменения прозрачности
        const opacityComponent = instance.getComponent(UIOpacity)!;
        opacityComponent.opacity = 0; // Начальная прозрачность = 0

        // Плавное движение вверх
        tween(instance)
            .to(0.5, { position: new Vec3(randomX, randomY + 100, 0) })  // Поднимаем вверх
            .start();

        // Плавное появление и исчезновение текста через компонент UIOpacity
        tween(opacityComponent)
            .to(0.5, { opacity: 255 })  // Плавно увеличиваем прозрачность до 255
            .to(0.5, { opacity: 0 })    // Плавно уменьшаем прозрачность до 0
            .call(() => {
                instance.destroy();  // Удаляем объект после завершения анимации
            })
            .start();
    }
}