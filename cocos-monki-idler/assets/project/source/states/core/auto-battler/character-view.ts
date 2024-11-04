import { Component, Widget, _decorator, sp } from "cc";
import {CHARACTER_ANIMATION_TYPE, CharacterViewModel} from "./character-view-model.ts";

@_decorator.ccclass("CharacterView")
export class CharacterView extends Component {
    @_decorator.property(Widget) public widget: Widget;
    @_decorator.property(sp.Skeleton) public spine: sp.Skeleton;

    private _viewModel: CharacterViewModel;

    public setup(viewModel: CharacterViewModel) {
        this._viewModel = viewModel;
    }

    public playAnimation(animation: CHARACTER_ANIMATION_TYPE, loop?: boolean): void {
        this.spine.setAnimation(0, animation, loop)
    }
}