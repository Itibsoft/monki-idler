import {PanelBase} from "../../../services";
import {_decorator, Button, Node} from "cc";

@_decorator.ccclass("DebugPanel")
export class DebugPanel extends PanelBase {
    @_decorator.property(Button) public button: Button;
    @_decorator.property(Node) public container: Node;
}