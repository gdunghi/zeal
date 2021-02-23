const os = require('node-os-utils');
const mqtt = require('mqtt')

//var mqtt_host = '192.168.1.42'
const mqtt_host = 'raspberrypi.local'
const mqtt_port = 1883

// init firestore
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// init logger
const winston = require('winston');
const { mem } = require('node-os-utils');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});


var client = mqtt.connect({ port: mqtt_port, host: mqtt_host })

client.subscribe('msg/#')
client.on('connect', () => {
    console.log('connected')
    logger.info('MQTT Broker connected')

    // publish sample data, remove this function on production
    setInterval(async () => {
        var cpu = os.cpu
        var mem = os.mem
        var cpu_usage = await cpu.usage()
        var mem_usage = await mem.used()
        var timestamp = Date.now()
        client.publish('msg/xavier/rz7', '{"cpu_usage":' + cpu_usage.toString() +
            ', "mem_usage":' + mem_usage['usedMemMb'].toString() +
            ', "mem_total":' + mem_usage['totalMemMb'].toString() +
            ', "timestamp":' + timestamp + '}'
        )
    }, 5000)
})

client.on('message', function (topic, message) {
    console.log('[INFO]', 'topic: ' + topic.toString() + ' message: ' + message.toString())
    // publish to firestore
    var json = message.toString();
    var jsonObject = JSON.parse(json)

    // sample publish
    //db.collection('messages').doc('xavier_rz7').set(jsonObject)
})

client.on('error', function (error) {
    console.log(error.toString())
    logger.error(error.toString())
})
//client.end()