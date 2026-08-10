/**
 * Generic repository contracts.
 *
 * Phase 1 §3: "Repositories never contain business rules or authorization
 * checks" and "Services never touch the database directly — always through
 * a repository." No concrete repositories exist yet — those are built
 * module-by-module in future milestones (`resources/resources.repository.ts`,
 * `orders/orders.repository.ts`, etc.), each injecting `PrismaService` and
 * implementing the interface below for its own entity.
 *
 * These interfaces are intentionally generic over Prisma's own generated
 * input/where types (`CreateInput`, `WhereUniqueInput`, ...) rather than
 * hand-rolled DTOs, so a concrete repository's method signatures line up
 * exactly with `PrismaService.<model>.*` without a duplicate, driftable
 * type definition.
 */

export interface FindManyOptions<WhereInput, OrderByInput> {
  where?: WhereInput;
  orderBy?: OrderByInput;
  skip?: number;
  take?: number;
}

/**
 * The baseline every entity repository implements: find one, find many,
 * create, update. Delete is deliberately NOT part of this base interface —
 * Section 9 (Soft Delete Strategy) means different entities delete in
 * different ways (or, for financial records, not at all), so delete
 * capability is opted into via `SoftDeletableRepository` /
 * `HardDeletableRepository` below, never assumed.
 */
export interface BaseRepository<
  Entity,
  CreateInput,
  UpdateInput,
  WhereUniqueInput,
  WhereInput = unknown,
  OrderByInput = unknown,
> {
  findById(id: string): Promise<Entity | null>;
  findUnique(where: WhereUniqueInput): Promise<Entity | null>;
  findMany(options?: FindManyOptions<WhereInput, OrderByInput>): Promise<Entity[]>;
  count(where?: WhereInput): Promise<number>;
  create(data: CreateInput): Promise<Entity>;
  update(where: WhereUniqueInput, data: UpdateInput): Promise<Entity>;
}

/**
 * Section 9's soft-delete entities (Resource, User, Review, Subject,
 * Branch, Course, University, ...). The Bible does not standardize the
 * exact soft-delete field across entities (some use a `status` enum value,
 * some an `archivedAt`/`closedAt`/`deletedAt` timestamp — see
 * `database/utils/soft-delete.util.ts`), so this interface only fixes the
 * *shape* of the operation, not the underlying column; each concrete
 * repository implements it using whichever field its own entity uses.
 */
export interface SoftDeletableRepository<Entity> {
  softDelete(id: string, deletedById?: string): Promise<Entity>;
}

/**
 * Section 9's genuine hard-delete entities (unused Coupons, expired
 * Sessions, Notifications past their retention window).
 */
export interface HardDeletableRepository<Entity> {
  hardDelete(id: string): Promise<Entity>;
}

/**
 * Section 2/Section 9 append-only entities (Download Log, Audit Log) —
 * create + read only, by construction. Deliberately has no update/delete
 * methods at all, so a future service can't accidentally mutate a record
 * whose entire purpose is to be a permanent, unedited record.
 */
export interface AppendOnlyRepository<
  Entity,
  CreateInput,
  WhereInput = unknown,
  OrderByInput = unknown,
> {
  findById(id: string): Promise<Entity | null>;
  findMany(options?: FindManyOptions<WhereInput, OrderByInput>): Promise<Entity[]>;
  create(data: CreateInput): Promise<Entity>;
}
