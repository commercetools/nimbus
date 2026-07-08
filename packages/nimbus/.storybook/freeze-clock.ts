import isChromatic from "chromatic/isChromatic";
import MockDate from "mockdate";

// Freeze the clock for Chromatic snapshots only: date components read the live
// clock (today() in story args, React Aria's "today" cell) and drift daily.
if (isChromatic()) {
  MockDate.set("2026-05-15T12:00:00Z");
}
