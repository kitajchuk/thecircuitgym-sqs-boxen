import * as core from "../core";
import paramalama from "paramalama";
import loadJS from "fg-loadjs";
import ResizeController from "properjs-resizecontroller";


const api = "https://www.youtube.com/iframe_api";


/**
 *
 * @public
 * @global
 * @class VideoFS
 * @param {Element} video The dom element to work with.
 * @param {string} source The url of the video file
 * @classdesc Handle fullbleed cover video.
 *
 */
class VideoFS {
    constructor ( element ) {
        this.element = element;
        this.data = this.element.data();
        this.script = this.element.find( "script" ).detach();
        this.blockJson = JSON.parse( this.script[ 0 ].textContent );
        this.params = paramalama( this.data.url );
        this.videoId = this.params.v;
        this.container = this.element[ 0 ].parentNode;
        this.videoRatio = parseInt( this.data.width, 10 ) / parseInt( this.data.height, 10 );
        this.originalWidth = parseInt( this.data.width, 10 );
        this.originalHeight = parseInt( this.data.height, 10 );
        this.handleResize = this.onResize.bind( this );
        this.resizer = new ResizeController();

        // Thumbnail image load for mobile
        if ( core.detect.isDevice() ) {
            this.loadImage();

        // YouTube JS API loaded?
        } else if ( window.YT ) {
            this.onReady();

        } else {
            this.loadJSAPI();
        }
    }


    loadImage () {
        core.util.loadImages( this.element, core.util.noop ).on( "done", () => {
            this.container.className += " is-active";
        });
    }


    loadJSAPI () {
        window.onYouTubeIframeAPIReady = () => {
            delete window.onYouTubeIframeAPIReady;

            this.onReady();
        };

        loadJS( api );
    }


    onReady () {
        this.player = new window.YT.Player( this.element[ 0 ], {
            height: this.originalHeight,
            width: this.originalWidth,
            videoId: this.videoId,
            playerVars: {
                disablekb: 1,
                controls: 0,
                iv_load_policy: 3,
                loop: 1,
                playlist: this.videoId,
                modestbranding: 1,
                playsinline: 1,
                rel: 0,
                showinfo: 0,
                wmode: "opaque",
                autoplay: 1
            },
            events: {
                onReady: ( e ) => {
                    e.target.playVideo();
                },
                onStateChange: ( e ) => {
                    // For example:
                    // Firefox with Block Audio / Video enabled
                    // Users can choose to set browsers to block autoplay content
                    // For this we apply a weak fallback (background image)
                    if ( e.data === window.YT.PlayerState.UNSTARTED ) {
                        this.iframe = this.player.f;
                        this.iframe.style.display = "none";
                        this.iframe.parentNode.appendChild( this.element[ 0 ] );
                        this.loadImage();

                    } else if ( e.data === window.YT.PlayerState.PLAYING ) {
                        this.iframe = this.player.f;
                        this.container.className += " is-active";

                        this.resizer.on( "resize", this.handleResize );
                        this.handleResize();
                    }
                }
            }
        });
    }


    onResize () {
        const nodeRect = this.container.getBoundingClientRect();
        const windowRatio = nodeRect.width / nodeRect.height;
        const adjustRatio = this.videoRatio / windowRatio;
        let videoWidth = null;
        let videoHeight = null;

        if ( windowRatio < this.videoRatio ) {
            videoWidth = nodeRect.width * adjustRatio;

        } else {
            videoWidth = nodeRect.width;
        }

        videoHeight = this.originalHeight * videoWidth / this.originalWidth;

        this.iframe.style.width = core.util.px( videoWidth );
        this.iframe.width = videoWidth;
        this.iframe.style.height = core.util.px( videoHeight );
        this.iframe.height = videoHeight;
    }


    destroy () {
        // Kill the resive event
        if ( this.handleResize ) {
            this.resizer.off( "resize", this.handleResize );
        }
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default VideoFS;
