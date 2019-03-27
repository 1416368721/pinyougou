package com.pinyougou.shop.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.common.util.CookieUtils;
import com.pinyougou.pojo.Seller;
import com.pinyougou.pojo.User;
import com.pinyougou.service.SellerService;
import com.pinyougou.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/password")
public class PasswordController {
    @Autowired
    private HttpServletRequest request;
    @Reference(timeout = 10000)
    private SellerService sellerService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @GetMapping("/findPassword")
    public Map<String,String> findPassword(){
        Map<String,String>map=new HashMap<>();
        String password = CookieUtils.getCookieValue(request,
                "password", true);
        String username = CookieUtils.getCookieValue(request,
                "username", true);
        System.out.println(password);
        map.put("password",password );
        map.put("username", username);
        return map;
    }
    @PostMapping("/changePassword")
    public Boolean changePassword(String username ,@RequestBody Map<String,String> map){
        try {
            System.out.println(username);
            String password = map.get("newPassword");
            Seller seller = new Seller();
            seller.setSellerId(username);
            seller.setPassword(passwordEncoder.encode(password));
            sellerService.update(seller);
            return true;
        }catch (Exception e){
            e.printStackTrace();
        }
        return false;
    }
}
