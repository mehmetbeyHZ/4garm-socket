var serialport = require('serialport');
var portName = '/dev/ttyUSB0';
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3133

// CommonJS
const io = require("socket.io-client");

const socket = io("http://195.201.168.87:3132/");




var myPort = new serialport(portName, {
    baudRate: 9600,
    parser: new serialport.parsers.Readline('\n')
});


myPort.on('open', onOpen);
myPort.on('data', onData);

function onOpen(){
    console.log('Open connections!');
}

function onData(data){
    console.log('on Data ' + data);
}


socket.on('robotic.data', data => {
    myPort.write(data)
    console.log(data)
})


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html')
})

// setInterval(function (){
//     myPort.write("DOWNUP:500!")
// },1000)

// app.post('/router',(req,res) => {
//     const {route_name, value} = req.body;
//     myPort.write(route_name+":"+value+"!")
//     res.send("ok")
// })

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

