import $ from "../../../properjs-hobo/dist/hobo.build";
import config from "./config";


/**
 *
 * @public
 * @namespace dom
 * @memberof core
 * @description Holds high-level cached Nodes.
 *
 */
const dom = {
    /**
     *
     * @public
     * @member doc
     * @memberof core.dom
     * @description The cached document.
     *
     */
    doc: $( document ),


    /**
     *
     * @public
     * @member html
     * @memberof core.dom
     * @description The cached documentElement node.
     *
     */
    html: $( document.documentElement ),


    /**
     *
     * @public
     * @member body
     * @memberof core.dom
     * @description The cached body node.
     *
     */
    body: $( document.body ),


    /**
     *
     * @public
     * @member page
     * @memberof core.dom
     * @description The cached <page> node.
     *
     */
    page: $( config.pageSelector ),


    /**
     *
     * @public
     * @member navi
     * @memberof core.dom
     * @description The cached <navi> node.
     *
     */
    navi: $( ".js-navi" ),


    /**
     *
     * @public
     * @member intro
     * @memberof core.dom
     * @description The cached <intro> node.
     *
     */
    intro: $( ".js-intro" ),

    /**
     *
     * @public
     * @member footer
     * @memberof core.dom
     * @description The cached <footer> node.
     *
     */
    footer: $( ".js-footer" ),
};



/******************************************************************************
 * Export
*******************************************************************************/
export default dom;
