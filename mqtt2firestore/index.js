const os = require('node-os-utils');
const mqtt = require('mqtt')

//var mqtt_host = '192.168.1.42'
const mqtt_host = 'test.mosquitto.org'
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
})

client.on('message', function (topic, message) {
    console.log('[INFO]', 'topic: ' + topic.toString() + ' message: ' + message.toString());
    // publish to firestore
    var json = message.toString();
    var jsonObject = JSON.parse(json);

    var topicArray = topic.toString().split('/');
    var msgType = topicArray[0];
    var msgUserID = topicArray[1];
    var msgDeviceID = topicArray[2];
    var timeStamp = Math.round(+new Date() / 1000);

    // sample publish
    db.collection('messages').doc(msgUserID + '_' + msgDeviceID).set(jsonObject);
    db.collection('messages').doc(msgUserID + '_' + msgDeviceID).collection('log').doc(timeStamp.toString()).set(jsonObject);
})

client.on('error', function (error) {
    console.log(error.toString())
    logger.error(error.toString())
})
//client.end()