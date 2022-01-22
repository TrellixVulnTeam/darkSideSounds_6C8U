
//SLIDER DEL INDEX (<SECTION>TARJETAS)

const slider = document.querySelector('.isection__slidercontainer');
const slides = Array.from(document.querySelectorAll('.isection__slidercontainer--slide'));

let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID;
let currentIndex = 0;

slides.forEach((slide, index) => {
  // touch events
  slide.addEventListener('touchstart', touchStart(index))
  slide.addEventListener('touchend', touchEnd)
  slide.addEventListener('touchmove', touchMove)
  // mouse events
  slide.addEventListener('mousedown', touchStart(index))
  slide.addEventListener('mouseup', touchEnd)
  slide.addEventListener('mousemove', touchMove)
  slide.addEventListener('mouseleave', touchEnd)
});

// make responsive to viewport changes
window.addEventListener('resize', setPositionByIndex);

// prevent menu popup on long press
window.oncontextmenu = function (event) {
  event.preventDefault()
  event.stopPropagation()
  return false
};

function getPositionX(event) {
  return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
};

function touchStart(index) {
  return function (event) {
    currentIndex = index
    startPos = getPositionX(event)
    isDragging = true
    animationID = requestAnimationFrame(animation)
    slider.classList.add('grabbing')
  };
};

function touchMove(event) {
  if (isDragging) {
    const currentPosition = getPositionX(event)
    currentTranslate = prevTranslate + currentPosition - startPos
  }
}

function touchEnd() {
  cancelAnimationFrame(animationID)
  isDragging = false
  const movedBy = currentTranslate - prevTranslate

  // si se mueve lo suficiente (-x) saltará al siguiente slider, de haber alguno
  if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1

  // si se mueve lo suficiente (x) saltará al siguiente slider, de haber alguno
  if (movedBy > 100 && currentIndex > 0) currentIndex -= 1

  setPositionByIndex()

  slider.classList.remove('grabbing')
}

function animation() {
  setSliderPosition()
  if (isDragging) requestAnimationFrame(animation)
}

function setPositionByIndex() {
  currentTranslate = currentIndex * -window.innerWidth
  prevTranslate = currentTranslate
  setSliderPosition()
}

function setSliderPosition() {
  slider.style.transform = `translateX(${currentTranslate}px)`
}


// REPRODUCTOR DE AUDIO


const audio = document.querySelector('audio');
const playPauseBtn = document.querySelector('#play-pause');
const nextBtn = document.querySelector('#next');
const prevBtn = document.querySelector('#previous');
const songList = document.querySelector('.song-list');
const title = document.querySelector('#title');
const record = document.querySelector('.record');
const volSlider = document.querySelector('.slider');

let songArray = [];
let songHeading = '';
let songIndex = 0;
let isPlaying = false;

function loadAudio() {
    audio.src = songArray[songIndex];

    let songListItems = songList.getElementsByTagName('li');
    songHeading = songListItems[songIndex].getAttribute('data-name');
    title.innerText = songHeading;

    //Highlight
    for(i=0; i<songListItems.length; i++){
        songListItems[i].classList.remove('active');
    }

    songList.getElementsByTagName('li')[songIndex].classList.add('active');
}

function loadSongs(){
    let songs = songList.getElementsByTagName('li');
    for(i=0; i<songs.length; i++){
        songArray.push(songs[i].getAttribute('data-src'));
    }

    loadAudio();
};

loadSongs();

function playAudio(){
    audio.play(); 
    playPauseBtn.querySelector('i.fas').classList.remove('fa-play');
    playPauseBtn.querySelector('i.fas').classList.add('fa-pause');
    isPlaying = true;
    record.classList.add('record-animation');
}

function pauseAudio(){
    audio.pause();  
    playPauseBtn.querySelector('i.fas').classList.remove('fa-pause');
    playPauseBtn.querySelector('i.fas').classList.add('fa-play');
    isPlaying = false;
    record.classList.remove('record-animation');
}

function nextSong() {
    songIndex++;
    if(songIndex > songArray.length - 1){
        songIndex = 0;
    };
    loadAudio();
    playAudio();
}

function previousSong(){
    songIndex--;
    if(songIndex < 0){
        songIndex = songArray.length -1;
    };
    loadAudio();
    playAudio();
}

playPauseBtn.addEventListener('click', function(){
    if(isPlaying === true){
        pauseAudio();
    } else{
        playAudio();
    }
}, false);

nextBtn.addEventListener('click', function(){
    nextSong();
}, false);

prevBtn.addEventListener('click', function(){
    previousSong();
}, false);

songList.addEventListener('click', function(e){
    songIndex = e.target.closest('li').getAttribute('data-index');
    loadAudio();
    playAudio();
}, false);

audio.addEventListener('ended', function(){
    nextSong();
});

volSlider.addEventListener('input', function(){
    audio.volume = volSlider.value / 100;
}, false);
