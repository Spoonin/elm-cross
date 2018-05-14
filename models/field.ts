export default class Field {
  private fieldMatrix: number[][];
  private size: number;
  constructor(size: number) {
    this.size = size;

    this.fieldMatrix = [];

    for (let i = 0; i < size; i++) {
      this.fieldMatrix[i] = [];

      for (let j = 0; j < size; j++) {
        this.fieldMatrix[i][j] = 0;
      }
    }
  }
  setMove(sign: number, row: number, col: number) {
    this.fieldMatrix[row][col] = sign;
  }
}
