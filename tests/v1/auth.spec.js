// set application mode to testing
const request = require("supertest");
const app = require("../../api/app");
const db = require("../../api/utils/db");
const { DATABASE_NAME, USERS_COLLECTION } = require("../../config");

const database = db.db(DATABASE_NAME);
const users = database.collection(USERS_COLLECTION);

// example test only will be removed later.
describe("GET /", () => {
  // this test should always pass
  test("should return 200 OK", async () => {
    const status_code = 200;
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(status_code);
  });
  test("should return 404 NOT FOUND", async () => {
    const status_code = 404;
    const res = await request(app).get("/notfound");
    expect(res.statusCode).toBe(status_code);
  });
});

// test user sign up.
describe("POST /api/v1/auth/register", () => {
  test("successful registration should return 201 CREATED", async () => {
    const status_code = 201;
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "test@mail.com",
      password: "password",
      firstName: "test",
      lastName: "user",
    });
    expect(res.statusCode).toBe(status_code);
    expect(res.body.statusCode).toBe(status_code);
    if (res.status_code === status_code) {
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe(["User created successfully."]);
      expect(res.body).toHaveProperty("accesstoken");
      expect(res.body).toHaveProperty("refreshToken");
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("_id");
      expect(res.body.data).toHaveProperty("email");
      expect(res.body.data).toHaveProperty("firstName");
      expect(res.body.data).toHaveProperty("lastName");
      expect(res.body.data.email).toBe("test@mail.com");
      expect(res.body.data.firstName).toBe("test");
      expect(res.body.data.password).toBeUndefined();
      expect(res.body.data.lastName).toBe("user");
    }
  });
  test("wrong email format should return 422 UNPROCESSABLE ENTITY", async () => {
    const status_code = 422;
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "test2mail.com",
      password: "password",
      firstName: "test",
      lastName: "user",
    });
    expect(res.statusCode).toBe(status_code);
    expect(res.body.statusCode).toBe(status_code);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("statusCode");
    expect(res.body.message[0]).toBe("email format is invalid");
  });
  test("duplicate mail should return 409 CONFLICT", async () => {
    const status_code = 409;
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "test@mail.com",
      password: "password",
      firstName: "test",
      lastName: "user",
    });
    expect(res.statusCode).toBe(status_code);
    expect(res.body.statusCode).toBe(status_code);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("statusCode");
    expect(res.body.message[0]).toBe("User already exists.");
  });
  test("missing password should return 422 UNPROCESSABLE ENTITY", async () => {
    const status_code = 422;
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "test3@mail.com",
      firstName: "test",
      lastName: "user",
    });
    expect(res.statusCode).toBe(status_code);
    expect(res.body.statusCode).toBe(status_code);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("statusCode");
    expect(res.body.message[0]).toBe("password is missing");
  });
});

// test user login.
describe("POST /api/v1/auth/login", () => {
  test("successful login should return 200 OK", async () => {
    const status_code = 200;
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "test@mail.com",
      password: "password",
    });
    expect(res.statusCode).toBe(status_code);
    expect(res.body.statusCode).toBe(status_code);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message[0]).toBe("Login successful.");
    expect(res.body).toHaveProperty("accesstoken");
    expect(res.body).toHaveProperty("refreshToken");
  });
  test("wrong email should return 404 NOT FOUND", async () => {
    const status_code = 404;
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "xmail@mail.com",
      password: "password",
    });
    expect(res.statusCode).toBe(status_code);
    expect(res.body.statusCode).toBe(status_code);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message[0]).toBe("User not found.");
  });
  test("wrong password should return 400 BAD REQUEST", async () => {
    const status_code = 400;
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "test@mail.com",
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(status_code);
    expect(res.body.statusCode).toBe(status_code);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message[0]).toBe("Invalid credentials!");
  });
});

beforeAll(async () => {
  // clear the database
  await users.deleteMany({});
});

afterAll(async () => {
  // clear the database
  await users.deleteMany({});
  await db.close();
});
