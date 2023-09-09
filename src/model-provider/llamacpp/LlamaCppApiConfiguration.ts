import { BasicApiConfiguration } from "../../core/api/BasicApiConfiguration.js";
import { RetryFunction } from "../../core/api/RetryFunction.js";
import { ThrottleFunction } from "../../core/api/ThrottleFunction.js";

export class LlamaCppApiConfiguration extends BasicApiConfiguration {
  constructor({
    baseUrl = "http://127.0.0.1:8080",
    retry,
    throttle,
  }: {
    baseUrl?: string;
    retry?: RetryFunction;
    throttle?: ThrottleFunction;
  } = {}) {
    super({
      baseUrl,
      retry,
      throttle,
    });
  }
}
