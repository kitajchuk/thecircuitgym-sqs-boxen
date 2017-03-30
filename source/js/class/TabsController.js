import $ from "properjs-hobo";
import * as core from "../core";


class TabsController {
    constructor ( element ) {
        this.element = element;
        this.labels = this.element.find( ".js-tabs-label" );
        this.contents = this.element.find( ".js-tabs-content" );
        this.activeLabel = this.labels.eq( 0 ).addClass( "is-active" );
        this.activeContent = this.contents.eq( 0 ).addClass( "is-active" );
        this.index = 0;
        this.timeout = null;
        this.duration = core.util.getTransitionDuration( this.contents[ 0 ] );

        this.bind();
    }


    bind () {
        this.labels.on( "click", ( e ) => {
            const el = $( e.target );
            const idx = Number( el.data( "index" ) ) - 1;

            this.goto( idx );
        });
    }


    clearTime () {
        try {
            clearTimeout( this.timeout );

            this.contents.removeClass( "is-entering is-exiting is-active" );

        } catch ( error ) {
            core.log( "warn", error );
        }
    }


    transition ( next, curr ) {
        this.activeContent = next;

        curr.removeClass( "is-active" ).addClass( "is-exiting" );
        next.addClass( "is-entering" );

        this.timeout = setTimeout( () => {
            curr.removeClass( "is-exiting" );
            next.removeClass( "is-entering" ).addClass( "is-active" );

        }, this.duration );
    }


    goto ( idx ) {
        this.clearTime();

        this.index = idx;

        this.labels.removeClass( "is-active" );
        this.activeLabel = this.labels.eq( idx ).addClass( "is-active" );

        this.transition(
            this.contents.eq( this.index ),
            this.activeContent
        );
    }


    destroy () {
        this.labels.off();
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default TabsController;
