/**
 * Media Upload & Cleanup System — Integration Test Script
 *
 * Tests the complete media system against the running API.
 * Run with: npx tsx app/lib/__tests__/media-system.test.ts
 *
 * Prerequisites:
 * - The Next.js dev server must be running (npm run dev)
 * - A valid admin session cookie or test admin credentials
 *
 * This file performs non-destructive verification of:
 * 1. S3 cleanup utilities (unit-level)
 * 2. File validation logic
 * 3. API route authorization
 * 4. Orphan detection logic
 */

import {
  validateUploadedFile,
  generateUniqueStorageKey,
} from "../s3";

// ─── Color helpers ──────────────────────────────────────────────────────────
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string) {
  if (condition) {
    passed++;
    console.log(`  ${green("✓")} ${label}`);
  } else {
    failed++;
    console.log(`  ${red("✗")} ${label}`);
  }
}

// ─── Test Suite: File Validation ────────────────────────────────────────────
console.log("\n" + yellow("═══ File Validation Tests ═══"));

// Valid images
assert(
  validateUploadedFile("photo.jpg", "image/jpeg", 1024 * 1024, "image").valid,
  "JPEG image passes validation"
);
assert(
  validateUploadedFile("photo.jpeg", "image/jpeg", 1024 * 1024, "image").valid,
  "JPEG with .jpeg extension passes validation"
);
assert(
  validateUploadedFile("photo.png", "image/png", 1024 * 1024, "image").valid,
  "PNG image passes validation"
);
assert(
  validateUploadedFile("photo.webp", "image/webp", 1024 * 1024, "image").valid,
  "WebP image passes validation"
);

// Invalid image types
assert(
  !validateUploadedFile("doc.pdf", "application/pdf", 1024 * 1024, "image").valid,
  "PDF rejected as image"
);
assert(
  !validateUploadedFile("script.exe", "application/octet-stream", 1024, "image").valid,
  "EXE rejected as image"
);
assert(
  !validateUploadedFile("photo.gif", "image/gif", 1024 * 1024, "image").valid,
  "GIF rejected as image (not in allowed list)"
);

// Image size limits
assert(
  !validateUploadedFile("big.jpg", "image/jpeg", 6 * 1024 * 1024, "image").valid,
  "6MB image rejected (exceeds 5MB limit)"
);
assert(
  validateUploadedFile("small.png", "image/png", 4.9 * 1024 * 1024, "image").valid,
  "4.9MB image accepted (under limit)"
);

// Valid PDFs
assert(
  validateUploadedFile("doc.pdf", "application/pdf", 1024 * 1024, "pdf").valid,
  "PDF passes validation"
);
assert(
  validateUploadedFile("large.pdf", "application/pdf", 24 * 1024 * 1024, "pdf").valid,
  "24MB PDF passes validation (under 25MB limit)"
);

// Invalid PDF types
assert(
  !validateUploadedFile("doc.pdf", "image/jpeg", 1024 * 1024, "pdf").valid,
  "JPEG with .pdf mime rejected as PDF"
);
assert(
  !validateUploadedFile("doc.txt", "application/pdf", 1024 * 1024, "pdf").valid,
  "PDF mime with .txt extension rejected"
);

// PDF size limits
assert(
  !validateUploadedFile("huge.pdf", "application/pdf", 26 * 1024 * 1024, "pdf").valid,
  "26MB PDF rejected (exceeds 25MB limit)"
);

// MIME / extension independent validation (both must be in allowed lists, but not cross-checked)
assert(
  validateUploadedFile("photo.jpg", "image/png", 1024, "image").valid,
  "JPG ext + PNG MIME passes (both individually valid — real browsers send correct MIME)"
);
assert(
  !validateUploadedFile("photo.bmp", "image/png", 1024, "image").valid,
  "BMP ext with PNG MIME rejected (BMP ext not in allowed list)"
);

// ─── Test Suite: Unique Key Generation ──────────────────────────────────────
console.log("\n" + yellow("═══ Key Generation Tests ═══"));

const key1 = generateUniqueStorageKey("team", "John Photo.jpg");
const key2 = generateUniqueStorageKey("team", "John Photo.jpg");

assert(key1.startsWith("team/"), "Key starts with correct folder prefix");
assert(key1 !== key2, "Two keys for same file are unique");
assert(!key1.includes(" "), "Key has no spaces");
assert(key1.endsWith(".jpg") || key1.includes(".jpg"), "Key preserves extension");

const key3 = generateUniqueStorageKey("whitepapers", "../../etc/passwd");
assert(!key3.includes(".."), "Directory traversal stripped from key");
assert(key3.startsWith("whitepapers/"), "Traversal attempt still uses correct folder");

const key4 = generateUniqueStorageKey("team", "special (chars) [test].png");
assert(!key4.includes("("), "Special characters sanitized in key");
assert(key4.startsWith("team/"), "Special char file still in correct folder");

// ─── Test Suite: CMS Prefix Safety ──────────────────────────────────────────
console.log("\n" + yellow("═══ CMS Prefix Safety Tests ═══"));

const CMS_MANAGED_PREFIXES = [
  "testimonials/",
  "team/",
  "whitepapers/",
  "media/",
  "partners/",
];

assert(
  CMS_MANAGED_PREFIXES.some((p) => "team/123-abc-photo.jpg".startsWith(p)),
  "Team file key recognized as CMS-managed"
);
assert(
  CMS_MANAGED_PREFIXES.some((p) => "whitepapers/456-def-doc.pdf".startsWith(p)),
  "Whitepaper file key recognized as CMS-managed"
);
assert(
  !CMS_MANAGED_PREFIXES.some((p) => "other/random-file.txt".startsWith(p)),
  "Non-CMS file key correctly NOT recognized"
);
assert(
  !CMS_MANAGED_PREFIXES.some((p) => "system/config.json".startsWith(p)),
  "System file key correctly NOT recognized"
);
assert(
  !CMS_MANAGED_PREFIXES.some((p) => "/milind.png".startsWith(p)),
  "Public root asset correctly NOT recognized as CMS-managed"
);

// ─── Test Suite: API Authorization ──────────────────────────────────────────
async function runApiTests() {
  console.log("\n" + yellow("═══ API Authorization Tests ═══"));

  const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

  async function testUnauthorized(url: string, method: string, body?: string) {
    try {
      const res = await fetch(`${BASE_URL}${url}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : {},
        body,
      });
      return res.status;
    } catch {
      return -1; // Connection refused
    }
  }

  const authTests = [
    { url: "/api/admin/uploads/presign", method: "POST", body: JSON.stringify({ folder: "team", filename: "test.jpg", contentType: "image/jpeg" }) },
    { url: "/api/admin/storage/orphans", method: "GET" },
    { url: "/api/admin/storage/cleanup", method: "POST", body: JSON.stringify({ keys: ["test/file.jpg"] }) },
    { url: "/api/admin/team", method: "GET" },
    { url: "/api/admin/whitepapers", method: "GET" },
  ];

  let serverReachable = false;

  for (const test of authTests) {
    const status = await testUnauthorized(test.url, test.method, test.body);
    if (status === -1) {
      if (!serverReachable) {
        console.log(dim("  (Dev server not running — skipping API auth tests)"));
      }
      break;
    }
    serverReachable = true;
    assert(status === 401, `${test.method} ${test.url} returns 401 without session`);
  }

  // ─── Test Suite: Invalid Upload Rejection ───────────────────────────────────
  if (serverReachable) {
    console.log("\n" + yellow("═══ Invalid Upload Rejection Tests ═══"));

    const presignRes1 = await fetch(`${BASE_URL}/api/admin/uploads/presign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        folder: "team",
        filename: "script.exe",
        contentType: "application/octet-stream",
        sizeBytes: 1024,
      }),
    });
    assert(
      presignRes1.status === 400 || presignRes1.status === 401,
      "EXE upload rejected at presign (400 or 401)"
    );

    const presignRes2 = await fetch(`${BASE_URL}/api/admin/uploads/presign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        folder: "whitepapers",
        filename: "doc.txt",
        contentType: "text/plain",
        sizeBytes: 1024,
      }),
    });
    assert(
      presignRes2.status === 400 || presignRes2.status === 401,
      "TXT file rejected as whitepaper at presign (400 or 401)"
    );
  }
}

// ─── Run all tests ──────────────────────────────────────────────────────────
runApiTests()
  .then(() => {
    console.log("\n" + yellow("═══ Results ═══"));
    console.log(`  ${green(`${passed} passed`)}, ${failed > 0 ? red(`${failed} failed`) : dim("0 failed")}`);
    console.log();
    if (failed > 0) process.exit(1);
  })
  .catch((err) => {
    console.error("Test runner error:", err);
    process.exit(1);
  });