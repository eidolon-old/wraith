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

var mockBag = require("../utils/mock-bag");
var mockFilters = require("../utils/mock-filters");
var mockPreprocessor = require("../utils/mock-preprocessor");

module.exports = function(request, response) {
    var filtered;
    var mocks = mockBag.getMocks();

    filtered = mockPreprocessor.process(mocks)
        .filter(mockFilters.filterPath(request))
        .filter(mockFilters.filterMethod(request))
        .filter(mockFilters.filterParams(request))
        .filter(mockFilters.filterHeaders(request))
        .filter(mockFilters.filterBody(request))
        .shift();

    if (filtered) {
        var mockResponse = filtered.response;

        mockResponse.headers = mockResponse.headers || {};
        mockResponse.data = mockResponse.data || {};

        if (!mockResponse.headers["content-type"]) {
            mockResponse.headers["content-type"] = "application/json";
        }

        Object
            .keys(mockResponse.headers)
            .forEach(function(header) {
                response.setHeader(header, mockResponse.headers[header]);
            });

        response
            .status(mockResponse.status)
            .send(mockResponse.body);
    } else {
        response
            .status(404)
            .send(JSON.stringify({ message: "Not found." }));
    }
};
