import fs, { Stats } from "fs";
import path from "path";

const allFiles: string[] = [];

let currentIndex: number = 0;

const walker = async (cwd: string, dir: string): Promise<string[]> => {
  const target: string = path.join(cwd, dir);

  try {
    const childrens: string[] = await fs.promises.readdir(target);

    for (const children of childrens) {
      const isDirectory: boolean = await fs.promises
        .stat(path.join(target, children))
        .then((stat: Stats): boolean => stat.isDirectory());

      if (isDirectory) {
        await walker(cwd, path.join(dir, children));
      } else {
        // tslint:disable-next-line: newline-per-chained-call
        allFiles[currentIndex] = `./${path.join(dir, children).replace("\\", "/")}`;
        currentIndex++;
      }
    }
  } catch (error) {
    return Promise.reject(error);
  }

  return Promise.resolve(allFiles);
};

export default walker;