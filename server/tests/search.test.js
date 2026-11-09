import test from "node:test";
import assert from "node:assert/strict";
import { escapeRegex, skillPattern } from "../utils/search.js";

test("java does not match JavaScript", () => {
  assert.equal(skillPattern("java").test("JavaScript"), false);
  assert.equal(skillPattern("java").test("Java"), true);
});

test("c does not match C++ or C#, but matches C", () => {
  assert.equal(skillPattern("c").test("C++"), false);
  assert.equal(skillPattern("c").test("C#"), false);
  assert.equal(skillPattern("c").test("C"), true);
});

test("c++ matches C++", () => {
  assert.equal(skillPattern("c++").test("C++"), true);
});

test("node matches Node.js but not Nodemailer", () => {
  assert.equal(skillPattern("node").test("Node.js"), true);
  assert.equal(skillPattern("node").test("Nodemailer"), false);
});

test("matching ignores upper and lower case", () => {
  assert.equal(skillPattern("REACT").test("react"), true);
});

test("escapeRegex neutralises special characters", () => {
  assert.equal(escapeRegex("a.b*c"), "a\\.b\\*c");
  assert.doesNotThrow(() => skillPattern("(((").test("anything"));
});