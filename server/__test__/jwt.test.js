process.env.SECRET_KEY = "test_secret";
const { sign, verify } = require("../helpers/jwt");

describe("JWT Utility Functions", () => {
  const dummyPayload = { id: 1, username: "testUser" };
  let token;

  beforeAll(() => {
    token = sign(dummyPayload);
  });

  test("sign() should return a valid JWT token", () => {
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);
  });

  test("verify() should return the correct payload", () => {
    const decoded = verify(token);
    expect(decoded.id).toBe(dummyPayload.id);
    expect(decoded.username).toBe(dummyPayload.username);
  });

  test("verify() should throw an error for an invalid token", () => {
    expect(() => verify("invalid.token.here")).toThrow();
  });
});
