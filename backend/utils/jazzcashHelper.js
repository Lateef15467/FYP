// utils/jazzcashHelper.js
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

/**
 * Generates JazzCash pp_SecureHash.
 *
 * Rules applied:
 * - Exclude fields with empty string values
 * - Exclude pp_SecureHash itself and pp_Password from the hash fields
 * - Sort keys alphabetically
 * - Concatenate values in key order with '&'
 * - Prepend integrity salt and '&'
 * - Use HMAC-SHA256 with integrity salt (result uppercased hex)
 *
 * @param {Object} data - object of pp_ fields (should NOT include pp_Password)
 * @returns {string} uppercase hex HMAC-SHA256
 */
export const generateJazzcashHash = (data) => {
  const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT;
  if (!integritySalt) {
    throw new Error("Missing JAZZCASH_INTEGRITY_SALT in env");
  }

  // Filter keys: exclude empty values, exclude pp_SecureHash and pp_Password
  const filteredKeys = Object.keys(data)
    .filter((k) => {
      const v = data[k];
      return (
        v !== "" &&
        v !== null &&
        v !== undefined &&
        k !== "pp_SecureHash" &&
        k !== "pp_Password"
      );
    })
    .sort();

  // Build string of values in alphabetical order of keys
  const valuesString = filteredKeys.map((k) => String(data[k])).join("&");

  // Prepend integrity salt + '&'
  const stringToSign = `${integritySalt}&${valuesString}`;

  // Use HMAC-SHA256 with integrity salt as the key (JazzCash expects this)
  const hmac = crypto
    .createHmac("sha256", integritySalt)
    .update(stringToSign)
    .digest("hex")
    .toUpperCase();

  return hmac;
};

export default generateJazzcashHash;
