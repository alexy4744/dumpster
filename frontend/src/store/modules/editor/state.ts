import { LANGUAGES } from "@/assets/languages";
import State from "@/store/interfaces/State";

/* Default values that are used if not set in local storage */
const state: State = {
  TAB_SIZE: 2,
  LINE_NUMBERS: true,
  LANGUAGE: LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)],

  styles: {
    all: {
      fontSize: "16px",
      lineHeight: "24px",
    },

    input: {
      marginLeft: "40px"
    },

    prism: {
      marginLeft: "40px"
    },

    lineNumbers: {
      width: "40px",
    }
  }
};

// Apply local storage values to the state
for (const property in state) {
  if (property !== "styles") {
    const item = localStorage.getItem(property);
    if (!item || item === state[property]) continue;

    state[property] = item;
  } else {
    for (const reference in state[property]) { // input, prism, lineNumbers...
      if (state[property].hasOwnProperty(reference)) {
        for (const prop in state[property][reference]) { // fontSize, lineHeight, width...
          if (state[property][reference].hasOwnProperty(prop)) {
            const userStyle = localStorage.getItem(`${reference}-${prop}`);
            if (!userStyle || userStyle === state[property][reference][prop]) continue;

            state[property][reference][prop] = userStyle;
          }
        }
      }
    }
  }
}

export default state;