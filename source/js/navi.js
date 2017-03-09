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
    },


    open () {
        this.isOpen = true;
        core.dom.html.addClass( "is-navi-open" );
    },


    close () {
        this.isOpen = false;
        core.dom.html.removeClass( "is-navi-open" );
    },


    checkLocation () {
        const naviLoc = core.dom.main.find( ".js-navi-location" );

        // Always remove last location navi
        if ( this.naviLoc ) {
            this.naviLoc.remove();
            this.naviLoc = null;
        }

        // Check if there is a new location navi
        if ( naviLoc.length ) {
            this.naviLoc = naviLoc;

            core.dom.body[ 0 ].insertBefore( this.naviLoc[ 0 ], core.dom.navi[ 0 ] );

            core.dom.html.addClass( "is-location" );

        } else {
            core.dom.html.removeClass( "is-location" );
        }
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default navi;
