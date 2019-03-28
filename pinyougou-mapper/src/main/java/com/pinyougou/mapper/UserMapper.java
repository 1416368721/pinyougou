package com.pinyougou.mapper;

import org.apache.ibatis.annotations.Update;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import tk.mybatis.mapper.common.Mapper;

import com.pinyougou.pojo.User;

import java.util.Date;

/**
 * UserMapper 数据访问接口
 * @date 2019-02-27 09:55:07
 * @version 1.0
 */
public interface UserMapper extends Mapper<User>{

    @Update("update tb_user set password = #{password}, updated = #{updated} where username = #{username} ")
    void updateByUsername(@Param("username") String username,@Param("password") String password,@Param("updated") Date updated);

    void saveUserInfo(User user);
    /** 根据用户名查询用户 */
    @Select("select * from tb_user where username = #{username}")
    User findUserByUsername(String username);

    @Update("update tb_user set phone = #{phone} where username = #{username}")
    void updatePhone(@Param("username") String username, @Param("phone") String phone);
    @Select("SELECT * FROM tb_user where username=#{username}")
    User findUserById(String username);
}