let myMap;




const init = ()=>{
    myMap=new ymaps.Map("map__image",{
        center: [56.01103750, 92.87142728],
        zoom:11,
        controls:[]
    });

    const coords=[
        [56.05100284, 92.90430406],
        [56.02214215, 92.79863689],
        [56.00997077, 92.87056493]
    
    ];

    const myColl=new ymaps.GeoObjectCollection({},{
        draggable:false,
        iconLayout:'default#image',
        iconImageHref: './img/map/map-icon.svg',
        iconImageSize: [58,73]

    });

    coords.forEach(coord=>{
        myColl.add(new ymaps.Placemark(coord));
    });

    myMap.geoObjects.add(myColl);

    myMap.behaviors.disable('scrollZoom')
}

ymaps.ready(init);