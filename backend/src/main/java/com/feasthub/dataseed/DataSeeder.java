package com.feasthub.dataseed;

import com.feasthub.delivery.entity.DeliveryPartner;
import com.feasthub.delivery.entity.RiderStatus;
import com.feasthub.delivery.entity.VehicleType;
import com.feasthub.delivery.repository.DeliveryPartnerRepository;
import com.feasthub.restaurant.entity.Category;
import com.feasthub.restaurant.entity.MenuItem;
import com.feasthub.restaurant.entity.Restaurant;
import com.feasthub.restaurant.repository.CategoryRepository;
import com.feasthub.restaurant.repository.MenuItemRepository;
import com.feasthub.restaurant.repository.RestaurantRepository;
import com.feasthub.user.entity.Address;
import com.feasthub.user.entity.RoleName;
import com.feasthub.user.entity.User;
import com.feasthub.user.repository.AddressRepository;
import com.feasthub.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final DeliveryPartnerRepository deliveryPartnerRepository;
    private final RestaurantRepository restaurantRepository;
    private final CategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Already seeded
        }

        System.out.println(">>> [FeastHub] Seeding Initial Database Records...");

        // 1. Seed Users
        User admin = User.builder()
                .fullName("Platform Administrator")
                .email("admin@feasthub.com")
                .passwordHash(passwordEncoder.encode("admin123"))
                .phone("+91 98765 43210")
                .role(RoleName.ROLE_ADMIN)
                .build();
        userRepository.save(admin);

        User riderUser = User.builder()
                .fullName("Vikram Singh")
                .email("vikram@feasthub.com")
                .passwordHash(passwordEncoder.encode("rider123"))
                .phone("+91 91234 56789")
                .role(RoleName.ROLE_DELIVERY_PARTNER)
                .build();
        User savedRider = userRepository.save(riderUser);

        DeliveryPartner riderProfile = DeliveryPartner.builder()
                .user(savedRider)
                .vehicleType(VehicleType.BIKE)
                .vehicleNumber("KA-01-EQ-9874")
                .status(RiderStatus.ONLINE)
                .currentLatitude(new BigDecimal("12.9352"))
                .currentLongitude(new BigDecimal("77.6245"))
                .totalEarnings(new BigDecimal("480.00"))
                .build();
        deliveryPartnerRepository.save(riderProfile);

        User customer = User.builder()
                .fullName("Rahul Sharma")
                .email("customer@feasthub.com")
                .passwordHash(passwordEncoder.encode("customer123"))
                .phone("+91 99887 76655")
                .role(RoleName.ROLE_CUSTOMER)
                .build();
        User savedCustomer = userRepository.save(customer);

        Address defaultAddress = Address.builder()
                .user(savedCustomer)
                .label("Home")
                .streetAddress("Flat 402, Green Glen Heights, Bellandur")
                .city("Bengaluru")
                .state("Karnataka")
                .postalCode("560103")
                .latitude(new BigDecimal("12.9279"))
                .longitude(new BigDecimal("77.6748"))
                .isDefault(true)
                .build();
        addressRepository.save(defaultAddress);

        // 2. Seed Categories
        Category catBurgers = Category.builder().name("Burgers").iconUrl("🍔").build();
        Category catPizzas = Category.builder().name("Pizzas").iconUrl("🍕").build();
        Category catBiryani = Category.builder().name("Biryani & Indian").iconUrl("🍛").build();
        Category catAsian = Category.builder().name("Asian & Bowls").iconUrl("🍜").build();
        Category catHealthy = Category.builder().name("Healthy & Salads").iconUrl("🥗").build();
        Category catDesserts = Category.builder().name("Desserts").iconUrl("🍰").build();

        categoryRepository.saveAll(List.of(catBurgers, catPizzas, catBiryani, catAsian, catHealthy, catDesserts));

        // 3. Seed Restaurants
        Restaurant r1 = Restaurant.builder()
                .name("Burger Forge Gourmet")
                .description("Artisanal smash burgers, truffle fries & thick milkshakes crafted with fresh organic brioche.")
                .address("100 Feet Road, Indiranagar, Bengaluru")
                .latitude(new BigDecimal("12.9783"))
                .longitude(new BigDecimal("77.6408"))
                .imageUrl("https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80")
                .rating(new BigDecimal("4.8"))
                .deliveryTimeMins(25)
                .deliveryFee(new BigDecimal("30.00"))
                .isActive(true)
                .build();

        Restaurant r2 = Restaurant.builder()
                .name("Crust & Craft Pizzeria")
                .description("Authentic Neapolitan wood-fired sourdough pizzas with imported San Marzano tomato base.")
                .address("80 Feet Road, Koramangala 4th Block, Bengaluru")
                .latitude(new BigDecimal("12.9352"))
                .longitude(new BigDecimal("77.6245"))
                .imageUrl("https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80")
                .rating(new BigDecimal("4.7"))
                .deliveryTimeMins(30)
                .deliveryFee(new BigDecimal("35.00"))
                .isActive(true)
                .build();

        Restaurant r3 = Restaurant.builder()
                .name("Royal Dum Biryani House")
                .description("Royal Awadhi & Hyderabadi dum biryanis cooked on slow charcoal flame in copper handis.")
                .address("Outer Ring Road, Marathahalli, Bengaluru")
                .latitude(new BigDecimal("12.9569"))
                .longitude(new BigDecimal("77.7011"))
                .imageUrl("https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80")
                .rating(new BigDecimal("4.6"))
                .deliveryTimeMins(35)
                .deliveryFee(new BigDecimal("40.00"))
                .isActive(true)
                .build();

        Restaurant r4 = Restaurant.builder()
                .name("Golden Dragon Asian Wok")
                .description("Street-style pan-Asian wok bowls, dim sums, spicy ramen, and crispy Cantonese starters.")
                .address("Lavelle Road, Shanthala Nagar, Bengaluru")
                .latitude(new BigDecimal("12.9716"))
                .longitude(new BigDecimal("77.5946"))
                .imageUrl("https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80")
                .rating(new BigDecimal("4.5"))
                .deliveryTimeMins(40)
                .deliveryFee(new BigDecimal("45.00"))
                .isActive(true)
                .build();

        restaurantRepository.saveAll(List.of(r1, r2, r3, r4));

        // 4. Seed Menu Items with AI Nutrition Details
        List<MenuItem> menuItems = List.of(
                // Burger Forge
                MenuItem.builder()
                        .restaurant(r1).category(catBurgers)
                        .name("Truffle Umami Smash Burger")
                        .description("Double smashed Angus beef patty, black truffle aioli, aged cheddar, caramelized shallots.")
                        .price(new BigDecimal("349.00"))
                        .imageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80")
                        .isVeg(false).isAvailable(true)
                        .caloriesKcal(680).proteinG(new BigDecimal("34.5")).carbsG(new BigDecimal("42.0")).fatG(new BigDecimal("38.0")).fiberG(new BigDecimal("3.2"))
                        .allergens("Gluten, Dairy, Mustard").build(),

                MenuItem.builder()
                        .restaurant(r1).category(catBurgers)
                        .name("Crispy Paneer Royale Burger")
                        .description("Golden panko-crusted spiced cottage cheese patty with mint sriracha slaw on sesame brioche.")
                        .price(new BigDecimal("279.00"))
                        .imageUrl("https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80")
                        .isVeg(true).isAvailable(true)
                        .caloriesKcal(560).proteinG(new BigDecimal("22.0")).carbsG(new BigDecimal("48.0")).fatG(new BigDecimal("28.0")).fiberG(new BigDecimal("4.5"))
                        .allergens("Dairy, Gluten").build(),

                MenuItem.builder()
                        .restaurant(r1).category(catHealthy)
                        .name("Rosemary Parmesan Fries")
                        .description("Crisp skin-on Idaho potatoes dusted with aromatic rosemary and freshly grated Parmesan.")
                        .price(new BigDecimal("149.00"))
                        .imageUrl("https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80")
                        .isVeg(true).isAvailable(true)
                        .caloriesKcal(320).proteinG(new BigDecimal("5.0")).carbsG(new BigDecimal("38.0")).fatG(new BigDecimal("16.0")).fiberG(new BigDecimal("3.8"))
                        .allergens("Dairy").build(),

                // Crust & Craft Pizzeria
                MenuItem.builder()
                        .restaurant(r2).category(catPizzas)
                        .name("Margherita D.O.P.")
                        .description("Traditional wood-fired Neapolitan pizza, San Marzano tomato, fresh buffalo mozzarella, basil leaves.")
                        .price(new BigDecimal("399.00"))
                        .imageUrl("https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80")
                        .isVeg(true).isAvailable(true)
                        .caloriesKcal(590).proteinG(new BigDecimal("24.0")).carbsG(new BigDecimal("70.0")).fatG(new BigDecimal("21.0")).fiberG(new BigDecimal("4.0"))
                        .allergens("Dairy, Gluten").build(),

                MenuItem.builder()
                        .restaurant(r2).category(catPizzas)
                        .name("Spicy Pepperoni & Hot Honey")
                        .description("Smoked cured pork pepperoni, crushed red pepper flakes, drizzle of organic wildflower hot honey.")
                        .price(new BigDecimal("489.00"))
                        .imageUrl("https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&auto=format&fit=crop&q=80")
                        .isVeg(false).isAvailable(true)
                        .caloriesKcal(740).proteinG(new BigDecimal("32.0")).carbsG(new BigDecimal("68.0")).fatG(new BigDecimal("36.0")).fiberG(new BigDecimal("3.5"))
                        .allergens("Gluten, Dairy, Pork").build(),

                // Royal Dum Biryani
                MenuItem.builder()
                        .restaurant(r3).category(catBiryani)
                        .name("Hyderabadi Dum Chicken Biryani")
                        .description("Long-grain aged Basmati rice layered with succulent marinated chicken, saffron, and fried onions.")
                        .price(new BigDecimal("369.00"))
                        .imageUrl("https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80")
                        .isVeg(false).isAvailable(true)
                        .caloriesKcal(620).proteinG(new BigDecimal("38.0")).carbsG(new BigDecimal("65.0")).fatG(new BigDecimal("22.0")).fiberG(new BigDecimal("4.2"))
                        .allergens("Dairy, Nuts").build(),

                MenuItem.builder()
                        .restaurant(r3).category(catBiryani)
                        .name("Shahi Paneer Tikka Biryani")
                        .description("Tandoor-charred cottage cheese cubes cooked in spiced fragrant rice with saffron and fresh mint.")
                        .price(new BigDecimal("329.00"))
                        .imageUrl("https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80")
                        .isVeg(true).isAvailable(true)
                        .caloriesKcal(540).proteinG(new BigDecimal("22.0")).carbsG(new BigDecimal("62.0")).fatG(new BigDecimal("21.0")).fiberG(new BigDecimal("5.0"))
                        .allergens("Dairy, Nuts").build(),

                // Golden Dragon Wok
                MenuItem.builder()
                        .restaurant(r4).category(catAsian)
                        .name("Tokyo Shoyu Ramen")
                        .description("Rich 12-hour broth, springy handmade noodles, braised chashu pork, seasoned ramen egg, scallions, nori.")
                        .price(new BigDecimal("429.00"))
                        .imageUrl("https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80")
                        .isVeg(false).isAvailable(true)
                        .caloriesKcal(510).proteinG(new BigDecimal("31.0")).carbsG(new BigDecimal("52.0")).fatG(new BigDecimal("18.0")).fiberG(new BigDecimal("3.0"))
                        .allergens("Gluten, Eggs, Soy").build(),

                MenuItem.builder()
                        .restaurant(r4).category(catDesserts)
                        .name("Belgian Dark Chocolate Lava Cake")
                        .description("Warm molten 70% dark chocolate center with a velvety crumb, dusted with fine sugar.")
                        .price(new BigDecimal("199.00"))
                        .imageUrl("https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80")
                        .isVeg(true).isAvailable(true)
                        .caloriesKcal(380).proteinG(new BigDecimal("6.0")).carbsG(new BigDecimal("42.0")).fatG(new BigDecimal("20.0")).fiberG(new BigDecimal("2.5"))
                        .allergens("Dairy, Gluten, Eggs").build()
        );

        menuItemRepository.saveAll(menuItems);
        System.out.println(">>> [FeastHub] Database Seeded Successfully with Restaurants, Dishes, AI Nutrition, and Demo Users!");
    }
}
