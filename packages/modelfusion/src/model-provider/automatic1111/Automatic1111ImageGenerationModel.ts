import { z } from "zod";
import { FunctionOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { callWithRetryAndThrottle } from "../../core/api/callWithRetryAndThrottle.js";
import {
  createJsonResponseHandler,
  postJsonToApi,
} from "../../core/api/postToApi.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { PromptTemplate } from "../../model-function/PromptTemplate.js";
import {
  ImageGenerationModel,
  ImageGenerationModelSettings,
} from "../../model-function/generate-image/ImageGenerationModel.js";
import { PromptTemplateImageGenerationModel } from "../../model-function/generate-image/PromptTemplateImageGenerationModel.js";
import { Automatic1111ApiConfiguration } from "./Automatic1111ApiConfiguration.js";
import { failedAutomatic1111CallResponseHandler } from "./Automatic1111Error.js";
import {
  Automatic1111ImageGenerationPrompt,
  mapBasicPromptToAutomatic1111Format,
} from "./Automatic1111ImageGenerationPrompt.js";

export interface Automatic1111ImageGenerationSettings
  extends ImageGenerationModelSettings {
  api?: ApiConfiguration;

  model: string;

  height?: number;
  width?: number;
  sampler?: string;
  steps?: number;
}

/**
 * Create an image generation model that calls the AUTOMATIC1111 Stable Diffusion Web UI API.
 *
 * @see https://github.com/AUTOMATIC1111/stable-diffusion-webui
 */
export class Automatic1111ImageGenerationModel
  extends AbstractModel<Automatic1111ImageGenerationSettings>
  implements
    ImageGenerationModel<
      Automatic1111ImageGenerationPrompt,
      Automatic1111ImageGenerationSettings
    >
{
  constructor(settings: Automatic1111ImageGenerationSettings) {
    super({ settings });
  }

  readonly provider = "Automatic1111" as const;

  get modelName() {
    return this.settings.model;
  }

  async callAPI(
    input: Automatic1111ImageGenerationPrompt,
    options?: FunctionOptions
  ): Promise<Automatic1111ImageGenerationResponse> {
    const api = this.settings.api ?? new Automatic1111ApiConfiguration();
    const abortSignal = options?.run?.abortSignal;

    return callWithRetryAndThrottle({
      retry: api.retry,
      throttle: api.throttle,
      call: async () =>
        postJsonToApi({
          url: api.assembleUrl(`/txt2img`),
          headers: api.headers,
          body: {
            height: this.settings.height,
            width: this.settings.width,
            prompt: input.prompt,
            negative_prompt: input.negativePrompt,
            sampler_index: this.settings.sampler,
            steps: this.settings.steps,
            seed: input.seed,
            override_settings: {
              sd_model_checkpoint: this.settings.model,
            },
          },
          failedResponseHandler: failedAutomatic1111CallResponseHandler,
          successfulResponseHandler: createJsonResponseHandler(
            Automatic1111ImageGenerationResponseSchema
          ),
          abortSignal,
        }),
    });
  }

  get settingsForEvent(): Partial<Automatic1111ImageGenerationSettings> {
    return {
      height: this.settings.height,
      width: this.settings.width,
      sampler: this.settings.sampler,
      steps: this.settings.steps,
    };
  }

  async doGenerateImage(
    prompt: Automatic1111ImageGenerationPrompt,
    options?: FunctionOptions
  ) {
    const response = await this.callAPI(prompt, options);

    return {
      response,
      base64Image: response.images[0],
    };
  }

  withTextPrompt() {
    return this.withPromptTemplate(mapBasicPromptToAutomatic1111Format());
  }

  withPromptTemplate<INPUT_PROMPT>(
    promptTemplate: PromptTemplate<
      INPUT_PROMPT,
      Automatic1111ImageGenerationPrompt
    >
  ): PromptTemplateImageGenerationModel<
    INPUT_PROMPT,
    Automatic1111ImageGenerationPrompt,
    Automatic1111ImageGenerationSettings,
    this
  > {
    return new PromptTemplateImageGenerationModel({
      model: this,
      promptTemplate,
    });
  }

  withSettings(additionalSettings: Automatic1111ImageGenerationSettings) {
    return new Automatic1111ImageGenerationModel(
      Object.assign({}, this.settings, additionalSettings)
    ) as this;
  }
}

const Automatic1111ImageGenerationResponseSchema = z.object({
  images: z.array(z.string()),
  parameters: z.object({}),
  info: z.string(),
});

export type Automatic1111ImageGenerationResponse = z.infer<
  typeof Automatic1111ImageGenerationResponseSchema
>;