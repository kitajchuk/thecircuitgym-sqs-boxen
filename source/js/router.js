import ImageController from "./class/ImageController";
import CoverController from "./class/CoverController";
import CarouselController from "./class/CarouselController";
import TabsController from "./class/TabsController";
import BlocksCoverController from "./class/BlocksCoverController";
import VideoFS from "./class/VideoFS";
import * as core from "./core";
import navi from "./navi";


/**
 *
 * @public
 * @namespace router
 * @description Handles async web app routing for nice transitions.
 *
 */
const router = {
    /**
     *
     * @public
     * @method init
     * @memberof router
     * @description Initialize the router module.
     *
     */
    init () {
        this.pageDuration = core.util.getTransitionDuration( core.dom.page[ 0 ] );
        this.bindEmpty();
        this.initPage();

        core.log( "router initialized" );
    },


    /**
     *
     * @public
     * @method initPage
     * @param {object} data The PageController data object
     * @memberof router
     * @description Cache the initial page load.
     *
     */
    initPage ( /* data */ ) {
        navi.checkLocation();
        navi.checkSubmenu();
        navi.checkActive();
        this.execHomepage( core.dom.page );
        this.execControllers();
    },


    /**
     *
     * @public
     * @method bindEmpty
     * @memberof router
     * @description Suppress #hash links.
     *
     */
    bindEmpty () {
        core.dom.body.on( "click", "[href^='#']", ( e ) => e.preventDefault() );
    },


    execHomepage ( $page ) {
        const data = $page.data();

        if ( data.homepage ) {
            core.dom.html.addClass( "is-home" );

        } else {
            core.dom.html.removeClass( "is-home" );
        }
    },


    execControllers () {
        this.images = core.dom.page.find( core.config.lazyImageSelector );
        this.videofs = core.dom.page.find( ".js-video-fs" );
        this.cover = core.dom.body.find( ".js-cover" );
        this.carousel = core.dom.page.find( ".js-carousel" );
        this.tabs = core.dom.page.find( ".js-tabs" );
        this.blocks = core.dom.page.find( "#block-yui_3_17_2_1_1492899785996_100777, #block-yui_3_17_2_1_1492364839208_29283" );

        this.imageController = new ImageController( this.images );
        this.imageController.on( "preloaded", () => {
            if ( this.videofs.length ) {
                this.videofsController = new VideoFS( this.videofs );
            }

            if ( this.cover.length ) {
                this.coverController = new CoverController( this.cover );
            } 

            if ( this.carousel.length ) {
                this.carouselController = new CarouselController( this.carousel );
            }

            if ( this.tabs.length ) {
                this.tabsController = new TabsController( this.tabs );
            }

            if ( this.blocks.length ) {
                this.blocksController = new BlocksCoverController( this.blocks );
            }

            core.emitter.fire( "app--intro-teardown" );
        });
    },


    // destroyControllers () {
    //     if ( this.imageController ) {
    //         this.imageController.destroy();
    //         this.imageController = null;
    //     }
    //
    //     if ( this.videofsController ) {
    //         this.videofsController.destroy();
    //         this.videofsController = null;
    //     }
    //
    //     if ( this.coverController ) {
    //         this.coverController.destroy();
    //         this.coverController = null;
    //     }
    //
    //     if ( this.carouselController ) {
    //         this.carouselController.destroy();
    //         this.carouselController = null;
    //     }
    //
    //     if ( this.tabsController ) {
    //         this.tabsController.destroy();
    //         this.tabsController = null;
    //     }
    //
    //     if ( this.blocksController ) {
    //         this.blocksController.destroy();
    //         this.blocksController = null;
    //     }
    // },


    // Initialize core sqs blocks after ajax routing
    execSquarespace () {
        setTimeout(() => {
            window.Squarespace.initializeVideo( window.Y );
            window.Squarespace.initializeCommerce( window.Y );
            window.Squarespace.initializeFormBlocks( window.Y, window.Y );
            window.Squarespace.initializeLayoutBlocks( window.Y );
            window.Squarespace.initializeSummaryV2Block( window.Y );

        }, 0 );
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default router;
