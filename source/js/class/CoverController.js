import * as core from "../core";
import Controller from "properjs-controller";


/**
 *
 * @public
 * @global
 * @class CoverController
 * @param {Element} element The dom elements to work with.
 * @classdesc Handle fullbleed cover image moments.
 *
 */
class CoverController extends Controller {
    constructor ( element ) {
        super();

        this.element = element[ 0 ];
        this.footer = core.dom.footer[ 0 ];

        this.start();
    }


    /**
     *
     * @instance
     * @description Initialize the animation frame
     * @memberof CoverController
     * @method start
     *
     */
    start () {
        this.go(() => {
            const elementBounds = this.element.getBoundingClientRect();
            const footerBounds = this.footer.getBoundingClientRect();
            const elementIntersecting = elementBounds.top <= 0 && elementBounds.bottom > 0;
            const footerIntersecting = footerBounds.top <= 0 && footerBounds.bottom > 0;

            if ( elementIntersecting || footerIntersecting ) {
                core.dom.html.addClass( "is-cover" );

            } else {
                core.dom.html.removeClass( "is-cover" );
            }
        });
    }


    /**
     *
     * @instance
     * @description Stop the animation frame
     * @memberof CoverController
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
export default CoverController;
