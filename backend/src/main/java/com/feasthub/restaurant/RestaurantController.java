package com.feasthub.restaurant;

import com.feasthub.common.response.ApiResponse;
import com.feasthub.restaurant.dto.MenuItemDto;
import com.feasthub.restaurant.dto.RestaurantDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RestaurantDto>>> getAllRestaurants() {
        List<RestaurantDto> restaurants = restaurantService.getAllActiveRestaurants();
        return ResponseEntity.ok(ApiResponse.ok(restaurants));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RestaurantDto>> getRestaurantById(@PathVariable Long id) {
        RestaurantDto restaurant = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(ApiResponse.ok(restaurant));
    }

    @GetMapping("/{id}/menu")
    public ResponseEntity<ApiResponse<List<MenuItemDto>>> getRestaurantMenu(@PathVariable Long id) {
        List<MenuItemDto> menu = restaurantService.getRestaurantMenu(id);
        return ResponseEntity.ok(ApiResponse.ok(menu));
    }
}
