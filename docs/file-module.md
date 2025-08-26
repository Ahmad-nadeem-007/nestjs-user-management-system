# File Module Documentation

## 1. Module Structure (file.module.ts)

### Imports
```typescript
imports: [
  MulterModule.register({
    storage: memoryStorage(),
  }),
]
```

**Benefits:**
- `MulterModule`: For file upload handling
- Memory storage for better performance
- File processing flexibility
- Efficient file handling

### Providers
```typescript
providers: [
  FileService
],
controllers: [
  FileController
]
```

**Benefits:**
- File handling logic separation
- Clean architecture
- Easy testing
- Modular design

## 2. Services

### FileService Methods
```typescript
export class FileService {
  async saveFile(file: Express.Multer.File): Promise<string> {
    // File saving logic
  }

  async getFile(fileName: string): Promise<Buffer> {
    // File retrieval logic
  }

  async deleteFile(fileName: string): Promise<void> {
    // File deletion logic
  }

  async listFiles(): Promise<string[]> {
    // List all files
  }
}
```

**Benefits:**
- Centralized file operations
- Error handling
- Security checks
- File management

## 3. Controllers

### FileController Routes
```typescript
@Post('upload')
@Get(':fileName')
@Delete(':fileName')
@Get()
```

**Benefits:**
- Clear API endpoints
- File operations
- Access control
- Documentation

## 4. File Upload Features

### Upload Configuration
```typescript
@UseInterceptors(FileInterceptor('file'))
@Post('upload')
async uploadFile(
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
        new FileTypeValidator({ fileType: '.(png|jpeg|jpg|gif|pdf)' }),
      ],
    }),
  )
  file: Express.Multer.File,
) {
  return this.fileService.saveFile(file);
}
```

**Benefits:**
- File validation
- Size limits
- Type checking
- Security measures

## 5. File Storage Management

### Storage Configuration
```typescript
private readonly uploadDir = 'uploads';

private async ensureUploadDirectoryExists() {
  try {
    await fs.access(this.uploadDir);
  } catch {
    await fs.mkdir(this.uploadDir, { recursive: true });
  }
}
```

**Benefits:**
- Organized storage
- Directory management
- Error prevention
- File structure

## 6. Security Features

### Access Control
```typescript
@UseGuards(JwtAuthGuard)
@Roles(UserRole.ADMIN)
```

**Benefits:**
- Authentication required
- Role-based access
- Secure operations
- Authorization

### File Validation
```typescript
new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
    new FileTypeValidator({ fileType: '.(png|jpeg|jpg|gif|pdf)' }),
  ],
})
```

**Benefits:**
- Size restrictions
- Type validation
- Security checks
- Error prevention

## 7. Error Handling

```typescript
try {
  await fs.access(filePath);
} catch {
  throw new NotFoundException('File not found');
}
```

**Benefits:**
- Proper error messages
- Security
- User feedback
- Debugging support

## 8. File Response Handling

### Stream Response
```typescript
@Get(':fileName')
async getFile(@Param('fileName') fileName: string, @Res() res: Response) {
  const file = await this.fileService.getFile(fileName);
  res.send(file);
}
```

**Benefits:**
- Efficient streaming
- Memory optimization
- Proper content types
- Better performance

## 9. API Documentation

### Swagger Configuration
```typescript
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  },
})
```

**Benefits:**
- Clear documentation
- API testing support
- Developer friendly
- Integration support

## 10. Best Practices

1. **File Handling:**
   - Secure storage
   - Type validation
   - Size limits
   - Clean up routines

2. **Security:**
   - Access control
   - File validation
   - Error handling
   - Safe storage

3. **Performance:**
   - Stream processing
   - Memory management
   - Efficient storage
   - Quick retrieval

4. **Organization:**
   - Clear structure
   - Easy maintenance
   - Scalable design
   - Clean code