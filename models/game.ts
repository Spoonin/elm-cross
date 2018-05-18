import Field from "../models/field";

export default class Game {
  id: string;
  private dirty = false;
  field: Field;
  player1: [string, number];
  player2: [string, number];
  constructor(id: string, player1: string, player2: string) {
    this.id = id;
    this.player1 = [player1, 0];
    this.player2 = [player2, 0];
    this.field = new Field(3);
  }
  private getPlayer(id: string): [string, number] {
    return this.player1[0] === id ? this.player1 : this.player2;
  }
  private getPlayerId(sign: 1 | -1): string {
    if (sign !== 1 || sign !== <number>-1) {
      throw new Error("invalid sign");
    }
    if (this.player1[1] === 0) {
      throw new Error("sign hasn't been set");
    }
    return this.player1[1] === sign ? this.player1[0] : this.player2[0];
  }
  private getOpponent(id: string): [string, number] {
    return this.player1[0] !== id ? this.player1 : this.player2;
  }
  isPlayer(id: string): boolean {
    return this.player1[0] === id || this.player2[0] === id;
  }
  move(id: string, col: number, row: number): void {
    if (this.isFinished()) {
      throw new Error("game is ended");
    }
    if (!this.dirty) {
      this.getPlayer(id)[1] = 1;
      this.getOpponent(id)[1] = -1;
      this.dirty = true;
    }
    this.field.setMove(this.getPlayer(id)[1], row, col);
  }
  getWinner(): string | null {
    const winnerSign = this.field.getWinnerSign();
    if (winnerSign === 1 || winnerSign === -1) {
      return this.getPlayerId(winnerSign);
    }
    return null;
  }
  isFinished(): boolean {
    return this.getWinner() !== null;
  }
}
