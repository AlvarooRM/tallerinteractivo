// script.js
let alarms = JSON.parse(localStorage.getItem('alarms')) || [];
let alarmSound = new Audio('media/despertador-dios-alarma.mp3');
let alarmTimeout = null;

function showTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const currentDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

    document.getElementById('clock').innerText = `${hours}:${minutes}:${seconds}`;
    document.getElementById('date').innerText = currentDate;

    checkAlarms();
    setTimeout(showTime, 1000);
}

function changeTheme(theme) {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
}

function showModal() {
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function addAlarm() {
    const alarmTime = document.getElementById('alarmTime').value;
    if (alarmTime) {
        alarms.push({ time: alarmTime, triggered: false });
        localStorage.setItem('alarms', JSON.stringify(alarms));
        closeModal();
        showAlarms();
    }
}

function showAlarms() {
    const container = document.getElementById('alarmsContainer');
    container.innerHTML = '';
    alarms.filter(alarm => !alarm.triggered).forEach((alarm, index) => {
        const alarmElem = document.createElement('div');
        alarmElem.innerText = `Alarma a las ${alarm.time}`;
        container.appendChild(alarmElem);
    });
}

function checkAlarms() {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    alarms.forEach((alarm, index) => {
        if (alarm.time === currentTime && !alarm.triggered) {
            alarmSound.play();
            alarm.triggered = true; 
            alert("¡Alarma!");
            clearTimeout(alarmTimeout);
            alarmTimeout = setTimeout(() => {
                alarmSound.pause();
                alarmSound.currentTime = 0;
            }, 3000); 
            localStorage.setItem('alarms', JSON.stringify(alarms));
            showAlarms();
        }
    });
}

document.querySelectorAll('.theme-button').forEach(button => {
    button.addEventListener('click', function() {
        changeTheme(this.getAttribute('data-theme'));
    });
});

document.getElementById('alarmButton').addEventListener('click', showModal);
document.querySelector('.close').addEventListener('click', closeModal);

window.onload = function() {
    showTime();
    showAlarms();
    const savedTheme = localStorage.getItem('theme') || 'default';
    changeTheme(savedTheme);
};
