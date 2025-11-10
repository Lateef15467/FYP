import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

export const generateJazzcashHash = (data) => {
  const integritySalt = process.env.JAZZCASH_INTEGERITY_SALT;
  const sortedKeys = Object.keys(data).sort();
  const sortedValues = sortedKeys.map((key) => data[key]);
  const stringToHash = `${integritySalt}&${sortedValues.join("&")}`;
  const hash = crypto
    .createHash("sha256")
    .update(stringToHash)
    .digest("hex")
    .toUpperCase();
  return hash;
};
