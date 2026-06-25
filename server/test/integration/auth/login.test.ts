import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../../src/app.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { User } from "../../../src/models/User.js";
import bcrypt from "bcryptjs";

let mongoServer: any;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const url = mongoServer.getUri()
    const connectToDb = await mongoose.connect(url)
    if (connectToDb.connection.readyState === 1) {
        console.log("Database is connected")
    }
})

afterAll(async () => {
    if (mongoServer) {
        mongoServer.stop()
    }
    mongoose.connection.close()
})

describe("login test", () => {
    const loginRoute = '/api/auth/login'
    const profileRoute = '/api/auth/me'
    const logoutRoute = '/api/auth/logout'
    let cookie:string
    it("Expecting 200 while logging in with right credentials", async () => {

        const hashedPassword = await bcrypt.hash("Ankan@123", 10);
        await User.create({
            name: "Ankan Mandal",
            email: "ankan@sample.com",
            password: hashedPassword
        })
        const response = await request(app)
            .post(loginRoute)
            .send({
                email: "ankan@sample.com",
                password: "Ankan@123"
            })

       expect(response.status).toBe(200)
        expect(response.body.user.id).toBeDefined()
        expect(response.body.user.email).toBe("ankan@sample.com")
        expect(response.body.user.name).toBe("Ankan Mandal")
        
        cookie = response.headers['set-cookie'][0]
        

        expect(cookie).toBeDefined()
        expect(cookie).toContain('token=')
    })


    it("Expecting 400 with wrong credentials",async ()=>{
        const response = await request(app)
            .post(loginRoute)
            .send({
                email: "ankan@sample.com",
                password: "Ankan@1234"
            })
        expect(response.status).toBe(400)
    })

    it("expecting 200 from profile protected route with right auth cookies",async ()=>{
        const response = await request(app)
                                .get(profileRoute)
                                .set("Cookie",cookie)
        
        expect(response.status).toBe(200)
        expect(response.body.user.id).toBeDefined()
        expect(response.body.user.email).toBe("ankan@sample.com")
        expect(response.body.user.name).toBe("Ankan Mandal")
    })

    it("expecting 401 when cookies are not preset from the protected route", async ()=>{
        const response = await request(app)
                        .get(profileRoute)
                        .set("cookie","")

        expect(response.status).toBe(401)
    })

    it("expecting no cookie on logout",async ()=>{
        const response = await request(app)
                                .post(logoutRoute)

        const cookies = response.headers['set-cookie'][0]

        expect(cookies).toContain('token=')
        expect(cookies).toContain('Expires=')
    })
})