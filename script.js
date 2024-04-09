window.onload = () => {
    const button = document.querySelector('button[data-action="change"]');
    button.innerText = '﹖';

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const places = staticLoadPlaces(latitude, longitude);
            renderPlaces(places);
            
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }

    console.log(longitude, latitude)
};

function staticLoadPlaces(latitude, longitude) {
    return [
        {
            name: 'Pokèmon',
            location: {
                lat: latitude,
                lng: longitude,
            },
        },
    ];
}

function calculatePosition(latitude, longitude, distance) {
    const earthRadius = 6378137; // Earth's radius in meters
    const dLat = (distance / earthRadius) * (180 / Math.PI);
    const newLat = latitude + dLat;
    const dLng = (distance / earthRadius) * (180 / Math.PI) / Math.cos(latitude * Math.PI / 180);
    const newLng = longitude + dLng;
    return { lat: newLat, lng: newLng };
}

var models = [
    {
        url: './assets/magnemite/scene.gltf',
        scale: '0.5 0.5 0.5',
        info: 'Magnemite, Lv. 5, HP 10/10',
        rotation: '0 180 0',
    },
    {
        url: './assets/articuno/scene.gltf',
        scale: '0.2 0.2 0.2',
        rotation: '0 180 0',
        info: 'Articuno, Lv. 80, HP 100/100',
    },
    {
        url: './assets/dragonite/scene.gltf',
        scale: '0.08 0.08 0.08',
        rotation: '0 180 0',
        info: 'Dragonite, Lv. 99, HP 150/150',
    },
];

var modelIndex = 0;
var setModel = function (model, entity) {
    if (model.scale) {
        entity.setAttribute('scale', model.scale);
    }

    if (model.rotation) {
        entity.setAttribute('rotation', model.rotation);
    }

    if (model.position) {
        entity.setAttribute('position', model.position);
    }

    entity.setAttribute('gltf-model', model.url);

    const div = document.querySelector('.instructions');
    div.innerText = model.info;
};

function renderPlaces(places, latitude, longitude) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        let model = document.createElement('a-entity');

        const distanceInFrontOfUser = 10; // Adjust this distance as needed
        const newPosition = calculatePosition(latitude, longitude, distanceInFrontOfUser);

        model.setAttribute('gps-entity-place', `latitude: ${newPosition.lat}; longitude: ${newPosition.lng};`);

        setModel(models[modelIndex], model);

        model.setAttribute('animation-mixer', '');

        document.querySelector('button[data-action="change"]').addEventListener('click', function () {
            var entity = document.querySelector('[gps-entity-place]');
            modelIndex++;
            var newIndex = modelIndex % models.length;
            setModel(models[newIndex], entity);
        });

        scene.appendChild(model);
    });
}