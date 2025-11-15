import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

export const generateJazzcashHash = (data) => {
  const salt = process.env.JAZZCASH_INTEGRITY_SALT;

  const sortedKeys = Object.keys(data).sort(); // alphabetically
  const sortedValues = sortedKeys.map((key) => data[key]);

  const stringToHash = salt + "&" + sortedValues.join("&");

  return crypto
    .createHash("sha256")
    .update(stringToHash)
    .digest("hex")
    .toUpperCase();
};
