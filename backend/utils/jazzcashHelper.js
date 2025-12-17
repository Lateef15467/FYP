import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

export const generateJazzcashHash = (data) => {
  const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT || "";

  const orderedKeys = [
    "pp_Amount",
    "pp_BillReference",
    "pp_Description",
    "pp_Language",
    "pp_MerchantID",
    "pp_Password",
    "pp_ReturnURL",
    "pp_TxnCurrency",
    "pp_TxnDateTime",
    "pp_TxnRefNo",
    "pp_TxnType",
    "pp_Version",
  ];

  const values = orderedKeys.map((key) => String(data[key] || ""));
  const stringToHash = integritySalt + "&" + values.join("&");

  return crypto
    .createHash("sha256")
    .update(stringToHash)
    .digest("hex")
    .toUpperCase();
};
