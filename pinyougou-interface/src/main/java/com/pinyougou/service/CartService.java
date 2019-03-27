package com.pinyougou.service;

import com.pinyougou.cart.Cart;

import java.util.List; /**
 * 购物车服务接口
 *
 * @author lee.siu.wah
 * @version 1.0
 * <p>File Created at 2019-03-19<p>
 */
public interface CartService {

    /**
     * 添加SKU商品添加到购物车
     * @param carts 购物车集合
     * @param itemId SKU的id
     * @param num 购买数量
     * @return 修改后的购物车集合
     */
    List<Cart> addItemToCart(List<Cart> carts, Long itemId, Integer num);

    /**
     * 获取登录用户的购物车
     * @param userId 用户id
     * @return 购物车集合
     */
    List<Cart> findCartRedis(String userId);

    /**
     * 把用户的购物车存储到Redis数据库
     * @param userId 用户id
     * @param carts 购物车集合
     */
    void saveCartRedis(String userId, List<Cart> carts);

    /**
     * 购物车合并
     * @param cookieCarts Cookie中购物车
     * @param redisCarts Redis中购物车
     * @return 合并后的购物车
     * */
    List<Cart> mergeCart(List<Cart> cookieCarts, List<Cart> redisCarts);

    /**
     *
     * @param carts
     * @param ids
     * @param username
     * @return
     */
    List<Cart> saveCartRedisByIds(List<Cart> carts,Long[] ids, String username);

    List<Cart> findIdsCartRedis(String userId);
}
