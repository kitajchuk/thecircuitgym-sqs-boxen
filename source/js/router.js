import $ from "properjs-hobo";
import PageController from "properjs-pagecontroller";
import ImageController from "./class/ImageController";
import AnimateController from "./class/AnimateController";
import CoverController from "./class/CoverController";
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
        this.pageDuration = core.util.getTransitionDuration( core.dom.main[ 0 ] );
        this.bindEmptyHashLinks();
        this.initPageController();

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
     * @method initPageController
     * @memberof router
     * @description Create the PageController instance.
     *
     */
    initPageController () {
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
        this.execHomepage( core.dom.main );
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
        let main = null;

        doc.innerHTML = html;

        doc = $( doc );
        main = doc.find( core.config.mainSelector );

        return {
            $doc: doc,
            $main: main,
            mainData: main.data(),
            mainHtml: main[ 0 ].innerHTML
        };
    },


    /**
     *
     * @public
     * @method bindEmptyHashLinks
     * @memberof router
     * @description Suppress #hash links.
     *
     */
    bindEmptyHashLinks () {
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
        core.dom.main.addClass( "is-inactive" );

        navi.close();

        this.destroyControllers();
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

        core.dom.main[ 0 ].innerHTML = this.doc.mainHtml;

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
        core.dom.main.removeClass( "is-inactive" );

        this.execHomepage( this.doc.$main );
        this.execControllers();
        this.execSquarespace();
    },


    execHomepage ( $main ) {
        const data = $main.data();

        if ( data.homepage ) {
            core.dom.html.addClass( "is-home" );

        } else {
            core.dom.html.removeClass( "is-home" );
        }
    },


    execControllers () {
        this.anims = core.dom.main.find( core.config.animSelector );
        this.images = core.dom.main.find( core.config.lazyImageSelector );
        this.videofs = core.dom.main.find( ".js-video-fs" );
        this.cover = core.dom.main.find( ".js-cover" );

        this.imageController = new ImageController( this.images );
        this.imageController.on( "preloaded", () => {
            if ( this.anims.length ) {
                this.animController = new AnimateController( this.anims );
            }

            if ( this.videofs.length ) {
                this.videofsController = new VideoFS( this.videofs );
            }

            if ( this.cover.length ) {
                this.coverController = new CoverController( this.cover );
            }

            core.emitter.fire( "app--intro-teardown" );
        });
    },


    destroyControllers () {
        if ( this.imageController ) {
            this.imageController.destroy();
            this.imageController = null;
        }

        if ( this.animController ) {
            this.animController.destroy();
            this.animController = null;
        }

        if ( this.videofsController ) {
            this.videofsController.destroy();
            this.videofsController = null;
        }

        if ( this.coverController ) {
            this.coverController.destroy();
            this.coverController = null;
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
