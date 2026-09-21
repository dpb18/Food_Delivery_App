package com.feasthub.order;

import com.feasthub.common.response.ApiResponse;
import com.feasthub.order.dto.CouponValidationResponse;
import com.feasthub.order.dto.CreateOrderRequest;
import com.feasthub.order.dto.OrderResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponseDto>> createOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateOrderRequest request
    ) {
        OrderResponseDto order = orderService.createOrder(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok("Order placed successfully!", order));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<List<OrderResponseDto>>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<OrderResponseDto> orders = orderService.getCustomerOrders(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponseDto>> getOrderById(@PathVariable Long id) {
        OrderResponseDto order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.ok(order));
    }

    @GetMapping("/coupons/validate")
    public ResponseEntity<ApiResponse<CouponValidationResponse>> validateCoupon(
            @RequestParam String code,
            @RequestParam BigDecimal subtotal
    ) {
        CouponValidationResponse response = orderService.validateCoupon(code, subtotal);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
