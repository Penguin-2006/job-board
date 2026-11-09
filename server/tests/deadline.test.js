import test from "node:test";
import assert from "node:assert/strict";
import { closesAt, isClosed, startOfTodayInZone, openDeadlineCutoff } from "../utils/deadline.js";

const deadline = new Date("2026-11-10T00:00:00.000Z");

test("a job closes at the end of the deadline day in India (23:59:59.999 IST)", () => {
  assert.equal(closesAt(deadline).toISOString(), "2026-11-10T18:29:59.999Z");
});

test("still open late on the deadline day in India", () => {
  const lateEveningIST = new Date("2026-11-10T18:00:00.000Z").getTime(); // 23:30 IST
  assert.equal(isClosed(deadline, lateEveningIST), false);
});

test("closed once the Indian day is over", () => {
  const justAfter = new Date("2026-11-10T18:30:00.000Z").getTime(); // 00:00 IST, 11 Nov
  assert.equal(isClosed(deadline, justAfter), true);
});

test("a missing deadline is never reported as closed", () => {
  assert.equal(isClosed(undefined), false);
});

test("start of today uses the Indian calendar date", () => {
  const now = new Date("2026-11-07T20:00:00.000Z").getTime();
  assert.equal(startOfTodayInZone(now).toISOString(), "2026-11-08T00:00:00.000Z");
});

test("openDeadlineCutoff agrees with isClosed", () => {
  const now = new Date("2026-11-10T18:00:00.000Z").getTime();
  const cutoff = openDeadlineCutoff(now);
  assert.equal(deadline >= cutoff, !isClosed(deadline, now));

  const later = new Date("2026-11-10T19:00:00.000Z").getTime();
  assert.equal(deadline >= openDeadlineCutoff(later), !isClosed(deadline, later));
});