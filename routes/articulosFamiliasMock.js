import express from 'express';
const router = express.Router();

let arr_articulosFamiliasMock = [
    {
        "IdArticuloFamilia": 1,
        "Nombre": "Accesorios"
      },
      {
        "IdArticuloFamilia": 2,
        "Nombre": "Audio"
      },
      {
        "IdArticuloFamilia": 3,
        "Nombre": "Celulares"
      },
      {
        "IdArticuloFamilia": 4,
        "Nombre": "Cuidado Personal"
      },
      {
        "IdArticuloFamilia": 5,
        "Nombre": "Dvd"
      },
      {
        "IdArticuloFamilia": 6,
        "Nombre": "Fotografia"
      },
      {
        "IdArticuloFamilia": 7,
        "Nombre": "Frio-Calor"
      },
      {
        "IdArticuloFamilia": 8,
        "Nombre": "Gps"
      },
      {
        "IdArticuloFamilia": 9,
        "Nombre": "Informatica"
      },
      {
        "IdArticuloFamilia": 10,
        "Nombre": "Led - Lcd"
      }    
];

// Metodo Get para obtener todos los articulos familias que contengan el nombre
// "/api/articulosfamiliasmock?nombre=nombre"
router.get('/api/articulosfamiliasmock', async (req, res) => {
  let articulosFamilia = arr_articulosFamiliasMock.filter(
    (x) =>  x.Nombre.toLowerCase().includes(req.query.nombre.toLowerCase())
  );

  if (articulosFamilia) {
    res.json(articulosFamilia);
  } else {
    res.status(404).send({ message: "Articulo Familia no encontrado" });
  }
});

// Metodo Get para obtener un articulo familia por id
router.get('/api/articulosfamiliasmock/:id', async (req, res) => {
  let articuloFamilia = arr_articulosFamiliasMock.find(
    (x) => x.IdArticuloFamilia === parseInt(req.params.id)
  );

  if (articuloFamilia) {
    res.json(articuloFamilia);
  } else {
    res.status(404).send({ message: "Articulo Familia no encontrado" });
  }
});

// Metodo Post para agregar un articulo familia
router.post('/api/articulosfamiliasmock/', async (req, res) => {
  const { nombre } = req.body;
  let articuloFamilia = {
    IdArticuloFamilia: arr_articulosFamiliasMock.length + 1,
    Nombre: nombre,
  };

  // Agregar al array
  arr_articulosFamiliasMock.push(articuloFamilia);

  // Retornar el objeto creado
  res.status(201).json(articuloFamilia);
});

router.put('/api/articulosfamiliasmock/:id', async (req, res) => {
  let articuloFamilia = arr_articulosFamiliasMock.find(
    (x) => x.IdArticuloFamilia === parseInt(req.params.id)
  );

  if(articuloFamilia){
    articuloFamilia.Nombre = req.body;
    res.json(articuloFamilia);
  } else {
    res.status(404).send({ message: "Articulo Familia no encontrado" });
  }
});

router.delete('/api/articulosfamiliasmock/:id', async (req, res) => {
  let articuloFamilia = arr_articulosFamiliasMock.find(
    (x) => x.IdArticuloFamilia === parseInt(req.params.id)
  );

  if(articuloFamilia){
    arr_articulosFamiliasMock = arr_articulosFamiliasMock.filter(
      (x) => x.IdArticuloFamilia !== parseInt(req.params.id)
    );
    res.json({ message: "Articulo Familia eliminado" });
  }else{
    res.status(404).send({ message: "Articulo Familia no encontrado" });
  }
});

export default router;