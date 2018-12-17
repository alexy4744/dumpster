import { promises, Stats } from "fs";
import path from "path";

const allFiles: string[] = [];

let currentIndex = 0;

const walker = async (cwd: string, dir: string): Promise<string[]> => {
  const target = path.join(cwd, dir);

  try {
    const childrens: string[] = await promises.readdir(target);

    for (const children of childrens) {
      const isDirectory = await promises.stat(path.join(target, children)).then((stat: Stats) => stat.isDirectory());

      if (isDirectory) {
        await walker(cwd, path.join(dir, children));
      } else {
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