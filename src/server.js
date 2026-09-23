const http = require('http');
const querystring = require('querystring');
const jsonHandler = require('./jsonResponses.js');
const htmlHandler = require('./htmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;




const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.log(err);

    response.writeHead(400, {
      'Content-Type': 'application/json'
    });

    response.end(JSON.stringify({
      message: 'error reading request body.',
      id: 'bodyReadError'
    }));
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();

    const type = request.headers['content-type'];

    try {
      if (type === 'application/json') {
        request.body = JSON.parse(bodyString);
      } 
      else if (type === 'application/x-www-form-urlencoded') {
        request.body = querystring.parse(bodyString);
      } 
      else {
        response.writeHead(400, {
          'Content-Type': 'application/json'
        });

        return response.end(JSON.stringify({
          message: 'Bad content type',
          id: 'invalidContentType'
        }));
      }

      handler(request, response);

    } catch (err) {
        console.log(err);
      response.writeHead(400, {
        'Content-Type': 'application/json'
      });

      response.end(JSON.stringify({
        message: 'invalid json!',
        id: 'invalidJSON'
      }));
    }
  });
};




const handleGet = (request, response, parsedUrl) => {

  switch (parsedUrl.pathname) {

    case '/':
      return htmlHandler.getIndex(request, response);

    case '/style.css':
      return htmlHandler.getCSS(request, response);

    case '/getUsers':
      return jsonHandler.getUsers(request, response);

    case '/notReal':
      return jsonHandler.notReal(request, response);

    default:
      return jsonHandler.notFound(request, response);
  }
};



const handleHead = (request, response, parsedUrl) => {

  switch (parsedUrl.pathname) {

    case '/getUsers':
      return jsonHandler.getUsers(request, response);

    case '/notReal':
      return jsonHandler.notReal(request, response);

    default:
      return jsonHandler.notFound(request, response);
  }
};




const handlePost = (request, response, parsedUrl) => {

  if (parsedUrl.pathname === '/addUser') {
    return parseBody(request, response, jsonHandler.addUser);
  }

  return jsonHandler.notFound(request, response);
};




const onRequest = (request, response) => {

  const parsedUrl = new URL(
    request.url,
    `http://${request.headers.host}`
  );

  if (request.method === 'GET') {
    return handleGet(request, response, parsedUrl);
  }

  if (request.method === 'HEAD') {
    return handleHead(request, response, parsedUrl);
  }

  if (request.method === 'POST') {
    return handlePost(request, response, parsedUrl);
  }


  return jsonHandler.notFound(request, response);
};



http.createServer(onRequest).listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});