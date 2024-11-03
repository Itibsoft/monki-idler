import {APPLICATION_STATE_TYPE, ApplicationState} from "../../application/application-state.ts";
import {AsyncUtils} from "../../utils/async-utils.ts";

export class CoreApplicationState extends ApplicationState {
    public type: APPLICATION_STATE_TYPE = APPLICATION_STATE_TYPE.CORE;

    public async enterAsync(): Promise<void> {
        await AsyncUtils.wait(10)
    }
    public async exitAsync(): Promise<void> {

    }

}