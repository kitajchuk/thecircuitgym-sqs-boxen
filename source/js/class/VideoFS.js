import * as core from "../core";


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
        this.container = this.element[ 0 ].parentNode;
        this.contentWindow = this.element[ 0 ].contentWindow;
        this.videoRatio = this.element[ 0 ].width / this.element[ 0 ].height;
        this.originalWidth = this.element[ 0 ].width;
        this.originalHeight = this.element[ 0 ].height;

        this.handleResize = this.onResize.bind( this );

        core.emitter.on( "app--resize", this.handleResize );

        this.handleResize();
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

        this.element[ 0 ].style.width = core.util.px( videoWidth );
        this.element[ 0 ].width = videoWidth;
        this.element[ 0 ].style.height = core.util.px( videoHeight );
        this.element[ 0 ].height = videoHeight;
    }


    destroy () {
        if ( this.handleResize ) {
            core.emitter.off( "app--resize", this.handleResize );
        }
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default VideoFS;
