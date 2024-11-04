import { Button, Component, _decorator, Node, Prefab, instantiate, ScrollView, Vec2, Label, UITransform } from "cc";
import { NarrativeBlock } from "./narrative-block.ts";
import { INarrativeBlockInfo } from "./narrative-controller.ts";

@_decorator.ccclass("NarrativeContainer")
export class NarrativeContainer extends Component {
    @_decorator.property(UITransform) public uiTransform: UITransform;
    @_decorator.property(Prefab) public blockPrefab: Prefab;
    @_decorator.property(Button) public nextButton: Button;
    @_decorator.property(Label) public nextButtonLabel: Label;
    @_decorator.property(Node) public narrativeBlocksContainer: Node;
    @_decorator.property(ScrollView) public scrollView: ScrollView;

    private _blocks: NarrativeBlock[] = [];

    public add(day: number, info: INarrativeBlockInfo): void {
        const instance = instantiate(this.blockPrefab);

        instance.setParent(this.narrativeBlocksContainer);

        const block = instance.getComponent(NarrativeBlock)!;

        block.setup(day, info);

        this._blocks.push(block);

        const maxOffset = this.scrollView.getMaxScrollOffset();

        this.scrollView.scrollToOffset(maxOffset, 1.2);
    }

    public clear(): void {
        for (const block of this._blocks) {
            block.node.destroy();
        }

        this._blocks = [];
    }

    public getBlockHeight(): number {
        return this.uiTransform.contentSize.y;
    }
}
