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

module.exports = {
    filterPath: function(request) {
        return function(mock) {
            var path = mock.request.path
                .replace(/\//g, "\\/")
                .replace(/(:\w+)/, "(\\w+)");

            path = new RegExp("^" + path + "$");

            return path.test(request.path);
        };
    },

    filterParams: function(request) {
        return function(mock) {
            mock.request.params = mock.request.params || {};

            if (mock.request.params.length !== request.query.length) {
                return false;
            }

            return Object.keys(mock.request.params)
                .every(function(item) {
                    return mock.request.params[item] === request.query[item];
                });
        };
    },

    filterMethod: function(request) {
        return function(mock) {
            return mock.request.method.toUpperCase() === request.method;
        };
    },

    filterHeaders: function(request) {
        return function(mock) {
            mock.request.headers = mock.request.headers || {};

            return Object.keys(mock.request.headers)
                .every(function(header) {
                    return mock.request.headers[header] ===
                        request.headers[header.toLowerCase()];
                });
        };
    },

    filterBody: function(request) {
        return function(mock) {
            mock.request.body = mock.request.body || {};

            if (mock.request.body.length !== request.body.length) {
                return false;
            }

            return Object.keys(mock.request.body)
                .every(function(item) {
                    return mock.request.body[item] === request.body[item];
                });
        }
    }
};
