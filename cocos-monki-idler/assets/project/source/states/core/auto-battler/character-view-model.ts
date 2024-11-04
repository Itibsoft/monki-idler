import {CharacterModel} from "./character-model.ts";
import {CharacterView} from "./character-view.ts";

export class CharacterViewModel {
    private _model: CharacterModel;
    private _view: CharacterView;
    
    public constructor(model: CharacterModel, view: CharacterView) {
    }
}