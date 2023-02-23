const request = require('supertest');
const test_server = require('../../server');

const VALID_REQUEST = {
    httpMethod: 'POST',
    path: '/.netlify/functions/messages',
    headers: {
      'content-type': 'application/json'
    },
    body: '{foo:bar}'
  }
  

describe('Server test suite', () => {
    test("Catch-all route", async () => {
        const res = await request(test_server).get("/");
        expect(res.body).toEqual({ message: "SENIOR PROJECT BACKEND" });
        expect(res.statusCode).toEqual(200);
    });
});

// describe('Booking test suite', () => {
//   test("Catch-all route", async () => {
//       const res = await request(test_server).post("/book");
//       expect(res.body).toEqual({ message: "SENIOR PROJECT BACKEND" });
//       expect(res.statusCode).toEqual(200);
//   });
// });