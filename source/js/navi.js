import * as core from "./core";


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
        this.currentLoc = null;
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

        core.emitter.on( "app--resize", () => {
            if ( window.innerWidth > core.config.mobileWidth ) {
                this.close();
            }
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
        const uid = window.location.pathname.replace( /^\/+|\/+$/g, "" ).split( "/" ).pop();

        core.dom.body.find( ".js-navi-link" ).removeClass( "is-active" );

        core.dom.body.find( `.js-navi-link[data-uid='${uid}']` ).addClass( "is-active" );
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
