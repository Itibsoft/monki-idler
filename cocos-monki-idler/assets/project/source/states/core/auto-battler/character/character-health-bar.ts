import {CustomProgressBar} from "../../../../utils/custom-progress-bar.ts";
import {Label, _decorator} from "cc";

@_decorator.ccclass("CharacterHealthBar")
export class CharacterHealthBar extends CustomProgressBar {
    @_decorator.property(Label) private declare healthValueLabel: Label;

    public override setCurrentProgress(value: number) {
        value = Math.round(value);

        super.setCurrentProgress(value);

        this.healthValueLabel.string = `${value} / ${this.totalProgress}`;
    }

    public override setTotalProgress(value: number) {
        value = Math.round(value);

        super.setTotalProgress(value);

        this.healthValueLabel.string = `${this.currentProgress} / ${value}`;
    }
}