const path = require( "path" );
const lager = require( "properjs-lager" );
const open = require( "open" );
const fetch = require( "node-fetch" );
const config = require( "./scripts/config" );
const source = path.join( __dirname, "source" );
const nodeModules = "node_modules";
const ESLintPlugin = require( "eslint-webpack-plugin" );



// https://webpack.js.org/contribute/writing-a-plugin/
// https://webpack.js.org/api/compiler-hooks/
class BoxenHooksPlugin {
    constructor ( options ) {
        this.options = options;
    }

    apply ( compiler ) {
        compiler.hooks.afterCompile.tap( "BoxenHooksPlugin", () => {
            if ( typeof this.options.afterCompile === "function" ) {
                this.options.afterCompile();
            }
        });
    }
}



// Define after config loads
const plugins = [
    new ESLintPlugin({
        emitError: true,
        emitWarning: false,
        failOnError: true,
        quiet: true,
        context: path.resolve( __dirname, "source" ),
        exclude: [
            "node_modules",
            "hobo.build.dist",
        ],
    }),
];

const pluginHooks = new BoxenHooksPlugin({
    afterCompile: () => {
        // First build opens localhost for you
        if ( config.open ) {
            config.open = false;
            open( `${config.browserUrl}` );

        // Subsequent builds trigger SQS reloads
        } else {
            fetch( config.reloadUrl ).then(() => {
                lager.server( "sqs local-api reload trigger" );
            });
        }
    },
});



const webpackConfig = ( env ) => {
    // Only handle builds for sandbox dev environment
    if ( env.sandbox ) {
        plugins.push( pluginHooks );
    }

    return {
        mode: process.env.NODE_ENV === "production" ? "production" : "development",


        devtool: process.env.NODE_ENV === "production" ? false : "eval-source-map",


        plugins,


        resolve: {
            modules: [__dirname, source, nodeModules],
            mainFields: ["webpack", "browserify", "web", "hobo", "main"]
        },


        entry: config.webpack.entry,


        output: {
            path: path.resolve( __dirname, "build", "scripts" ),
            filename: "[name].js"
        },


        module: {
            rules: [
                {
                    // test: /source\/.*\.js$/i,
                    // exclude: /node_modules/,
                    test: /source\/.*\.js$|node_modules\/[properjs-|konami-|paramalama].*/i,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                presets: ["@babel/preset-env"],
                            },
                        },
                    ],
                },
                {
                    test: /svg-.*\.block$|\.svg$/i,
                    exclude: /node_modules/,
                    use: [
                        "svg-inline-loader",
                    ],
                },
            ]
        }
    };
};



module.exports = webpackConfig;
