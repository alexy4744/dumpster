const { PRSIMJS_LANGUAGES } = require("./config");

module.exports = {
  presets: [
    "@vue/app"
  ],

  plugins: [
    ["prismjs", {
      languages: PRSIMJS_LANGUAGES,
      plugins: ["line-numbers"],
      theme: "okaidia",
      css: true
    }]
  ]
};