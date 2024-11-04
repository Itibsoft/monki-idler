import { Component, _decorator, Widget, UITransform } from "cc";

@_decorator.ccclass("LocationBackground")
export class LocationBackground extends Component {
    @_decorator.property(Widget) public widget: Widget;
    @_decorator.property(UITransform) public uiTransform: UITransform;

    public getWidth(): number {
        return this.uiTransform.contentSize.x;
    }

    public setPositionLeft(left: number): void {
        this.widget.left = left;
    }

    public getPositionLeft(): number {
        return this.widget.left;
    }

    public move(value: number): void {
        this.widget.left -= value;
    }
}