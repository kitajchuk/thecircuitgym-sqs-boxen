import $ from "properjs-hobo";
import * as core from "../core";


class CarouselController {
    constructor ( element ) {
        this.element = element;
        this.items = this.element.find( ".js-carousel-item" );
        this.navis = this.element.find( ".js-carousel-navi" );
        this.activeItem = this.items.eq( 0 ).addClass( "is-active" );
        this.indexes = this.element.find( ".js-carousel-index" );
        this.data = {
            index: 0,
            length: this.items.length,
            timeout: null,
            duration: core.util.getTransitionDuration( this.items[ 0 ] )
        };
        this.autoDuration = 6000;
        this.isAutoEnabled = true;

        this.initialize();
    }


    initialize () {
        this.bind();
        this.index();
        this.update();
    }


    bind () {
        this.navis.on( "click", ( e ) => {
            this.clearAuto();

            if ( /prev/i.test( e.target.className ) ) {
                this.rewind();

            } else {
                this.advance();
            }
        });

        this.indexes.on( "click", ( e ) => {
            this.clearAuto();

            const el = $( e.target );
            const idx = Number( el.data( "index" ) ) - 1;

            this.goto( idx );
        });
    }


    index () {
        this.indexes.removeClass( "is-active" );
        this.indexes.eq( this.data.index ).addClass( "is-active" );
    }


    update () {
        if ( this.isAutoEnabled ) {
            this.autoTimeout = setTimeout( this.advance.bind( this ), this.autoDuration );
        }
    }


    clearTime () {
        try {
            clearTimeout( this.data.timeout );

            this.items.removeClass( "is-entering is-exiting is-active" );

        } catch ( error ) {
            core.log( "warn", error );
        }
    }


    clearAuto () {
        try {
            this.isAutoEnabled = false;
            clearTimeout( this.autoTimeout );

        } catch ( error ) {
            core.log( "warn", error );
        }
    }


    transition ( next, curr ) {
        this.activeItem = next;
        this.update();

        curr.removeClass( "is-active" ).addClass( "is-exiting" );
        next.addClass( "is-entering" );

        this.index();

        this.data.timeout = setTimeout( () => {
            curr.removeClass( "is-exiting" );
            next.removeClass( "is-entering" ).addClass( "is-active" );

        }, this.data.duration );
    }


    goto ( idx ) {
        this.clearTime();

        this.data.index = idx;

        this.transition(
            this.items.eq( this.data.index ),
            this.activeItem
        );
    }


    advance () {
        this.clearTime();

        if ( this.data.index === (this.data.length - 1) ) {
            this.data.index = 0;

        } else {
            this.data.index++;
        }

        this.transition(
            this.items.eq( this.data.index ),
            this.activeItem
        );
    }


    rewind () {
        this.clearTime();

        if ( this.data.index === 0 ) {
            this.data.index = (this.data.length - 1);

        } else {
            this.data.index--;
        }

        this.transition(
            this.items.eq( this.data.index ),
            this.activeItem
        );
    }


    destroy () {
        this.navis.off();
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default CarouselController;
