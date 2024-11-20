require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path'); 
const reverso = require('reverso-api');
const app = express();

const PORT = process.env.PORT || 3000;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

const reverso_api = new reverso();

// Abilita CORS
app.use(cors());

// Servire la cartella "www" come directory pubblica
app.use(express.static(path.join(__dirname, 'www')));

// Route per il proxy
app.get('/proxy', async (req, res) => {
    try {
        // Ottieni il valore di fs2 dalla query string, se presente
        const fs2Value = req.query.fs2 || 0; // Usa '0' come valore di default se fs2 non è presente

        // Costruisci l'URL con il parametro fs2
        const url = `https://www.parolecasuali.it/?fs=1&fs2=${fs2Value}&Submit=Nuova+parola`;

        // Esegui la richiesta GET al sito
        const response = await axios.get(url);

        // Rispondi con i dati ricevuti
        res.send(response.data);
    } catch (error) {
        console.error('Errore nella route /proxy:', error.message);
        res.status(500).send('Errore nel proxy');
    }
});

app.get('/translate', async (req, res) => {
    try {
        const parola = req.query.word;
        const lang = req.query.lang;
        if (!parola) {
            return res.status(400).send('Parametro "word" mancante.');
        }
        console.log("Richiesta traduzione di:", parola, "[",lang,"]");

        reverso_api.getTranslation(parola, 'italian', lang.toLowerCase(), (err, response) => {
            if (err) {
                console.error('Errore nella traduzione con Reverso:', err);
                return res.status(500).send('Errore durante la traduzione.');
            }
            console.log("Risposta di Reverso:", response);
            res.send(response.translations);
        });
    } catch (error) {
        console.error('Errore nella route /translate:', error.message);
        res.status(500).send('Errore durante la traduzione.');
    }
});

app.get('/pixabay', async (req, res) => {
    try {
        const query = req.query.q;
        const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=illustration&safesearch=true&per_page=10`;
        const response = await axios.get(url);
        res.send(response.data);
    } catch (error) {
        console.error('Errore API Pixabay:', error);
        res.status(500).send('Errore API Pixabay');
    }
});

// Middleware globale per gestire errori
app.use((err, req, res, next) => {
    console.error('Errore globale:', err.message);
    res.status(500).send('Errore interno al server.');
});

// Gestione di eccezioni non catturate
process.on('uncaughtException', (err) => {
    console.error('Eccezione non catturata:', err.message);
    // Puoi aggiungere ulteriori log o notifiche qui
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Rifiuto non gestito:', reason);
    // Puoi aggiungere ulteriori log o notifiche qui
});

// Avvia il server
app.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
    console.log(`La cartella "www" è disponibile su http://localhost:${PORT}/`);
});
