const path = require( "path" );
const lager = require( "properjs-lager" );
const config = require( "./config" );
const utils = require( "./utils" );
const siteBuildPath = path.join( process.cwd(), "build", "site.region" );
const siteBuildRegion = utils.read( siteBuildPath, true );
const siteFooters = "{squarespace-footers}";
const entryPoints = [];
const siteReplacements = [
    `        ${siteFooters}`
];



for ( let module in config.webpack.entry ) {
    if ( module !== "boxen" && config.webpack.entry[ module ] ) {
        lager.server( `Scaffold entry, ${siteFooters}:${module}` );

        entryPoints.push(
            `<script src="/scripts/${module}.js?v={squarespace.template-revision}"></script>`
        );
    }
}



if ( entryPoints.length ) {
    utils.write(
        siteBuildPath,
        siteBuildRegion.replace( siteFooters, siteReplacements.concat( entryPoints ).reverse().join( "\n" ) ),
        true
    );

} else {
    lager.server( `Scaffold no entries found` );
}
