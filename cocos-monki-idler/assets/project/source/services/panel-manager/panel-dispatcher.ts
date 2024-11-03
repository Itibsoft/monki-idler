import {_decorator, Component, Node} from "cc";

import {PanelType} from "./enums/panel-type.ts";
import {PanelBase} from "./abstracts/panel-base.ts";
import {PANEL_STATE} from "./enums/panel-state.ts";

const {ccclass, property} = _decorator;

@ccclass("PanelDispatcher")
export class PanelDispatcher extends Component {
    @property(Node) private windowContent: Node;
    @property(Node) private overlayContent: Node;
    @property(Node) private cachedContent: Node;

    public activate(panel: PanelBase) {
        this.SetPanelForContainer(panel, true);
    }
    public cache(panel: PanelBase): void {
        this.SetPanelForContainer(panel, false);
    }

    public remove(panel: PanelBase): void {
        panel.node.destroy();
    }

    private SetPanelForContainer(panel: PanelBase, isOpen: boolean): void {
        let content: Node | null = null;

        panel.state = isOpen ? PANEL_STATE.OPENED : PANEL_STATE.CLOSED;

        if (isOpen) {
            panel.setActive(true);

            if (panel.meta.Type == PanelType.WINDOW) {
                content = this.windowContent;
            } else if (panel.meta.Type == PanelType.OVERLAY) {
                content = this.overlayContent;
            }
        } else {

            content = this.cachedContent;
            panel.setActive(false);
        }

        if (content === null) {
            throw new Error("PanelDispatcher: SetPanelForContainer: content is null")
        }

        panel.setParent(content);

        let panels = content.children.sort((childA, childB) => {
            let panelBaseA = childA.getComponent("PanelBase") as PanelBase;
            let panelBaseB = childB.getComponent("PanelBase") as PanelBase;

            return panelBaseA.meta.Order - panelBaseB.meta.Order;
        });

        // for (let index = 0; index < panels.length; index++) {
        //     panels[index].setSiblingIndex(index);
        // }

        let siblingIndex = 0;

        for (let index = panels.length - 1; index >= 0; index--) {
            panels[index].setSiblingIndex(siblingIndex);
            siblingIndex++;
        }
    }
}