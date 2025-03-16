package com.tracker.ApiGatewayService;

import com.tracker.ApiGatewayService.filters.JwtAuthGatewayFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayServiceApplication.class, args);
	}

	@Bean
	public RouteLocator gatewayRoutes(RouteLocatorBuilder builder, JwtAuthGatewayFilter jwtAuthFilter) {
		return builder.routes()
				.route("UserService", r -> r.path("/api/users/**")
						.filters(f -> f.filter(jwtAuthFilter.apply(new JwtAuthGatewayFilter.Config())))
						.uri("http://localhost:8081"))
				.route("AuthService", r -> r.path("/auth/**")
						.uri("http://localhost:8081"))
				.build();
	}
}
