import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IntlMessages } from "./i18n";

// Mock messages for testing
const mockEnMessages: IntlMessages = {
  "Nimbus.Alert.dismiss": "Dismiss",
  "Nimbus.Dialog.closeTrigger": "Close",
};

const mockDeMessages: IntlMessages = {
  "Nimbus.Alert.dismiss": "Schließen",
  "Nimbus.Dialog.closeTrigger": "Schließen",
};

const mockEsMessages: IntlMessages = {
  "Nimbus.Alert.dismiss": "Descartar",
  "Nimbus.Dialog.closeTrigger": "Cerrar",
};

const mockFrMessages: IntlMessages = {
  "Nimbus.Alert.dismiss": "Fermer",
  "Nimbus.Dialog.closeTrigger": "Fermer",
};

const mockPtMessages: IntlMessages = {
  "Nimbus.Alert.dismiss": "Descartar",
  "Nimbus.Dialog.closeTrigger": "Fechar",
};

// Mock the dynamic imports at the top level
vi.mock("@commercetools/nimbus-i18n/compiled-data/en.json", () => ({
  default: mockEnMessages,
}));

vi.mock("@commercetools/nimbus-i18n/compiled-data/de.json", () => ({
  default: mockDeMessages,
}));

vi.mock("@commercetools/nimbus-i18n/compiled-data/es.json", () => ({
  default: mockEsMessages,
}));

vi.mock("@commercetools/nimbus-i18n/compiled-data/fr-FR.json", () => ({
  default: mockFrMessages,
}));

vi.mock("@commercetools/nimbus-i18n/compiled-data/pt-BR.json", () => ({
  default: mockPtMessages,
}));

describe("getMessagesForLocale", () => {
  let getMessagesForLocale: (locale: string) => Promise<IntlMessages>;

  beforeEach(async () => {
    // Dynamically import the function after mocks are set up
    const module = await import("./i18n");
    getMessagesForLocale = module.getMessagesForLocale;
  });

  describe("locale normalization", () => {
    it("should normalize en-US to en", async () => {
      const messages = await getMessagesForLocale("en-US");
      expect(messages).toEqual(mockEnMessages);
    });

    it("should normalize de-DE to de", async () => {
      const messages = await getMessagesForLocale("de-DE");
      expect(messages).toEqual(mockDeMessages);
    });

    it("should normalize es-ES to es", async () => {
      const messages = await getMessagesForLocale("es-ES");
      expect(messages).toEqual(mockEsMessages);
    });

    it("should normalize fr-CA to fr-FR", async () => {
      const messages = await getMessagesForLocale("fr-CA");
      expect(messages).toEqual(mockFrMessages);
    });

    it("should normalize pt-PT to pt-BR", async () => {
      const messages = await getMessagesForLocale("pt-PT");
      expect(messages).toEqual(mockPtMessages);
    });

    it("should handle base locales directly", async () => {
      const messages = await getMessagesForLocale("en");
      expect(messages).toEqual(mockEnMessages);
    });
  });

  describe("supported locales", () => {
    it("should load English messages for 'en'", async () => {
      const messages = await getMessagesForLocale("en");
      expect(messages).toEqual(mockEnMessages);
    });

    it("should load German messages for 'de'", async () => {
      const messages = await getMessagesForLocale("de");
      expect(messages).toEqual(mockDeMessages);
    });

    it("should load Spanish messages for 'es'", async () => {
      const messages = await getMessagesForLocale("es");
      expect(messages).toEqual(mockEsMessages);
    });

    it("should load French messages for 'fr-FR'", async () => {
      const messages = await getMessagesForLocale("fr-FR");
      expect(messages).toEqual(mockFrMessages);
    });

    it("should load Portuguese messages for 'pt-BR'", async () => {
      const messages = await getMessagesForLocale("pt-BR");
      expect(messages).toEqual(mockPtMessages);
    });
  });

  describe("fallback behavior", () => {
    it("should fallback to English for unsupported locales", async () => {
      const messages = await getMessagesForLocale("ja-JP");
      expect(messages).toEqual(mockEnMessages);
    });

    it("should fallback to English for empty locale", async () => {
      const messages = await getMessagesForLocale("");
      expect(messages).toEqual(mockEnMessages);
    });
  });

  describe("error handling", () => {
    it("should return empty object when English fallback fails", async () => {
      // Create a separate test with mocked error for English
      vi.doMock("@commercetools/nimbus-i18n/compiled-data/en.json", () => {
        throw new Error("Failed to load English messages");
      });

      vi.resetModules();
      const errorModule = await import("./i18n");
      const getMessagesForLocaleWithError = errorModule.getMessagesForLocale;

      // Try to load an unsupported locale - should try English fallback, which fails
      const messages = await getMessagesForLocaleWithError("ja-JP");
      expect(messages).toEqual({});
    });

    it("should return empty object when all imports fail", async () => {
      // Mock both German and English to fail
      vi.doMock("@commercetools/nimbus-i18n/compiled-data/de.json", () => {
        throw new Error("Module not found");
      });
      vi.doMock("@commercetools/nimbus-i18n/compiled-data/en.json", () => {
        throw new Error("Module not found");
      });

      vi.resetModules();
      const errorModule = await import("./i18n");
      const getMessagesForLocaleWithError = errorModule.getMessagesForLocale;

      const messages = await getMessagesForLocaleWithError("de");
      expect(messages).toEqual({});
    });
  });
});
