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

var chalk = require("chalk");
var Logger = require("../utils/logger");
var onFinished = require("on-finished");

module.exports = function(section) {
    return function(req, res, next) {
        var logger = Logger(section);

        var start = process.hrtime();

        onFinished(res, function() {
            var end = process.hrtime();
            var message = "";

            message += req.method + " ";
            message += req.url + " ";

            if (res.statusCode < 400) {
                message += chalk.green(res.statusCode);
            } else if (res.statusCode >= 400 < 500) {
                message += chalk.yellow(res.statusCode);
            } else if (res.statusCode > 500) {
                message += chalk.red(res.statusCode);
            }

            start = parseFloat(start[0] * 1000000 + start[1] / 1000);
            end = parseFloat(end[0] * 1000000 + end[1] / 1000);

            message += " - ";
            message += ((end - start) / 1000).toFixed(3);
            message += "ms";

            logger.log(message);
        });

        next();
    };
};
