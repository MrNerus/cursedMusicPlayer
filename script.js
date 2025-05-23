const draggable = document.getElementById('draggable');
const percentView = document.getElementById('percent');
const title = document.getElementById('title');
const track = document.getElementById('track');
const trackInner = document.getElementById('trackInner');
const overlay = document.getElementById('overlay');
const playBtn = document.getElementById('playBtn');

let isDragging = false;
let startX = 0;
let startTransform = 0;
let percent = 0.5;

const audio = new Audio();
let disableClick = false;

// Load random music
const currentUrl = window.location.href;
fetch(`${currentUrl}/music.json`)
    .then(res => res.json())
    .then(musicList => {
        const random = musicList[Math.floor(Math.random() * musicList.length)];
        audio.src = `${currentUrl}/musics/${random.url}`;
        title.innerText = random.title;
    })
    .catch(console.error);

document.addEventListener('click', () => {
    if (!disableClick) audio.play();
    else disableClick = true;
});

window.addEventListener('DOMContentLoaded', () => {
    const center = (track.clientWidth - draggable.offsetWidth) / 2;
    draggable.style.left = `${center}px`;

    trackInner.style.transform = `translateX(0px)`;
});



playBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
});


function getClientX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
}

function onStart(e) {
    isDragging = true;
    draggable.classList.add('dragging');
    startX = getClientX(e);

    const transform = getComputedStyle(trackInner).transform;
    startTransform = transform !== 'none' ? new DOMMatrix(transform).m41 : 0;

    // Prevent scroll on touch
    if (e.cancelable) e.preventDefault();
}

function onMove(e) {
    if (!isDragging) return;

    const dx = getClientX(e) - startX;
    const maxMove = (track.clientWidth - draggable.offsetWidth);
    let newX = startTransform + dx;
    newX = Math.max(-maxMove / 2, Math.min(newX, maxMove / 2));

    trackInner.style.transform = `translateX(${newX}px)`;

    percent = 1 - ((newX + maxMove / 2) / maxMove);
    audio.volume = percent;
    percentView.innerText = `${Math.round(percent * 100)}%`;

    if (e.cancelable) e.preventDefault(); // Prevent scrolling while dragging
}

function onEnd() {
    isDragging = false;
    draggable.classList.remove('dragging');
}

draggable.addEventListener('mousedown', onStart);
document.addEventListener('mousemove', onMove);
document.addEventListener('mouseup', onEnd);

draggable.addEventListener('touchstart', onStart, { passive: false });
document.addEventListener('touchmove', onMove, { passive: false });
document.addEventListener('touchend', onEnd);