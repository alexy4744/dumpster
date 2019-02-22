import Console from "@structures/Console";

const console: Console = new Console();

export default (): boolean => {
  const fields: string[] = [
    "RATELIMIT_UPLOAD_POINTS",
    "RATELIMIT_UPLOAD_DURATION",
    "RATELIMIT_DOWNLOAD_POINTS",
    "RATELIMIT_DOWNLOAD_DURATION",
    "RATELIMIT_BASIC_POINTS",
    "RATELIMIT_BASIC_DURATION",
    "HTTP"
  ];

  let failed: boolean = false;

  const missing = (field: string): void => {
    console.error(`[CONFIGURATION] You must set ${field} in process.env!`);
    if (!failed) failed = true;
  };

  for (const field of fields) {
    if (!process.env[field]) missing(field);
  }

  if (!process.env.HTTPS) {
    console.warn("[CONFIGURATION] You should enable HTTPS by specifing its port in process.env!");
  }

  return failed ? false : true;
};