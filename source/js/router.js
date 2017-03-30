import $ from "properjs-hobo";
import PageController from "properjs-pagecontroller";
import ImageController from "./class/ImageController";
import CoverController from "./class/CoverController";
import CarouselController from "./class/CarouselController";
import TabsController from "./class/TabsController";
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
        this.initPages();

        core.log( "router initialized" );
    },


    /**
     *
     * @public
     * @method route
     * @param {string} path The uri to route to
     * @memberof router
     * @description Trigger app to route a specific page. [Reference]{@link https://github.com/ProperJS/Router/blob/master/Router.js#L222}
     *
     */
    route ( path ) {
        this.controller.getRouter().trigger( path );
    },


    /**
     *
     * @public
     * @method push
     * @param {string} path The uri to route to
     * @param {function} cb Optional callback to fire
     * @memberof router
     * @description Trigger a silent route with a supplied callback.
     *
     */
    push ( path, cb ) {
        this.controller.routeSilently( path, (cb || core.util.noop) );
    },


    /**
     *
     * @public
     * @method initPages
     * @memberof router
     * @description Create the PageController instance.
     *
     */
    initPages () {
        this.controller = new PageController({
            transitionTime: this.pageDuration
        });

        this.controller.setConfig([
            "*"
        ]);

        this.controller.setModules( [] );

        //this.controller.on( "page-controller-router-samepage", () => {} );
        this.controller.on( "page-controller-router-transition-out", this.changePageOut.bind( this ) );
        this.controller.on( "page-controller-router-refresh-document", this.changeContent.bind( this ) );
        this.controller.on( "page-controller-router-transition-in", this.changePageIn.bind( this ) );
        this.controller.on( "page-controller-initialized-page", this.initPage.bind( this ) );

        this.controller.initPage();
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
        navi.checkActive();
        navi.checkSubmenu();
        navi.checkLocation();
        this.execHomepage( core.dom.page );
        this.execControllers();
    },


    /**
     *
     * @public
     * @method parseDoc
     * @param {string} html The responseText to parse out
     * @memberof router
     * @description Get the DOM information to cache for a request.
     * @returns {object}
     *
     */
    parseDoc ( html ) {
        let doc = document.createElement( "html" );
        let page = null;

        doc.innerHTML = html;

        doc = $( doc );
        page = doc.find( core.config.pageSelector );

        return {
            $doc: doc,
            $page: page,
            pageData: page.data(),
            pageHtml: page[ 0 ].innerHTML
        };
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


    /**
     *
     * @public
     * @method changePageOut
     * @param {object} data The PageController data object
     * @memberof router
     * @description Trigger transition-out animation.
     *
     */
    changePageOut ( /* data */ ) {
        core.dom.html.addClass( "is-routing" );
        core.dom.page.addClass( "is-inactive" );

        navi.close();
    },


    /**
     *
     * @public
     * @method changeContent
     * @param {object} data The PageController data object
     * @memberof router
     * @description Swap the new content into the DOM.
     *
     */
    changeContent ( data ) {
        this.doc = this.parseDoc( data.response );

        core.dom.page[ 0 ].innerHTML = this.doc.pageHtml;

        this.destroyControllers();
        navi.checkActive();
        navi.checkLocation();
        this.execHomepage( this.doc.$page );
        this.execControllers();
        this.execSquarespace();

        core.emitter.fire( "app--analytics-push", this.doc );
    },


    /**
     *
     * @public
     * @method changePageIn
     * @param {object} data The PageController data object
     * @memberof router
     * @description Trigger transition-in animation.
     *
     */
    changePageIn ( /* data */ ) {
        core.dom.html.removeClass( "is-routing" );
        core.dom.page.removeClass( "is-inactive" );
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
        this.cover = core.dom.page.find( ".js-cover" );
        this.carousel = core.dom.page.find( ".js-carousel" );
        this.tabs = core.dom.page.find( ".js-tabs" );

        this.imageController = new ImageController( this.images );
        this.imageController.on( "preloaded", () => {
            if ( this.videofs.length ) {
                this.videofsController = new VideoFS( this.videofs );
            }

            // Mostly better transitions this way...
            if ( this.cover.length ) {
                this.coverController = new CoverController( this.cover );

            } else {
                CoverController.removeClass();
            }

            if ( this.carousel.length ) {
                this.carouselController = new CarouselController( this.carousel );
            }

            if ( this.tabs.length ) {
                this.tabsController = new TabsController( this.tabs );
            }

            core.emitter.fire( "app--intro-teardown" );
        });
    },


    destroyControllers () {
        if ( this.imageController ) {
            this.imageController.destroy();
            this.imageController = null;
        }

        if ( this.videofsController ) {
            this.videofsController.destroy();
            this.videofsController = null;
        }

        if ( this.coverController ) {
            this.coverController.destroy();
            this.coverController = null;
        }

        if ( this.carouselController ) {
            this.carouselController.destroy();
            this.carouselController = null;
        }

        if ( this.tabsController ) {
            this.tabsController.destroy();
            this.tabsController = null;
        }
    },


    // Initialize core sqs blocks after ajax routing
    execSquarespace () {
        window.Squarespace.initializeVideo( window.Y );
        window.Squarespace.initializeCommerce( window.Y );
        window.Squarespace.initializeFormBlocks( window.Y );
        window.Squarespace.initializeLayoutBlocks( window.Y );
        window.Squarespace.initializeSummaryV2Block( window.Y );
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default router;
