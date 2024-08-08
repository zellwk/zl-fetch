/**
 * Main Fetch Function
 * @param {string} url - endpoint
 * @param {object} [options] - zlFetch options
 * @param {string} [options.method] - HTTP method
 * @param {object} [options.headers] - HTTP headers
 * @param {object} [options.body] - Body content
 * @param {string} [options.auth] - Authentication information
 * @param {string} [options.debug] - Logs the request options for debugging
 * @param {string} [options.returnError] - Returns the error instead of rejecting it
 * @param {string} [options.customResponseParser] - Use a custome response parser
 */
export function coreFetch(url: string, options?: {
    method?: string;
    headers?: object;
    body?: object;
    auth?: string;
    debug?: string;
    returnError?: string;
    customResponseParser?: string;
}): Promise<any>;
export namespace coreFetch {
    export function get(url: any, options: any): Promise<any>;
    export function post(url: any, options: any): Promise<any>;
    export function put(url: any, options: any): Promise<any>;
    export function patch(url: any, options: any): Promise<any>;
    function _delete(url: any, options: any): Promise<any>;
    export { _delete as delete };
}
