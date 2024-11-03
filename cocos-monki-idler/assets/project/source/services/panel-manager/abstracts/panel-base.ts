import {
    Component,
    Node,
    _decorator
} from "cc";

import {PanelMeta} from "../meta/panel-meta.ts";
import {PANEL_STATE} from "../enums/panel-state.ts";

const {ccclass} = _decorator;

@ccclass("PanelBase")
export abstract class PanelBase extends Component {
    public meta: PanelMeta;
    public order: number;
    public state: PANEL_STATE;

    private _idPanel: string;

    public setMeta(panelMeta: PanelMeta): void {
        this.meta = panelMeta;
    }

    public setActive(isActive: boolean): void {
        this.node.active = isActive;
    }

    public setParent(parent: Node): void {
        this.node.parent = parent;
    }

    public getId(): string {
        if(this._idPanel == null) {
            const timestamp: number = new Date().getTime();
            const randomPart: string = Math.random().toString(36).substring(2, 5);
            this._idPanel = `${timestamp}${randomPart}`;
        }

        return this._idPanel;
    }

    public getNode(): Node {
        return this.node;
    }
}