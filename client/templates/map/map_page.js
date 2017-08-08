// Meteor.startup(function() {  
//   GoogleMaps.load();
// });

// Template.mapPage.helpers({  
//   mapOptions: function() {
//     if (GoogleMaps.loaded()) {
//       return {
//         center: new google.maps.LatLng(13.1641, 100.9217),
//         zoom: 8
//       };
//     }
//   } 
// });

// Template.body.onCreated(function() {

//   // We can use the `ready` callback to interact with the map API once the map is ready.
// 	GoogleMaps.ready('mapEx', function(map) {
// 	    // Add a marker to the map once it's ready
// 	    var marker = new google.maps.Marker({
// 	      position: map.options.center,
// 	      map: map.instance
// 	   	});

//        google.maps.event.addListener(map.instance, 'click', function(event) {
//         var point = {lat: event.latLng.lat(), lng: event.latLng.lng()};
//         Meteor.call('markInsert',point);
//         // Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
//       });

//        addMark();
      
// 	});
// });


/////////////////////////////////////////////////////////////////////////////////////

Markers = new Mongo.Collection('markers');

if (Meteor.isClient) {
  Template.mapPage.onCreated(function() {
    GoogleMaps.ready('mapEx', function(map) {

      //Add a marker to the map once it's ready
       var marker = new google.maps.Marker({
         position: map.options.center,
         map: map.instance
       });

      google.maps.event.addListener(map.instance, 'click', function(event) {
        Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      });

      var markers = {};

      Markers.find().observe({
        added: function (document) {
          var marker = new google.maps.Marker({
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(document.lat, document.lng),
            map: map.instance,
            id: document._id
          });

          google.maps.event.addListener(marker, 'dragend', function(event) {
            Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
          });

          markers[document._id] = marker;
        },
        changed: function (newDocument, oldDocument) {
          markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
        },
        removed: function (oldDocument) {
          markers[oldDocument._id].setMap(null);
          google.maps.event.clearInstanceListeners(markers[oldDocument._id]);
          delete markers[oldDocument._id];
        }
      });
    });
  });

  Meteor.startup(function() {
    GoogleMaps.load();
  });

  Template.mapPage.helpers({
    mapOptions: function() {
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(13.1641, 100.9217),
          zoom: 8
        };
      }
    }
  });
}
