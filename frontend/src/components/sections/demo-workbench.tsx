"use client";

import { Clipboard, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { DemoDefinition } from "@/data/demos";

type RuntimeStatus = {
  available: boolean;
  status: "Coming Soon" | "Beta Demo" | "Live Demo" | "Unavailable";
  reason?: "region-restricted" | "region-unavailable";
  maximumInputCharacters: number;
};

function isRuntimeStatus(value: unknown): value is RuntimeStatus {
  return (
    typeof value === "object" &&
    value !== null &&
    "available" in value &&
    typeof value.available === "boolean" &&
    "status" in value &&
    (value.status === "Coming Soon" ||
      value.status === "Beta Demo" ||
      value.status === "Live Demo" ||
      value.status === "Unavailable") &&
    "maximumInputCharacters" in value &&
    typeof value.maximumInputCharacters === "number"
  );
}

function isSuccessfulDemoResult(
  value: unknown,
): value is { data: { output: string } } {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    typeof value.data === "object" &&
    value.data !== null &&
    "output" in value.data &&
    typeof value.data.output === "string"
  );
}

function readErrorMessage(value: unknown) {
  if (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof value.error === "string"
  ) {
    return value.error;
  }
  return "The AI demo could not be completed. Please try again later.";
}

export function DemoWorkbench({ demo }: { demo: DemoDefinition }) {
  const [runtimeStatus, setRuntimeStatus] = useState<RuntimeStatus | null>(
    null,
  );
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const trackedView = useRef(false);

  useEffect(() => {
    let active = true;
    async function loadStatus() {
      try {
        const response = await fetch("/api/demos/status", {
          cache: "no-store",
        });
        const result: unknown = await response.json();
        if (!response.ok || !isRuntimeStatus(result)) {
          throw new Error("The demo status could not be verified.");
        }
        if (active) setRuntimeStatus(result);
      } catch (statusError) {
        if (active) {
          setError(
            statusError instanceof Error
              ? statusError.message
              : "The demo status could not be verified.",
          );
        }
      }
    }
    void loadStatus();
    if (!trackedView.current) {
      trackedView.current = true;
      void fetch("/api/demos/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: demo.slug }),
      })
        .then((response) => {
          if (!response.ok) {
            console.error("Demo page view could not be recorded.");
          }
        })
        .catch((trackingError: unknown) => {
          console.error(
            "Demo page view tracking failed:",
            trackingError instanceof Error
              ? trackingError.message
              : "Unknown tracking error",
          );
        });
    }
    return () => {
      active = false;
    };
  }, [demo.slug]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!runtimeStatus?.available) {
      setError("This demo is not enabled yet.");
      return;
    }
    if (!confirmed) {
      setError("Confirm the age and data-use notice before continuing.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/demos/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: demo.slug,
          category: demo.category,
          input: input.trim(),
          ageConfirmed: confirmed,
          dataPolicyAccepted: confirmed,
        }),
      });
      const result: unknown = await response.json();
      if (!response.ok) throw new Error(readErrorMessage(result));
      if (!isSuccessfulDemoResult(result)) {
        throw new Error("The AI provider returned an unexpected response.");
      }
      setOutput(result.data.output);
      setNotice("Draft generated. Review it carefully before use.");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "The AI demo could not be completed. Please try again later.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function copyOutput() {
    if (!output) return;
    setError("");
    setNotice("");
    try {
      await navigator.clipboard.writeText(output);
      setNotice("Output copied to your clipboard.");
    } catch {
      setError("Clipboard access was unavailable. Select and copy the output.");
    }
  }

  function reset() {
    setInput("");
    setOutput("");
    setConfirmed(false);
    setError("");
    setNotice("");
  }

  return (
    <div className="demo-workbench-layout">
      <form className="demo-workbench" onSubmit={submit}>
        <div className="demo-workbench-header">
          <div>
            <p className="eyebrow small">Interactive demo</p>
            <h3>{demo.title}</h3>
          </div>
          <span className="demo-runtime-status">
            {runtimeStatus?.status ?? "Checking availability"}
          </span>
        </div>
        {runtimeStatus?.reason === "region-restricted" ? (
          <div className="alert alert-warning">
            Gemini free-tier demos are not available in your region. You can
            still request a custom discussion.
          </div>
        ) : runtimeStatus?.reason === "region-unavailable" ? (
          <div className="alert alert-warning">
            Demo access is disabled because this region could not be verified.
            No prompt will be sent.
          </div>
        ) : !runtimeStatus?.available ? (
          <div className="alert">
            {runtimeStatus?.status === "Unavailable"
              ? "Demo availability could not be verified. No prompt will be sent."
              : "The interactive Gemini connection is not enabled yet. This page describes the planned experience; no AI output is simulated."}
          </div>
        ) : (
          <>
            <label className="demo-input-label" htmlFor="demo-input">
              Your fictional example
              <textarea
                id="demo-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={runtimeStatus.maximumInputCharacters}
                rows={7}
                required
                placeholder="Describe a general task. Do not include real personal or confidential details."
              />
            </label>
            <div className="demo-input-meta">
              <button
                className="demo-sample-button"
                type="button"
                onClick={() => setInput(demo.sampleInput)}
              >
                Use example input
              </button>
              <span>
                {input.length}/{runtimeStatus.maximumInputCharacters}
              </span>
            </div>
            <label className="demo-consent" htmlFor="demo-consent">
              <input
                id="demo-consent"
                type="checkbox"
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
                required
              />
              <span>
                I am 18 or older. I understand this free Gemini demo sends my
                input to Google, where unpaid-tier content may be reviewed and
                used to improve services. I will not enter personal, sensitive,
                or confidential information.
              </span>
            </label>
          </>
        )}
        {error && (
          <p className="demo-message error" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="demo-message success" role="status">
            {notice}
          </p>
        )}
        {runtimeStatus?.available && (
          <div className="demo-workbench-actions">
            <button
              className="button button-primary"
              type="submit"
              disabled={busy || !confirmed || input.trim().length < 3}
            >
              {busy ? "Generating..." : "Generate draft"}
              <Sparkles size={16} aria-hidden="true" />
            </button>
            <button
              className="button button-secondary"
              type="button"
              onClick={reset}
              disabled={busy}
            >
              Reset <RotateCcw size={15} aria-hidden="true" />
            </button>
          </div>
        )}
      </form>
      <section
        className="demo-output-card"
        aria-labelledby="demo-output-title"
        aria-live="polite"
      >
        <div className="demo-output-heading">
          <div>
            <p className="eyebrow small">AI-generated draft</p>
            <h3 id="demo-output-title">Output</h3>
          </div>
          {output && (
            <button
              className="icon-button"
              type="button"
              onClick={copyOutput}
              aria-label="Copy output"
              title="Copy output"
            >
              <Clipboard size={17} aria-hidden="true" />
            </button>
          )}
        </div>
        {output ? (
          <pre className="demo-output-text">{output}</pre>
        ) : (
          <p className="muted">
            {runtimeStatus?.available
              ? "Your result will appear here after you run the demo."
              : "No example output is fabricated. A result appears here only after a real Gemini request is enabled and completed."}
          </p>
        )}
        <p className="demo-output-disclaimer">
          Verify all facts and review drafts before use. Demo output is not
          professional advice or a decision.
        </p>
      </section>
    </div>
  );
}
