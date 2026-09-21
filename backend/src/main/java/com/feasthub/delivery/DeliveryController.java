package com.feasthub.delivery;

import com.feasthub.common.response.ApiResponse;
import com.feasthub.delivery.dto.DeliveryPartnerProfileDto;
import com.feasthub.delivery.dto.UpdateLocationRequest;
import com.feasthub.delivery.dto.UpdateStatusRequest;
import com.feasthub.delivery.dto.VerifyOtpRequest;
import com.feasthub.order.dto.OrderResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @GetMapping("/available-orders")
    public ResponseEntity<ApiResponse<List<OrderResponseDto>>> getAvailableOrders() {
        List<OrderResponseDto> orders = deliveryService.getAvailableOrders();
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<List<OrderResponseDto>>> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
        List<OrderResponseDto> orders = deliveryService.getMyAssignedOrders(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @PostMapping("/orders/{id}/accept")
    public ResponseEntity<ApiResponse<OrderResponseDto>> acceptOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        OrderResponseDto order = deliveryService.acceptOrder(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.ok("Order accepted for delivery", order));
    }

    @PostMapping("/orders/{id}/verify-otp")
    public ResponseEntity<ApiResponse<OrderResponseDto>> verifyOtp(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody VerifyOtpRequest request
    ) {
        OrderResponseDto order = deliveryService.verifyOtpAndDeliver(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Delivery successfully verified with OTP!", order));
    }

    @PatchMapping("/rider/location")
    public ResponseEntity<ApiResponse<DeliveryPartnerProfileDto>> updateLocation(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateLocationRequest request
    ) {
        DeliveryPartnerProfileDto profile = deliveryService.updateLocation(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok("Location updated", profile));
    }

    @PatchMapping("/rider/status")
    public ResponseEntity<ApiResponse<DeliveryPartnerProfileDto>> updateStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateStatusRequest request
    ) {
        DeliveryPartnerProfileDto profile = deliveryService.updateStatus(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok("Status updated", profile));
    }

    @GetMapping("/rider/profile")
    public ResponseEntity<ApiResponse<DeliveryPartnerProfileDto>> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        DeliveryPartnerProfileDto profile = deliveryService.getRiderProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }
}
