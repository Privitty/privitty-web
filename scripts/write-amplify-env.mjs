import fs from "fs";

const keys = [
  "DATABASE_URL",
  "DIRECT_URL",
  "S3_REGION",
  "S3_BUCKET",
  "S3_ACCESS_KEY_ID",
  "S3_SECRET_ACCESS_KEY",
  "S3_CUSTOM_DOMAIN",
  "NEXT_PUBLIC_S3_REGION",
  "NEXT_PUBLIC_S3_BUCKET",
  "NEXT_PUBLIC_S3_CUSTOM_DOMAIN",
  "ADMIN_INITIAL_EMAIL",
  "ADMIN_INITIAL_PASSWORD",
  "ADMIN_INITIAL_NAME",
];

const lines = keys
  .filter((key) => process.env[key])
  .map((key) => `${key}=${JSON.stringify(process.env[key])}`);

fs.writeFileSync(".env.production", `${lines.join("\n")}\n`);
console.log(`Wrote ${lines.length} environment variables to .env.production`);
