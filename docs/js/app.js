bodymovin.loadAnimation({
    container: document.getElementById("header_loader"),
    renderer: 'canvas',
    loop: true,
    autoplay: true,
    path: 'tgs/duck_files.json',
    rendererSettings: {
        clearCanvas: true,
    }
});
load_data().then(_ => {});
async function load_data() {
    let result = await request_get('https://app.owlgram.org/dc_status');
    for (let i = 0;i < result['status'].length;i++) {
        let dcInfo = result['status'][i];
        let dcID = dcInfo['dc_id'];
        document.getElementById('dc' + dcID + '_tab').classList.remove('loading');
        let elementStatus = document.getElementById('dc' + dcID + '_status');
        let textStatus;
        if (dcInfo['dc_status'] === 1) {
            elementStatus.classList.add('available')
            textStatus = 'Available, Ping: ';
        } else if (dcInfo['dc_status'] === 2) {
            elementStatus.classList.add('slow')
            textStatus = 'Slow, Ping: ';
        } else if (dcInfo['dc_status'] === 0) {
            elementStatus.classList.add('offline')
            textStatus = 'Offline, Ping: ';
        }
        textStatus += dcInfo['ping'] + 'ms'
        elementStatus.innerHTML = textStatus;
    }
    let now = new Date();
    let time = new Date(((result['last_refresh']) * 1000) + (now.getTimezoneOffset() * 60000));
    let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    document.getElementById('loading_date').classList.remove('placeholder');
    document.getElementById('loading_date').innerHTML = months[time.getMonth()] + ' ' + getStringTime(time.getDate()) + ' ' + time.getFullYear() + ' ' + getStringTime(time.getHours()) + ':' + getStringTime(time.getMinutes()) + ' UTC';
}
function getStringTime(date) {
    if (date < 10) {
        return '0' + date;
    } else {
        return date;
    }
}
function refreshPage() {
    setTimeout(() => {
        location.reload();
    }, 200);
}
async function request_get(link){
    return await (await fetch(link, {
        method: 'GET',
    })).json()
}