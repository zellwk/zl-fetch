/**
 * Main Fetch Function
 * @function coreFetch
 * @param {string} url - endpoint
 * @param {object} [options] - zlFetch options
 * @param {string} [options.method] - HTTP method
 * @param {object} [options.headers] - HTTP headers
 * @param {object} [options.body] - Body content
 * @param {string} [options.auth] - Authentication information
 * @param {string} [options.debug] - Logs the request options for debugging
 * @param {string} [options.returnError] - Returns the error instead of rejecting it
 * @param {string} [options.customResponseParser] - Use a custome response parser
 * @property {get} coreFetch
 * @property {post} coreFetch
 * @property {put} coreFetch
 * @property {patch} coreFetch
 * @property {delete} coreFetch
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
export function createShorthandMethods(fn: any): any;
