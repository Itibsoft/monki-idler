import {
    Asset,
    assetManager,
    AssetManager,
    AudioClip,
    BufferAsset,
    Font,
    JsonAsset,
    Material,
    Prefab,
    SpriteAtlas,
    SpriteFrame,
    TextAsset
} from "cc";

export class AssetsBundle {
    public readonly address: string;
    public isReleased: boolean = false;

    private readonly _resourcesCashed: Map<string, Asset>;
    private readonly _bundle: AssetManager.Bundle;

    public constructor(address: string, bundle: AssetManager.Bundle) {
        this.address = address;

        this._bundle = bundle;
        this._resourcesCashed = new Map<string, any>();

        this.isReleased = false;
    }

    public loadAudioClip(audioClipPath: string): Promise<AudioClip> {
        return new Promise<AudioClip>((resolve, reject) => {
            if (this._resourcesCashed.has(audioClipPath)) {
                const audioClip = this._resourcesCashed.get(audioClipPath) as AudioClip;
                resolve(audioClip);
                return;
            }

            this._bundle.load(audioClipPath, AudioClip, (err, audioClip) => {
                if (err) {
                    reject(err);
                    return;
                }

                this._resourcesCashed.set(audioClipPath, audioClip);

                resolve(audioClip);
            });
        });
    }

    public loadFont(assetPath: string): Promise<Font> {
        return new Promise<Font>((resolve, reject) => {
            if (this._resourcesCashed.has(assetPath)) {
                const font = this._resourcesCashed.get(assetPath) as Font;
                resolve(font);
                return;
            }

            this._bundle.load(assetPath, Font, (err, font) => {
                if (err) {
                    reject(err);
                    return;
                }

                this._resourcesCashed.set(assetPath, font);

                resolve(font);
            });
        });
    }

    public loadJson<TJson>(jsonPath: string): Promise<TJson> {
        return new Promise<TJson>((resolve, reject) => {
            if (this._resourcesCashed.has(jsonPath)) {
                const jsonAsset = this._resourcesCashed.get(jsonPath) as JsonAsset;
                const json = jsonAsset.json as TJson;

                resolve(json);
                return;
            }

            this._bundle.load(jsonPath, JsonAsset, (err, jsonAsset) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!jsonAsset.isValid) {
                    reject(new Error(`JsonAsset is not valid: ${jsonPath}`));
                }

                this._resourcesCashed.set(jsonPath, jsonAsset);

                const json = jsonAsset.json as TJson;
                resolve(json);
            });
        });
    }

    public loadPrefab(assetPath: string): Promise<Prefab> {
        return new Promise<Prefab>((resolve, reject) => {
            if (this._resourcesCashed.has(assetPath)) {
                const prefab = this._resourcesCashed.get(assetPath) as Prefab;
                resolve(prefab);
                return;
            }

            this._bundle.load(assetPath, Prefab, (err, prefab) => {
                if (err) {
                    reject(err);
                    return;
                }

                this._resourcesCashed.set(assetPath, prefab);

                resolve(prefab);
            });
        });
    }

    public loadMaterial(assetPath: string): Promise<Material> {
        return new Promise<Material>((resolve, reject) => {
            if (this._resourcesCashed.has(assetPath)) {
                const material = this._resourcesCashed.get(assetPath) as Material;
                resolve(material);
                return;
            }

            this._bundle.load(assetPath, Material, (err, material) => {
                if (err) {
                    reject(err);
                    return;
                }

                this._resourcesCashed.set(assetPath, material);

                resolve(material);
            });
        })
    }

    public loadSpriteAtlas(spriteAtlasPath: string): Promise<SpriteAtlas> {
        return new Promise<SpriteAtlas>((resolve, reject) => {
            if (this._resourcesCashed.has(spriteAtlasPath)) {
                const spriteAtlas = this._resourcesCashed.get(spriteAtlasPath) as SpriteAtlas;
                resolve(spriteAtlas);
                return;
            }

            this._bundle.load(spriteAtlasPath, SpriteAtlas, (err, spriteAtlas) => {
                if (err) {
                    reject(err);
                    return;
                }

                this._resourcesCashed.set(spriteAtlasPath, spriteAtlas);

                resolve(spriteAtlas);
            });
        });
    }

    public loadSpriteFrame(spriteFramePath: string): Promise<SpriteFrame> {
        return new Promise<SpriteFrame>((resolve, reject) => {
            if (this._resourcesCashed.has(spriteFramePath)) {
                const spriteFrame = this._resourcesCashed.get(spriteFramePath) as SpriteFrame;
                resolve(spriteFrame)
                return;
            }

            this._bundle.load(spriteFramePath, SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    reject(err);
                    return;
                }

                this._resourcesCashed.set(spriteFramePath, spriteFrame);  

                resolve(spriteFrame);
            });
        });
    }

    public loadText(textPath: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (this._resourcesCashed.has(textPath)) {
                let textAsset = this._resourcesCashed.get(textPath) as TextAsset;
                resolve(textAsset.text)
                return;
            }

            this._bundle.load(textPath, TextAsset, (err, textAsset) => {
                if (err) {
                    reject(err);
                    return;
                }

                this._resourcesCashed.set(textPath, textAsset);

                const text = textAsset.text;
                resolve(text);
            });
        });
    }

    public release(): void {
        this._resourcesCashed.forEach((asset) => {
            assetManager.releaseAsset(asset);
        });

        this._resourcesCashed.clear();

        this.isReleased = true;
    }
}