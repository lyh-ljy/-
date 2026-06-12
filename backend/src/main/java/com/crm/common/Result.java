package com.crm.common;

/** 统一响应结果 */
public class Result<T> {
    private int code;
    private String message;
    private T data;
    private long timestamp;

    private Result() {}

    public static <T> Result<T> ok(T data) {
        Result<T> r = new Result<>();
        r.code = 200;
        r.message = "操作成功";
        r.data = data;
        r.timestamp = System.currentTimeMillis();
        return r;
    }

    public static <T> Result<T> ok(String message, T data) {
        Result<T> r = ok(data);
        r.message = message;
        return r;
    }

    public static <T> Result<T> fail(int code, String message) {
        Result<T> r = new Result<>();
        r.code = code;
        r.message = message;
        r.timestamp = System.currentTimeMillis();
        return r;
    }

    public static <T> Result<T> fail(String message) {
        return fail(500, message);
    }

    public int getCode() { return code; }
    public void setCode(int code) { this.code = code; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}
