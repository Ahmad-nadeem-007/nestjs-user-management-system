import { Repository, SelectQueryBuilder } from 'typeorm';

import { PaginatedResult } from '../types/pagination.types';
import { PaginationDto } from '../dto/pagination.dto';
export async function paginate<T extends Record<string, any>>(
  repository: Repository<T> | SelectQueryBuilder<T>,
  options: PaginationDto,
  relations: string[] = [],
  where?: any,
  sort?: (query: SelectQueryBuilder<T>) => void,
): Promise<PaginatedResult<T>> {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  let query: SelectQueryBuilder<T>;

  if (repository instanceof Repository) {
    query = repository.createQueryBuilder('entity');
  } else {
    query = repository;
  }

  // Add relations if provided
  if (relations.length) {
    relations.forEach((relation) => {
      query = query.leftJoinAndSelect(`entity.${relation}`, relation);
    });
  }
// Apply where conditions (agar diye gaye hain)
if (where) {
  query.where(where);
}
  // Apply custom sorting if provided
  if (sort) {
    sort(query);
  } else {
    // Default sorting by createdAt DESC if the entity has this field
    try {
      query.orderBy('entity.createdAt', 'DESC');
    } catch (error) {
      // Ignore if createdAt doesn't exist
    }
  }

  const [data, total] = await query
    .take(limit)
    .skip(skip)
    .getManyAndCount();

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    totalPages,
    page,
    limit,
  };
}
