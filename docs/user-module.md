# User Module Documentation

## 1. Module Structure (user.module.ts)

### Imports
```typescript
imports: [
  TypeOrmModule.forFeature([User, FriendRequest]),
]
```

**Benefits:**
- `TypeOrmModule`: Registers database entities
- Automatic repository injection
- Database operations setup
- Entity management

### Providers & Controllers
```typescript
providers: [
  UserService,
  FriendRequestService
],
controllers: [
  UserController,
  FriendRequestController
]
```

**Benefits:**
- Clear separation of concerns
- Modular architecture
- Easy testing
- Clean code structure

## 2. Entities

### User Entity
```typescript
@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  // ... other fields
}
```

**Benefits:**
- Strong type checking
- Database schema definition
- Validation rules
- Relationship management

### FriendRequest Entity
```typescript
@Entity()
export class FriendRequest extends BaseEntity {
  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => User)
  receiver: User;

  @Column({ type: 'enum' })
  status: FriendRequestStatus;
}
```

**Benefits:**
- Relationship management
- Type safety
- Easy querying
- Clear structure

## 3. DTOs (Data Transfer Objects)

### CreateUserDto
```typescript
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

**Benefits:**
- Input validation
- Type safety
- API documentation
- Request validation

### UpdateUserDto
```typescript
export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

**Benefits:**
- Reuse validation rules
- Partial updates
- Type inheritance
- Code reusability

## 4. Services

### UserService Methods
```typescript
- create()
- findAll()
- findOne()
- update()
- remove()
- findByEmail()
```

**Benefits:**
- Business logic separation
- Database operations
- Error handling
- Code organization

### FriendRequestService Methods
```typescript
- sendFriendRequest()
- acceptFriendRequest()
- rejectFriendRequest()
- getFriendRequests()
```

**Benefits:**
- Friend system logic
- Status management
- Relationship handling
- Clean implementation

## 5. Controllers

### UserController Routes
```typescript
@Get()
@Get(':id')
@Post()
@Patch(':id')
@Delete(':id')
```

**Benefits:**
- RESTful API design
- Route protection
- Input validation
- Response formatting

### FriendRequestController Routes
```typescript
@Post('send')
@Post(':id/accept')
@Post(':id/reject')
@Get('pending')
```

**Benefits:**
- Clear API structure
- Friend system endpoints
- Protected routes
- Request handling

## 6. Query Building

### Advanced Queries
```typescript
findOne(conditions: any) {
  let query = this.userRepo.createQueryBuilder('user');
  // ... query building logic
}
```

**Benefits:**
- Complex queries
- Performance optimization
- Flexible searching
- Relationship loading

## 7. Pagination

```typescript
async findAll(page: number = 1, limit: number = 10) {
  const [users, total] = await this.userRepo.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
  });
  return {
    data: users,
    meta: {
      total,
      page,
      limit,
    }
  };
}
```

**Benefits:**
- Performance optimization
- Large data handling
- Better user experience
- Resource management

## 8. Error Handling

```typescript
@Catch(TypeOrmError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: TypeOrmError, host: ArgumentsHost) {
    // Error handling logic
  }
}
```

**Benefits:**
- Centralized error handling
- Custom error responses
- Better debugging
- User-friendly errors

## 9. Security Features

1. **Data Protection:**
   - Password hashing
   - Data encryption
   - Input validation
   - Access control

2. **Request Validation:**
   - DTO validation
   - Type checking
   - Input sanitization
   - Error handling

3. **Response Formatting:**
   - Consistent structure
   - Data transformation
   - Error formatting
   - Status codes

4. **Access Control:**
   - Role-based access
   - Permission checking
   - Route protection
   - Data filtering