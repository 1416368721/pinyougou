package com.pinyougou.cart.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.pinyougou.cart.Cart;
import com.pinyougou.common.util.CookieUtils;
import com.pinyougou.service.CartService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * 购物车控制器
 *
 * @author lee.siu.wah
 * @version 1.0
 * <p>File Created at 2019-03-19<p>
 */
@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private HttpServletRequest request;
    @Autowired
    private HttpServletResponse response;
    @Reference(timeout = 10000)
    private CartService cartService;

    /** 把SKU商品添加到购物车 */
    @GetMapping("/addCart")
    @CrossOrigin(origins = "http://item.pinyougou.com",
            allowCredentials = "true")
    public boolean addCart(Long itemId, Integer num){
        try{
            // 设置允许跨域访问的域名 99%
            //response.setHeader("Access-Control-Allow-Origin", "http://item.pinyougou.com");
            // 设置允许跨域访问Cookie 1%
            //response.setHeader("Access-Control-Allow-Credentials", "true");

            // 获取登录用户名
            String userId = request.getRemoteUser();

            // 1. 获取原来的购物车
            List<Cart> carts = findCart();

            // 2. 把SKU商品添加到购物车，返回修改后的购物车
            carts = cartService.addItemToCart(carts, itemId, num);

            // 判断用户是否登录
            if (StringUtils.isNoneBlank(userId)) { // 已登录
                /** ########### 已登录的用户购物车数据存储到Redis数据库 ############## */
                cartService.saveCartRedis(userId, carts);

            }else { // 未登录

                /** ########### 未登录的用户购物车数据存储到Cookie中 ############## */
                CookieUtils.setCookie(request, response,
                        CookieUtils.CookieName.PINYOUGOU_CART,
                        JSON.toJSONString(carts),
                        60 * 60 * 24, true);
            }
            return true;
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return false;
    }


    /** 获取购物车 */
    @GetMapping("/findCart")
    public List<Cart> findCart(){
        // 获取登录用户名
        String userId = request.getRemoteUser();

        // 购物集合
        List<Cart> carts = null;

        // 判断用户是否登录
        if (StringUtils.isNoneBlank(userId)){ // 已登录
            /** ####### 已登录的用户从Redis中获取购物车 ######## */
            carts = cartService.findCartRedis(userId);

            /** ############# 购物车合并 ################ */
            // 获取Cookie中的购物车数据
            String cartJsonStr = CookieUtils.getCookieValue(request,
                    CookieUtils.CookieName.PINYOUGOU_CART, true);
            if (StringUtils.isNoneBlank(cartJsonStr)){
                // 代表Cookie中的购物车不是空 [{},{}]
                List<Cart> cookieCarts = JSON.parseArray(cartJsonStr, Cart.class);
                if (cookieCarts.size() > 0){
                    // 调用服务接口合并购物车
                    carts = cartService.mergeCart(cookieCarts, carts);
                    // 把合并后的购物车数据重新存储到Redis
                    cartService.saveCartRedis(userId, carts);

                    // 删除Cookie中购物车
                    CookieUtils.deleteCookie(request,response,
                            CookieUtils.CookieName.PINYOUGOU_CART);
                }
            }

        }else{ // 未登录
            /** ####### 未登录的用户从Cookie中获取购物车 ######## */
            // 把List<Cart> 转化成json字符串 [{},{}]
            String cartJsonStr = CookieUtils.getCookieValue(request,
                    CookieUtils.CookieName.PINYOUGOU_CART, true);
            if (StringUtils.isBlank(cartJsonStr)){
                // 创建新的购物车
                cartJsonStr = "[]";
            }
            carts = JSON.parseArray(cartJsonStr, Cart.class);
        }
        return carts;

    }
}
