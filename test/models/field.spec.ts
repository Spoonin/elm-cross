import { expect } from "chai";
import "mocha";

import Field from "../../models/field";

describe("Field class", () => {
  it("throws an error on wrong constructor params", () => {
    expect(() => {
      const t = new Field(-1);
    }).to.throw("invalid size");
  });
  describe(".setMove(sign, row, col)", () => {
    it("sets sign number on specified cell", () => {
      const field = new Field(2);
      field.setMove(1, 1, 1);

      expect(field.fieldMatrix[1][1]).to.eq(1);

      field.setMove(-1, 0, 1);

      expect(field.fieldMatrix[0][1]).to.eq(-1);
    });

    it("throws an error in case of wrong move", () => {
      const field = new Field(2);

      expect(() => {
        field.setMove(-1, 0, 0);
      }).to.throw("wrong turn");

      field.setMove(1, 1, 1);

      expect(() => {
        field.setMove(1, 0, 1);
      }).to.throw("wrong turn");

      expect(() => {
        field.setMove(-1, 1, 1);
      }).to.throw("move on occupied cell");

      expect(() => {
        field.setMove(0, 0, 1);
      }).to.throw("wrong turn");

      expect(() => {
        field.setMove(-1, 0, -1);
      }).to.throw("wrong coordinates");

      expect(() => {
        field.setMove(-1, 3, 1);
      }).to.throw("wrong coordinates");
    });
  });
  describe(".getPendingSign()", () => {
    it("reutrns 1 as start sign", () => {
      const field = new Field(2);
      expect(field.getPendingSign()).to.eq(1);
    });
    it("switches returned sign every move", () => {
      const field = new Field(2);
      expect(field.getPendingSign()).to.eq(1);
      field.setMove(1, 0, 0);
      expect(field.getPendingSign()).to.eq(-1);
      field.setMove(-1, 0, 0);
      expect(field.getPendingSign()).to.eq(1);
    });
  });
  describe(".getWinnerSign()", () => {
    it("returns the sign for winner, or 0 if game is not ended", () => {
      const field1 = new Field(2);
      field1.setMove(1, 0, 0);
      expect(field1.getWinnerSign()).to.eq(0);
      field1.setMove(-1, 0, 1);
      expect(field1.getWinnerSign()).to.eq(0);
      field1.setMove(1, 1, 1);
      expect(field1.getWinnerSign()).to.eq(1);

      const field2 = new Field(2);
      field2.setMove(1, 0, 0);
      field2.setMove(-1, 1, 1);
      field2.setMove(1, 0, 1);
      expect(field2.getWinnerSign()).to.eq(1);

      const field3 = new Field(3);
      field3.setMove(1, 0, 0);
      field3.setMove(-1, 0, 2);
      field3.setMove(1, 0, 1);
      field3.setMove(-1, 1, 2);
      field3.setMove(1, 1, 0);
      field3.setMove(-1, 2, 2);
      expect(field3.getWinnerSign()).to.eq(-1);
    });
  });
});
