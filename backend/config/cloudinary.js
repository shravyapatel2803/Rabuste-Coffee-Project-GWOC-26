import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: "drpwviqnn",
  api_key: "831767874381657",
  api_secret: "cZwE6pkmAabV9cT6b-7B5zzsoIU",
});

export default cloudinary;
