/**
 * TypeScript Language Service Plugin entry point.
 *
 * Shows design token CSS values (e.g., "24px") next to token names
 * in autocomplete when editing Chakra styled-system properties.
 */

import type typescript from "typescript";
import { loadTokenData } from "./token-data";
import { createPlugin } from "./create-plugin";

function init(_modules: { typescript: typeof typescript }) {
  return {
    create(
      info: typescript.server.PluginCreateInfo
    ): typescript.LanguageService {
      info.project.projectService.logger.info(
        "[nimbus-design-token-ts-plugin] Initializing..."
      );

      const tokenData = loadTokenData();

      if (!tokenData) {
        info.project.projectService.logger.info(
          "[nimbus-design-token-ts-plugin] Could not load token data, plugin disabled."
        );
        return info.languageService;
      }

      const categoryCount = Object.keys(tokenData.categorySets).length;
      const totalTokens = Object.values(tokenData.categorySets).reduce(
        (sum, set) => sum + set.size,
        0
      );
      info.project.projectService.logger.info(
        `[nimbus-design-token-ts-plugin] Loaded ${totalTokens} tokens across ${categoryCount} categories.`
      );

      return createPlugin(_modules.typescript, info, tokenData);
    },
  };
}

export = init;
