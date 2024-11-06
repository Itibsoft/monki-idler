import {PanelBase} from "../../../services";
import {Button, Label, Sprite, _decorator} from "cc";

@_decorator.ccclass("GameResultPanel")
export class GameResultPanel extends PanelBase {
    @_decorator.property(Sprite) public backSprite: Sprite;
    @_decorator.property(Label) public titleLabel: Label;

    @_decorator.property(Label) public currentDay: Label;
    @_decorator.property(Label) public maxDay: Label;

    @_decorator.property(Button) public okButton: Button;
}
