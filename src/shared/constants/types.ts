export type responseType<T> = {
    error: boolean,
    success: boolean,
    msg: "string",
    data: T
}