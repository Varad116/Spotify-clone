console.log('Lets write JavaScript');

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
            songs.push(element.href.split("/").pop())
        }
    }
    return songs
}

async function main() {
    // Get the list of all the songs
    let songs = await getSongs()
    console.log(songs)

    // show all the songs in playlist
    let songUL = document.querySelector(".songList") .getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="img/music.svg" alt="Music">
                        <div class="info">
                            <div><pre>${song.replace("%5Csongs%5C", " ")}</pre></div>
                            <div><pre>VARAD</pre></div>
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                            <img class="invert" src="img/play.svg" alt="playnow">
                        </div>
         </li>`;
    }
    
    // Play the first song
    let audio = new Audio(songs[0]);
    audio.play();

    audio.addEventListener("loadeddata", () => {
        console.log("audio.duration, audio.currentSrc, audio.currentTime",);
        // the duration variable now holds the duration (in seconds) of the audio clip
    });

}

main()