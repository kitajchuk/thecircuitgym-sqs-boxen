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
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default navi;
