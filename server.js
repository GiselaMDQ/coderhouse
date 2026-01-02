const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const ANIMALES_FILE = path.join(__dirname, 'json', 'Animales.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Servir archivos estáticos

// Función auxiliar para leer animales del JSON
async function leerAnimales() {
    try {
        const data = await fs.readFile(ANIMALES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo de animales:', error);
        return [];
    }
}

// Función auxiliar para guardar animales en el JSON
async function guardarAnimales(animales) {
    try {
        await fs.writeFile(ANIMALES_FILE, JSON.stringify(animales, null, 4), 'utf8');
        return true;
    } catch (error) {
        console.error('Error al guardar el archivo de animales:', error);
        return false;
    }
}

// Endpoint para obtener todos los animales
app.get('/api/animales', async (req, res) => {
    try {
        const animales = await leerAnimales();
        res.json(animales);
    } catch (error) {
        console.error('Error al obtener animales:', error);
        res.status(500).json({ error: 'Error al obtener animales' });
    }
});

// Endpoint para guardar un nuevo animal
app.post('/api/animales', async (req, res) => {
    try {
        const nuevoAnimal = req.body;
        
        // Validar campos requeridos
        if (!nuevoAnimal.situacion || !nuevoAnimal.tipoAnimal) {
            return res.status(400).json({ 
                error: 'Los campos situacion y tipoAnimal son requeridos' 
            });
        }

        // Leer animales existentes
        const animales = await leerAnimales();
        
        // Agregar el nuevo animal
        animales.push(nuevoAnimal);
        
        // Guardar en el archivo JSON
        const guardado = await guardarAnimales(animales);
        
        if (guardado) {
            res.status(201).json({ 
                message: 'Animal guardado correctamente',
                animal: nuevoAnimal 
            });
        } else {
            res.status(500).json({ error: 'Error al guardar el animal' });
        }
    } catch (error) {
        console.error('Error al guardar animal:', error);
        res.status(500).json({ error: 'Error al guardar el animal' });
    }
});

// Endpoint para buscar animales según criterios
app.get('/api/animales/buscar', async (req, res) => {
    try {
        const { situacion, tipoAnimal, raza, latitud, longitud } = req.query;
        
        // Validar que al menos situación y tipoAnimal estén presentes
        if (!situacion || !tipoAnimal) {
            return res.status(400).json({ 
                error: 'Los parámetros situacion y tipoAnimal son requeridos' 
            });
        }

        // Leer todos los animales
        const animales = await leerAnimales();
        
        // Filtrar animales según los criterios
        let coincidencias = animales.filter(animal => {
            // Situación y tipoAnimal son obligatorios
            const coincideSituacion = animal.situacion === situacion;
            const coincideTipo = animal.tipoAnimal === tipoAnimal;
            
            // Raza es opcional (si se proporciona, debe coincidir)
            const coincideRaza = !raza || 
                !animal.raza || 
                animal.raza.toUpperCase() === raza.toUpperCase();
            
            return coincideSituacion && coincideTipo && coincideRaza;
        });
        
        res.json(coincidencias);
    } catch (error) {
        console.error('Error al buscar animales:', error);
        res.status(500).json({ error: 'Error al buscar animales' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

