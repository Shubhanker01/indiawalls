import { NextResponse } from 'next/server';

/**
 * @template T
 * @typedef {{ success: true, data: T } | { success: false, error: string, code?: string }} ApiResponse
 */

/** @template T @param {T | { success: boolean, data?: T, error?: string, code?: string }} payload @param {ResponseInit} [init] */
export function apiResponse(payload, init = {}) {
    const bodyStatus =
        payload && typeof payload === 'object' && Number.isInteger(payload.status) && payload.status >= 400
            ? payload.status
            : undefined;
    const status = init.status ?? bodyStatus ?? 200;
    const responseInit = init.status === undefined && bodyStatus !== undefined
        ? { ...init, status }
        : init;
    const isFailure =
        status >= 400 ||
        (payload && typeof payload === 'object' && typeof payload.error === 'string');

    if (isFailure) {
        let code = typeof payload?.code === 'string' ? payload.code : undefined;
        if (!code && payload?.locked === true) {
            code = payload.emailSent === true ? 'MFA_LOCKED_EMAIL_SENT' : 'LOCKED';
        } else if (!code && payload?.clientDeleted === true) {
            code = 'CLIENT_DELETED_STORAGE_CLEANUP_FAILED';
        } else if (!code && payload?.productDeleted === true) {
            code = 'PRODUCT_DELETED_STORAGE_CLEANUP_FAILED';
        } else if (!code) {
            code =
                {
                    401: 'UNAUTHORIZED',
                    403: 'FORBIDDEN',
                    404: 'NOT_FOUND',
                    409: 'CONFLICT',
                    423: 'LOCKED',
                    429: 'RATE_LIMITED',
                }[status] || (status >= 500 ? 'INTERNAL_ERROR' : 'BAD_REQUEST');
        }

        return NextResponse.json(
            {
                success: false,
                error: payload?.error || payload?.message || 'Request failed.',
                code,
            },
            responseInit
        );
    }

    if (
        payload &&
        typeof payload === 'object' &&
        typeof payload.success === 'boolean' &&
        'data' in payload
    ) {
        return NextResponse.json(payload, responseInit);
    }

    return NextResponse.json({ success: true, data: payload }, responseInit);
}
