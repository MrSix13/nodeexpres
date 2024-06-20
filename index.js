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

app.post('/enviar-mensaje', (req,res)=>{
    const {numero, mensaje} = req.body;
    let numero_enviar = numero + '@c.us'
    
    client.sendMessage(numero_enviar, mensaje)
           .then(()=>{
            res.json({mensaje: 'Mensaje enviado correctamente.'});
           })
           .catch((error)=>{
            console.error('Error al enviar mensaje:', error)
           });
});
app.listen(port, ()=>{
    console.log(`servidor escuchando en el puerto ${port}`)
});

await client.initialize();