package com.pinyougou;

import com.pinyougou.pojo.Order;
import com.pinyougou.pojo.OrderItem;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * date:2019/3/25;
 * author:xqq;
 */
public class MyOrder implements Serializable {
    /**我的订单*/
    private Order order;

    /**Sku商品*/
    private List<OrderItem> orderItems;

    public MyOrder(Order order, List<OrderItem> orderItems) {
        this.order = order;
        this.orderItems = orderItems;
    }

    public MyOrder() {
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }
}
