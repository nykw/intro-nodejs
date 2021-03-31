const chai = require("chai");
const { expect } = chai;
const usersController = require("../controllers/usersController");

// テストの対象をdescribeブロックで定義する
describe("usersController", () => {
  describe("getUserParams", () => {
    // テストに期待される結果を詳細に記述する
    it("should convert request body to contain the name attributes of the user object", () => {
      const body = {
        first: "Jon",
        last: "Wexler",
        email: "jon@jonwexler.com",
        password: 12345,
        zipCode: 10016
      };

      expect(usersController.getUserParams(body)).to.deep.include({
        name: {
          first: "Jon",
          last: "Wexler"
        }
      });
    });

    it("should return an empty object with empty request body input", () => {
      const emptyBody = {};
      expect(usersController.getUserParams(emptyBody)).to.deep.include({});
    });
  });
});
