console.log('lets write javaScript');
let currentSong = new Audio();
let songs;

function secondstoMinutesSeconds(seconds) {
    if (typeof seconds !== "number" || isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

async function getSongs() {

    let a = await fetch("http://127.0.0.1:5500/Songs/")
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split('/').pop());
        }
    }
    return songs

}

const playMusic = (track,pause=false) => {
    currentSong.src = "/Songs/" + track
    if(!pause){
    currentSong.play()
    play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {

    // Get the list of all songs
    songs = await getSongs()
    playMusic(songs[0],true)


    // show all the songs in playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    // ...existing code...
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li data-filename="${song}">
        <img class="invert" src="music.svg" alt="">
        <div class="info">
            <div>${decodeURIComponent(song)}</div>
            <div>Sanika</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="play.svg" alt="">
        </div>
    </li>`;
    }

    
    // Attach an event listener to each song

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            const filename = e.getAttribute("data-filename");
            playMusic(filename);
        });
    });

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    // listen for time update event

    currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondstoMinutesSeconds(currentSong.currentTime)}/${secondstoMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration) * 100 +"%";
})

    //  add an event listner to seekbar

    document.querySelector(".seekbar").addEventListener("click", function(e) {
    const seekbar = this;
    const rect = seekbar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const percent = offsetX / width;
    if (currentSong.duration && !isNaN(currentSong.duration)) {
        currentSong.currentTime = percent * currentSong.duration;
    }
})

    // add an event listner to hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0"

    })

    // add an  event listner to close button 

    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-100%"

})

   // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            const filename = this.getAttribute('data-filename');
            if (filename) {
                playMusic(filename);
            }
        });
    });
}

main()

