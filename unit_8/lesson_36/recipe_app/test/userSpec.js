process.env.NODE_ENV = "test";

const User = require("../models/user");
const { expect } = require("chai");
require("../main");

beforeEach(done => {
  User.remove({})
    .then(() => {
      done();
    });
});

describe("SAVE user", () => {
  it("it should save one user", async () => {
    const testUser = new User({
      name: {
        first: "Jon",
        last: "Wexler"
      },
      email: "jon@jonwexler.com",
      password: 12345,
      zipCode: 10016,
    });

    try {
      await testUser.save();
      const result = await User.find({});
      expect(result.length).to.eq(1);
      expect(result[0]).to.have.property("_id");
    } catch (error) {
      throw new Error("error");
    }
  })
})
