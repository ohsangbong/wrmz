const highlighting_border = (domSelector, gameName, from, itemName) => {
    let count = 0;
    $(domSelector).css("border", "20px solid red");
    $('.status').append(`
            <span>${gameName}에서 ${from}님이 보낸&nbsp</span>
            <span class="redColor"> ${itemName}이(가)</span>
            <span> 도착하였습니다.</span>`);
    const hilighting = setInterval(() => {
        if(count % 2 === 1) {
            $(domSelector).css("border", "20px solid red");
        } else {
            $(domSelector).css("border", "20px solid yellow");
        }
        count++;
    }, 800)
    setTimeout(() => {
        clearInterval(hilighting);
        $(domSelector).css("border", "none");
        $('.status span').remove();
    }, 4800)
}

$( document ).ready(function() {
    $('.item-1').css("background-image", "url(" + requiredImages.launcher + ")");
    $('.item-2').css("background-image", "url(" +  requiredImages.grenade + ")");
    $('.item-3').css("background-image", "url(" + requiredImages.airstrike + ")");
    $('.item-4').css("background-image", "url(" + requiredImages.dynamite + ")");
    $('.item-5').css("background-image", "url(" + requiredImages.baseballBat + ")");


    var ws = new WebSocket('ws://10.0.3.182:8000', 'connection');
    ws.onopen = function () {
        ws.send('hello');
    };

    ws.onmessage = function (evt) {
        const eventData = JSON.parse(evt.data)
        if(eventData.description === "grenade") {
            const grenadeSnailImg = "images/grenadeSnail.png";
            highlighting_border('.item-2', 'Maple Story',  eventData.owner, eventData.name);
            $('.item-2').css("background-image", "url(" +  grenadeSnailImg + ")");
        } else if (eventData.description === "baseballBat") {
            requiredImages.baseballBat = "images/baseballBatDoruko_inventory.png";
            highlighting_border('.item-5', 'Maple Story',  eventData.owner, eventData.name);
            $('.item-5').css("background-image", "url(" +  requiredImages.baseballBat + ")");
        }
    };

    ws.onclose = function () {
        console.log("connection is closed");
    };
    requestPreloads();

})