package com.crm.common;

import java.util.List;

/** 分页响应结果 */
public class PageResult<T> {
    private List<T> records;
    private long total;
    private int page;
    private int pageSize;
    private int totalPages;

    public PageResult() {}

    public PageResult(List<T> records, long total, int page, int pageSize) {
        this.records = records;
        this.total = total;
        this.page = page;
        this.pageSize = pageSize;
        this.totalPages = (int) Math.ceil((double) total / pageSize);
    }

    public List<T> getRecords() { return records; }
    public void setRecords(List<T> records) { this.records = records; }
    public long getTotal() { return total; }
    public void setTotal(long total) { this.total = total; }
    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }
    public int getPageSize() { return pageSize; }
    public void setPageSize(int pageSize) { this.pageSize = pageSize; }
    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int totalPages) { this.totalPages = totalPages; }
}
