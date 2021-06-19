import $ from "properjs-hobo";
import * as core from "./core";
import ResizeController from "properjs-resizecontroller";


/**
 *
 * @public
 * @namespace navi
 * @description Performs the branded load-in screen sequence.
 * @memberof menus
 *
 */
const navi = {
    /**
     *
     * @public
     * @method init
     * @memberof menus.navi
     * @description Method initializes navi node in DOM.
     *
     */
    init () {
        this.naviLoc = null;
        this.isOpen = false;
        this.trigger = core.dom.body.find( ".js-navi-controller" );
        this.indexes = core.dom.navi.find( ".js-navi-index" );
        this.currentLoc = null;
        this.resizer = new ResizeController();
        this.bind();
    },


    bind () {
        this.trigger.on( "click", () => {
            if ( this.isOpen ) {
                this.close();

            } else {
                this.open();
            }
        });

        core.dom.navi.on( "click", ".js-navi-index", ( e ) => {
            const target = $( e.target );
            const index = target.is( ".js-navi-index" ) ? target : target.closest( ".js-navi-index" );
            const hover = target.closest( ".js-navi-hovermenu" );
            const submenu = hover.find( ".js-navi-submenu" );
            const isActive = index.is( ".is-active" );

            if ( isActive ) {
                index.removeClass( "is-active" );
                submenu[ 0 ].style.height = core.util.px( 0 );

            } else {
                index.addClass( "is-active" );
                submenu[ 0 ].style.height = core.util.px( submenu.data( "height" ) );
            }
        });

        this.resizer.on( "resize", () => {
            if ( window.innerWidth > core.config.mobileWidth ) {
                this.close();
            }
        });

        if ( !core.detect.isDevice() ) {
            this.hovers();
        }
    },


    hovers () {
        core.dom.navi.on( "mouseenter", ".js-navi-hovermenu", ( e ) => {
            const hover = $( e.target ).closest( ".js-navi-hovermenu" );
            const submenu = hover.find( ".js-navi-submenu" );

            submenu[ 0 ].style.height = core.util.px( submenu.data( "height" ) );

        }).on( "mouseleave", ".js-navi-hovermenu", ( e ) => {
            const hover = $( e.target ).closest( ".js-navi-hovermenu" );
            const submenu = hover.find( ".js-navi-submenu" );

            submenu[ 0 ].style.height = core.util.px( 0 );
        });
    },


    open () {
        this.isOpen = true;
        core.dom.html.addClass( "is-navi-open" );
    },


    close () {
        this.isOpen = false;
        core.dom.html.removeClass( "is-navi-open" );
    },


    checkActive () {
        // Either find a :uid match in the uri params or just let it go man :-)
        const uris = window.location.pathname.replace( /^\/+|\/+$/g, "" ).split( "/" );
        const links = core.dom.body.find( ".js-navi-link" ).removeClass( "is-active" );
        let naviLink = null;

        for ( let i = uris.length; i--; ) {
            naviLink = links.filter( `[data-uid='${uris[ i ]}']` );

            if ( naviLink.length ) {
                naviLink.addClass( "is-active" );

                break;
            }
        }
    },


    resetSubmenus () {
        const naviSub = core.dom.navi.find( ".js-navi-submenu" );

        this.indexes.removeClass( "is-active" );

        naviSub.forEach(( el, i ) => {
            const submenu = naviSub.eq( i );

            submenu[ 0 ].style.height = core.util.px( 0 );
        });
    },


    checkSubmenu () {
        if ( this.currentLoc !== null || this.naviLoc !== null ) {
            core.log( "Skip checkSubmenu for location nav" );
            return;
        }

        const naviSub = core.dom.navi.find( ".js-navi-submenu" );

        naviSub.forEach(( el, i ) => {
            const submenu = naviSub.eq( i );
            const height = submenu[ 0 ].getBoundingClientRect().height;

            submenu.data( "height", height ).addClass( "is-determined" );
        });
    },


    checkLocation () {
        const naviLoc = core.dom.page.find( ".js-navi-location" );
        const naviData = naviLoc.data();

        // Location navi in scope
        if ( naviLoc.length ) {
            // Already within the same location scope
            if ( this.currentLoc === naviData.location ) {
                // Just remove parsed navi
                naviLoc.remove();

            // Looking within a different location scope
            } else {
                this.naviLoc = naviLoc;

                core.dom.navi[ 0 ].parentNode.insertBefore( this.naviLoc[ 0 ], core.dom.navi[ 0 ] );

                core.dom.html.addClass( "is-location" );
            }

            this.currentLoc = naviData.location;

        // Location navi NOT in scope
        } else {
            core.dom.html.removeClass( "is-location" );

            // Clear scope for location navi
            this.currentLoc = null;

            // Remove possible location navi
            if ( this.naviLoc ) {
                this.naviLoc.remove();
                this.naviLoc = null;
            }
        }
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default navi;
