const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/status', (request, response) => response.json({clients: clients.length}))

const PORT = 3001;

let clients = []
let facts = []
let factCount = 0
let dataToPush = {}

app.listen(PORT, () => {
    console.log(`Facts Event service listening at http://localhost:${PORT}`)
})
const SEND_INTERVAL = 2000;

const writeEvent = (response, clientId) => {
    response.write(`id: ${uuidv4()}\n`)
    response.write(`event: message\n`)
    response.write(`data: ${JSON.stringify(dataToPush)}\n\n`)
    dataToPush = {}
    factCount+=1
}


function eventsHandler(request, response, next){
     const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
     }

     response.writeHead(200, headers)
     const clientId = Date.now()
     const newClient = {
        id: clientId,
        response
     }


     setInterval(() => {
         if (factCount !== facts.length) {
            console.log(factCount !== facts.length, factCount, facts.length, dataToPush)
            writeEvent(response, clientId);
        }
      }, SEND_INTERVAL);

     //writeEvent(response, clientId, facts)



     clients.push(newClient)

     request.on('close', () => {
        console.log(`${clientId} Connection closed`)
        clients = clients.filter(client => client.id !== clientId)
     })
}

function sendEventsToAll(newFact) {
    clients.forEach(client => client.response.write(`sent new fact data ${JSON.stringify(newFact)}\n\n`))
}

async function addFact(request, response, next) {
    const newFact = request.body
    facts.push(newFact)
    dataToPush = newFact
    response.json(newFact)
    return sendEventsToAll(newFact)
}

app.get('/events', eventsHandler)
app.post('/fact', addFact)