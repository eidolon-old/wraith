/**
 * This file is part of the wraith package.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

"use strict";

var bodyParser = require("body-parser");
var chalk = require("chalk");
var connect = require("connect");
var cors = require("cors");
var cson = require("cson");
var glob = require("glob");
var http = require("http");
var logger = require("./utils/logger")("kernel");
var mockBag = require("./utils/mock-bag");
var requestInfo = require("./middlewares/request-info-middleware");

module.exports = new function() {
    var docsApp;
    var dport;
    var files;
    var inited = false;
    var mocksApp;
    var port;

    function initApplications() {
        docsApp = connect();
        docsApp.use(cors());
        docsApp.use(requestInfo("docs"));

        mocksApp = connect();
        mocksApp.use(bodyParser.json());
        mocksApp.use(bodyParser.urlencoded({ extended: false }));
        mocksApp.use(cors());
        mocksApp.use(requestInfo("mocks"));

        require("./resources/config/mocks-routes")(mocksApp);
    }

    function initFiles(filesArg) {
        files = glob.sync(filesArg);

        if (!files || !files.length) {
            logger.error("No files found, exiting.");
            process.exit();
        }

        files
            .map(function(file) {
                logger.log("Loading mocks from " + chalk.magenta("'" + file + "'") + ".");

                return cson.load(file);
            })
            .reduce(function(a, b) {
                return a.concat(b);
            }, [])
            .map(function(mock) {
                mockBag.addMock(mock);
            });
    }

    function initPorts(portArg, dportArg) {
        port = portArg;
        dport = dportArg;
    }

    this.init = function(args) {
        initApplications();
        initFiles(args.files);
        initPorts(args.port, args.dport);

        inited = true;
    };

    this.listen = function() {
        if (!inited) {
            logger.error("Wraith has not been initialised, something has gone very wrong.");
            process.exit();
        }

        http
            .createServer(mocksApp)
            .listen(port, function() {
                logger.success("Mocks being served on port " + chalk.green(port));
            });

        http
            .createServer(docsApp)
            .listen(dport, function() {
                logger.success("Documentation being server on port " + chalk.green(dport));
            });
    };
};
