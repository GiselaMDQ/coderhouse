# PetLocator - Sistema de Reencuentro de Animales

Proyecto Coderhouse de PetLocator - Sistema para reportar y buscar animales perdidos o encontrados.

## Instalación

1. Instalar dependencias:
```bash
npm install
```

## Ejecutar el servidor

Para iniciar el servidor backend:
```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000`

## Estructura del Backend

### Endpoints disponibles:

- **GET /api/animales** - Obtiene todos los animales guardados
- **POST /api/animales** - Guarda un nuevo animal (perdido o encontrado)
- **GET /api/animales/buscar** - Busca animales según criterios:
  - `situacion` (requerido): "perdido" o "encontrado"
  - `tipoAnimal` (requerido): "Perro" o "Gato"
  - `raza` (opcional): raza del animal
  - `latitud` (opcional): coordenada de latitud
  - `longitud` (opcional): coordenada de longitud

## Notas

- Los datos se guardan actualmente en `json/Animales.json`
- En el futuro se puede migrar a una base de datos
- El frontend está configurado para conectarse al servidor en `http://localhost:3000`
