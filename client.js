var serialport = require('serialport');
var portName = '/dev/ttyUSB0';
const express = require('express')
const bodyParser = require('body-parser')
const { exec} = require('child_process');

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
myPort.on('close',onCLosed);

function onCLosed(data){
    setTimeout(async function (){
        await execShellCommand("sudo chmod a+rw "+ portName)

        myPort = await new serialport(portName, {
            baudRate: 9600,
            parser: new serialport.parsers.Readline('\n')
        });
    },3000);
}

function onOpen(){
    console.log('Open connections!');
}

function onData(data){
    console.log('on Data ' + data);
}


let lastDataReceived = Date.now() - 10000;
socket.on('robotic.data', data => {
    console.log("Last rev" + lastDataReceived)
    console.log("Last now" + Date.now())
    console.log("Resp:" + (Date.now() - lastDataReceived / 1000) );
    if (Math.round((Date.now() - lastDataReceived) / 1000) > 1){
        lastDataReceived = Date.now()
        myPort.write(data)
        console.log(data)
    }else{
        console.log("BLOCKED REQUEST")
    }
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

function execShellCommand(cmd) {
    const exec = require("child_process").exec;
    return new Promise((resolve, reject) => {
        exec(cmd, { maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            } else if (stdout) {
                console.log(stdout);
            } else {
                console.log(stderr);
            }
            resolve(stdout ? true : false);
        });
    });
}
