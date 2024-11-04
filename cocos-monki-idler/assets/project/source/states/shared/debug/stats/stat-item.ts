import { Component, Label, _decorator } from "cc";
import {Counter} from "./counter.ts";
import { IStat } from "../../../core/auto-battler/character.ts";

@_decorator.ccclass("StatItem")
export class StatItem extends Component {
    @_decorator.property(Label) public nameLabel: Label;
    @_decorator.property(Counter) public counter: Counter;

    public setup(stat: IStat): void {
        this.nameLabel.string = stat.name;
        this.counter.setup(stat.value);
    }
}