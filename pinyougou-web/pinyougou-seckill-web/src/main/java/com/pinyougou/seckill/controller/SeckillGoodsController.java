package com.pinyougou.seckill.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.SeckillGoods;
import com.pinyougou.service.SeckillGoodsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 秒杀商品控制器
 *
 * @author lee.siu.wah
 * @version 1.0
 * <p>File Created at 2019-03-23<p>
 */
@RestController
@RequestMapping("/seckill")
public class SeckillGoodsController {

    @Reference(timeout = 10000)
    private SeckillGoodsService seckillGoodsService;

    /** 查询正在秒杀的商品 */
    @GetMapping("/findSeckillGoods")
    public List<SeckillGoods> findSeckillGoods(){
        return seckillGoodsService.findSeckillGoods();
    }


    /** 根据id查询秒杀商品 */
    @GetMapping("/findOne")
    public SeckillGoods findOne(Long id){
        return seckillGoodsService.findSeckillGoodsFromRedis(id);
    }

}
