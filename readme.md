# API Rest Vehiculos

Ejercicio de API Rest de eventos hecho con NodeJS y MongoDB  

## Descripcion

El proyecto es una rest API para una web de publicacion de eventos.  
Contiene los endpoints para los eventos y para los usuarios utilizando autenticaciones para publicar eventos.

## Link de heroku

El link de la API Rest en heroku es: <link pendiente>

## Link del ejercicio (requerimientos)

El ejercicio esta basado en el repositorio de requerimientos <https://github.com/ingenious-agency/backend-test/tree/master/instructions#requerimientos-no-funcionales>

## Modulos utilizados

Los modulos utilizados para este ejercicio fueron los siguientes:

- express
- mongoose
- dotenv
- bcrypt
- jsonwebtoken
- validator

## Endpoints

Aclaraciones: "api" es la url donde se encuentra alojada la api (ejemplo: http://localhost:9000)  

### Eventos

- Devuelve todos los eventos posibles

```rest
    GET api/events
```

Ejemplo de respuesta:

```json
    [{
        "title": "Evento 1",
        "description" : "Evento de prueba",
        "dateList": [{"date" : "2021-08-10T14:00:00", "price" : 50}, {"date" : "2021-08-12T20:30:00", "price" : 60.75}],
        "location" : "Buenos Aires",
        "image" : "http://www.google.com",
        "user" : "12310azjo1jlzjo124",
        "featured" : false
    }]
```

- Devuelve los eventos de forma paginada (limite de 5 eventos por pagina)

```rest
    GET api/events/page/:page
```

Ejemplo de respuesta:

```json
    {
    "events": [
        {
        "_id": "61168489a27d941a6c32ed56",
        "title": "Evento 6",
        "description": "Evento de prueba",
        "dateList": [
            {
            "_id": "61168489a27d941a6c32ed57",
            "date": "2021-01-12T17:00:00.000Z",
            "price": 50
            },
            {
            "_id": "61168489a27d941a6c32ed58",
            "date": "2020-10-11T23:30:00.000Z",
            "price": 60.75
            }
        ],
        "location": "Buenos Aires",
        "image": "http://www.google.com",
        "featured": false,
        "user": "611599243686982f60c164b5",
        "createdAt": "2021-08-13T14:41:13.520Z",
        "__v": 0
        },
        {
        "_id": "6116865fd9f8682de4f15b40",
        "title": "Evento 4",
        "description": "Evento de prueba",
        "dateList": [
            {
            "_id": "6116865fd9f8682de4f15b41",
            "date": "2021-08-13T17:00:00.000Z",
            "price": 50
            },
            {
            "_id": "6116865fd9f8682de4f15b42",
            "date": "2021-10-11T23:30:00.000Z",
            "price": 60.75
            }
        ],
        "location": "Buenos Aires",
        "image": "http://www.google.com",
        "featured": true,
        "user": "611599243686982f60c164b5",
        "createdAt": "2021-08-13T14:49:03.302Z",
        "__v": 0
        },
        {
        "_id": "61168abe02bf9131ac68acd8",
        "title": "Evento 1",
        "description": "Evento de prueba",
        "dateList": [
            {
            "_id": "61168abe02bf9131ac68acd9",
            "date": "2021-08-10T17:00:00.000Z",
            "price": 50
            },
            {
            "_id": "61168abe02bf9131ac68acda",
            "date": "2021-08-12T23:30:00.000Z",
            "price": 60.75
            }
        ],
        "location": "Buenos Aires",
        "image": "http://www.google.com",
        "featured": false,
        "user": "611599243686982f60c164b5",
        "createdAt": "2021-08-13T15:07:42.492Z",
        "__v": 0
        }
    ],
    "actualPage": 2,
    "totalPages": 2,
    "count": 3
    }
```

- Devuelve los eventos ordenados por fecha que aun no se hayan concluido (despues de la fecha de hoy)

```rest
    GET api/events/ordered
```

Ejemplo de respuesta:

```json
    [
    {
        "_id": "6116865fd9f8682de4f15b40",
        "title": "Evento 4",
        "featured": true,
        "nextDate": {
        "_id": "6116865fd9f8682de4f15b41",
        "date": "2021-08-13T17:00:00.000Z",
        "price": 50
        }
    },
    {
        "_id": "61168449a27d941a6c32ed40",
        "title": "Evento 2",
        "featured": false,
        "nextDate": {
        "_id": "61168449a27d941a6c32ed41",
        "date": "2021-10-10T17:00:00.000Z",
        "price": 50
        }
    },
    {
        "_id": "6116844fa27d941a6c32ed45",
        "title": "Evento 3",
        "featured": true,
        "nextDate": {
        "_id": "6116844fa27d941a6c32ed46",
        "date": "2021-12-10T17:00:00.000Z",
        "price": 50
        }
    }
    ]
```

- Devuelve los eventos del dia que sean destacados

```rest
    GET api/events/highlights
```

Ejemplo de respuesta:

```json
    [
    {
        "_id": "6116865fd9f8682de4f15b40",
        "title": "Evento 4",
        "featured": true,
        "nextDate": {
        "_id": "6116865fd9f8682de4f15b41",
        "date": "2021-08-13T17:00:00.000Z",
        "price": 50
        }
    }
    ]
```

- Devuelve el evento detallado que contiene el id

```rest
    GET api/events/:id
```

Ejemplo de respuesta:

```json
    {
    "_id": "6116844fa27d941a6c32ed45",
    "title": "Evento 3",
    "description": "Evento de prueba",
    "dateList": [
        {
        "_id": "6116844fa27d941a6c32ed46",
        "date": "2021-12-10T17:00:00.000Z",
        "price": 50
        },
        {
        "_id": "6116844fa27d941a6c32ed47",
        "date": "2021-12-12T23:30:00.000Z",
        "price": 60.75
        }
    ],
    "location": "Buenos Aires",
    "image": "http://www.google.com",
    "featured": true,
    "user": "611599243686982f60c164b5",
    "createdAt": "2021-08-13T14:40:15.405Z",
    "__v": 0
    }
```

- Comparte el evento especifico en twitter

```rest
    POST api/events/:id/share
```

Ejemplo de respuesta:

```json
    {
    "message": "Evento compartido correctamente",
    "url": "http://twitter.com/status/...",
    "createdAt": "2021-08-13T15:10:20.471Z"
    }
```

- Agrega un nuevo evento segun el body  

```rest
    POST api/events
```

El header requiere un token JWT de autenticacion que se obtiene logueando con un usuario

El body debe tener obligatoriamente los siguientes parametros de ejemplo:

1. title : string
2. description : string
3. dateList : Array  
    date : datetime  
    price : float
4. image : URL string
5. featured : bool
6. location : string

Ejemplo:  

```json
    {
        "title": "Evento 1",
        "description" : "Evento de prueba",
        "dateList": [{"date" : "2021-08-10T14:00:00", "price" : 50}, {"date" : "2021-08-12T20:30:00", "price" : 60.75}],
        "location" : "Buenos Aires",
        "image" : "http://www.google.com",
        "featured" : false
    }
```

Ejemplo de respuesta:

```json
    {
    "message": "Evento agregado correctamente"
    }
```

### Usuarios

- Devuelve todos los usuarios disponibles

```rest
    GET api/users
```

Ejemplo de respuesta:

```json
  {
    "events": [
      "611695580efc3e2da8ed2ea2",
      "611695b9967c5a305ca8fa75"
    ],
    "_id": "611599243686982f60c164b5",
    "userName": "Juan",
    "password": "$2b$10$t/iK53vMOId8vE7Oh5djm.Z0yMJO4jlSCV3GMWbWtdI1mzKwxxXVK",
    "createdAt": "2021-08-12T21:56:52.761Z",
    "__v": 0
  }
]

```

- Registra a un usuario nuevo

```rest
    POST api/users/register
```

El body debe tener obligatoriamente un userName y password.  
El password siempre se encripta al guardarse en la base de datos.

Ejemplo de body:

```json
    {
        "userName" : "Juan",
        "password" : "1234"
    }
```

Ejemplo de respuesta:

```json
    {
    "message": "Usuario agregado correctamente"
    }
```

- Loguea a un usuario existente devolviendo un token de autenticacion

```rest
    POST api/users/login
```

El body debe incluir el userName (debe estar registrado) y la contraseña

Ejemplo de body:

```json
    {
        "userName" : "Juan",
        "password" : "1234"
    }
```

Retorna un token JWT para autenticar y poder agregar eventos

Ejemplo de respuesta:

```json
    {
    "message": "Usuario autenticado correctamente",
    "userName": "Juan",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6Ikp1YW4iLCJpZCI6IjYxMTU5OTI0MzY4Njk4MmY2MGMxNjRiNSIsImlhdCI6MTYyODg3MDMwN30.F_pJNMMESh7_vK9rCpwsSwH7y5cELjwbOG5wn021zMc"
    }
```