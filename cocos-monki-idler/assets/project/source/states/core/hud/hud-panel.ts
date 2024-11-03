import {PanelBase} from "../../../services";
import {UITransform, _decorator} from "cc";

@_decorator.ccclass("HudPanel")
export class HudPanel extends PanelBase {
    @_decorator.property(UITransform) public narrativeBlockTransform: UITransform;
}