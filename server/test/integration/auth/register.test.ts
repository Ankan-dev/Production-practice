import {describe, it, expect,beforeAll,afterAll} from 'vitest'
import request from 'supertest'
import app from '../../../src/app.js'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongoServer:any

beforeAll(async()=>{
    mongoServer= await MongoMemoryServer.create();
    const mongoURI = mongoServer.getUri();

    const connectDb = await mongoose.connect(mongoURI)

    if(connectDb.connection.readyState===1){
        console.log("Database is connected successfully")
    }
})


afterAll(async()=>{
    if(mongoServer){
        await mongoServer.stop()
    }
    mongoose.connection.close()
})

describe("auth tests",()=>{

    const registerRoute='/api/auth/register'
    

    it("Expection 201 when proper credentials are provided",async ()=>{
        const response = await request(app)
                                .post(registerRoute)
                                .send({
                                    name:"Ankan Mandal",
                                    email:"ankan@sample.com",
                                    password:"Ankan@123"
                                })
        
        expect(response.status).toBe(201)
        expect(response.body.user.id).toBeDefined()
        
        expect(response.body.user.name).toBe("Ankan Mandal")
        expect(response.body.user.email).toBe("ankan@sample.com")
        expect(response.headers["set-cookie"]).toBeDefined()

    })


    it("Expecting 400 if any credential is missing", async ()=>{
        const respone = await request(app)
                            .post(registerRoute)
                            .send({
                                name:"Ankan Mandal",
                                email:"",
                                password:"ankan@123"
                            })

        expect(respone.status).toBe(400)
    })

    it("Expecting 400 if dublicate user data is sent", async ()=>{
        const response = await request(app)
                                .post(registerRoute)
                                .send({
                                    name:"Ankan Mandal",
                                    email:"ankan@sample.com",
                                    password:"Ankan@123"
                                })

        expect(response.status).toBe(400)
    })


    
})