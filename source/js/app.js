import * as core from "./core";
import router from "./router";
import intro from "./intro";
import navi from "./navi";
import $ from "../../properjs-hobo/dist/hobo.build";
import debounce from "properjs-debounce";


/**
 *
 * @public
 * @class App
 * @classdesc Load the App application Class to handle it ALL.
 *
 */
class App {
    constructor () {
        this.core = core;
        this.router = router;
        this.intro = intro;
        this.navi = navi;

        this.initModules();
        this.initEvents();
    }


    initEvents () {
        this.core.emitter.on( "app--intro-teardown", debounce(() => {
            $( ".absolute-cart-box" ).addClass( "is-active" );

        }, 500 ));
    }


    /**
     *
     * @public
     * @instance
     * @method initModules
     * @memberof App
     * @description Initialize application modules.
     *
     */
    initModules () {
        // Core
        this.core.detect.init();

        // Utility?

        // Views
        this.intro.init();
        this.navi.init();

        // Controller
        this.router.init();
    }
}


/******************************************************************************
 * Expose
*******************************************************************************/
window.app = new App();


/******************************************************************************
 * Export
*******************************************************************************/
export default window.app;
