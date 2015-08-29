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

var connect = require("connect");
var glob = require("glob");
var http = require("http");
var logger = require("./utils/logger")("kernel");

module.exports = new function() {
    var files;
    var inited = false;
    var port;

    function initFiles(filesArg) {
        files = glob.sync(filesArg);

        if (!files || !files.length) {
            logger.error("No files found, exiting.");
            process.exit();
        }
    }

    function initPort(portArg) {
        port = portArg;
    }

    this.init = function(args) {
        initFiles(args.files);
        initPort(args.port);

        inited = true;
    };

    this.listen = function() {
        if (!inited) {
            logger.error("Wraith has not been initialised, something has gone very wrong.");
            process.exit();
        }

        var app = connect();

        http.createServer(app).listen(port);

        logger.success("Listening on port " + port);
    };
};
