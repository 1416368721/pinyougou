package com.pinyougou.user.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.User;
import com.pinyougou.service.UserService;
import org.springframework.web.bind.annotation.*;

/**
 * 用户控制器
 *
 * @author lee.siu.wah
 * @version 1.0
 * <p>File Created at 2019-03-16<p>
 */
@RestController
@RequestMapping("/user")
public class UserController {

    @Reference(timeout = 10000)
    private UserService userService;

    /**
     * 用户注册
     */
    @PostMapping("/save")
    public boolean save(@RequestBody User user, String code) {
        try {
            // 检验短信验证码
            boolean flag = userService.checkSmsCode(user.getPhone(), code);
            if (flag) {
                userService.save(user);
            }
            return flag;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }

    /**
     * 发送短信验证码
     */
    @GetMapping("/sendSmsCode")
    public boolean sendSmsCode(String phone) {
        try {
            return userService.sendSmsCode(phone);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }

    @PostMapping("/updatePassword")
    public boolean updatePassword(@RequestBody User user) {
        try {
            userService.update(user);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }
}
