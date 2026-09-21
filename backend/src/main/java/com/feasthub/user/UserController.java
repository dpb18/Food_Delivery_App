package com.feasthub.user;

import com.feasthub.common.response.ApiResponse;
import com.feasthub.user.dto.AddressDto;
import com.feasthub.user.dto.CreateAddressRequest;
import com.feasthub.user.dto.UserSummaryDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserSummaryDto>> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UserSummaryDto profile = userService.getUserProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @GetMapping("/addresses")
    public ResponseEntity<ApiResponse<List<AddressDto>>> getAddresses(@AuthenticationPrincipal UserDetails userDetails) {
        List<AddressDto> addresses = userService.getUserAddresses(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(addresses));
    }

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponse<AddressDto>> addAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateAddressRequest request
    ) {
        AddressDto created = userService.addAddress(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok("Address added successfully", created));
    }
}
