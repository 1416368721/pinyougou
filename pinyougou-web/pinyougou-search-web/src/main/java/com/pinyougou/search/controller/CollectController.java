package com.pinyougou.search.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.Item;
import com.pinyougou.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * date:2019/3/27;
 * author:xqq;
 */
@RestController
@RequestMapping("/collect")
public class CollectController {
    @Reference(timeout = 10000)
    private OrderService orderService;

    @PostMapping("/saveCollect")
    public boolean saveCollect(@RequestBody Item item){

        return true;
    }


}
