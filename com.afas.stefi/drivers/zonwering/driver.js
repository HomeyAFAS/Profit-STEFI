'use strict';

var Stefi = require('../../lib/stefi.js')
var devices = {};

module.exports = {
	init: function( devices_data, callback ) {
		devices_data.forEach(function(device_data){
			initDevice( device_data );
		})

		callback();
	},
	added: function( device_data, callback ) {
		initDevice( device_data );
		callback( null, true );
	},
	deleted: function( device_data, callback ) {
		delete devices[ device_data.id ];
		callback( null, true );
	},
	pair: function( socket ) {
		socket.on('list_devices', function( data, callback ){

			var device_data = {
				name: '3.01 Kennis & Content',
				data: {
					id: '3.01_zonwering',
					up: '0f0003010004bcfff04865e1008080',
					down: '0f0003010000bcfff04865e1008101',
					idle: '0f0003010001bcfff04965e1008081'
				}
			},
			{
				name: '3.12 Bedrijfsleven Zonwering West',
				data: {
					id: '3.12_zonwering_west',
					up: '0f0003010009bcfff04823e10080c6',
					down: '0f0003010007bcfff04823e1008147',
					idle: '0f0003010008bcfff04923e10080c7'
				}
			},
			{
				name: '3.12 Bedrijfsleven Zonwering Noord',
				data: {
					id: '3.12_zonwering_noord',
					up: '0f0003010004bcfff04865e1008080',
					down: '0f0003010000bcfff04865e1008101',
					idle: '0f0003010001bcfff04965e1008081'
				}
			}

			callback( null, [ device_data ] );

		})
	},
	capabilities: {
		windowcoverings_state: {
			get: function( device_data, callback ){
				var zonwering = getZonwering( device_data.id );
				if( zonwering instanceof Error ) return callback( zonwering );

				callback( null, zonwering.state.windowcoverings_state );
			},
			set: function( device_data, windowcoverings_state, callback ) {
				var zonwering = getZonwering( device_data.id );
				if( zonwering instanceof Error ) return callback( zonwering );

				Stefi.handleAction(Stefi.deviceTypes.zonwering, zonwering, windowcoverings_state, function(data, error){
					if(error) return callback(data, error);

					zonwering.state.windowcoverings_state = data;
					callback( null, zonwering.state.windowcoverings_state );
				})
			}
		}
	}
}

function getZonwering( device_data_id ) {
	var device = devices[ device_data_id ];
	if( typeof device === 'undefined' ) {
		return new Error('invalid_device');
	} else {
		return device;
	}
}

function initDevice( device_data ) {
	devices[ device_data.id ] = {};
	devices[ device_data.id ].state = { windowcoverings_state: 'up' };
	devices[ device_data.id ].data = device_data;
}
