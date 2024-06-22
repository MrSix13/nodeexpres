import express from 'express';
import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import cors from 'cors';

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());
const client = new Client({
    webVersionCache: {
      type: "remote",
      remotePath:
        "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
  });

async function reconnect() {
    try {
      await client.initialize();
      console.log('Reconnected to WhatsApp Web!');
    } catch (error) {
      console.error('Error during reconnection:', error);
      // Implement exponential backoff or retry logic here
    }
  }

  

client.on('qr', (qr)=>{
    qrcode.generate(qr, {small:true})
    console.log('QR RECEIVED', qr)
});
client.on('ready', ()=>{
    console.log('Conectado a wsp');
});
client.on('message', (message)=>{
    if(message._data.from === '56963497946@c.us'){
        console.log('Mensaje recibido', message._data);
    }
});

app.get('/', (req,res)=>{
    return res.json({mensaje: "hola mundo"})
})

app.post('/enviar-mensaje', async(req,res)=>{
    const {numero, mensaje} = req.body;
   console.log(numero)
   console.log(mensaje)

    try {
        for (const phoneNumber of numero) {
            const formattedNumber = phoneNumber + '@c.us';
            console.log('formattedNumber:', formattedNumber)
            await client.sendMessage(formattedNumber, mensaje);
        }   
       res.json({ mensaje: 'Mensajes enviados correctamente.' });
   } catch (error) {
    console.error('Error sending message:', error);
        res.status(500).json({ mensaje: 'Error al enviar mensajes' });
        // await reconnect();
    }
    
});

app.listen(port, ()=>{
    console.log(`servidor escuchando en el puerto ${port}`)
});

await client.initialize();   


// let numero_enviar = numero + '@c.us'

// client.sendMessage(numero_enviar, mensaje)
//        .then(()=>{
//         res.json({mensaje: 'Mensaje enviado correctamente.'});
//        })
//        .catch((error)=>{
//         console.error('Error al enviar mensaje:', error)
//        });