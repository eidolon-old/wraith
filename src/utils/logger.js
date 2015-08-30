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
var figures = require("figures");
var moment = require("moment");

function generatePrefix(color, name) {
    var prefix = chalk[color](moment().format("HH:mm:ss")) + " " +
        chalk.gray(figures.arrowRight) + " [wraith] ";

    if (name) {
        prefix += name + ": ";
    }

    return prefix;
}

module.exports = function(prefix) {
    return {
        break: function() {
            console.log();
        },

        log: function(value) {
            console.log(generatePrefix("blue", prefix) + value);
        },

        success: function(value) {
            console.log(generatePrefix("green", prefix) + value);
        },

        warn: function(value) {
            console.log(generatePrefix("yellow", prefix) + value);
        },

        error: function(value) {
            console.log(generatePrefix("red", prefix) + value);
        }
    };
};
