import { defer } from 'rxjs';

export function asyncData<T> (data: T) {
    return defer(() => Promise.resolve(data));
}

export function asyncError<T> (error: T) {
    return defer(() => Promise.reject(error));
}
