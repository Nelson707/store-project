package com.store.Store.dto;

import lombok.Getter;

import java.util.Set;

@Getter
public class AuthResponseDto {

    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private Set<String> roles;
    private String token;

    // Constructor with token
    public AuthResponseDto(Long id, String name, String email, String phoneNumber, Set<String> roles, String token) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.roles = roles;
        this.token = token;
    }


}
