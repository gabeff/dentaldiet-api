const jwt = require('jsonwebtoken');

module.exports = authorize;

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        function (req, res, next) {

            const token =
                req.body.token ||
                req.query.token ||
                req.headers['x-access-token'] ||
                req.cookies.token;
            
            if (!token) {
                res.status(401).send('Não autorizado: Nenhum token fornecido');
            } else {
                jwt.verify(token, process.env.SECRET, function (err, decoded) {
                    if (err) {
                        console.error(err);
                        res.status(401).send('Não autorizado: Token inválido');
                    } if (roles.length && !roles.includes(decoded.papel)) {
                        return res.status(401).send('Não autorizado: Usuário não possui privilégios suficientes.');
                    } else {
                        next();
                    }
                });
            }

        }
    ];
}