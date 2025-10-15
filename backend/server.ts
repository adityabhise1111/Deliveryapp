import app from './app.ts'
import http from 'http'

const port: number = Number(process.env.PORT) ||3000 ;

const server: http.Server = http.createServer(app)

server.listen(port ,()=>{
    console.log(`Server is running on the localhost://${port}`)
})