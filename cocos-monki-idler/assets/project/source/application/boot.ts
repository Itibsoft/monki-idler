import { Component, _decorator} from "cc";
import {Application} from "./application.ts";

@_decorator.ccclass("Boot")
export class Boot extends Component {
    protected async start(): Promise<void> {
        await Application.startAsync();
    }
}