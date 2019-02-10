import { introduction, paste, upload } from "./BASE";

export default `
const { introduction, paste, upload } = require("./welcome.js");

console.log(introduction);

\`${introduction}\`

console.log(paste);

\`${paste}\`

console.log(upload);

\`${upload}\`
`;