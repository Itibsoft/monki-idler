import {PanelBase} from "../../../services";
import {UITransform, _decorator} from "cc";
import {NarrativeContainer} from "../narrative/narrative-container.ts";

@_decorator.ccclass("HudPanel")
export class HudPanel extends PanelBase {
    @_decorator.property(UITransform) public narrativeBlockTransform: UITransform;
    @_decorator.property(NarrativeContainer) public narrativeContainer: NarrativeContainer;
}