import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

export const generateJazzcashHash = (data) => {
  const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT; // ✅ correct name

  // ✅ Remove empty fields and sort keys alphabetically
  const filteredKeys = Object.keys(data)
    .filter((key) => data[key] !== "")
    .sort();

  const stringToHash =
    integritySalt + "&" + filteredKeys.map((key) => data[key]).join("&");

  const hash = crypto
    .createHash("sha256")
    .update(stringToHash)
    .digest("hex")
    .toUpperCase();

  return hash;
};
