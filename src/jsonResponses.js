
const users = {};



const respondJSON = (request, response, status, object) => {
    const content = JSON.stringify(object);
    response.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });
    if (request.method !== 'HEAD' && status !== 204) {
        response.write(content);
    }
    response.end();
};


const getUsers = (request, response) => {
    const responseJSON = {
        users,
    };
    respondJSON(request, response, 200, responseJSON);
};


const notReal = (request, response) => {
    const responseJSON = {
        message: 'Does not exist',
        id: 'notReal'
    };
    respondJSON(request, response, 404, responseJSON);
};


const notFound = (request, response) => {
    const responseJSON = {
        message: 'PAge wanst found',
        id: 'pageNotFound'
    };
    respondJSON(request, response, 404, responseJSON);
};


const addUser = (request, response) => {
    const responseJSON = {
        message: 'need name and age',
    };
    const { name, age } = request.body;
    if (!name || !age) {
        responseJSON.id = 'missingParams';
        return respondJSON(
            request,
            response,
            400,
            responseJSON
        );
    }


    let responseCode = 204;


    if (!users[name]) {
        responseCode = 201;
        users[name] = {
            name: name,
        };
    }
    users[name].age = age;
    if (responseCode === 201) {
        responseJSON.message = 'Created Successfully';
        return respondJSON(
            request,
            response,
            responseCode,
            responseJSON
        );
    }

    return respondJSON(
        request,
        response,
        responseCode,
        {}
    );
};



module.exports = {
    getUsers,
    notReal,
    notFound,
    addUser,
};

