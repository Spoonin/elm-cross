export default class Field {
  fieldMatrix: number[][];
  private size: number;
  constructor(size: number) {
    if (size <= 0) {
      throw new Error("invalid size");
    }
    this.size = size;

    this.fieldMatrix = [];

    for (let i = 0; i < size; i++) {
      // i -> row number
      this.fieldMatrix[i] = [];

      for (let j = 0; j < size; j++) {
        // j column number
        this.fieldMatrix[i][j] = 0;
      }
    }
  }
  private getMatrixSum(): number {
    return this.fieldMatrix
      .reduce((acc, cur) => acc.concat(cur)) // flatten array
      .reduce((acc, cur) => acc + cur);
  }
  private getRowSum(row: number): number {
    if (row > this.size - 1) {
      throw new Error("invalid row param");
    }
    return this.fieldMatrix[row].reduce((acc, cur) => acc + cur);
  }
  private getColSum(col: number): number {
    if (col > this.size - 1) {
      throw new Error("invalid col param");
    }
    return this.fieldMatrix.map(i => i[col]).reduce((acc, cur) => acc + cur);
  }

  private getDiagSum(): [number, number] {
    const sumDiagonals: [number, number] = [0, 0];

    for (let i = 0; i < this.size; i++) {
      sumDiagonals[0] += this.fieldMatrix[i][i];
      sumDiagonals[1] += this.fieldMatrix[i][this.size - i - 1];
    }
    return sumDiagonals;
  }
  getWinnerSign(): number {
    const checkResult = (res: number) => Math.abs(res) === this.size;
    for (let i = 0; i < this.size; i++) {
      let result = this.getRowSum(i);
      if (checkResult(result)) {
        return result / Math.abs(result);
      }
      result = this.getColSum(i);
      if (checkResult(result)) {
        return result / Math.abs(result);
      }
    }
    const [dm, ds] = this.getDiagSum();
    if (checkResult(dm)) {
      return dm / Math.abs(dm);
    }
    if (checkResult(ds)) {
      return ds / Math.abs(ds);
    }

    return 0;
  }
  getPendingSign(): number {
    return this.getMatrixSum() > 0 ? -1 : 1;
  }
  setMove(sign: number, row: number, col: number): void {
    if (row < 0 || col < 0 || row > this.size - 1 || col > this.size - 1) {
      throw new Error("wrong coordinates");
    }
    if (this.getWinnerSign() !== 0) {
      throw new Error("game has ended");
    }
    if (this.getPendingSign() !== sign) {
      throw new Error("wrong turn");
    }
    if (this.fieldMatrix[row][col] !== 0) {
      throw new Error("move on occupied cell");
    }
    this.fieldMatrix[row][col] = sign;
  }
}
