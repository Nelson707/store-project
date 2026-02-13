package com.store.Store.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SaleItemRequestDto {
    @NotNull
    private Long productId;

    @NotNull
    @Positive
    private Integer quantity;
}
