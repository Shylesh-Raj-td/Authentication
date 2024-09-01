const request = require("supertest");
const express = require("express");
const server = require("../server");

describe("Session Management", () => {
  let mode;

  beforeAll(() => {
    mode = server.listen(5000);
  });

  afterAll(() => {
    mode.close();
  });
  it("It should login successfully with correct credentials", async () => {
    const response = await request(server)
      .post("/login")
      .send({ username: "admin", password: "admin" });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("success");
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  it("It should fail login with incorrect credentials", async () => {
    const response = await request(server)
      .post("/login")
      .send({ username: "admin", password: "wrongpassword" });

    expect(response.statusCode).toBe(401);
    expect(response.text).toBe("Invalid username or password");
  });

  it("It should return todos for authenticated user", async () => {
    // First, log in to get the session cookie
    const loginResponse = await request(server)
      .post("/login")
      .send({ username: "admin", password: "admin" });

    const cookie = loginResponse.headers["set-cookie"];

    // Then, use the session cookie to access the /todos endpoint
    const todosResponse = await request(server)
      .get("/todos")
      .set("Cookie", cookie);

    expect(todosResponse.statusCode).toBe(200);
    expect(todosResponse.body).toEqual([
      {
        id: 1,
        title: "Learn Node",
        userId: 1,
      },
    ]);
  });

  it("It should return 401 for unauthenticated user", async () => {
    const response = await request(server).get("/todos");

    expect(response.statusCode).toBe(401);
    expect(response.text).toBe("Invalid Session");
  });

  it("It should log out successfully", async () => {
    // First, log in to get the session cookie
    const loginResponse = await request(server)
      .post("/login")
      .send({ username: "admin", password: "admin" });

    const cookie = loginResponse.headers["set-cookie"];

    // Then, log out using the session cookie
    const logoutResponse = await request(server)
      .post("/logout")
      .set("Cookie", cookie);

    expect(logoutResponse.statusCode).toBe(200);
    expect(logoutResponse.text).toBe("Successfully logged out");
  });
});
