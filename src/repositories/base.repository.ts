import { PaginationMeta } from '../types';

export abstract class BaseRepository<T, CreateDTO, UpdateDTO> {
  protected constructor(protected readonly model: any) {}

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async findMany(
    args: { where?: any; orderBy?: any; include?: any },
    pagination?: { page: number; limit: number }
  ): Promise<{ data: T[]; meta?: PaginationMeta }> {
    const { where, orderBy, include } = args;

    if (!pagination) {
      const data = await this.model.findMany({ where, orderBy, include });
      return { data };
    }

    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [totalItems, data] = await Promise.all([
      this.model.count({ where }),
      this.model.findMany({
        where,
        orderBy,
        include,
        skip,
        take: limit
      })
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  }

  async create(data: CreateDTO): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string, data: UpdateDTO): Promise<T> {
    return this.model.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<T> {
    // Soft delete assuming model has deletedAt
    return this.model.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
