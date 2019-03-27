package com.pinyougou.cart.service.impl;
import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.cart.Cart;
import com.pinyougou.mapper.ItemMapper;
import com.pinyougou.pojo.Item;
import com.pinyougou.pojo.OrderItem;
import com.pinyougou.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.transaction.annotation.Transactional;

import javax.print.DocFlavor;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 *  购物车服务接口实现类
 *
 * @author lee.siu.wah
 * @version 1.0
 * <p>File Created at 2019-03-19<p>
 */
@Service(interfaceName = "com.pinyougou.service.CartService")
@Transactional
public class CartServiceImpl implements CartService {

    @Autowired
    private ItemMapper itemMapper;
    @Autowired
    private RedisTemplate redisTemplate;

    /**
     * 添加SKU商品添加到购物车
     * @param carts 购物车集合
     * @param itemId SKU的id
     * @param num 购买数量
     * @return 修改后的购物车集合
     */
    public List<Cart> addItemToCart(List<Cart> carts, Long itemId, Integer num){
        try{
            // 1. 根据itemId到tb_item表查询一行数据
            Item item = itemMapper.selectByPrimaryKey(itemId);

            // 2. 根据商家id从用户的购物车集合中搜索到对应的商家购物车
            Cart cart = searchCartBySellerId(carts, item.getSellerId());

            // 3. 判断商家的购物车是否为空
            if (cart == null){
                // 代表没有买过该商家的商品
                // 创建商家的购物车
                cart = new Cart();
                // 设置商家的id
                cart.setSellerId(item.getSellerId());
                // 设置店铺的名称
                cart.setSellerName(item.getSeller());

                // 创建商家的购物车集合
                List<OrderItem> orderItems = new ArrayList<>();
                // 创建购物车中的商品对象
                OrderItem orderItem = createOrderItem(item, num);
                
                // 添加用户购买的商品
                orderItems.add(orderItem);
                // 设置商家的购物车集合
                cart.setOrderItems(orderItems);
                // 添加到用户的购物车集合中
                carts.add(cart);
            }else{
                // 代表买过该商家的商品
                // 获取该商家的购物车集合
                List<OrderItem> orderItems = cart.getOrderItems();
                // 根据itemId到商家的购物车集合搜索一个商品
                OrderItem orderItem = searchOrderItemByItemId(orderItems, itemId);

                // 判断是否买了同样的商品
                if (orderItem == null){
                    // 代表没有买过该商家同样的商品
                    // 创建新的购物车中的商品
                    orderItem = createOrderItem(item, num);
                    // 添加到该商家的购物车集合中
                    orderItems.add(orderItem);
                }else {
                    // 代表买过该商家同样的商品
                    // 设置购买数量(叠加)
                    orderItem.setNum(orderItem.getNum() + num);
                    // 设置小计金额
                    orderItem.setTotalFee(new BigDecimal(
                            orderItem.getPrice().doubleValue() * orderItem.getNum()));

                    // 判断购买数量是否为零
                    if (orderItem.getNum() == 0){
                        // 从该商家的购物车集合中删除该商品
                        orderItems.remove(orderItem);
                    }
                    // 判断商家的购物车集合是否零
                    if (orderItems.size() == 0){
                        // 用户的购物车集合中删除该商家的购物车
                        carts.remove(cart);
                    }
                }
            }

            return carts;
        }catch (Exception ex){
            throw new RuntimeException(ex);
        }
    }

    /** 根据itemId到商家的购物车集合搜索一个商品 */
    private OrderItem searchOrderItemByItemId(List<OrderItem> orderItems, Long itemId) {
        for (OrderItem orderItem : orderItems) {
            if (orderItem.getItemId().equals(itemId)){
                return orderItem;
            }
        }
        return null;
    }

    /** 把Item转化成购物车相关的商品 */
    private OrderItem createOrderItem(Item item, Integer num) {
        OrderItem orderItem = new OrderItem();
        // 设置sku的id
        orderItem.setItemId(item.getId());
        // 设置spu的id
        orderItem.setGoodsId(item.getGoodsId());
        // 设置商品标题
        orderItem.setTitle(item.getTitle());
        // 设置商品价格
        orderItem.setPrice(item.getPrice());
        // 设置购买数据
        orderItem.setNum(num);
        // 设置小计金额
        orderItem.setTotalFee(new BigDecimal(item.getPrice().doubleValue() * num));
        // 设置商品的图片
        orderItem.setPicPath(item.getImage());
        // 设置商家的id
        orderItem.setSellerId(item.getSellerId());
        return orderItem;
    }

    /** 根据商家id从用户的购物车集合中搜索到对应的商家购物车 */
    private Cart searchCartBySellerId(List<Cart> carts, String sellerId) {
        for (Cart cart : carts) {
            if (sellerId.equals(cart.getSellerId())){
                return cart;
            }
        }
        return null;
    }


    /**
     * 获取登录用户的购物车
     * @param userId 用户id
     * @return 购物车集合
     */
    public List<Cart>  findCartRedis(String userId){
        try{
            List<Cart> carts = (List<Cart>)redisTemplate.boundValueOps("cart_" + userId).get();
            if (carts == null){
                carts = new ArrayList<>();
            }
            return carts;
        }catch (Exception ex){
            throw new RuntimeException(ex);
        }
    }

    /**
     * 把用户的购物车存储到Redis数据库
     * @param userId 用户id
     * @param carts 购物车集合
     */
    public void saveCartRedis(String userId, List<Cart> carts){
        try{
            redisTemplate.boundValueOps("cart_" + userId).set(carts);
        }catch (Exception ex){
            throw new RuntimeException(ex);
        }
    }

    /**
     * 购物车合并
     * @param cookieCarts Cookie中购物车
     * @param redisCarts Redis中购物车
     * @return 合并后的购物车
     * */
    public List<Cart> mergeCart(List<Cart> cookieCarts, List<Cart> redisCarts){
        try{
            // 循环Cookie中的购物车数据
            for (Cart cookieCart : cookieCarts) {
                // 迭代商家购物车中的商品
                for (OrderItem orderItem : cookieCart.getOrderItems()) {
                    redisCarts = addItemToCart(redisCarts, orderItem.getItemId(), orderItem.getNum());
                }
            }
            return redisCarts;
        }catch (Exception ex){
            throw new RuntimeException(ex);
        }
    }

    //通过ids获取商品并封装到购物车中
    @Override
    public List<Cart> saveCartRedisByIds(List<Cart> carts,Long[] ids, String username) {
        ArrayList<Cart>cartsByIds=new ArrayList<>();
        System.out.println(ids);
        for(int i=0;carts.size()>i;i++){
            Cart cart1 = new Cart();
            Cart cart = carts.get(i);
            cart1.setSellerId(cart.getSellerId());
            cart1.setSellerName(cart.getSellerName());
            List<OrderItem> cartOrderItems = cart.getOrderItems();
            ArrayList<OrderItem>orderItems=new ArrayList<>();
            for (int j=0;cartOrderItems.size()>j;j++){
                OrderItem orderItem = cart.getOrderItems().get(j);
                for (Long id : ids) {
                    if (id.equals(orderItem.getItemId())){
                        orderItems.add(orderItem);
                        cartOrderItems.remove(j);
                        j--;
                        continue;
                    }
                }
                if (cartOrderItems!=null&&cartOrderItems.size()==0){
                    carts.remove(i);
                    i--;
                }
            cart1.setOrderItems(orderItems);
            }
            cartsByIds.add(cart1);
            System.out.println(cartsByIds);
        }
        redisTemplate.boundValueOps("cart_"+username).set(carts);
        redisTemplate.boundValueOps("idSelectedCart_"+username).set(cartsByIds);
         List<Cart> idsCarts = (List<Cart>) redisTemplate.boundValueOps("IdSelectedCart_" + username).get();
//        System.out.println("idsCarts===="+idsCarts);
         List<Cart> Carts = (List<Cart>) redisTemplate.boundValueOps("cart_" + username).get();
//        System.out.println("carts===="+carts);
         return idsCarts;
    }

//    获取idsCarts
    @Override
    public List<Cart> findIdsCartRedis(String userId) {
        return (List<Cart>)redisTemplate.boundValueOps("idSelectedCart_"+userId).get();
    }
}


