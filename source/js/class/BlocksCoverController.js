import * as core from "../core";
import Controller from "properjs-controller";


/**
 *
 * @public
 * @global
 * @class BlocksCoverController
 * @param {Element} element The dom element to work with.
 * @classdesc Handle fullbleed cover image moments.
 *
 */
class BlocksCoverController extends Controller {
    constructor ( elements ) {
        super();

        this.bounds = {
            top: 0,
            bottom: 0
        };
        this.elements = elements;

        this.start();
    }


    getBounds () {
        const bounds = {
            top: [],
            bottom: []
        };

        this.elements.forEach(( element ) => {
            const rect = element.getBoundingClientRect();

            bounds.top.push( rect.top );
            bounds.bottom.push( rect.bottom );
        });

        this.bounds.top = Math.min( ...bounds.top );
        this.bounds.bottom = Math.max( ...bounds.bottom );
    }


    /**
     *
     * @instance
     * @description Initialize the animation frame
     * @memberof BlocksCoverController
     * @method start
     *
     */
    start () {
        // Call on parent cycle
        this.go(() => {
            this.getBounds();

            if ( this.bounds.top < 0 && this.bounds.bottom > 0 ) {
                core.dom.html.addClass( "is-cover--blocks" );

            } else {
                core.dom.html.removeClass( "is-cover--blocks" );
            }
        });
    }


    /**
     *
     * @instance
     * @description Stop the animation frame
     * @memberof BlocksCoverController
     * @method destroy
     *
     */
    destroy () {
        this.stop();
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default BlocksCoverController;
