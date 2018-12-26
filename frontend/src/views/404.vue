<template>
  <div class="bonk">
    <div class="bonk-wrapper">
      <div class="bonk-wrapper-headers">
        <h1 class="bonk-wrapper-headers-lenny">( ͡◉ ͜ʖ ͡◉)</h1>
        <h1 class="bonk-wrapper-headers-oops">OOPS!</h1>
      </div>

      <h1 class="bonk-wrapper-headers-deadend">You have hit a dead end!</h1>

      <div class="bonk-wrapper-buttons">
        <router-link to="/">
          <button>Go Back</button>
        </router-link>

        <button id="play-video" @click="videoPlayback" disabled>
          <div id="play-video-spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
          </div>

          <span class="hidden" id="play-video-text">Play video</span>
        </button>
      </div>
    </div>

    <video id="bonk-video" controls>
      <source src="@/assets/videos/bonked.mp4" type="video/mp4">Your browser is missing out on a really funny video
    </video>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

interface Video {
  isPlaying: boolean;
  player: HTMLVideoElement | null;
}

@Component
export default class Home extends Vue {
  private video: Video = {
    isPlaying: false,
    player: null
  };

  public mounted() {
    const video = document.getElementById("bonk-video");
    if (!video) return;

    const playVideoSpan: HTMLSpanElement | null = document.getElementById("play-video-text");
    if (!playVideoSpan) return;

    this.video.player = video as HTMLVideoElement;

    this.video.player.onpause = () => this.pauseVideo(playVideoSpan);
    this.video.player.onplay = () => this.playVideo(playVideoSpan);
    this.video.player.onended = () => this.pauseVideo(playVideoSpan);
    this.video.player.oncanplay = () => {
      const playVideoSpinner: HTMLElement | null = document.getElementById("play-video-spinner");
      if (!playVideoSpinner) return;

      const playVideo: HTMLElement | null = document.getElementById("play-video");
      if (!playVideo) return;

      playVideo.removeAttribute("disabled");

      playVideoSpinner.remove();
      playVideoSpan.classList.remove("hidden");
    };
  }

  private videoPlayback() {
    const playVideoSpan: HTMLSpanElement | null = document.getElementById("play-video-text");
    if (!playVideoSpan) return;

    if (this.video.isPlaying) this.pauseVideo(playVideoSpan);
    else this.playVideo(playVideoSpan);
  }

  private playVideo(playVideoSpan: HTMLSpanElement) {
    if (!this.video.player) return;

    if (!this.video.isPlaying) {
      this.video.player.play();
      playVideoSpan.innerText = "Pause Video";
    }

    this.video.isPlaying = true;
  }

  private pauseVideo(playVideoSpan: HTMLSpanElement) {
    if (!this.video.player) return;

    if (this.video.isPlaying) {
      this.video.player.pause();
      playVideoSpan.innerText = "Play Video";
    }

    this.video.isPlaying = false;
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/colors.scss";

.bonk {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);

  // No flex wrap to prevent margins from collapsing between video and header
  @media screen and (max-width: 1175px) {
    flex-direction: column;

    .bonk-wrapper {
      margin-right: 0;
    }
  }
}

.bonk-wrapper {
  flex-direction: column;
  margin-right: 50px;
}

.bonk-wrapper-headers {
  display: flex;
  flex-direction: row;
  min-width: 200px;

  @media screen and (max-width: 400px) {
    flex-direction: column;

    .bonk-wrapper-headers-oops {
      margin-left: 0px;
    }
  }
}

h1 {
  font-size: 3rem;
  color: $primary;
  margin-bottom: 25px;
  text-align: center;
}

.bonk-wrapper-headers-lenny {
  color: lighten($primary, 10%);
}

.bonk-wrapper-headers-oops {
  margin-left: 25px;
}

.bonk-wrapper-headers-deadend {
  font-size: 2rem;
  text-align: center;
}

.bonk-wrapper-buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 35px 0;
}

button {
  width: 125px;
  height: 50px;
  margin: 0 25px;
  border: 2px solid $primary;
  border-radius: 25px;
  background-color: $primary;
  color: darken($background, 1%);
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  &:disabled {
    $disabledColor: darken($primary, 10%);

    background-color: $disabledColor;
    border-color: $disabledColor;
    cursor: default;
  }

  &:hover:not(:disabled) {
    background-color: transparent;
    color: $primary;
    cursor: pointer;
  }
}

video {
  width: 364px;
  height: 364px;
  border: 8px solid $primary;
}

@media screen and (max-width: 538px) {
  #play-video,
  video {
    display: none;
  }
}

// http://tobiasahlin.com/spinkit/
#play-video-spinner {
  margin: 0 auto;
  width: 70px;
  text-align: center;
}

#play-video-spinner > div {
  width: 12px;
  height: 12px;
  background-color: darken($background, 1%);

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

#play-video-spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

#play-video-spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
  }
}

@keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>

