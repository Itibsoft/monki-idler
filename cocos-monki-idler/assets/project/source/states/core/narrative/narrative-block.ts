import {Component, _decorator, Label, Sprite, Color, Node} from "cc";
import {INarrativeBlockInfo, NARRATIVE_BLOCK_TYPE} from "./narrative-controller.ts";

@_decorator.ccclass("NarrativeBlock")
export class NarrativeBlock extends Component {
    @_decorator.property(Label) private dayLabel: Label;
    @_decorator.property(Label) private textLabel: Label;
    @_decorator.property(Sprite) private typeSprite: Sprite;

    @_decorator.property(Node) private rewardContainer: Node;
    @_decorator.property(Node) private infoContainer: Node;

    public setup(day: number, info: INarrativeBlockInfo): void {
        this.dayLabel.string = `День ${day}`;
        this.textLabel.string = info.text;

        if (info.type === NARRATIVE_BLOCK_TYPE.BATTLE) {
            this.typeSprite.color = new Color().fromHEX("#E67676");
        } else {
            this.typeSprite.color = new Color().fromHEX("#76E694");
        }
    }

}