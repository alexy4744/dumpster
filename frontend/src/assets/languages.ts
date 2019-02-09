/* File being used by a vuex module and babel to view all valid languages...
  TO-DO: Move this file somewhere else, kind of a shitty location for it */

import { PRSIMJS_LANGUAGES } from "@/../config.json";

export const LANGUAGES: string[] = PRSIMJS_LANGUAGES;

// Make the raw names used by prismjs to something more human friendly
export const FRIENDLY_LANGUAGES: { [key: string]: string } = {
  "clike": "C-Like",
  "c": "C",
  "cpp": "C++",
  "csharp": "C#",
  "css": "CSS",
  "dart": "Dart",
  "elixir": "Elixir",
  "erlang": "Erlang",
  "go": "Go",
  "java": "Java",
  "javascript": "JavaScript",
  "json": "JSON",
  "jsx": "JSX",
  "kotlin": "Kotlin",
  "lua": "Lua",
  "markup": "HTML/XML/SVG/MathML",
  "markdown": "Markdown",
  "php": "PHP",
  "python": "Python",
  "pug": "Pug",
  "ruby": "Ruby",
  "rust": "Rust",
  "sass": "SASS",
  "scss": "SCSS",
  "swift": "Swift",
  "tsx": "TSX",
  "typescript": "TypeScript",
  "visual-basic": "Visual Basic"
};