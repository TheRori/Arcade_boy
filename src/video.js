import {getVideoConfig} from "./loader";

let videoPlaying = false;

export function set_video(link, startTime = 0) {
    const video = document.getElementById("video");
    const source = document.getElementById("videoMachine");

    if (link === "") {
        video.style.transform = "none";
        video.style.filter = "none";
        source.src = "";
        video.style.display = "none";
        videoPlaying = false;
        return;
    }

    // Charger la vidéo
    source.src = "media/video/" + link;
    video.style.display = "inline-block";
    video.load();
    video.currentTime = startTime;

    // Appliquer les configurations spécifiques
    const config = getVideoConfig(link);
    video.style.transform = config.transform;
    video.style.filter = config.filter;
    Object.assign(video.style, config.styles);

    videoPlaying = true;
}

