package com.feasthub.restaurant;

import com.feasthub.common.exception.ResourceNotFoundException;
import com.feasthub.restaurant.dto.CategoryDto;
import com.feasthub.restaurant.dto.MenuItemDto;
import com.feasthub.restaurant.dto.RestaurantDto;
import com.feasthub.restaurant.entity.Category;
import com.feasthub.restaurant.entity.MenuItem;
import com.feasthub.restaurant.entity.Restaurant;
import com.feasthub.restaurant.repository.CategoryRepository;
import com.feasthub.restaurant.repository.MenuItemRepository;
import com.feasthub.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final CategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;

    @Transactional(readOnly = true)
    public List<RestaurantDto> getAllActiveRestaurants() {
        return restaurantRepository.findByIsActiveTrue().stream()
                .map(r -> mapToRestaurantDto(r, false))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RestaurantDto getRestaurantById(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        return mapToRestaurantDto(restaurant, true);
    }

    @Transactional(readOnly = true)
    public List<MenuItemDto> getRestaurantMenu(Long restaurantId) {
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new ResourceNotFoundException("Restaurant not found with id: " + restaurantId);
        }
        return menuItemRepository.findByRestaurantIdAndIsAvailableTrue(restaurantId).stream()
                .map(this::mapToMenuItemDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> CategoryDto.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .iconUrl(c.getIconUrl())
                        .build())
                .collect(Collectors.toList());
    }

    public RestaurantDto mapToRestaurantDto(Restaurant restaurant, boolean includeMenu) {
        List<MenuItemDto> menu = null;
        if (includeMenu) {
            menu = menuItemRepository.findByRestaurantId(restaurant.getId()).stream()
                    .map(this::mapToMenuItemDto)
                    .collect(Collectors.toList());
        }

        return RestaurantDto.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .description(restaurant.getDescription())
                .address(restaurant.getAddress())
                .latitude(restaurant.getLatitude())
                .longitude(restaurant.getLongitude())
                .imageUrl(restaurant.getImageUrl())
                .rating(restaurant.getRating())
                .deliveryTimeMins(restaurant.getDeliveryTimeMins())
                .deliveryFee(restaurant.getDeliveryFee())
                .isActive(restaurant.getIsActive())
                .menu(menu)
                .build();
    }

    public MenuItemDto mapToMenuItemDto(MenuItem item) {
        return MenuItemDto.builder()
                .id(item.getId())
                .restaurantId(item.getRestaurant().getId())
                .categoryId(item.getCategory().getId())
                .categoryName(item.getCategory().getName())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .imageUrl(item.getImageUrl())
                .isVeg(item.getIsVeg())
                .isAvailable(item.getIsAvailable())
                .caloriesKcal(item.getCaloriesKcal())
                .proteinG(item.getProteinG())
                .carbsG(item.getCarbsG())
                .fatG(item.getFatG())
                .fiberG(item.getFiberG())
                .allergens(item.getAllergens())
                .build();
    }
}
