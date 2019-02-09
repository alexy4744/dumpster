import { introduction, paste, upload } from "./BASE";

export default `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Welcome to Dumpster!</title>
    <script src="/assets/welcome.js"></script>
  </head>
  <body>
    <h1>WHAT IS DUMPSTER?</h1>
    <p>
      ${introduction}
    </p>

    <h1>HOW TO UPLOAD PASTES</h1>
    <p>
      ${paste}
    </p>

    <h1>HOW TO UPLOAD FILES</h1>
    <p>
      ${upload}
    </p>
  </body>
</html>
`;