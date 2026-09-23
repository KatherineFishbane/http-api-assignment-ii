
const fs = require('fs');
const path = require('path');

const stylePath = path.join(__dirname, '../client/style.css');
const htmlPath = path.join(__dirname, '../client/client.html');



const getIndex = (request, response) => {

    fs.readFile(htmlPath, (err, data) => {

        if (err) {
            console.error('Error loading client.html:', err);

            response.writeHead(500, {
                'Content-Type': 'text/plain'
            });

            return response.end('Error loading client.html');
        }

        response.writeHead(200, {
            'Content-Type': 'text/html'
        });

        response.end(data);
    });
};



const getCSS = (request, response) => {

    fs.readFile(stylePath, (err, data) => {

        if (err) {
            console.error('Error loading style.css:', err);

            response.writeHead(500, {
                'Content-Type': 'text/plain'
            });

            return response.end('Error loading style.css');
        }

        response.writeHead(200, {
            'Content-Type': 'text/css'
        });

        response.end(data);
    });
};


module.exports = {
    getIndex,
    getCSS
};

