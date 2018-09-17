'use strict';

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

/*
 order : {
  orderId: String,
  name: String,
  address: String,
  pizzas: Array of Strings,
  delivery_status: READY_FOR_DELIVERY / DELIVERED
  timestamp: timestamp
}
*/

module.exports.saveCompletedOrder = order => {
	console.log('Guardar un pedido fue llamado');

	order.delivery_status = 'READY_FOR_DELIVERY';

	const params = {
		TableName: process.env.COMPLETED_ORDER_TABLE,
		Item: order
	};

	return dynamo.put(params).promise();
};

module.exports.deliverOrder = orderId => {
	console.log('Enviar una orden fue llamado');

	const params = {
		TableName: process.env.COMPLETED_ORDER_TABLE,
		Key: {
			orderId
		},
		ConditionExpression: 'attribute_exists(orderId)',
		UpdateExpression: 'set delivery_status = :v',
		ExpressionAttributeValues: {
			':v': 'DELIVERED'
		},
		ReturnValues: 'ALL_NEW'
	};

	return dynamo
		.update(params)
		.promise()
		.then(response => {
			console.log('order delivered');
			return response.Attributes;
		});
};

module.exports.getOrder = orderId => {
	console.log('El metodo obtener una orden fue llamado');

	const params = {
		TableName: process.env.COMPLETED_ORDER_TABLE,
		Key: {
			orderId
		}
	};

	return dynamo
		.get(params)
		.promise()
		.then(item => {
			return item.Item;
		});
};
