import {PanelBase} from "../../../services";
import {_decorator, Button, EditBox, Node} from "cc";
import {StatsEditor} from "./stats/stats-editor.ts";

@_decorator.ccclass("DebugPanel")
export class DebugPanel extends PanelBase {
    @_decorator.property(Button) public button: Button;
    @_decorator.property(Node) public container: Node;

    @_decorator.property(Button) public stopBackgroundButton: Button;
    @_decorator.property(Button) public startBackgroundButton: Button;
    @_decorator.property(EditBox) public speedBackgroundEditBox: EditBox;

    @_decorator.property(StatsEditor) public statsEditor: StatsEditor;
}