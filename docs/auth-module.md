# Authentication Module Documentation

## 1. Module Structure (auth.module.ts)

### Imports
```typescript
imports: [
  UserModule,
  PassportModule,
  JwtModule.registerAsync({...}),
  EmailModule,
]
```

**Benefits:**
- `UserModule`: For user information and operations
- `PassportModule`: For authentication strategies
- `JwtModule`: For JWT token handling
- `EmailModule`: For sending emails

### Providers
```typescript
providers: [
  AuthService,
  LocalStrategy,
  JwtStrategy,
  {
    provide: APP_GUARD,
    useClass: GlobalAuthGuard,
  },
  {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },
]
```

**Benefits:**
- Centralized service declarations
- Automatic guard application
- Dependency Injection advantages
- Clean architecture

## 2. Guards (Security)

### JwtAuthGuard
```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```
**Usage:**
- Protects routes from unauthorized access
- Validates JWT tokens
- Use with `@UseGuards(JwtAuthGuard)` decorator
- Automatic token verification

### RolesGuard
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Checks user roles
  }
}
```
**Benefits:**
- Role-based access control
- Flexible permission system
- Easy to extend
- Secure route protection

### LocalAuthGuard
```typescript
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
```
**Usage:**
- Validates username/password during login
- Integrates with Passport.js
- Handles credential verification

## 3. Decorators

### @Public()
```typescript
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```
**Usage:**
- Marks routes as public
- Bypasses authentication
- Clear route designation
- Easy to maintain

### @Roles()
```typescript
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
```
**Benefits:**
- Defines route access permissions
- Supports multiple roles
- Enhances code readability
- Type-safe role assignment

### @CurrentUser()
```typescript
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```
**Usage:**
- Easy access to current user
- Type-safe user data
- Clean controller methods
- Reduces code duplication

## 4. DTOs (Data Transfer Objects)

### LoginDto
```typescript
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```
**Benefits:**
- Request validation
- Type safety
- API documentation
- Clear data structure

### RegisterDto
```typescript
export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```
**Benefits:**
- Strong type checking
- Input validation
- Swagger documentation
- Error prevention

## 5. Strategies

### LocalStrategy
```typescript
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  async validate(email: string, password: string): Promise<any> {
    // Validates user credentials
  }
}
```
**Usage:**
- Handles login authentication
- Password verification
- User validation
- Security enforcement

### JwtStrategy
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  async validate(payload: JwtPayload) {
    // Validates JWT token
  }
}
```
**Benefits:**
- Token validation
- User authentication
- Route protection
- Session management

## 6. Services

### AuthService Methods
```typescript
- validateUser()
- login()
- register()
- verifyEmail()
- forgotPassword()
- resetPassword()
```
**Benefits:**
- Business logic separation
- Code reusability
- Easy testing
- Clean architecture

## 7. Controllers

### Routes
```typescript
@Post('login')
@Post('register')
@Post('verify-email')
@Post('forgot-password')
@Post('reset-password')
@Get('refresh')
```
**Benefits:**
- Clear API structure
- Route protection
- Documentation
- Request handling

## 8. Security Features

1. **Password Security:**
   - Bcrypt hashing
   - Salt rounds configuration
   - Secure storage
   - Password policies

2. **Token Management:**
   - JWT implementation
   - Token expiration
   - Refresh mechanism
   - Secure transmission

3. **Email Verification:**
   - Token generation
   - Secure links
   - Expiration handling
   - User verification

4. **Error Handling:**
   - Secure error messages
   - Proper status codes
   - Validation errors
   - Exception filters