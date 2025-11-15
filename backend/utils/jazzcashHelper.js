import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

export const generateJazzcashHash = (data) => {
  // Remove empty fields and the secure hash field itself
  const filtered = Object.keys(data)
    .filter((k) => data[k] !== "" && k !== "pp_SecureHash")
    .sort(); // alphabetical order

  // Build concatenated string of values in alphabetical key order
  const valuesConcat = filtered.map((k) => String(data[k])).join("&");

  // JazzCash expects: integritySalt + "&" + <valuesConcatenated>
  const hashString = `${process.env.JAZZCASH_INTEGRITY_SALT}&${valuesConcat}`;

  const hash = crypto
    .createHash("sha256")
    .update(hashString)
    .digest("hex")
    .toUpperCase();
  return hash;
};
