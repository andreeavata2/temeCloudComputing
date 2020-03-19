module.exports.handleSuccess = (response, information = { message: 'Success.' }, statusCode = 200) => {
    response.setHeader('Content-Type', 'application/json');
    response.statusCode = statusCode;
    response.write(JSON.stringify(information));
    response.end();
}

module.exports.handleError = (response, information = { message: 'Error: Something went wrong.' }, statusCode = 404) => {
    response.setHeader('Content-Type', 'application/json');
    response.statusCode = statusCode;
    response.write(JSON.stringify(information));
    response.end();
}

module.exports.transformBodyToString = req => {
    return new Promise((resolve, reject) => {
        try {
            let body = "";
            req.on('data', buff => {
                body += buff.toString();
            });

            req.on('end', () => {
                resolve(body)
            })

        } catch (error) {
            reject(error)
        }
    })
}