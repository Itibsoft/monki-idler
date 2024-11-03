import {director, instantiate, Node, Scene} from "cc";

import {AssetsBundleManager, BUNDLES, Logger, PanelDispatcher, PanelManager} from "../services";
import {Loader} from "../loader";
import {APPLICATION_STATE_TYPE, ApplicationState} from "./application-state.ts";
import {CoreApplicationState} from "../states/core/core-application-state.ts";

type Task = () => Promise<void>;

export class Application {
    public static stateType: APPLICATION_STATE_TYPE = APPLICATION_STATE_TYPE.NONE;

    private static _currentState: ApplicationState | undefined;

    private static _states: Map<APPLICATION_STATE_TYPE, ApplicationState> = new Map<APPLICATION_STATE_TYPE, ApplicationState>();

    public static async startAsync(): Promise<void> {
        const tasks: Map<string, Task> = new Map<string, Task>();

        const logger = new Logger();
        const assets = new AssetsBundleManager();
        const loader = new Loader();

        tasks.set("initialize panel manager", async () => {
            const shared_bundle = await assets.loadBundle(BUNDLES.SHARED);

            if(!shared_bundle) {
                logger.error("Not found shared bundle!");
                return;
            }

            const prefab = await shared_bundle.loadPrefab("panel-dispatcher");

            const instance = instantiate(prefab) as Node;

            const scene = director.getScene() as Scene;

            instance.setParent(scene);

            const panel_dispatcher = instance.getComponent(PanelDispatcher) as PanelDispatcher;

            new PanelManager(panel_dispatcher);
        });

        tasks.set("initialize loader", async () => {
            await loader.initializeAsync();

            loader.open();
        });

        tasks.set("create application states", async () => {
            this._states.set(APPLICATION_STATE_TYPE.CORE, new CoreApplicationState());
        })

        tasks.set("enter core application state", async () => {
            await Application.enterStateAsync(APPLICATION_STATE_TYPE.CORE)
        })

        let step_index: number = 0;

        for (const [title, task] of tasks) {
            logger.log(`task [${step_index}]: ${title}`)
            await task();

            step_index++
        }

        loader.close();
    }

    public static async enterStateAsync(type: APPLICATION_STATE_TYPE): Promise<void> {
        if(this._currentState !== undefined) {
            await this._currentState.exitAsync();
        }

        if(!this._states.has(type)) {
            throw new Error(`Not found target application state: ${type}`);
        }

        const state = this._states.get(type)!

        this._currentState = state;
        this.stateType = state.type;

        await state.enterAsync();
    }
}