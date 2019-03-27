package com.pinyougou.pojo;

import javax.persistence.*;

/**
 * Collect 实体类
 * @date 2019-03-27 19:49:10
 * @version 1.0
 */
@Table(name="tb_collect")
public class Collect implements java.io.Serializable{

	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	@Column(name="id")
	private Long id;
	@Column(name="user_id")
	private String userId;
	@Column(name="item_id")
	private Long itemId;

	/** setter and getter method */
	public void setId(Long id){
		this.id = id;
	}
	public Long getId(){
		return this.id;
	}
	public void setUserId(String userId){
		this.userId = userId;
	}
	public String getUserId(){
		return this.userId;
	}
	public void setItemId(Long itemId){
		this.itemId = itemId;
	}
	public Long getItemId(){
		return this.itemId;
	}

}