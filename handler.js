'use strict';

const uuidv1 = require('uuid/v1');
const AWS = require('aws-sdk');

var sqs = new AWS.SQS({ region: process.env.REGION });
const QUEUE_URL = process.env.PENDING_ORDER_QUEUE;

module.exports.hacerPedido = (event, context, callback) => {
	console.log('HacerPedido fue llamada');

	const body = JSON.parse(event.body);

	const order = {
		orderId: uuidv1(),
		name: body.name,
		address: body.address,
		pizzas: body.pizzas,
		timestamp: Date.now()
	};

	const params = {
		MessageBody: JSON.stringify(order),
		QueueUrl: QUEUE_URL
	};

	sqs.sendMessage(params, function(err, data) {
		if (err) {
			sendResponse(500, err, callback);
		} else {
			const message = {
				order: order,
				messageId: data.MessageId
			};
			sendResponse(200, message, callback);
		}
	});
};

module.exports.prepararPedido = (event, context, callback) => {
	console.log('Preparar pedido fue llamada');

	console.log(event);
	callback();
};

function sendResponse(statusCode, message, callback) {
	const response = {
		statusCode: statusCode,
		body: JSON.stringify(message)
	};
	callback(null, response);
}
