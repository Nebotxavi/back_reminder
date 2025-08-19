import { IdGenerator } from "./idGenerator/index.js";
import { encodeBase62 } from "./utils/general.js";

const generator = new IdGenerator(0, 0);

const ids = Array.from({ length: 10000 }, () => generator.getId());

const shortUrls = ids.map((id) => encodeBase62(id));

console.log("shortUrls", shortUrls);
