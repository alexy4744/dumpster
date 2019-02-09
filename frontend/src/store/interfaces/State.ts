export default interface State {
  [key: string]: any;

  TAB_SIZE: number;
  LINE_NUMBERS: boolean;
  LANGUAGE: string;

  styles: {
    [key: string]: {
      [key: string]: string;
    }

    input: {
      [key: string]: string;

      fontSize: string;
      lineHeight: string;
    },

    prism: {
      [key: string]: string;

      fontSize: string;
      lineHeight: string;
    },

    lineNumbers: {
      [key: string]: string;

      width: string;
    }
  };
}