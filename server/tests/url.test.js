import test from "node:test";
import assert from "node:assert/strict";
import { isHttpUrl } from "../utils/url.js";

test("accepts normal http and https links", () => {
  assert.equal(isHttpUrl("https://drive.google.com/file/d/abc/view"), true);
  assert.equal(isHttpUrl("  http://example.com/resume.pdf  "), true);
});

test("rejects other schemes", () => {
  assert.equal(isHttpUrl("javascript:alert(1)"), false);
  assert.equal(isHttpUrl("ftp://example.com/a.pdf"), false);
  assert.equal(isHttpUrl("data:text/html,<script>1</script>"), false);
});

test("rejects things that are not links", () => {
  assert.equal(isHttpUrl("not a link"), false);
  assert.equal(isHttpUrl(""), false);
  assert.equal(isHttpUrl(undefined), false);
  assert.equal(isHttpUrl({ a: 1 }), false);
});

test("rejects absurdly long links", () => {
  assert.equal(isHttpUrl("https://example.com/" + "a".repeat(2100)), false);
});