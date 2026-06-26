import { describe, it, expect } from "vitest";
import { canTransition, validateSchedule } from "./post-status";

describe("canTransition", () => {
  it("permite idea → draft", () => {
    expect(canTransition("idea", "draft")).toBe(true);
  });
  it("não permite pular etapa idea → published", () => {
    expect(canTransition("idea", "published")).toBe(false);
  });
  it("permite scheduled → published", () => {
    expect(canTransition("scheduled", "published")).toBe(true);
  });
  it("permite ready → idea (voltar)", () => {
    expect(canTransition("ready", "idea")).toBe(true);
  });
  it("permite mesmo status draft → draft", () => {
    expect(canTransition("draft", "draft")).toBe(true);
  });
});

describe("validateSchedule", () => {
  it("scheduled sem data falha", () => {
    expect(validateSchedule("scheduled", null).ok).toBe(false);
  });
  it("scheduled com data no passado falha", () => {
    const past = new Date(Date.now() - 60_000);
    expect(validateSchedule("scheduled", past).ok).toBe(false);
  });
  it("scheduled com data no futuro passa", () => {
    const future = new Date(Date.now() + 60 * 60_000);
    expect(validateSchedule("scheduled", future).ok).toBe(true);
  });
  it("draft sem data passa", () => {
    expect(validateSchedule("draft", null).ok).toBe(true);
  });
});
