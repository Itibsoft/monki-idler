import {
    _decorator,
    Component,
    view,
    Vec3,
    screen,
} from "cc";

@_decorator.ccclass("ResizeContainerComponent")
export class ResizeContainerComponent extends Component {
    private readonly _resizeHandler: () => void = this.resize.bind(this);

    protected onLoad(): void {
        screen.on("window-resize", this._resizeHandler);

        this._resizeHandler();
    }

    private resize(): void {
        let rect = view.getViewportRect();

        const delta = rect.width / rect.height;

        if (delta < 0.57) {
            const newWidth = rect.height * 0.57;
            const value = rect.width / newWidth;

            this.node.scale = new Vec3(value, value, 1);
        } else {
            this.node.scale = new Vec3(1, 1, 1)
        }
    }
}