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
    process: function(mocks) {
        var processed = [];

        mocks.forEach(function(mock) {
            var methods = Object.keys(mock.methods);

            methods.forEach(function(method) {
                if (!mock.methods[method].actions) {
                    return;
                }

                mock.methods[method].actions.forEach(function(action) {
                    action.request = action.request || {};
                    action.response = action.response || {};
                    action.request.body = action.request.body || {};
                    action.request.headers = action.request.headers || {};
                    action.request.params = action.request.params || {};
                    action.response.body = action.response.body || {};
                    action.response.headers = action.response.headers || {};
                    action.response.status = action.response.status || 200;

                    if (typeof action.request.body === "string") {
                        action.request.body = JSON.parse(action.request.body);
                    }

                    if (typeof action.response.body === "string") {
                        action.response.body = JSON.parse(action.response.body);
                    }

                    processed.push({
                        request: {
                            body: action.request.body,
                            headers: action.request.headers,
                            method: method,
                            params: action.request.params,
                            path: mock.endpoint,
                        },
                        response: {
                            body: action.response.body,
                            headers: action.response.headers,
                            status: action.response.status
                        }
                    });
                });
            });
        });

        return processed;
    }
};

