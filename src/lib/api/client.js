/**
 * @typedef {Object} ApiRequestOptions
 * @property {string} [method]
 * @property {unknown} [body]
 * @property {Record<string, string | number | boolean | null | undefined>} [params]
 * @property {AbortSignal} [signal]
 * @property {HeadersInit} [headers]
 * @property {RequestCache} [cache]
 */

export class ApiError extends Error {
    /** @param {number} status @param {unknown} data @param {string} statusText */
    constructor(status, data, statusText) {
        const serverMessage =
            data && typeof data === 'object' && 'error' in data ? data.error : undefined;
        super(serverMessage || statusText || `Request failed with status ${status}`);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
        this.code = data && typeof data === 'object' && 'code' in data ? data.code : undefined;
    }
}

/**
 * @template T
 * @param {string} path
 * @param {ApiRequestOptions} [options]
 * @returns {Promise<T>}
 */
async function apiRequest(path, { method = 'GET', body, params, signal, headers, cache } = {}) {
    const query = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                query.set(key, String(value));
            }
        });
    }
    const queryString = query.toString();
    const requestUrl = queryString
        ? `${path}${path.includes('?') ? '&' : '?'}${queryString}`
        : path;

    const requestHeaders = new Headers(headers);
    let requestBody;
    if (body !== undefined) {
        if (typeof FormData !== 'undefined' && body instanceof FormData) {
            requestBody = body;
        } else {
            requestHeaders.set('Content-Type', 'application/json');
            requestBody = JSON.stringify(body);
        }
    }

    const response = await fetch(requestUrl, {
        method,
        body: requestBody,
        headers: requestHeaders,
        signal,
        cache,
        credentials: 'same-origin',
    });
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

    if (!response.ok || data?.success === false) {
        throw new ApiError(response.status, data, response.statusText);
    }

    if (
        !data ||
        typeof data !== 'object' ||
        data.success !== true ||
        !Object.prototype.hasOwnProperty.call(data, 'data')
    ) {
        throw new Error('The API returned an invalid response envelope.');
    }

    return data.data;
}

/** @template T @param {string} path @param {ApiRequestOptions} [options] @returns {Promise<T>} */
export function apiGet(path, options) {
    return apiRequest(path, options);
}

/** @template T @param {string} path @param {unknown} [body] @param {ApiRequestOptions} [options] @returns {Promise<T>} */
export function apiPost(path, body, options = {}) {
    return apiRequest(path, { ...options, method: 'POST', body });
}

/** @template T @param {string} path @param {unknown} [body] @param {ApiRequestOptions} [options] @returns {Promise<T>} */
export function apiPatch(path, body, options = {}) {
    return apiRequest(path, { ...options, method: 'PATCH', body });
}

/** @template T @param {string} path @param {unknown} [body] @param {ApiRequestOptions} [options] @returns {Promise<T>} */
export function apiPut(path, body, options = {}) {
    return apiRequest(path, { ...options, method: 'PUT', body });
}

/** @template T @param {string} path @param {unknown} [body] @param {ApiRequestOptions} [options] @returns {Promise<T>} */
export function apiDelete(path, body, options = {}) {
    return apiRequest(path, { ...options, method: 'DELETE', body });
}
