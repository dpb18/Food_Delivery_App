package com.feasthub.admin;

import com.feasthub.admin.dto.AdminMetricsDto;
import com.feasthub.admin.dto.AdminOrderUpdateDto;
import com.feasthub.common.response.ApiResponse;
import com.feasthub.order.dto.OrderResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderResponseDto>>> getAllOrders() {
        List<OrderResponseDto> orders = adminService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponseDto>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody AdminOrderUpdateDto updateDto
    ) {
        OrderResponseDto updated = adminService.updateOrderStatus(id, updateDto);
        return ResponseEntity.ok(ApiResponse.ok("Order status updated successfully", updated));
    }

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<AdminMetricsDto>> getMetrics() {
        AdminMetricsDto metrics = adminService.getMetrics();
        return ResponseEntity.ok(ApiResponse.ok(metrics));
    }
}
