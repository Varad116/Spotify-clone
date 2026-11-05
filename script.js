console.log('Lets write JavaScript');

let currentSong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(decodeURIComponent(element.href).split(/[\\/]/).pop())
        }
    }
    return songs
}

const playMusic = (track)=>{
    // let audio = new Audio("/songs/" + track)
    currentSong.src = "/songs/" + track
    currentSong.play()
    play.src = "/img/pause.svg"
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {

    // Get the list of all the songs
    songs = await getSongs()
    console.log(songs)

    // show all the songs in playlist
    let songUL = document.querySelector(".songList") .getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="img/music.svg" alt="Music">
                        <div class="info">
                            <div>${song.replace("%5Csongs%5C", " ")}</div>
                            <div>VARAD</div>
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                            <img class="invert" src="img/play.svg" alt="playnow">
                        </div>
         </li>`;
    }

    // attach an event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerText.trim())
        })
    })

    // attach an event listner to play, next and previous
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "/img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "/img/play.svg"
        }
    })

    // listen for time update events
    currentSong.addEventListener("timeupdate", ()=>{
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration) * 100 +"%";
    })

    // add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
})

// add an event listner for hamburger
document.querySelector(".hamburger").addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "0"
})

// add an event listner for close button
document.querySelector(".close").addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "-120%"
})

// add an event listner to previous
previous.addEventListener("click", ()=>{
    console.log("previous clicked")
    console.log(currentSong)
    let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
    if ((index-1) >= 0) {
        playMusic(songs[index-1])
    }
})

// add an event listner to next
next.addEventListener("click", ()=>{
    console.log("next clicked")
    console.log(currentSong.src)
    let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
    if ((index+1) < songs.length) {
        playMusic(songs[index+1])
    }
})

// add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
    console.log("setting volume to", e.target.value, "/ 100")
    currentSong.volume = parseInt(e.target.value)/100
})

}

main()