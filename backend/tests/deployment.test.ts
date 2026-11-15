import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";

describe("Render deployment endpoints and CORS", () => {
  it("reports process liveness without exposing infrastructure details", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      service: "praedicoai-backend",
    });
  });

  it.each([
    "https://praedicoai.com",
    "http://localhost:3000",
    "https://legacy.example",
  ])("allows the configured frontend origin %s", async (origin) => {
    const response = await request(app).get("/health").set("Origin", origin);

    expect(response.headers["access-control-allow-origin"]).toBe(origin);
  });

  it("does not grant CORS access to an unconfigured origin", async () => {
    const response = await request(app)
      .get("/health")
      .set("Origin", "https://untrusted.example");

    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("answers allowed preflight requests", async () => {
    const response = await request(app)
      .options("/api/v1/auth/login")
      .set("Origin", "https://praedicoai.com")
      .set("Access-Control-Request-Method", "POST")
      .set("Access-Control-Request-Headers", "content-type");

    expect(response.status).toBe(204);
    expect(response.headers["access-control-allow-origin"]).toBe(
      "https://praedicoai.com",
    );
    expect(response.headers["access-control-allow-methods"]).toContain("POST");
  });
});
