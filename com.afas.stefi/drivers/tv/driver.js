"use strict";

// a list of devices, with their 'id' as key
// it is generally advisable to keep a list of
// paired and active devices in your driver's memory.
var devices = {};

// the `init` method is called when your driver is loaded for the first time
module.exports.init = function( devices_data, callback ) {
    devices_data.forEach(function(device_data){
        initDevice( device_data );
    })

    callback();
}

// the `added` method is called is when pairing is done and a device has been added
module.exports.added = function( device_data, callback ) {
    initDevice( device_data );
    callback( null, true );
}

// the `delete` method is called when a device has been deleted by a user
module.exports.deleted = function( device_data, callback ) {
    delete devices[ device_data.id ];
    callback( null, true );
}

// the `pair` method is called when a user start pairing
module.exports.pair = function( socket ) {
    socket.on('list_devices', function( data, callback ){

        var device_data = {
        }

        callback( null, [ device_data ] );

    })
}

// these are the methods that respond to get/set calls from Homey
// for example when a user pressed a button
module.exports.capabilities = {};
module.exports.capabilities.onoff = {};
module.exports.capabilities.onoff.get = function( device_data, callback ) {

    var device = getDeviceByData( device_data );
    if( device instanceof Error ) return callback( device );

    return callback( null, device.state.onoff );

}
module.exports.capabilities.onoff.set = function( device_data, onoff, callback ) {

    var device = getDeviceByData( device_data );
    if( device instanceof Error ) return callback( device );

    device.state.onoff = onoff;

    // here you would use a wireless technology to actually turn the device on or off

    // also emit the new value to realtime
    // this produced Insights logs and triggers Flows
    self.realtime( device_data, 'onoff', device.state.onoff)

    return callback( null, device.state.onoff );

}

// a helper method to get a device from the devices list by it's device_data object
function getDeviceByData( device_data ) {
    var device = devices[ device_data.id ];
    if( typeof device === 'undefined' ) {
        return new Error("invalid_device");
    } else {
        return device;
    }
}

// a helper method to add a device to the devices list
function initDevice( device_data ) {
    devices[ device_data.id ] = {};
    devices[ device_data.id ].state = { onoff: true };
    devices[ device_data.id ].data = device_data;
}