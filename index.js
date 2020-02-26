const Express = require('express');
const app = Express();
const PORT = process.env.Port || 5000;
const fetch = require('node-fetch');
const endpoints = require('./endpoints');
let logger = require('logger').createLogger('development.log');
let hbs = require('express-handlebars');
const path = require('path')
const fs = require('fs')
const lineReader = require('line-reader');
// app.use(Express.static("public"))


app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/' }))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs')



app.get('/', (req, res) => {
    logger.info(`[${req.method}] : Accessing route: ${req.url}`);
    // res.sendFile('public/index.html', { root: __dirname });
    res.render('index', { name: 'andreea' })
})

app.get('/numbers', async(req, res) => {
    logger.info(`[${req.method}] : Accessing route: ${req.url}`);
    const options = {
        headers: {
            'x-rapidapi-host': endpoints.numbersAPI.split("://")[1],
            'x-rapidapi-key': endpoints.apiKey
        }
    };

    try {
        // const api1_url = 'https://numbersapi.p.rapidapi.com/6/21/date?fragment=true&json=true';
        let dateStart = new Date();
        const url = `${endpoints.numbersAPI}/6/12/date?fragment=true&json=true`;
        const fetch_response = await fetch(url, options);
        const jsonResponse = await fetch_response.json();
        let dateEnd = new Date() - dateStart;
        logger.info(`[${req.method}] : Fetching url: ${url} in ${dateEnd}ms`);
        res.json(jsonResponse);
    } catch (error) {
        logger.info(`[ERROR][${req.method}][${res.statusCode}] : Fetching failed at  ${req.url}`);
        res.json({ err: error })
    }
});

app.get('/ChuckNorris', async(req, res) => {
    logger.info(`[${req.method}] : Accessing route: ${req.url}`);
    const options3 = {
        headers: {
            'x-rapidapi-host': endpoints.chuckAPI.split("://")[1],
            'x-rapidapi-key': endpoints.apiKey,
            'accept': endpoints.chuckAcc
        }
    };

    try {
        // const api3_url = 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random';
        let dateStart = new Date();
        const url = `${endpoints.chuckAPI}/jokes/random`;
        const fetch_response = await fetch(url, options3);
        const json = await fetch_response.json();
        let dateEnd = new Date() - dateStart;
        logger.info(`[${req.method}][${res.statusCode}] : Fetching successfully url: ${url} in ${dateEnd}ms`);
        res.json(json);
    } catch (error) {
        logger.info(`[ERROR][${req.method}][${res.statusCode}] : Fetching failed at url: ${req.url}`);
        res.json({ err: error })
    }
});

app.get('/definition/:term?', async(req, res) => {
    logger.info(`[${req.method}] : Accessing route: ${req.url}`);
    let term = "default";
    if (req.params.term) {
        term = req.params.term;
    }
    const options2 = {
        headers: {
            'x-rapidapi-host': endpoints.definitionAPI.split("://")[1],
            'x-rapidapi-key': endpoints.apiKey
        }
    };
    try {
        // const url = 'https://mashape-community-urban-dictionary.p.rapidapi.com/define?term=want';
        const url = `${endpoints.definitionAPI}/define?term=${term}`;

        const fetch_response = await fetch(url, options2);
        const json = await fetch_response.json();
        res.json(json);
    } catch (error) {
        logger.info(`[ERROR][${req.method}][${res.statusCode}] : Fetching failed at url: ${req.url}`);
        res.json({ err: error })
    }
});

app.get('/metrix', async(req, res) => {
    const fileName = "development.log";

    let res1 = []
    let aa = await lineReader.eachLine(fileName, function(line, last) {
        if (line)
            res1.push(line);
        // do whatever you want with line...
        if (last) {
            res.json({ res1 })
        }
    });

})
app.get('/generate', async(req, res) => {
    logger.info(`[${req.method}] : Accessing route: ${req.url}`);

    let responseFromNumbers = {};
    let responseFromChuck = {};
    let responseFromDefinition = {};

    try {
        // const url = 'https://mashape-community-urban-dictionary.p.rapidapi.com/define?term=want';
        const url1 = 'http://localhost:5000/ChuckNorris';
        const url2 = 'http://localhost:5000/numbers';
        const url3 = 'http://localhost:5000/definition';
        let finalResponseForClient = {};

        // call chuck
        const fetch_response1 = await fetch(url1);
        const responseFromChuck = await fetch_response1.json();

        // call numbers
        const fetch_response2 = await fetch(url2);
        const responseFromNumbers = await fetch_response2.json();

        // get last digit frum number key in obj
        const responseNumberFromNumbersAPI = responseFromNumbers.number % 10;

        // get the n'th word from obj value
        const arrayOfWordFromChuck = responseFromChuck.value.split(" ");
        while (responseNumberFromNumbersAPI > arrayOfWordFromChuck.length) {
            responseNumberFromNumbersAPI /= 2;
        }

        const responseValueFromChuck = arrayOfWordFromChuck[responseNumberFromNumbersAPI];
        // console.log('Getting definitions for word:', responseValueFromChuck)

        // call /defition with valueFromchuck as param
        const fetch_response3 = await fetch(`${url3}/${responseValueFromChuck}`);
        const responseFromDefinition = await fetch_response3.json();

        const totalLengthOfDefinitions = responseFromDefinition.list.length;
        console.log('We have received ', totalLengthOfDefinitions, ' definitions for word:', responseValueFromChuck)

        const randomNumber = Math.floor(Math.random() * totalLengthOfDefinitions);

        console.log('Random number received:', randomNumber);

        finalResponseForClient = responseFromDefinition.list[randomNumber];
        // res.json({ data: finalResponseForClient });
        res.render('definition', { definition: finalResponseForClient })
    } catch (error) {
        logger.info(`[ERROR][${req.method}][${res.statusCode}] : Fetching failed at url: ${req.url}`);
        res.json({ err: error })
    }


    // res.json({ msg: "sdfcvsdfs" })
})

// // middleware for 500 - server error
// app.use((err, req, res, next) => {
//     res.status(500).json({ msg: 'sad' });
//     next();
// })




// middleware for 404 not found - error codes
app.use((req, res, next) => {
    res.sendFile('public/notFound.html', { root: __dirname });
})


app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
    // console.log('Server is running at port:', PORT);
})