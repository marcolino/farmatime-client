import { getMetaValue } from "./libs/Misc";

const config = getMetaValue("config"); // get config injected by server in meta tag with name "config"

export default config;
