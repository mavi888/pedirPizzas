'use strict';

const uuidv1 = require('uuid/v1');

module.exports.hacerPedido = (event, context, callback) => {
	console.log('HacerPedido fue llamada');
	const orderId = uuidv1();

	const response = {
		statusCode: 200,
		body: JSON.stringify({
			message: `El pedido fue registrado con el numero de orden: ${orderId}`
		})
	};

	callback(null, response);
};
