package com.pinyougou.shop.controller;

import com.pinyougou.common.util.CookieUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

/**
 * 登录控制器
 *
 * @author lee.siu.wah
 * @version 1.0
 * <p>File Created at 2019-03-03<p>
 */
@Controller
public class LoginController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private HttpServletRequest request;
    @Autowired
    private HttpServletResponse response;
    /** 用户登录  get|post */
    @RequestMapping("/login")
    public String login(String username, String password, String code,
                        HttpServletRequest request){
        System.out.println("username:" + username);
        System.out.println("password:" + password);
        CookieUtils.setCookie(request,
                response, "password",password ,
                60*60*24*30, true);
        CookieUtils.setCookie(request,
                response, "username",username ,
                60*60*24*30, true);
        System.out.println("code:" + code);

        // 判断请求方式
        if ("post".equalsIgnoreCase(request.getMethod())) {
            // 判断验证码
            String oldCode = (String) request.getSession().getAttribute(VerifyController.VERIFY_CODE);
            if (code != null && code.equalsIgnoreCase(oldCode)) {
                // 创建用户名与密码对象
                UsernamePasswordAuthenticationToken token =
                        new UsernamePasswordAuthenticationToken(username, password);
                // 登录认证(Spring Security)
                Authentication authenticate = authenticationManager.authenticate(token);
                // 判断认证是否成功
                if (authenticate.isAuthenticated()) {
                    // 认证成功
                    SecurityContextHolder.getContext()
                            .setAuthentication(authenticate);
                    return "redirect:/admin/index.html";
                }
            }
        }
        return  "redirect:/shoplogin.html";
    }


    /** 获取登录用户名 */
    @GetMapping("/showLoginName")
    @ResponseBody
    public Map<String,String> showLoginName(){
        // 获取安全上下文对象
        SecurityContext context = SecurityContextHolder.getContext();
        // 获取登录用户名
        String loginName = context.getAuthentication().getName();
        Map<String,String> data = new HashMap<>();
        data.put("loginName", loginName);
        return data;

    }

}
