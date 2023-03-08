const request = require('supertest');
const test_server = require('../../server');
const test_BookingController = require("../controllers/booking.controller");
import Express from 'express';

describe('Server test suite', () => {
    test("Catch-all route", async () => {
        const res = await request(test_server).get("/");
        expect(res.body).toEqual({ message: "SENIOR PROJECT BACKEND" });
        expect(res.statusCode).toEqual(200);
    });
  
    test('book/getall ', async () => {    
      await request(test_server).get("/book/getall").set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imtla0BrZWsua3oiLCJpYXQiOjE2NzcxNzA1MzMsImV4cCI6MTY3OTc2MjUzM30.7yDN89dWHpGGx2LJhZJCWp70jX7q9DL4vnFURjKIEhY").expect(201);
    })

    test('book ', async () => {    
      const appointment = {
        patient_id: 1,
        specialist_id: 2,
        appointed_at: '2023-11-16T19:00:00.001Z',
        comments: 'some comments',
      }
      await request(test_server).post("/book").set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imtla0BrZWsua3oiLCJpYXQiOjE2NzcxNzA1MzMsImV4cCI6MTY3OTc2MjUzM30.7yDN89dWHpGGx2LJhZJCWp70jX7q9DL4vnFURjKIEhY").send(appointment).expect(400);
    })

    test('/book/getbypatientid ', async () => {  
      const appointment = {
        patient_id: 1,
        specialist_id: 2,
        appointed_at: '2023-11-16T19:00:00.001Z',
        comments: 'some comments',
      }  
      await request(test_server).post("/book/getbypatientid").set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imtla0BrZWsua3oiLCJpYXQiOjE2NzcxNzA1MzMsImV4cCI6MTY3OTc2MjUzM30.7yDN89dWHpGGx2LJhZJCWp70jX7q9DL4vnFURjKIEhY").send(appointment).expect(201);
    })
    
    test('/book/getbyspecialistid ', async () => { 
      const appointment = {
        patient_id: 1,
        specialist_id: 2,
        appointed_at: '2023-11-16T19:00:00.001Z',
        comments: 'some comments',
      }     
      await request(test_server).post("/book/getbyspecialistid").set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imtla0BrZWsua3oiLCJpYXQiOjE2NzcxNzA1MzMsImV4cCI6MTY3OTc2MjUzM30.7yDN89dWHpGGx2LJhZJCWp70jX7q9DL4vnFURjKIEhY").send(appointment).expect(201);
    })

    test('/book/update ', async () => {    
      await request(test_server).post("/book/update").set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imtla0BrZWsua3oiLCJpYXQiOjE2NzcxNzA1MzMsImV4cCI6MTY3OTc2MjUzM30.7yDN89dWHpGGx2LJhZJCWp70jX7q9DL4vnFURjKIEhY").expect(500);
    })

    test('/book/delete ', async () => {    
      await request(test_server).post("/book/delete").set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imtla0BrZWsua3oiLCJpYXQiOjE2NzcxNzA1MzMsImV4cCI6MTY3OTc2MjUzM30.7yDN89dWHpGGx2LJhZJCWp70jX7q9DL4vnFURjKIEhY").expect(500);
    })

    test('/book/approve ', async () => {    
      await request(test_server).post("/book/approve").set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imtla0BrZWsua3oiLCJpYXQiOjE2NzcxNzA1MzMsImV4cCI6MTY3OTc2MjUzM30.7yDN89dWHpGGx2LJhZJCWp70jX7q9DL4vnFURjKIEhY").expect(500);
    })

    });