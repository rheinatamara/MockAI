const { encode, decode } = require("../helpers/bcrypt"); // Assuming it's in the same directory

describe("Bcrypt Utility Functions", () => {
  const dummyPassword = "dummyPassword123";
  let hashedPassword;

  beforeAll(() => {
    // Generate a hash before running tests
    hashedPassword = encode(dummyPassword);
  });

  test("encode() should hash the password", () => {
    expect(hashedPassword).not.toBe(dummyPassword);
    expect(hashedPassword).toMatch(/^\$2[ayb]\$.{56}$/); // Regex for bcrypt hashes
  });

  test("decode() should return true for the correct password", () => {
    expect(decode(dummyPassword, hashedPassword)).toBe(true);
  });

  test("decode() should return false for an incorrect password", () => {
    expect(decode("wrongPassword", hashedPassword)).toBe(false);
  });
});
