const { Kafka, logLevel } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka_new:9092'],
    logLevel: logLevel.NOTHING,
})

const producer = kafka.producer()

const runProducer = async () => {
    await producer.connect()
    await producer.send({
        topic: 'test-topic',
        messages: [
            { value: 'Hello KafkaJS user By Dinh Quoc Dat!' },
        ],
    })

    await producer.disconnect()
}
runProducer().catch(console.error)
// Compare this snippet from src/services/apikey.service.js: