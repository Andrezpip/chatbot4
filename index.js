const fs = require('fs');

const qrcode = require('qrcode-terminal');

const { Client } = require('whatsapp-web.js');



const SESSION_FILE_PATH = "./session.js";

const country_cod = "57";
const number = "3166561816";
const msg = "Hola mundo"

let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require (SESSION_FILE_PATH);
}

const client = new Client({
    session: sessionData 
});

client.initialize();

client.on ('qr', qr=> {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('el cliente esta listo');

    let chatId = country_cod + number + "@c.us";
    client.sendMessage(chatId, msg)
       .then(Response => {
           if(Response.id.fromMe) {
               console.log('El mensaje fue enviado');
           }
       })
})

client.on('authenticated', session => {
    sessionData = session,

    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), err => {
        if(err) {
            console.error(err);
        }
    })
})

client.on('auth_failure', msg => {
    console.error('Hubo un fallo en la autenticacion', msg)
})

client.on('message', msg =>{
    if(msg.body == "hola") {
        client.sendMessage(msg.from, "hola que tal colecito")
    }
})