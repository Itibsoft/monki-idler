import {PanelBase} from "../../../services";
import {Widget, _decorator} from "cc";

@_decorator.ccclass("LocationPanel")
export class LocationPanel extends PanelBase {
    @_decorator.property(Widget) public backgroundWidget: Widget;
    @_decorator.property(Widget) public characterWidget: Widget;
}