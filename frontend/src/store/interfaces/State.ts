export default interface State {
  [key: string]: any;

  TAB_SIZE: number;
  LINE_NUMBERS: boolean;
  LANGUAGE: string;

  styles: {
    [key: string]: {
      [key: string]: string;
    }
  };
}