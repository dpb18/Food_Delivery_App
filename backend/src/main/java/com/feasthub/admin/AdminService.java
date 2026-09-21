package com.feasthub.admin;

import com.feasthub.admin.dto.AdminMetricsDto;
import com.feasthub.admin.dto.AdminOrderUpdateDto;
import com.feasthub.common.exception.ResourceNotFoundException;
import com.feasthub.delivery.entity.RiderStatus;
import com.feasthub.delivery.repository.DeliveryPartnerRepository;
import com.feasthub.order.OrderService;
import com.feasthub.order.dto.OrderResponseDto;
import com.feasthub.order.entity.Order;
import com.feasthub.order.entity.OrderStatus;
import com.feasthub.order.repository.OrderRepository;
import com.feasthub.restaurant.repository.MenuItemRepository;
import com.feasthub.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final DeliveryPartnerRepository deliveryPartnerRepository;

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(orderService::mapToOrderResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponseDto updateOrderStatus(Long orderId, AdminOrderUpdateDto updateDto) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        order.setStatus(updateDto.getStatus());
        Order saved = orderRepository.save(order);
        return orderService.mapToOrderResponseDto(saved);
    }

    @Transactional(readOnly = true)
    public AdminMetricsDto getMetrics() {
        List<Order> allOrders = orderRepository.findAll();

        long totalOrders = allOrders.size();
        BigDecimal totalRevenue = allOrders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Long> statusCounts = new HashMap<>();
        for (OrderStatus st : OrderStatus.values()) {
            statusCounts.put(st.name(), 0L);
        }
        for (Order o : allOrders) {
            statusCounts.put(o.getStatus().name(), statusCounts.getOrDefault(o.getStatus().name(), 0L) + 1);
        }

        long activeDishes = menuItemRepository.count();
        long totalRestaurants = restaurantRepository.count();
        long activeRiders = deliveryPartnerRepository.findByStatus(RiderStatus.ONLINE).size();

        return AdminMetricsDto.builder()
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .activeDishes(activeDishes)
                .totalRestaurants(totalRestaurants)
                .activeRiders(activeRiders)
                .ordersByStatus(statusCounts)
                .build();
    }
}
