import { Component, Widget, _decorator, sp } from "cc";
import {CharacterModel, CHARACTER_ANIMATION_TYPE} from "./character-model.ts";

@_decorator.ccclass("CharacterView")
export class CharacterView extends Component {
    @_decorator.property(Widget) public widget: Widget;
    @_decorator.property(sp.Skeleton) public spine: sp.Skeleton;

    private _character: CharacterModel;

    public setup(character: CharacterModel) {
        this._character = character;
    }

    public playAnimation(animation: CHARACTER_ANIMATION_TYPE, loop?: boolean): void {
        this.spine.setAnimation(0, animation, loop)
    }
}