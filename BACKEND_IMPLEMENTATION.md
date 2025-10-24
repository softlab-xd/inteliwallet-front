# Guia de Implementação do Backend - InteliWallet
## Spring Boot + PostgreSQL

Este documento fornece um guia completo para implementar o backend do InteliWallet usando Spring Boot e PostgreSQL.

---

## 📋 Índice

1. [Configuração Inicial](#configuração-inicial)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Modelo de Dados](#modelo-de-dados)
4. [Implementação das Entidades](#implementação-das-entidades)
5. [Repositórios](#repositórios)
6. [Serviços](#serviços)
7. [Controladores (APIs)](#controladores-apis)
8. [Segurança e JWT](#segurança-e-jwt)
9. [Deploy e Produção](#deploy-e-produção)

---

## 1. Configuração Inicial

### Dependências (pom.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>

    <groupId>com.inteliwallet</groupId>
    <artifactId>inteliwallet-api</artifactId>
    <version>1.0.0</version>
    <name>InteliWallet API</name>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Boot Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Spring Boot Security -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- Spring Boot Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- PostgreSQL Driver -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.11.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- ModelMapper -->
        <dependency>
            <groupId>org.modelmapper</groupId>
            <artifactId>modelmapper</artifactId>
            <version>3.1.1</version>
        </dependency>

        <!-- Spring Boot Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### application.properties

```properties
# Application
spring.application.name=inteliwallet-api
server.port=3001

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/inteliwallet
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# JWT
jwt.secret=seu-secret-key-super-seguro-aqui-com-minimo-256-bits
jwt.expiration=86400000

# CORS
cors.allowed-origins=http://localhost:3000,http://localhost:3001

# API Prefix
server.servlet.context-path=/api
```

---

## 2. Estrutura do Projeto

```
src/main/java/com/inteliwallet/
├── InteliwalletApplication.java
├── config/
│   ├── CorsConfig.java
│   ├── SecurityConfig.java
│   └── ModelMapperConfig.java
├── controller/
│   ├── AuthController.java
│   ├── UserController.java
│   ├── TransactionController.java
│   ├── GoalController.java
│   ├── FriendController.java
│   └── GamificationController.java
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── TransactionRequest.java
│   │   └── GoalRequest.java
│   └── response/
│       ├── AuthResponse.java
│       ├── UserResponse.java
│       ├── TransactionResponse.java
│       └── ErrorResponse.java
├── entity/
│   ├── User.java
│   ├── Transaction.java
│   ├── Goal.java
│   ├── Friend.java
│   ├── FriendInvite.java
│   ├── Achievement.java
│   └── Challenge.java
├── repository/
│   ├── UserRepository.java
│   ├── TransactionRepository.java
│   ├── GoalRepository.java
│   ├── FriendRepository.java
│   ├── FriendInviteRepository.java
│   ├── AchievementRepository.java
│   └── ChallengeRepository.java
├── service/
│   ├── AuthService.java
│   ├── UserService.java
│   ├── TransactionService.java
│   ├── GoalService.java
│   ├── FriendService.java
│   └── GamificationService.java
├── security/
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── UserDetailsServiceImpl.java
└── exception/
    ├── GlobalExceptionHandler.java
    ├── ResourceNotFoundException.java
    └── BadRequestException.java
```

---

## 3. Modelo de Dados

### Diagrama ER (Entidades Principais)

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ id (PK)         │
│ username        │
│ email (unique)  │
│ password (hash) │
│ avatar          │
│ totalPoints     │
│ level           │
│ hasCompletedOB  │
│ createdAt       │
│ updatedAt       │
└─────────────────┘
        │
        │ 1:N
        ├──────────────┐
        ↓              ↓
┌─────────────────┐  ┌─────────────────┐
│  Transaction    │  │      Goal       │
├─────────────────┤  ├─────────────────┤
│ id (PK)         │  │ id (PK)         │
│ userId (FK)     │  │ userId (FK)     │
│ type            │  │ title           │
│ amount          │  │ targetAmount    │
│ title           │  │ currentAmount   │
│ category        │  │ category        │
│ date            │  │ deadline        │
│ createdAt       │  │ status          │
│ updatedAt       │  │ createdAt       │
└─────────────────┘  └─────────────────┘
```

---

## 4. Implementação das Entidades

### User.java

```java
package com.inteliwallet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(length = 10)
    private String avatar;

    @Column(nullable = false)
    private Integer totalPoints = 0;

    @Column(nullable = false)
    private Integer level = 1;

    @Column(nullable = false)
    private Boolean hasCompletedOnboarding = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Goal> goals = new ArrayList<>();
}
```

### Transaction.java

```java
package com.inteliwallet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private LocalDateTime date;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum TransactionType {
        INCOME, EXPENSE
    }
}
```

### Goal.java

```java
package com.inteliwallet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "goals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal targetAmount;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal currentAmount = BigDecimal.ZERO;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private LocalDateTime deadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GoalStatus status = GoalStatus.ACTIVE;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum GoalStatus {
        ACTIVE, COMPLETED, OVERDUE
    }
}
```

---

## 5. Repositórios

### UserRepository.java

```java
package com.inteliwallet.repository;

import com.inteliwallet.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Boolean existsByEmail(String email);
    Boolean existsByUsername(String username);
}
```

### TransactionRepository.java

```java
package com.inteliwallet.repository;

import com.inteliwallet.entity.Transaction;
import com.inteliwallet.entity.Transaction.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {

    List<Transaction> findByUserIdOrderByDateDesc(String userId);

    List<Transaction> findByUserIdAndType(String userId, TransactionType type);

    List<Transaction> findByUserIdAndDateBetween(
        String userId,
        LocalDateTime startDate,
        LocalDateTime endDate
    );

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type")
    BigDecimal sumAmountByUserIdAndType(
        @Param("userId") String userId,
        @Param("type") TransactionType type
    );
}
```

### GoalRepository.java

```java
package com.inteliwallet.repository;

import com.inteliwallet.entity.Goal;
import com.inteliwallet.entity.Goal.GoalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, String> {
    List<Goal> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Goal> findByUserIdAndStatus(String userId, GoalStatus status);
}
```

---

## 6. Serviços

### AuthService.java

```java
package com.inteliwallet.service;

import com.inteliwallet.dto.request.LoginRequest;
import com.inteliwallet.dto.request.RegisterRequest;
import com.inteliwallet.dto.response.AuthResponse;
import com.inteliwallet.entity.User;
import com.inteliwallet.exception.BadRequestException;
import com.inteliwallet.repository.UserRepository;
import com.inteliwallet.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Validate unique email and username
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email já está em uso");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Nome de usuário já está em uso");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAvatar("👤");
        user.setTotalPoints(0);
        user.setLevel(1);
        user.setHasCompletedOnboarding(false);

        user = userRepository.save(user);

        // Generate JWT token
        String token = tokenProvider.generateToken(user.getId());

        return new AuthResponse(token, mapToUserResponse(user));
    }

    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        // Get user
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new BadRequestException("Credenciais inválidas"));

        // Generate JWT token
        String token = tokenProvider.generateToken(user.getId());

        return new AuthResponse(token, mapToUserResponse(user));
    }

    private UserResponse mapToUserResponse(User user) {
        // Implementation to map User entity to UserResponse DTO
        // Use ModelMapper or manual mapping
        return new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getAvatar(),
            user.getCreatedAt().toString(),
            user.getTotalPoints(),
            user.getLevel(),
            user.getHasCompletedOnboarding()
        );
    }
}
```

### TransactionService.java

```java
package com.inteliwallet.service;

import com.inteliwallet.dto.request.TransactionRequest;
import com.inteliwallet.dto.response.TransactionResponse;
import com.inteliwallet.entity.Transaction;
import com.inteliwallet.entity.Transaction.TransactionType;
import com.inteliwallet.entity.User;
import com.inteliwallet.exception.ResourceNotFoundException;
import com.inteliwallet.repository.TransactionRepository;
import com.inteliwallet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<TransactionResponse> getUserTransactions(String userId) {
        return transactionRepository.findByUserIdOrderByDateDesc(userId)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public TransactionResponse createTransaction(String userId, TransactionRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setType(request.getType());
        transaction.setAmount(request.getAmount());
        transaction.setTitle(request.getTitle());
        transaction.setCategory(request.getCategory());
        transaction.setDate(request.getDate());

        transaction = transactionRepository.save(transaction);

        // Award points for creating transaction
        awardPointsForTransaction(user);

        return mapToResponse(transaction);
    }

    private void awardPointsForTransaction(User user) {
        user.setTotalPoints(user.getTotalPoints() + 5);
        // Check for level up
        int newLevel = calculateLevel(user.getTotalPoints());
        if (newLevel > user.getLevel()) {
            user.setLevel(newLevel);
        }
        userRepository.save(user);
    }

    private int calculateLevel(int points) {
        // Simple level calculation: 100 points per level
        return (points / 100) + 1;
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        // Map to DTO
        return new TransactionResponse(
            transaction.getId(),
            transaction.getType().name(),
            transaction.getAmount(),
            transaction.getTitle(),
            transaction.getCategory(),
            transaction.getDate().toString(),
            transaction.getCreatedAt().toString(),
            transaction.getUpdatedAt().toString()
        );
    }
}
```

---

## 7. Controladores (APIs)

### AuthController.java

```java
package com.inteliwallet.controller;

import com.inteliwallet.dto.request.LoginRequest;
import com.inteliwallet.dto.request.RegisterRequest;
import com.inteliwallet.dto.response.AuthResponse;
import com.inteliwallet.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // JWT é stateless, logout é gerenciado no frontend
        return ResponseEntity.noContent().build();
    }
}
```

### TransactionController.java

```java
package com.inteliwallet.controller;

import com.inteliwallet.dto.request.TransactionRequest;
import com.inteliwallet.dto.response.TransactionResponse;
import com.inteliwallet.security.CurrentUser;
import com.inteliwallet.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getTransactions(@CurrentUser String userId) {
        return ResponseEntity.ok(transactionService.getUserTransactions(userId));
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
        @CurrentUser String userId,
        @Valid @RequestBody TransactionRequest request
    ) {
        TransactionResponse response = transactionService.createTransaction(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
```

---

## 8. Segurança e JWT

### JwtTokenProvider.java

```java
package com.inteliwallet.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public String generateToken(String userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
            .setSubject(userId)
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(getSigningKey(), SignatureAlgorithm.HS512)
            .compact();
    }

    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }
}
```

### SecurityConfig.java

```java
package com.inteliwallet.config;

import com.inteliwallet.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests()
                .requestMatchers("/auth/**").permitAll()
                .anyRequest().authenticated()
            .and()
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
        AuthenticationConfiguration authConfig
    ) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
```

---

## 9. Deploy e Produção

### Docker Compose (desenvolvimento)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: inteliwallet
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/inteliwallet
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### Dockerfile

```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 3001
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 📝 Checklist de Implementação

- [ ] Configurar projeto Spring Boot
- [ ] Configurar PostgreSQL local
- [ ] Implementar entidades (User, Transaction, Goal)
- [ ] Implementar repositórios
- [ ] Implementar serviços de negócio
- [ ] Implementar segurança JWT
- [ ] Implementar endpoints REST
- [ ] Adicionar validações
- [ ] Implementar tratamento de erros
- [ ] Testar todos os endpoints
- [ ] Documentar API (Swagger/OpenAPI)
- [ ] Configurar CORS
- [ ] Deploy em produção

---

## 🔗 Recursos Adicionais

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security](https://spring.io/projects/spring-security)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/)

---

**Desenvolvido para InteliWallet** 🚀
