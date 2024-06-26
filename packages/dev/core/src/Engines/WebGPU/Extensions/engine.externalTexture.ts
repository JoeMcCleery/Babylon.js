import { WebGPUEngine } from "../../webgpuEngine";
import type { ExternalTexture } from "../../../Materials/Textures/externalTexture";
import type { Nullable } from "../../../types";
import { WebGPUExternalTexture } from "../webgpuExternalTexture";
import { Effect } from "../../../Materials/effect";

declare module "../../../Materials/effect" {
    export interface Effect {
        /**
         * Sets an external texture on the engine to be used in the shader.
         * @param name Name of the external texture variable.
         * @param texture Texture to set.
         */
        setExternalTexture(name: string, texture: Nullable<ExternalTexture>): void;
    }
}

Effect.prototype.setExternalTexture = function (name: string, texture: Nullable<ExternalTexture>): void {
    this._engine.setExternalTexture(name, texture);
};

declare module "../../webgpuEngine" {
    export interface WebGPUEngine {
        /**
         * Creates an external texture
         * @param video video element
         * @returns the external texture, or null if external textures are not supported by the engine
         */
        createExternalTexture(video: HTMLVideoElement): Nullable<ExternalTexture>;

        /**
         * Sets an internal texture to the according uniform.
         * @param name The name of the uniform in the effect
         * @param texture The texture to apply
         */
        setExternalTexture(name: string, texture: Nullable<ExternalTexture>): void;
    }
}

WebGPUEngine.prototype.createExternalTexture = function (video: HTMLVideoElement): Nullable<ExternalTexture> {
    const texture = new WebGPUExternalTexture(video);
    return texture;
};

WebGPUEngine.prototype.setExternalTexture = function (name: string, texture: Nullable<ExternalTexture>): void {
    if (!texture) {
        this._currentMaterialContext.setTexture(name, null);
        return;
    }
    this._setInternalTexture(name, texture);
};
