import { Component, Label, Sprite, _decorator } from "cc";

@_decorator.ccclass("RewardItem")
export class RewardItem extends Component {
    @_decorator.property(Sprite) public iconSprite: Sprite;
    @_decorator.property(Label) public valueLabel: Label;
}