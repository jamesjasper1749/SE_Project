Meteor.startup(function() {  
  GoogleMaps.load({ v: '3', key: 'AIzaSyDzgiOABUWqCUWLMX6bXkRnPn-K6jqfua0', libraries: 'geometry,places' });
});

Template.mapPage.helpers({  
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(13.1641, 100.9217),
        zoom: 12,
        styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]

      };
    }
  } 
});

Meteor.subscribe('markers');

Template.mapPage.onCreated(function() {

  // We can use the `ready` callback to interact with the map API once the map is ready.
	GoogleMaps.ready('mapEx', function(map) {
	    // Add a marker to the map once it's ready
	    var marker1 = new google.maps.Marker({
	      position: map.options.center,
	      map: map.instance
	   	});

       google.maps.event.addListener(map.instance, 'click', function(event) {
        var point = {lat: event.latLng.lat(), lng: event.latLng.lng()};
        Meteor.call('markInsert',point);
        // Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      });

       console.log('1');

        var markers = {};

        Markers.find().observe({  
          added: function(document) {
            // Create a marker for this document
            var marker = new google.maps.Marker({
              draggable: true,
              animation: google.maps.Animation.DROP,
              position: new google.maps.LatLng(document.lat, document.lng),
              map: map.instance,
              // We store the document _id on the marker in order 
              // to update the document within the 'dragend' event below.
              id: document._id
            });

            // This listener lets us drag markers on the map and update their corresponding document.
            google.maps.event.addListener(marker, 'dragend', function(event) {
              Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
            });

            // Store this marker instance within the markers object.
            markers[document._id] = marker;
          },
          changed: function(newDocument, oldDocument) {
            markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
          },
          removed: function(oldDocument) {
            // Remove the marker from the map
            markers[oldDocument._id].setMap(null);

            // Clear the event listener
            google.maps.event.clearInstanceListeners(
              markers[oldDocument._id]);

            // Remove the reference to this marker instance
            delete markers[oldDocument._id];
          }
        });
      
	});
});




/////////////////////////////////////////////////////////////////////////////////////

  // var MAP_ZOOM = 15;

  // Meteor.startup(function() {
  //   GoogleMaps.load({ v: '3', key: 'AIzaSyDzgiOABUWqCUWLMX6bXkRnPn-K6jqfua0', libraries: 'geometry,places' });
  // });

  // Template.map.onCreated(function() {
  //   var self = this;

  //   GoogleMaps.ready('map', function(map) {
  //     var marker;

  //     // Create and move the marker when latLng changes.
  //     self.autorun(function() {
  //       var latLng = Geolocation.latLng();
  //       if (! latLng)
  //         return;

  //       // If the marker doesn't yet exist, create it.
  //       if (! marker) {
  //         marker = new google.maps.Marker({
  //           position: new google.maps.LatLng(latLng.lat, latLng.lng),
  //           map: map.instance
  //         });
  //       }
  //       // The marker already exists, so we'll just change its position.
  //       else {
  //         marker.setPosition(latLng);
  //       }

  //       // Center and zoom the map view onto the current position.
  //       map.instance.setCenter(marker.getPosition());
  //       map.instance.setZoom(MAP_ZOOM);
  //     });
  //   });
  // });

  // Template.map.helpers({
  //   geolocationError: function() {
  //     var error = Geolocation.error();
  //     return error && error.message;
  //   },
  //   mapOptions: function() {
  //     var latLng = Geolocation.latLng();
  //     // Initialize the map once we have the latLng.
  //     if (GoogleMaps.loaded() && latLng) {
  //       return {
  //         center: new google.maps.LatLng(latLng.lat, latLng.lng),
  //         zoom: MAP_ZOOM,
  //         styles: [
  //             {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
  //             {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
  //             {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
  //             {
  //               featureType: 'administrative.locality',
  //               elementType: 'labels.text.fill',
  //               stylers: [{color: '#d59563'}]
  //             },
  //             {
  //               featureType: 'poi',
  //               elementType: 'labels.text.fill',
  //               stylers: [{color: '#d59563'}]
  //             },
  //             {
  //               featureType: 'poi.park',
  //               elementType: 'geometry',
  //               stylers: [{color: '#263c3f'}]
  //             },
  //             {
  //               featureType: 'poi.park',
  //               elementType: 'labels.text.fill',
  //               stylers: [{color: '#6b9a76'}]
  //             },
  //             {
  //               featureType: 'road',
  //               elementType: 'geometry',
  //               stylers: [{color: '#38414e'}]
  //             },
  //             {
  //               featureType: 'road',
  //               elementType: 'geometry.stroke',
  //               stylers: [{color: '#212a37'}]
  //             },
  //             {
  //               featureType: 'road',
  //               elementType: 'labels.text.fill',
  //               stylers: [{color: '#9ca5b3'}]
  //             },
  //             {
  //               featureType: 'road.highway',
  //               elementType: 'geometry',
  //               stylers: [{color: '#746855'}]
  //             },
  //             {
  //               featureType: 'road.highway',
  //               elementType: 'geometry.stroke',
  //               stylers: [{color: '#1f2835'}]
  //             },
  //             {
  //               featureType: 'road.highway',
  //               elementType: 'labels.text.fill',
  //               stylers: [{color: '#f3d19c'}]
  //             },
  //             {
  //               featureType: 'transit',
  //               elementType: 'geometry',
  //               stylers: [{color: '#2f3948'}]
  //             },
  //             {
  //               featureType: 'transit.station',
  //               elementType: 'labels.text.fill',
  //               stylers: [{color: '#d59563'}]
  //             },
  //             {
  //               featureType: 'water',
  //               elementType: 'geometry',
  //               stylers: [{color: '#17263c'}]
  //             },
  //             {
  //               featureType: 'water',
  //               elementType: 'labels.text.fill',
  //               stylers: [{color: '#515c6d'}]
  //             },
  //             {
  //               featureType: 'water',
  //               elementType: 'labels.text.stroke',
  //               stylers: [{color: '#17263c'}]
  //             }
  //           ]
  //       };
  //     }
  //   }
  // });
