import {Component, _decorator, Sprite, Color} from 'cc';

const {ccclass, property, executeInEditMode} = _decorator;

@ccclass("CustomProgressBar")
@executeInEditMode
export class CustomProgressBar extends Component {
    @property(Sprite)
    private declare fillSprite: Sprite;

    @property({tooltip: "Total value of the progress bar"})
    private total: number = 100;

    @property({tooltip: "Current value of the progress bar", range: [0, 100], slide: true})
    private current: number = 0;

    public setTotalProgress(value: number) {
        if (value <= 0) {
            console.warn("Total value must be greater than zero.");
            return;
        }

        this.total = value;
        this.updateFillRange();
    }

    public get totalProgress(): number {
        return this.total;
    }

    public setCurrentProgress(value: number) {
        if (value < 0) {
            console.warn("Current value cannot be negative.");
            return;
        }

        if (value > this.total) {
            console.warn("Current value cannot be greater than total value.");
            return;
        }

        this.current = value;
        this.updateFillRange();
    }

    public get currentProgress(): number {
        return this.current;
    }

    public set colorFill(color: Color) {
        this.fillSprite.color = color.clone();
    }

    private updateFillRange() {
        if (this.fillSprite) {
            this.fillSprite.fillRange = this.current / this.total;
        }
    }

    protected onLoad() {
        this.updateFillRange();
    }

    protected update(deltaTime: number) {
        this.updateFillRange();
    }
}