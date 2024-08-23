/**
 * Main Fetch Function
 * @param {string} url - endpoint
 * @param {object} [options] - zlFetch options
 * @param {string} [options.method] - HTTP method
 * @param {object} [options.query] - query Object
 * @param {object} [options.queries] - query Object
 * @param {object} [options.params] - query Object
 * @param {object} [options.param] - query Object
 * @param {object} [options.headers] - HTTP headers
 * @param {object} [options.body] - Body content
 * @param {string} [options.auth] - Authentication information
 * @param {string} [options.debug] - Logs the request options for debugging
 * @param {string} [options.returnError] - Returns the error instead of rejecting it
 * @param {string} [options.customResponseParser] - Use a custome response parser
 */
export function coreFetch(url: string, options?: {
    method?: string;
    query?: object;
    queries?: object;
    params?: object;
    param?: object;
    headers?: object;
    body?: object;
    auth?: string;
    debug?: string;
    returnError?: string;
    customResponseParser?: string;
}): Promise<any>;
export namespace coreFetch {
    /**
     * @param {string} url - endpoint
     * @param {object} [options] - zlFetch options
     * @param {string} [options.method] - HTTP method
     * @param {object} [options.query] - query Object
     * @param {object} [options.queries] - query Object
     * @param {object} [options.params] - query Object
     * @param {object} [options.param] - query Object
     * @param {object} [options.headers] - HTTP headers
     * @param {string} [options.auth] - Authentication information
     * @param {string} [options.debug] - Logs the request options for debugging
     * @param {string} [options.returnError] - Returns the error instead of rejecting it
     * @param {string} [options.customResponseParser] - Use a custome response parser
     */
    export function get(url: string, options?: {
        method?: string;
        query?: object;
        queries?: object;
        params?: object;
        param?: object;
        headers?: object;
        auth?: string;
        debug?: string;
        returnError?: string;
        customResponseParser?: string;
    }): Promise<any>;
    /**
     * @param {string} url - endpoint
     * @param {object} [options] - zlFetch options
     * @param {string} [options.method] - HTTP method
     * @param {object} [options.query] - query Object
     * @param {object} [options.queries] - query Object
     * @param {object} [options.params] - query Object
     * @param {object} [options.param] - query Object
     * @param {object} [options.headers] - HTTP headers
     * @param {object} [options.body] - Body content
     * @param {string} [options.auth] - Authentication information
     * @param {string} [options.debug] - Logs the request options for debugging
     * @param {string} [options.returnError] - Returns the error instead of rejecting it
     * @param {string} [options.customResponseParser] - Use a custome response parser
     */
    export function post(url: string, options?: {
        method?: string;
        query?: object;
        queries?: object;
        params?: object;
        param?: object;
        headers?: object;
        body?: object;
        auth?: string;
        debug?: string;
        returnError?: string;
        customResponseParser?: string;
    }): Promise<any>;
    /**
     * @param {string} url - endpoint
     * @param {object} [options] - zlFetch options
     * @param {string} [options.method] - HTTP method
     * @param {object} [options.query] - query Object
     * @param {object} [options.queries] - query Object
     * @param {object} [options.params] - query Object
     * @param {object} [options.param] - query Object
     * @param {object} [options.headers] - HTTP headers
     * @param {object} [options.body] - Body content
     * @param {string} [options.auth] - Authentication information
     * @param {string} [options.debug] - Logs the request options for debugging
     * @param {string} [options.returnError] - Returns the error instead of rejecting it
     * @param {string} [options.customResponseParser] - Use a custome response parser
     */
    export function put(url: string, options?: {
        method?: string;
        query?: object;
        queries?: object;
        params?: object;
        param?: object;
        headers?: object;
        body?: object;
        auth?: string;
        debug?: string;
        returnError?: string;
        customResponseParser?: string;
    }): Promise<any>;
    /**
     * @param {string} url - endpoint
     * @param {object} [options] - zlFetch options
     * @param {string} [options.method] - HTTP method
     * @param {object} [options.query] - query Object
     * @param {object} [options.queries] - query Object
     * @param {object} [options.params] - query Object
     * @param {object} [options.param] - query Object
     * @param {object} [options.headers] - HTTP headers
     * @param {object} [options.body] - Body content
     * @param {string} [options.auth] - Authentication information
     * @param {string} [options.debug] - Logs the request options for debugging
     * @param {string} [options.returnError] - Returns the error instead of rejecting it
     * @param {string} [options.customResponseParser] - Use a custome response parser
     */
    export function patch(url: string, options?: {
        method?: string;
        query?: object;
        queries?: object;
        params?: object;
        param?: object;
        headers?: object;
        body?: object;
        auth?: string;
        debug?: string;
        returnError?: string;
        customResponseParser?: string;
    }): Promise<any>;
    /**
     * @param {string} url - endpoint
     * @param {object} [options] - zlFetch options
     * @param {string} [options.method] - HTTP method
     * @param {object} [options.query] - query Object
     * @param {object} [options.queries] - query Object
     * @param {object} [options.params] - query Object
     * @param {object} [options.param] - query Object
     * @param {object} [options.headers] - HTTP headers
     * @param {string} [options.auth] - Authentication information
     * @param {string} [options.debug] - Logs the request options for debugging
     * @param {string} [options.returnError] - Returns the error instead of rejecting it
     * @param {string} [options.customResponseParser] - Use a custome response parser
     */
    function _delete(url: string, options?: {
        method?: string;
        query?: object;
        queries?: object;
        params?: object;
        param?: object;
        headers?: object;
        auth?: string;
        debug?: string;
        returnError?: string;
        customResponseParser?: string;
    }): Promise<any>;
    export { _delete as delete };
}
