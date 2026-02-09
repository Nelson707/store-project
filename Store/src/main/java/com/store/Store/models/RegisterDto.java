package com.store.Store.models;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RegisterDto {

    @NotEmpty
    private String name;

    @NotEmpty
    @Email
    private String email;

    private String phoneNumber;
    private String role;
    @Size(min = 8, message = "minimum password length is 8 characters")
    private String password;
    private String confirmPassword;
}
