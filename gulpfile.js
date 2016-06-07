/*
 * Copyright (C) 2016 DivDE <divde@laposte.net>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
"use strict";

const path = require("path");
const child_process = require("child_process");
const gulp = require("gulp");
const gzip = require("gulp-gzip");
const webpack = require("webpack");
const WebpackManifestPlugin = require("webpack-manifest-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const promifisy = require("pify");
const rimraf = promifisy(require("rimraf"));
const pkg = require("./package.json");
const debug = (process.env.NODE_ENV === "development");

const replacementPlugin = (regExp, replacement) => {
    return new webpack.NormalModuleReplacementPlugin(regExp, (arg) => {
        arg.request = arg.request.replace(regExp, replacement);
    });
};

const commonWebpackConfig = (config, babelConfig) => {
    config.debug = debug;
    if (!debug) {
        config.devtool = "source-map";
        if (babelConfig.presets.indexOf("es2015") > -1) {
            config.plugins.push(new webpack.optimize.UglifyJsPlugin());
        }
    }
    config.plugins.unshift(replacementPlugin(/^@client/, path.join(__dirname, "src", "client")));
    config.plugins.unshift(replacementPlugin(/^@actions/, path.join(__dirname, "src", "client", "state", "actions")));
    config.plugins.unshift(replacementPlugin(/^@dynComponents/, path.join(__dirname, "src", "client", "ui", "dynComponents")));
    config.plugins.unshift(replacementPlugin(/^@widgets/, path.join(__dirname, "src", "client", "ui", "widgets")));
    config.plugins.unshift(replacementPlugin(/^@validation/, path.join(__dirname, "src", "client", "validation")));
    config.plugins.unshift(new ExtractTextPlugin(debug ? "[name].css" : "[name]-[contenthash].css", {
        allChunks: true
    })),
    config.module = {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader", query: babelConfig},
            {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
            {test: /\.(woff|woff2|ttf|eot|svg|png|gif|jpg)$/, loader: "file?name=[name]-[hash].[ext]"}
        ]
    };
    return config;
};

const clientWebpackConfig = () => commonWebpackConfig({
    entry: {
        "main": path.join(__dirname, "src/client/main.js")
    },
    output: {
        path: path.join(__dirname, "build/public/statics"),
        publicPath: "/statics/",
        filename: debug ? "[name].js" : "[name]-[chunkhash].js",
        hashFunction: "md5",
        hashDigestLength: 32
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": debug ? "\"development\"" : "\"production\"",
            "process.browser": "true"
        }),
        new WebpackManifestPlugin()
    ]
}, {
    plugins: ["transform-async-to-generator"],
    presets: ["es2015", "react"]
});

const serverWebpackConfig = () => commonWebpackConfig({
    entry: [path.join(__dirname, "src/server/main.js")],
    plugins: [
        replacementPlugin(/^.*\.css$/, path.join(__dirname, "src", "server", "emptyFile.js")),
        new webpack.DefinePlugin({
            "process.browser": "false"
        }),
        new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1})
    ],
    output: {
        libraryTarget: "commonjs2",
        path: path.join(__dirname, "build/server"),
        publicPath: "/statics/",
        filename: "main.js"
    },
    target: "node",
    externals: /(^[a-z\-0-9]+|package\.json$|manifest\.json$)/,
    node: {
        __dirname: false,
        __filename: false
    }
}, {
    plugins: ["transform-es2015-modules-commonjs", "transform-async-to-generator", "transform-es2015-arrow-functions", "transform-es2015-template-literals"],
    presets: ["react"]
});

const checkWebpackErrors = function (done) {
    return (inputErr, result) => {
        let outputErr = inputErr;
        if (!outputErr) {
            const stats = result.toJson();
            if (stats.errors.length > 0) {
                outputErr = stats.errors;
            }
        }
        done(outputErr);
    };
};

gulp.task("build-client", function(done) {
    webpack(clientWebpackConfig()).run(checkWebpackErrors(done));
});

gulp.task("build-server", function(done) {
    webpack(serverWebpackConfig()).run(checkWebpackErrors(done));
});

gulp.task("gzip", ["build-client"], function() {
    if (!debug) {
        return gulp.src(["build/public/statics/**/*", "!**/*.gz"])
            .pipe(gzip({
                gzipOptions: {
                    level: 9
                }
            }))
            .pipe(gulp.dest("build/public/statics"));
    }
});

gulp.task("build", ["build-client", "build-server", "gzip"]);

gulp.task("clean", function() {
    return rimraf(path.join(__dirname, "build"));
});

gulp.task("watch", function(done) {
    const builds = {
        client: 0,
        server: 0
    };

    let runningProcess = null;

    const runningProcessExit = () => {
        if (runningProcess === this) {
            console.log(`${pkg.name} exited`);
            runningProcess = null;
        }
    };
    const stopProcess = () => {
        if (runningProcess) {
            console.log(`Closing ${pkg.name}`);
            runningProcess.kill();
            runningProcess = null;
        }
    };
    const startProcess = () => {
        console.log(`Starting ${pkg.name}`);
        runningProcess = child_process.fork(path.resolve(__dirname, pkg.bin));
        runningProcess.disconnect();
        runningProcess.on("exit", runningProcessExit.bind(runningProcess));
    };

    function callback(buildId) {
        return (error) => {
            if (error) {
                stopProcess();
                builds[buildId] = 0;
                console.error(`Error: ${error}`);
            } else {
                builds[buildId]++;
                if (builds.client > 0 && builds.server > 0) {
                    if (!runningProcess || buildId == "server") {
                        stopProcess();
                        startProcess();
                    }
                    if (done) {
                        const cb = done;
                        done = null;
                        cb();
                    }
                }
            }
        };
    }

    webpack(clientWebpackConfig()).watch({}, checkWebpackErrors(callback("client")));
    webpack(serverWebpackConfig()).watch({}, checkWebpackErrors(callback("server")));
});
