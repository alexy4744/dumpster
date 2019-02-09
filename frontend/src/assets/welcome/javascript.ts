import { introduction, paste, upload } from "./BASE";

export default `
import welcome from "./welcome.js"

console.log(welcome.introduction)

\`${introduction}\`

console.log(welcome.paste)

\`${paste}\`

console.log(welcome.upload)

\`${upload}\`
`;