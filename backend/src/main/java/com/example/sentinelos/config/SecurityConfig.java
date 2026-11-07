package com.example.sentinelos.config;

import com.example.sentinelos.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/emergency/report").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/hospital/ambulances").hasAnyRole("ADMIN", "DISPATCHER", "HOSPITAL", "RESCUE_TEAM")
                        .requestMatchers("/api/emergency/all/**", "/api/emergency/all")
                            .hasAnyRole("ADMIN", "DISPATCHER", "RESCUE_TEAM", "HOSPITAL")
                        .requestMatchers(HttpMethod.GET, "/api/emergency/*")
                            .hasAnyRole("ADMIN", "DISPATCHER", "RESCUE_TEAM", "HOSPITAL")
                        .requestMatchers(HttpMethod.PUT, "/api/emergency/*/triage").hasRole("DISPATCHER")
                        .requestMatchers(HttpMethod.PUT, "/api/emergency/*/acknowledge").hasRole("RESCUE_TEAM")
                        .requestMatchers(HttpMethod.PUT, "/api/emergency/**").hasRole("DISPATCHER")
                        .requestMatchers(HttpMethod.GET, "/api/emergency/*/recommendations").hasRole("DISPATCHER")
                        .requestMatchers(HttpMethod.DELETE, "/api/emergency/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/hospital/add").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/hospital/ambulances").hasAnyRole("ADMIN", "HOSPITAL")
                        .requestMatchers(HttpMethod.POST, "/api/hospital/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/hospital/**")
                            .hasAnyRole("ADMIN", "HOSPITAL")
                        .requestMatchers(HttpMethod.POST, "/api/rescue/mission/*/team-response").hasRole("RESCUE_TEAM")
                        .requestMatchers(HttpMethod.POST, "/api/rescue/mission/*/hospital-response").hasRole("HOSPITAL")
                        .requestMatchers(HttpMethod.POST, "/api/rescue/mission/create").hasRole("DISPATCHER")
                        .requestMatchers(HttpMethod.PUT, "/api/rescue/mission/*/status").hasRole("RESCUE_TEAM")
                        .requestMatchers(HttpMethod.PUT, "/api/rescue/mission/*/eta").hasRole("RESCUE_TEAM")
                        .requestMatchers(HttpMethod.GET, "/api/rescue/mission/active")
                            .hasAnyRole("ADMIN", "DISPATCHER", "RESCUE_TEAM", "HOSPITAL")
                        .requestMatchers(HttpMethod.GET, "/api/rescue/mission/hospital/**")
                            .hasAnyRole("ADMIN", "DISPATCHER", "RESCUE_TEAM", "HOSPITAL")
                        .requestMatchers("/api/rescue/**")
                            .hasAnyRole("ADMIN", "DISPATCHER", "RESCUE_TEAM")
                        .requestMatchers(HttpMethod.POST, "/api/volunteer/task/**")
                            .hasAnyRole("ADMIN", "NGO")
                        .requestMatchers(HttpMethod.PUT, "/api/volunteer/task/*/assign/**")
                            .hasAnyRole("ADMIN", "NGO")
                        .requestMatchers(HttpMethod.PUT, "/api/volunteer/task/**")
                            .hasAnyRole("ADMIN", "NGO", "VOLUNTEER")
                        .requestMatchers(HttpMethod.GET, "/api/volunteer/task/{id}").hasAnyRole("ADMIN", "NGO")
                        .requestMatchers(HttpMethod.GET, "/api/volunteer/task/status/**", "/api/volunteer/task/emergency/**", "/api/volunteer/task/location/**").hasAnyRole("ADMIN", "NGO")
                        .requestMatchers(HttpMethod.GET, "/api/volunteer/task/volunteers")
                            .hasAnyRole("ADMIN", "NGO")
                        .requestMatchers("/api/volunteer/**")
                            .hasAnyRole("ADMIN", "NGO", "VOLUNTEER")
                        .requestMatchers("/actuator/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(java.util.Arrays.asList("*"));
        configuration.setAllowedMethods(java.util.Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(java.util.Arrays.asList("*"));
        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
