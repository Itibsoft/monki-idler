import {Component, _decorator, Label} from "cc";
import {INarrativeBlockInfo} from "./narrative-controller.ts";

@_decorator.ccclass("NarrativeBlock")
export class NarrativeBlock extends Component {
    @_decorator.property(Label) private dayLabel: Label;
    @_decorator.property(Label) private textLabel: Label;

    public setup(day: number, info: INarrativeBlockInfo): void {
        this.dayLabel.string = `День ${day}`;
        this.textLabel.string = info.text;
    }

}