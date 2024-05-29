// test/pruebainicial.test.js
const request = require("supertest");
const app = require("../index.js");

describe("Ejemplo simple, test que no falla", () => {
    it("Simplemente compruebo si true === true", () => {
        expect(true).toBe(true);
    });
});

describe("GET Hola Mundo!", () => {
    it("Debería devolver Hola Mundo!", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual("Hola Mundo!");
    });
});

describe("GET _isalive", () => {
    it("Debería devolver Servidor iniciado en ...", async () => {
        const res = await request(app).get("/_isalive");
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain("Servidor iniciado en");
    });
});

describe("GET 404", () => {
    it("Debería devolver error 404", async () => {
        const res = await request(app).get("/urlinexistente");
        expect(res.statusCode).toEqual(404);
        expect(res.text).toEqual("No encontrada!");
    });
});
