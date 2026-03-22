
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Complaint
 * 
 */
export type Complaint = $Result.DefaultSelection<Prisma.$ComplaintPayload>
/**
 * Model Attachment
 * 
 */
export type Attachment = $Result.DefaultSelection<Prisma.$AttachmentPayload>
/**
 * Model StatusHistory
 * 
 */
export type StatusHistory = $Result.DefaultSelection<Prisma.$StatusHistoryPayload>
/**
 * Model Upvote
 * 
 */
export type Upvote = $Result.DefaultSelection<Prisma.$UpvotePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  USER: 'USER',
  OFFICIAL: 'OFFICIAL',
  ADMIN: 'ADMIN'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const ComplaintCategory: {
  ROADS: 'ROADS',
  WATER: 'WATER',
  ELECTRICITY: 'ELECTRICITY',
  SANITATION: 'SANITATION',
  PUBLIC_SAFETY: 'PUBLIC_SAFETY',
  TRANSPORTATION: 'TRANSPORTATION',
  OTHER: 'OTHER'
};

export type ComplaintCategory = (typeof ComplaintCategory)[keyof typeof ComplaintCategory]


export const ComplaintStatus: {
  PENDING: 'PENDING',
  ACKNOWLEDGED: 'ACKNOWLEDGED',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
  CLOSED: 'CLOSED'
};

export type ComplaintStatus = (typeof ComplaintStatus)[keyof typeof ComplaintStatus]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type ComplaintCategory = $Enums.ComplaintCategory

export const ComplaintCategory: typeof $Enums.ComplaintCategory

export type ComplaintStatus = $Enums.ComplaintStatus

export const ComplaintStatus: typeof $Enums.ComplaintStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.complaint`: Exposes CRUD operations for the **Complaint** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Complaints
    * const complaints = await prisma.complaint.findMany()
    * ```
    */
  get complaint(): Prisma.ComplaintDelegate<ExtArgs>;

  /**
   * `prisma.attachment`: Exposes CRUD operations for the **Attachment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Attachments
    * const attachments = await prisma.attachment.findMany()
    * ```
    */
  get attachment(): Prisma.AttachmentDelegate<ExtArgs>;

  /**
   * `prisma.statusHistory`: Exposes CRUD operations for the **StatusHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StatusHistories
    * const statusHistories = await prisma.statusHistory.findMany()
    * ```
    */
  get statusHistory(): Prisma.StatusHistoryDelegate<ExtArgs>;

  /**
   * `prisma.upvote`: Exposes CRUD operations for the **Upvote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Upvotes
    * const upvotes = await prisma.upvote.findMany()
    * ```
    */
  get upvote(): Prisma.UpvoteDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.15.0
   * Query Engine version: 12e25d8d06f6ea5a0252864dd9a03b1bb51f3022
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray | { toJSON(): unknown }

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Complaint: 'Complaint',
    Attachment: 'Attachment',
    StatusHistory: 'StatusHistory',
    Upvote: 'Upvote'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'user' | 'complaint' | 'attachment' | 'statusHistory' | 'upvote'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>,
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>,
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Complaint: {
        payload: Prisma.$ComplaintPayload<ExtArgs>
        fields: Prisma.ComplaintFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ComplaintFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ComplaintPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ComplaintFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ComplaintPayload>
          }
          findFirst: {
            args: Prisma.ComplaintFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ComplaintPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ComplaintFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ComplaintPayload>
          }
          findMany: {
            args: Prisma.ComplaintFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ComplaintPayload>[]
          }
          create: {
            args: Prisma.ComplaintCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ComplaintPayload>
          }
          createMany: {
            args: Prisma.ComplaintCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ComplaintCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ComplaintPayload>[]
          }
          delete: {
            args: Prisma.ComplaintDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ComplaintPayload>
          }
          update: {
            args: Prisma.ComplaintUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ComplaintPayload>
          }
          deleteMany: {
            args: Prisma.ComplaintDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.ComplaintUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.ComplaintUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ComplaintPayload>
          }
          aggregate: {
            args: Prisma.ComplaintAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateComplaint>
          }
          groupBy: {
            args: Prisma.ComplaintGroupByArgs<ExtArgs>,
            result: $Utils.Optional<ComplaintGroupByOutputType>[]
          }
          count: {
            args: Prisma.ComplaintCountArgs<ExtArgs>,
            result: $Utils.Optional<ComplaintCountAggregateOutputType> | number
          }
        }
      }
      Attachment: {
        payload: Prisma.$AttachmentPayload<ExtArgs>
        fields: Prisma.AttachmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AttachmentFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AttachmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AttachmentFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AttachmentPayload>
          }
          findFirst: {
            args: Prisma.AttachmentFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AttachmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AttachmentFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AttachmentPayload>
          }
          findMany: {
            args: Prisma.AttachmentFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AttachmentPayload>[]
          }
          create: {
            args: Prisma.AttachmentCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AttachmentPayload>
          }
          createMany: {
            args: Prisma.AttachmentCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AttachmentCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AttachmentPayload>[]
          }
          delete: {
            args: Prisma.AttachmentDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AttachmentPayload>
          }
          update: {
            args: Prisma.AttachmentUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AttachmentPayload>
          }
          deleteMany: {
            args: Prisma.AttachmentDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.AttachmentUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.AttachmentUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AttachmentPayload>
          }
          aggregate: {
            args: Prisma.AttachmentAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateAttachment>
          }
          groupBy: {
            args: Prisma.AttachmentGroupByArgs<ExtArgs>,
            result: $Utils.Optional<AttachmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.AttachmentCountArgs<ExtArgs>,
            result: $Utils.Optional<AttachmentCountAggregateOutputType> | number
          }
        }
      }
      StatusHistory: {
        payload: Prisma.$StatusHistoryPayload<ExtArgs>
        fields: Prisma.StatusHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StatusHistoryFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$StatusHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StatusHistoryFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$StatusHistoryPayload>
          }
          findFirst: {
            args: Prisma.StatusHistoryFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$StatusHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StatusHistoryFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$StatusHistoryPayload>
          }
          findMany: {
            args: Prisma.StatusHistoryFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$StatusHistoryPayload>[]
          }
          create: {
            args: Prisma.StatusHistoryCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$StatusHistoryPayload>
          }
          createMany: {
            args: Prisma.StatusHistoryCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StatusHistoryCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$StatusHistoryPayload>[]
          }
          delete: {
            args: Prisma.StatusHistoryDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$StatusHistoryPayload>
          }
          update: {
            args: Prisma.StatusHistoryUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$StatusHistoryPayload>
          }
          deleteMany: {
            args: Prisma.StatusHistoryDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.StatusHistoryUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.StatusHistoryUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$StatusHistoryPayload>
          }
          aggregate: {
            args: Prisma.StatusHistoryAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateStatusHistory>
          }
          groupBy: {
            args: Prisma.StatusHistoryGroupByArgs<ExtArgs>,
            result: $Utils.Optional<StatusHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.StatusHistoryCountArgs<ExtArgs>,
            result: $Utils.Optional<StatusHistoryCountAggregateOutputType> | number
          }
        }
      }
      Upvote: {
        payload: Prisma.$UpvotePayload<ExtArgs>
        fields: Prisma.UpvoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UpvoteFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UpvotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UpvoteFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UpvotePayload>
          }
          findFirst: {
            args: Prisma.UpvoteFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UpvotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UpvoteFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UpvotePayload>
          }
          findMany: {
            args: Prisma.UpvoteFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UpvotePayload>[]
          }
          create: {
            args: Prisma.UpvoteCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UpvotePayload>
          }
          createMany: {
            args: Prisma.UpvoteCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UpvoteCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UpvotePayload>[]
          }
          delete: {
            args: Prisma.UpvoteDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UpvotePayload>
          }
          update: {
            args: Prisma.UpvoteUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UpvotePayload>
          }
          deleteMany: {
            args: Prisma.UpvoteDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.UpvoteUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.UpvoteUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UpvotePayload>
          }
          aggregate: {
            args: Prisma.UpvoteAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateUpvote>
          }
          groupBy: {
            args: Prisma.UpvoteGroupByArgs<ExtArgs>,
            result: $Utils.Optional<UpvoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.UpvoteCountArgs<ExtArgs>,
            result: $Utils.Optional<UpvoteCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    complaints: number
    assignedComplaints: number
    attachments: number
    statusHistories: number
    upvotes: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    complaints?: boolean | UserCountOutputTypeCountComplaintsArgs
    assignedComplaints?: boolean | UserCountOutputTypeCountAssignedComplaintsArgs
    attachments?: boolean | UserCountOutputTypeCountAttachmentsArgs
    statusHistories?: boolean | UserCountOutputTypeCountStatusHistoriesArgs
    upvotes?: boolean | UserCountOutputTypeCountUpvotesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountComplaintsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ComplaintWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAssignedComplaintsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ComplaintWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAttachmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AttachmentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountStatusHistoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StatusHistoryWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUpvotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UpvoteWhereInput
  }


  /**
   * Count Type ComplaintCountOutputType
   */

  export type ComplaintCountOutputType = {
    attachments: number
    statusHistory: number
    upvotes: number
  }

  export type ComplaintCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attachments?: boolean | ComplaintCountOutputTypeCountAttachmentsArgs
    statusHistory?: boolean | ComplaintCountOutputTypeCountStatusHistoryArgs
    upvotes?: boolean | ComplaintCountOutputTypeCountUpvotesArgs
  }

  // Custom InputTypes
  /**
   * ComplaintCountOutputType without action
   */
  export type ComplaintCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComplaintCountOutputType
     */
    select?: ComplaintCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ComplaintCountOutputType without action
   */
  export type ComplaintCountOutputTypeCountAttachmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AttachmentWhereInput
  }

  /**
   * ComplaintCountOutputType without action
   */
  export type ComplaintCountOutputTypeCountStatusHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StatusHistoryWhereInput
  }

  /**
   * ComplaintCountOutputType without action
   */
  export type ComplaintCountOutputTypeCountUpvotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UpvoteWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    failedLoginAttempts: number | null
  }

  export type UserSumAggregateOutputType = {
    failedLoginAttempts: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    name: string | null
    phone: string | null
    role: $Enums.UserRole | null
    avatar: string | null
    emailVerified: Date | null
    failedLoginAttempts: number | null
    lockedUntil: Date | null
    lastLoginAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    name: string | null
    phone: string | null
    role: $Enums.UserRole | null
    avatar: string | null
    emailVerified: Date | null
    failedLoginAttempts: number | null
    lockedUntil: Date | null
    lastLoginAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    name: number
    phone: number
    role: number
    avatar: number
    emailVerified: number
    failedLoginAttempts: number
    lockedUntil: number
    lastLoginAt: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    failedLoginAttempts?: true
  }

  export type UserSumAggregateInputType = {
    failedLoginAttempts?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    phone?: true
    role?: true
    avatar?: true
    emailVerified?: true
    failedLoginAttempts?: true
    lockedUntil?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    phone?: true
    role?: true
    avatar?: true
    emailVerified?: true
    failedLoginAttempts?: true
    lockedUntil?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    phone?: true
    role?: true
    avatar?: true
    emailVerified?: true
    failedLoginAttempts?: true
    lockedUntil?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    password: string
    name: string
    phone: string | null
    role: $Enums.UserRole
    avatar: string | null
    emailVerified: Date | null
    failedLoginAttempts: number
    lockedUntil: Date | null
    lastLoginAt: Date | null
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    phone?: boolean
    role?: boolean
    avatar?: boolean
    emailVerified?: boolean
    failedLoginAttempts?: boolean
    lockedUntil?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    complaints?: boolean | User$complaintsArgs<ExtArgs>
    assignedComplaints?: boolean | User$assignedComplaintsArgs<ExtArgs>
    attachments?: boolean | User$attachmentsArgs<ExtArgs>
    statusHistories?: boolean | User$statusHistoriesArgs<ExtArgs>
    upvotes?: boolean | User$upvotesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    phone?: boolean
    role?: boolean
    avatar?: boolean
    emailVerified?: boolean
    failedLoginAttempts?: boolean
    lockedUntil?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    phone?: boolean
    role?: boolean
    avatar?: boolean
    emailVerified?: boolean
    failedLoginAttempts?: boolean
    lockedUntil?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    complaints?: boolean | User$complaintsArgs<ExtArgs>
    assignedComplaints?: boolean | User$assignedComplaintsArgs<ExtArgs>
    attachments?: boolean | User$attachmentsArgs<ExtArgs>
    statusHistories?: boolean | User$statusHistoriesArgs<ExtArgs>
    upvotes?: boolean | User$upvotesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      complaints: Prisma.$ComplaintPayload<ExtArgs>[]
      assignedComplaints: Prisma.$ComplaintPayload<ExtArgs>[]
      attachments: Prisma.$AttachmentPayload<ExtArgs>[]
      statusHistories: Prisma.$StatusHistoryPayload<ExtArgs>[]
      upvotes: Prisma.$UpvotePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      name: string
      phone: string | null
      role: $Enums.UserRole
      avatar: string | null
      emailVerified: Date | null
      failedLoginAttempts: number
      lockedUntil: Date | null
      lastLoginAt: Date | null
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UserFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UserFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends UserFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
    **/
    create<T extends UserCreateArgs<ExtArgs>>(
      args: SelectSubset<T, UserCreateArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends UserCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends UserCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
    **/
    delete<T extends UserDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, UserDeleteArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UserUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, UserUpdateArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UserDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UserUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
    **/
    upsert<T extends UserUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, UserUpsertArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    complaints<T extends User$complaintsArgs<ExtArgs> = {}>(args?: Subset<T, User$complaintsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ComplaintPayload<ExtArgs>, T, 'findMany'> | Null>;

    assignedComplaints<T extends User$assignedComplaintsArgs<ExtArgs> = {}>(args?: Subset<T, User$assignedComplaintsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ComplaintPayload<ExtArgs>, T, 'findMany'> | Null>;

    attachments<T extends User$attachmentsArgs<ExtArgs> = {}>(args?: Subset<T, User$attachmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, 'findMany'> | Null>;

    statusHistories<T extends User$statusHistoriesArgs<ExtArgs> = {}>(args?: Subset<T, User$statusHistoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, 'findMany'> | Null>;

    upvotes<T extends User$upvotesArgs<ExtArgs> = {}>(args?: Subset<T, User$upvotesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UpvotePayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'DateTime'>
    readonly failedLoginAttempts: FieldRef<"User", 'Int'>
    readonly lockedUntil: FieldRef<"User", 'DateTime'>
    readonly lastLoginAt: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly deletedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.complaints
   */
  export type User$complaintsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Complaint
     */
    select?: ComplaintSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplaintInclude<ExtArgs> | null
    where?: ComplaintWhereInput
    orderBy?: ComplaintOrderByWithRelationInput | ComplaintOrderByWithRelationInput[]
    cursor?: ComplaintWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ComplaintScalarFieldEnum | ComplaintScalarFieldEnum[]
  }

  /**
   * User.assignedComplaints
   */
  export type User$assignedComplaintsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Complaint
     */
    select?: ComplaintSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplaintInclude<ExtArgs> | null
    where?: ComplaintWhereInput
    orderBy?: ComplaintOrderByWithRelationInput | ComplaintOrderByWithRelationInput[]
    cursor?: ComplaintWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ComplaintScalarFieldEnum | ComplaintScalarFieldEnum[]
  }

  /**
   * User.attachments
   */
  export type User$attachmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttachmentInclude<ExtArgs> | null
    where?: AttachmentWhereInput
    orderBy?: AttachmentOrderByWithRelationInput | AttachmentOrderByWithRelationInput[]
    cursor?: AttachmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AttachmentScalarFieldEnum | AttachmentScalarFieldEnum[]
  }

  /**
   * User.statusHistories
   */
  export type User$statusHistoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusHistory
     */
    select?: StatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StatusHistoryInclude<ExtArgs> | null
    where?: StatusHistoryWhereInput
    orderBy?: StatusHistoryOrderByWithRelationInput | StatusHistoryOrderByWithRelationInput[]
    cursor?: StatusHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StatusHistoryScalarFieldEnum | StatusHistoryScalarFieldEnum[]
  }

  /**
   * User.upvotes
   */
  export type User$upvotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Upvote
     */
    select?: UpvoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UpvoteInclude<ExtArgs> | null
    where?: UpvoteWhereInput
    orderBy?: UpvoteOrderByWithRelationInput | UpvoteOrderByWithRelationInput[]
    cursor?: UpvoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UpvoteScalarFieldEnum | UpvoteScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Complaint
   */

  export type AggregateComplaint = {
    _count: ComplaintCountAggregateOutputType | null
    _avg: ComplaintAvgAggregateOutputType | null
    _sum: ComplaintSumAggregateOutputType | null
    _min: ComplaintMinAggregateOutputType | null
    _max: ComplaintMaxAggregateOutputType | null
  }

  export type ComplaintAvgAggregateOutputType = {
    priority: number | null
  }

  export type ComplaintSumAggregateOutputType = {
    priority: number | null
  }

  export type ComplaintMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    category: $Enums.ComplaintCategory | null
    status: $Enums.ComplaintStatus | null
    priority: number | null
    userId: string | null
    assignedToId: string | null
    resolvedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type ComplaintMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    category: $Enums.ComplaintCategory | null
    status: $Enums.ComplaintStatus | null
    priority: number | null
    userId: string | null
    assignedToId: string | null
    resolvedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type ComplaintCountAggregateOutputType = {
    id: number
    title: number
    description: number
    category: number
    status: number
    location: number
    priority: number
    userId: number
    assignedToId: number
    resolvedAt: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type ComplaintAvgAggregateInputType = {
    priority?: true
  }

  export type ComplaintSumAggregateInputType = {
    priority?: true
  }

  export type ComplaintMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    category?: true
    status?: true
    priority?: true
    userId?: true
    assignedToId?: true
    resolvedAt?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type ComplaintMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    category?: true
    status?: true
    priority?: true
    userId?: true
    assignedToId?: true
    resolvedAt?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type ComplaintCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    category?: true
    status?: true
    location?: true
    priority?: true
    userId?: true
    assignedToId?: true
    resolvedAt?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type ComplaintAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Complaint to aggregate.
     */
    where?: ComplaintWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Complaints to fetch.
     */
    orderBy?: ComplaintOrderByWithRelationInput | ComplaintOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ComplaintWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Complaints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Complaints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Complaints
    **/
    _count?: true | ComplaintCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ComplaintAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ComplaintSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ComplaintMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ComplaintMaxAggregateInputType
  }

  export type GetComplaintAggregateType<T extends ComplaintAggregateArgs> = {
        [P in keyof T & keyof AggregateComplaint]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateComplaint[P]>
      : GetScalarType<T[P], AggregateComplaint[P]>
  }




  export type ComplaintGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ComplaintWhereInput
    orderBy?: ComplaintOrderByWithAggregationInput | ComplaintOrderByWithAggregationInput[]
    by: ComplaintScalarFieldEnum[] | ComplaintScalarFieldEnum
    having?: ComplaintScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ComplaintCountAggregateInputType | true
    _avg?: ComplaintAvgAggregateInputType
    _sum?: ComplaintSumAggregateInputType
    _min?: ComplaintMinAggregateInputType
    _max?: ComplaintMaxAggregateInputType
  }

  export type ComplaintGroupByOutputType = {
    id: string
    title: string
    description: string
    category: $Enums.ComplaintCategory
    status: $Enums.ComplaintStatus
    location: JsonValue | null
    priority: number
    userId: string
    assignedToId: string | null
    resolvedAt: Date | null
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: ComplaintCountAggregateOutputType | null
    _avg: ComplaintAvgAggregateOutputType | null
    _sum: ComplaintSumAggregateOutputType | null
    _min: ComplaintMinAggregateOutputType | null
    _max: ComplaintMaxAggregateOutputType | null
  }

  type GetComplaintGroupByPayload<T extends ComplaintGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ComplaintGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ComplaintGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ComplaintGroupByOutputType[P]>
            : GetScalarType<T[P], ComplaintGroupByOutputType[P]>
        }
      >
    >


  export type ComplaintSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    category?: boolean
    status?: boolean
    location?: boolean
    priority?: boolean
    userId?: boolean
    assignedToId?: boolean
    resolvedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    assignedTo?: boolean | Complaint$assignedToArgs<ExtArgs>
    attachments?: boolean | Complaint$attachmentsArgs<ExtArgs>
    statusHistory?: boolean | Complaint$statusHistoryArgs<ExtArgs>
    upvotes?: boolean | Complaint$upvotesArgs<ExtArgs>
    _count?: boolean | ComplaintCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["complaint"]>

  export type ComplaintSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    category?: boolean
    status?: boolean
    location?: boolean
    priority?: boolean
    userId?: boolean
    assignedToId?: boolean
    resolvedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    assignedTo?: boolean | Complaint$assignedToArgs<ExtArgs>
  }, ExtArgs["result"]["complaint"]>

  export type ComplaintSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    category?: boolean
    status?: boolean
    location?: boolean
    priority?: boolean
    userId?: boolean
    assignedToId?: boolean
    resolvedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type ComplaintInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    assignedTo?: boolean | Complaint$assignedToArgs<ExtArgs>
    attachments?: boolean | Complaint$attachmentsArgs<ExtArgs>
    statusHistory?: boolean | Complaint$statusHistoryArgs<ExtArgs>
    upvotes?: boolean | Complaint$upvotesArgs<ExtArgs>
    _count?: boolean | ComplaintCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ComplaintIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    assignedTo?: boolean | Complaint$assignedToArgs<ExtArgs>
  }

  export type $ComplaintPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Complaint"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      assignedTo: Prisma.$UserPayload<ExtArgs> | null
      attachments: Prisma.$AttachmentPayload<ExtArgs>[]
      statusHistory: Prisma.$StatusHistoryPayload<ExtArgs>[]
      upvotes: Prisma.$UpvotePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string
      category: $Enums.ComplaintCategory
      status: $Enums.ComplaintStatus
      location: Prisma.JsonValue | null
      priority: number
      userId: string
      assignedToId: string | null
      resolvedAt: Date | null
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["complaint"]>
    composites: {}
  }

  type ComplaintGetPayload<S extends boolean | null | undefined | ComplaintDefaultArgs> = $Result.GetResult<Prisma.$ComplaintPayload, S>

  type ComplaintCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ComplaintFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ComplaintCountAggregateInputType | true
    }

  export interface ComplaintDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Complaint'], meta: { name: 'Complaint' } }
    /**
     * Find zero or one Complaint that matches the filter.
     * @param {ComplaintFindUniqueArgs} args - Arguments to find a Complaint
     * @example
     * // Get one Complaint
     * const complaint = await prisma.complaint.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ComplaintFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, ComplaintFindUniqueArgs<ExtArgs>>
    ): Prisma__ComplaintClient<$Result.GetResult<Prisma.$ComplaintPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Complaint that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ComplaintFindUniqueOrThrowArgs} args - Arguments to find a Complaint
     * @example
     * // Get one Complaint
     * const complaint = await prisma.complaint.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ComplaintFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, ComplaintFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ComplaintClient<$Result.GetResult<Prisma.$ComplaintPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Complaint that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ComplaintFindFirstArgs} args - Arguments to find a Complaint
     * @example
     * // Get one Complaint
     * const complaint = await prisma.complaint.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ComplaintFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, ComplaintFindFirstArgs<ExtArgs>>
    ): Prisma__ComplaintClient<$Result.GetResult<Prisma.$ComplaintPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Complaint that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ComplaintFindFirstOrThrowArgs} args - Arguments to find a Complaint
     * @example
     * // Get one Complaint
     * const complaint = await prisma.complaint.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ComplaintFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, ComplaintFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ComplaintClient<$Result.GetResult<Prisma.$ComplaintPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Complaints that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ComplaintFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Complaints
     * const complaints = await prisma.complaint.findMany()
     * 
     * // Get first 10 Complaints
     * const complaints = await prisma.complaint.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const complaintWithIdOnly = await prisma.complaint.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ComplaintFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ComplaintFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ComplaintPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Complaint.
     * @param {ComplaintCreateArgs} args - Arguments to create a Complaint.
     * @example
     * // Create one Complaint
     * const Complaint = await prisma.complaint.create({
     *   data: {
     *     // ... data to create a Complaint
     *   }
     * })
     * 
    **/
    create<T extends ComplaintCreateArgs<ExtArgs>>(
      args: SelectSubset<T, ComplaintCreateArgs<ExtArgs>>
    ): Prisma__ComplaintClient<$Result.GetResult<Prisma.$ComplaintPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Complaints.
     * @param {ComplaintCreateManyArgs} args - Arguments to create many Complaints.
     * @example
     * // Create many Complaints
     * const complaint = await prisma.complaint.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends ComplaintCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ComplaintCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Complaints and returns the data saved in the database.
     * @param {ComplaintCreateManyAndReturnArgs} args - Arguments to create many Complaints.
     * @example
     * // Create many Complaints
     * const complaint = await prisma.complaint.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Complaints and only return the `id`
     * const complaintWithIdOnly = await prisma.complaint.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends ComplaintCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, ComplaintCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ComplaintPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a Complaint.
     * @param {ComplaintDeleteArgs} args - Arguments to delete one Complaint.
     * @example
     * // Delete one Complaint
     * const Complaint = await prisma.complaint.delete({
     *   where: {
     *     // ... filter to delete one Complaint
     *   }
     * })
     * 
    **/
    delete<T extends ComplaintDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, ComplaintDeleteArgs<ExtArgs>>
    ): Prisma__ComplaintClient<$Result.GetResult<Prisma.$ComplaintPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Complaint.
     * @param {ComplaintUpdateArgs} args - Arguments to update one Complaint.
     * @example
     * // Update one Complaint
     * const complaint = await prisma.complaint.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ComplaintUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, ComplaintUpdateArgs<ExtArgs>>
    ): Prisma__ComplaintClient<$Result.GetResult<Prisma.$ComplaintPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Complaints.
     * @param {ComplaintDeleteManyArgs} args - Arguments to filter Complaints to delete.
     * @example
     * // Delete a few Complaints
     * const { count } = await prisma.complaint.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ComplaintDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ComplaintDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Complaints.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ComplaintUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Complaints
     * const complaint = await prisma.complaint.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ComplaintUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, ComplaintUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Complaint.
     * @param {ComplaintUpsertArgs} args - Arguments to update or create a Complaint.
     * @example
     * // Update or create a Complaint
     * const complaint = await prisma.complaint.upsert({
     *   create: {
     *     // ... data to create a Complaint
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Complaint we want to update
     *   }
     * })
    **/
    upsert<T extends ComplaintUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, ComplaintUpsertArgs<ExtArgs>>
    ): Prisma__ComplaintClient<$Result.GetResult<Prisma.$ComplaintPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Complaints.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ComplaintCountArgs} args - Arguments to filter Complaints to count.
     * @example
     * // Count the number of Complaints
     * const count = await prisma.complaint.count({
     *   where: {
     *     // ... the filter for the Complaints we want to count
     *   }
     * })
    **/
    count<T extends ComplaintCountArgs>(
      args?: Subset<T, ComplaintCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ComplaintCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Complaint.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ComplaintAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ComplaintAggregateArgs>(args: Subset<T, ComplaintAggregateArgs>): Prisma.PrismaPromise<GetComplaintAggregateType<T>>

    /**
     * Group by Complaint.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ComplaintGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ComplaintGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ComplaintGroupByArgs['orderBy'] }
        : { orderBy?: ComplaintGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ComplaintGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetComplaintGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Complaint model
   */
  readonly fields: ComplaintFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Complaint.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ComplaintClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    assignedTo<T extends Complaint$assignedToArgs<ExtArgs> = {}>(args?: Subset<T, Complaint$assignedToArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'> | null, null, ExtArgs>;

    attachments<T extends Complaint$attachmentsArgs<ExtArgs> = {}>(args?: Subset<T, Complaint$attachmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, 'findMany'> | Null>;

    statusHistory<T extends Complaint$statusHistoryArgs<ExtArgs> = {}>(args?: Subset<T, Complaint$statusHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, 'findMany'> | Null>;

    upvotes<T extends Complaint$upvotesArgs<ExtArgs> = {}>(args?: Subset<T, Complaint$upvotesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UpvotePayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the Complaint model
   */ 
  interface ComplaintFieldRefs {
    readonly id: FieldRef<"Complaint", 'String'>
    readonly title: FieldRef<"Complaint", 'String'>
    readonly description: FieldRef<"Complaint", 'String'>
    readonly category: FieldRef<"Complaint", 'ComplaintCategory'>
    readonly status: FieldRef<"Complaint", 'ComplaintStatus'>
    readonly location: FieldRef<"Complaint", 'Json'>
    readonly priority: FieldRef<"Complaint", 'Int'>
    readonly userId: FieldRef<"Complaint", 'String'>
    readonly assignedToId: FieldRef<"Complaint", 'String'>
    readonly resolvedAt: FieldRef<"Complaint", 'DateTime'>
    readonly createdAt: FieldRef<"Complaint", 'DateTime'>
    readonly updatedAt: FieldRef<"Complaint", 'DateTime'>
    readonly deletedAt: FieldRef<"Complaint", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Complaint findUnique
   */
  export type ComplaintFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Complaint
     */
    select?: ComplaintSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplaintInclude<ExtArgs> | null
    /**
     * Filter, which Complaint to fetch.
     */
    where: ComplaintWhereUniqueInput
  }

  /**
   * Complaint findUniqueOrThrow
   */
  export type ComplaintFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Complaint
     */
    select?: ComplaintSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplaintInclude<ExtArgs> | null
    /**
     * Filter, which Complaint to fetch.
     */
    where: ComplaintWhereUniqueInput
  }

  /**
   * Complaint findFirst
   */
  export type ComplaintFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Complaint
     */
    select?: ComplaintSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplaintInclude<ExtArgs> | null
    /**
     * Filter, which Complaint to fetch.
     */
    where?: ComplaintWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Complaints to fetch.
     */
    orderBy?: ComplaintOrderByWithRelationInput | ComplaintOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Complaints.
     */
    cursor?: ComplaintWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Complaints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Complaints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Complaints.
     */
    distinct?: ComplaintScalarFieldEnum | ComplaintScalarFieldEnum[]
  }

  /**
   * Complaint findFirstOrThrow
   */
  export type ComplaintFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Complaint
     */
    select?: ComplaintSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplaintInclude<ExtArgs> | null
    /**
     * Filter, which Complaint to fetch.
     */
    where?: ComplaintWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Complaints to fetch.
     */
    orderBy?: ComplaintOrderByWithRelationInput | ComplaintOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Complaints.
     */
    cursor?: ComplaintWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Complaints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Complaints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Complaints.
     */
    distinct?: ComplaintScalarFieldEnum | ComplaintScalarFieldEnum[]
  }

  /**
   * Complaint findMany
   */
  export type ComplaintFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Complaint
     */
    select?: ComplaintSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplaintInclude<ExtArgs> | null
    /**
     * Filter, which Complaints to fetch.
     */
    where?: ComplaintWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Complaints to fetch.
     */
    orderBy?: ComplaintOrderByWithRelationInput | ComplaintOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Complaints.
     */
    cursor?: ComplaintWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Complaints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Complaints.
     */
    skip?: number
    distinct?: ComplaintScalarFieldEnum | ComplaintScalarFieldEnum[]
  }

  /**
   * Complaint create
   */
  export type ComplaintCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Complaint
     */
    select?: ComplaintSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplaintInclude<ExtArgs> | null
    /**
     * The data needed to create a Complaint.
     */
    data: XOR<ComplaintCreateInput, ComplaintUncheckedCreateInput>
  }

  /**
   * Complaint createMany
   */
  export type ComplaintCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Complaints.
     */
    data: ComplaintCreateManyInput | ComplaintCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Complaint createManyAndReturn
   */
  export type ComplaintCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Complaint
     */
    select?: ComplaintSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Complaints.
     */
    data: ComplaintCreateManyInput | ComplaintCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplaintIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Complaint update
   */
  export type ComplaintUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Complaint
     */
    select?: ComplaintSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplaintInclude<ExtArgs> | null
    /**
     * The data needed to update a Complaint.
     */
    data: XOR<ComplaintUpdateInput, ComplaintUncheckedUpdateInput>
    /**
     * Choose, which Complaint to update.
     */
    where: ComplaintWhereUniqueInput
  }

  /**
   * Complaint updateMany
   */
  export type ComplaintUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Complaints.
     */
    data: XOR<ComplaintUpdateManyMutationInput, ComplaintUncheckedUpdateManyInput>
    /**
     * Filter which Complaints to update
     */
    where?: ComplaintWhereInput
  }

  /**
   * Complaint upsert
   */
  export type ComplaintUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Complaint
     */
    select?: ComplaintSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplaintInclude<ExtArgs> | null
    /**
     * The filter to search for the Complaint to update in case it exists.
     */
    where: ComplaintWhereUniqueInput
    /**
     * In case the Complaint found by the `where` argument doesn't exist, create a new Complaint with this data.
     */
    create: XOR<ComplaintCreateInput, ComplaintUncheckedCreateInput>
    /**
     * In case the Complaint was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ComplaintUpdateInput, ComplaintUncheckedUpdateInput>
  }

  /**
   * Complaint delete
   */
  export type ComplaintDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Complaint
     */
    select?: ComplaintSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplaintInclude<ExtArgs> | null
    /**
     * Filter which Complaint to delete.
     */
    where: ComplaintWhereUniqueInput
  }

  /**
   * Complaint deleteMany
   */
  export type ComplaintDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Complaints to delete
     */
    where?: ComplaintWhereInput
  }

  /**
   * Complaint.assignedTo
   */
  export type Complaint$assignedToArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Complaint.attachments
   */
  export type Complaint$attachmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttachmentInclude<ExtArgs> | null
    where?: AttachmentWhereInput
    orderBy?: AttachmentOrderByWithRelationInput | AttachmentOrderByWithRelationInput[]
    cursor?: AttachmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AttachmentScalarFieldEnum | AttachmentScalarFieldEnum[]
  }

  /**
   * Complaint.statusHistory
   */
  export type Complaint$statusHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusHistory
     */
    select?: StatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StatusHistoryInclude<ExtArgs> | null
    where?: StatusHistoryWhereInput
    orderBy?: StatusHistoryOrderByWithRelationInput | StatusHistoryOrderByWithRelationInput[]
    cursor?: StatusHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StatusHistoryScalarFieldEnum | StatusHistoryScalarFieldEnum[]
  }

  /**
   * Complaint.upvotes
   */
  export type Complaint$upvotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Upvote
     */
    select?: UpvoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UpvoteInclude<ExtArgs> | null
    where?: UpvoteWhereInput
    orderBy?: UpvoteOrderByWithRelationInput | UpvoteOrderByWithRelationInput[]
    cursor?: UpvoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UpvoteScalarFieldEnum | UpvoteScalarFieldEnum[]
  }

  /**
   * Complaint without action
   */
  export type ComplaintDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Complaint
     */
    select?: ComplaintSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplaintInclude<ExtArgs> | null
  }


  /**
   * Model Attachment
   */

  export type AggregateAttachment = {
    _count: AttachmentCountAggregateOutputType | null
    _avg: AttachmentAvgAggregateOutputType | null
    _sum: AttachmentSumAggregateOutputType | null
    _min: AttachmentMinAggregateOutputType | null
    _max: AttachmentMaxAggregateOutputType | null
  }

  export type AttachmentAvgAggregateOutputType = {
    size: number | null
  }

  export type AttachmentSumAggregateOutputType = {
    size: number | null
  }

  export type AttachmentMinAggregateOutputType = {
    id: string | null
    complaintId: string | null
    userId: string | null
    filename: string | null
    cloudinaryId: string | null
    url: string | null
    thumbnailUrl: string | null
    mimeType: string | null
    size: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AttachmentMaxAggregateOutputType = {
    id: string | null
    complaintId: string | null
    userId: string | null
    filename: string | null
    cloudinaryId: string | null
    url: string | null
    thumbnailUrl: string | null
    mimeType: string | null
    size: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AttachmentCountAggregateOutputType = {
    id: number
    complaintId: number
    userId: number
    filename: number
    cloudinaryId: number
    url: number
    thumbnailUrl: number
    mimeType: number
    size: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AttachmentAvgAggregateInputType = {
    size?: true
  }

  export type AttachmentSumAggregateInputType = {
    size?: true
  }

  export type AttachmentMinAggregateInputType = {
    id?: true
    complaintId?: true
    userId?: true
    filename?: true
    cloudinaryId?: true
    url?: true
    thumbnailUrl?: true
    mimeType?: true
    size?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AttachmentMaxAggregateInputType = {
    id?: true
    complaintId?: true
    userId?: true
    filename?: true
    cloudinaryId?: true
    url?: true
    thumbnailUrl?: true
    mimeType?: true
    size?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AttachmentCountAggregateInputType = {
    id?: true
    complaintId?: true
    userId?: true
    filename?: true
    cloudinaryId?: true
    url?: true
    thumbnailUrl?: true
    mimeType?: true
    size?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AttachmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Attachment to aggregate.
     */
    where?: AttachmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attachments to fetch.
     */
    orderBy?: AttachmentOrderByWithRelationInput | AttachmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AttachmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attachments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attachments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Attachments
    **/
    _count?: true | AttachmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AttachmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AttachmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AttachmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AttachmentMaxAggregateInputType
  }

  export type GetAttachmentAggregateType<T extends AttachmentAggregateArgs> = {
        [P in keyof T & keyof AggregateAttachment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAttachment[P]>
      : GetScalarType<T[P], AggregateAttachment[P]>
  }




  export type AttachmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AttachmentWhereInput
    orderBy?: AttachmentOrderByWithAggregationInput | AttachmentOrderByWithAggregationInput[]
    by: AttachmentScalarFieldEnum[] | AttachmentScalarFieldEnum
    having?: AttachmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AttachmentCountAggregateInputType | true
    _avg?: AttachmentAvgAggregateInputType
    _sum?: AttachmentSumAggregateInputType
    _min?: AttachmentMinAggregateInputType
    _max?: AttachmentMaxAggregateInputType
  }

  export type AttachmentGroupByOutputType = {
    id: string
    complaintId: string | null
    userId: string
    filename: string
    cloudinaryId: string | null
    url: string
    thumbnailUrl: string | null
    mimeType: string
    size: number
    createdAt: Date
    updatedAt: Date
    _count: AttachmentCountAggregateOutputType | null
    _avg: AttachmentAvgAggregateOutputType | null
    _sum: AttachmentSumAggregateOutputType | null
    _min: AttachmentMinAggregateOutputType | null
    _max: AttachmentMaxAggregateOutputType | null
  }

  type GetAttachmentGroupByPayload<T extends AttachmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AttachmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AttachmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AttachmentGroupByOutputType[P]>
            : GetScalarType<T[P], AttachmentGroupByOutputType[P]>
        }
      >
    >


  export type AttachmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    complaintId?: boolean
    userId?: boolean
    filename?: boolean
    cloudinaryId?: boolean
    url?: boolean
    thumbnailUrl?: boolean
    mimeType?: boolean
    size?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    complaint?: boolean | Attachment$complaintArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["attachment"]>

  export type AttachmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    complaintId?: boolean
    userId?: boolean
    filename?: boolean
    cloudinaryId?: boolean
    url?: boolean
    thumbnailUrl?: boolean
    mimeType?: boolean
    size?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    complaint?: boolean | Attachment$complaintArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["attachment"]>

  export type AttachmentSelectScalar = {
    id?: boolean
    complaintId?: boolean
    userId?: boolean
    filename?: boolean
    cloudinaryId?: boolean
    url?: boolean
    thumbnailUrl?: boolean
    mimeType?: boolean
    size?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AttachmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    complaint?: boolean | Attachment$complaintArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AttachmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    complaint?: boolean | Attachment$complaintArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AttachmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Attachment"
    objects: {
      complaint: Prisma.$ComplaintPayload<ExtArgs> | null
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      complaintId: string | null
      userId: string
      filename: string
      cloudinaryId: string | null
      url: string
      thumbnailUrl: string | null
      mimeType: string
      size: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["attachment"]>
    composites: {}
  }

  type AttachmentGetPayload<S extends boolean | null | undefined | AttachmentDefaultArgs> = $Result.GetResult<Prisma.$AttachmentPayload, S>

  type AttachmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AttachmentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AttachmentCountAggregateInputType | true
    }

  export interface AttachmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Attachment'], meta: { name: 'Attachment' } }
    /**
     * Find zero or one Attachment that matches the filter.
     * @param {AttachmentFindUniqueArgs} args - Arguments to find a Attachment
     * @example
     * // Get one Attachment
     * const attachment = await prisma.attachment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends AttachmentFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, AttachmentFindUniqueArgs<ExtArgs>>
    ): Prisma__AttachmentClient<$Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Attachment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AttachmentFindUniqueOrThrowArgs} args - Arguments to find a Attachment
     * @example
     * // Get one Attachment
     * const attachment = await prisma.attachment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends AttachmentFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AttachmentFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AttachmentClient<$Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Attachment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttachmentFindFirstArgs} args - Arguments to find a Attachment
     * @example
     * // Get one Attachment
     * const attachment = await prisma.attachment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends AttachmentFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, AttachmentFindFirstArgs<ExtArgs>>
    ): Prisma__AttachmentClient<$Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Attachment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttachmentFindFirstOrThrowArgs} args - Arguments to find a Attachment
     * @example
     * // Get one Attachment
     * const attachment = await prisma.attachment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends AttachmentFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AttachmentFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AttachmentClient<$Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Attachments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttachmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Attachments
     * const attachments = await prisma.attachment.findMany()
     * 
     * // Get first 10 Attachments
     * const attachments = await prisma.attachment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const attachmentWithIdOnly = await prisma.attachment.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends AttachmentFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AttachmentFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Attachment.
     * @param {AttachmentCreateArgs} args - Arguments to create a Attachment.
     * @example
     * // Create one Attachment
     * const Attachment = await prisma.attachment.create({
     *   data: {
     *     // ... data to create a Attachment
     *   }
     * })
     * 
    **/
    create<T extends AttachmentCreateArgs<ExtArgs>>(
      args: SelectSubset<T, AttachmentCreateArgs<ExtArgs>>
    ): Prisma__AttachmentClient<$Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Attachments.
     * @param {AttachmentCreateManyArgs} args - Arguments to create many Attachments.
     * @example
     * // Create many Attachments
     * const attachment = await prisma.attachment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends AttachmentCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AttachmentCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Attachments and returns the data saved in the database.
     * @param {AttachmentCreateManyAndReturnArgs} args - Arguments to create many Attachments.
     * @example
     * // Create many Attachments
     * const attachment = await prisma.attachment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Attachments and only return the `id`
     * const attachmentWithIdOnly = await prisma.attachment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends AttachmentCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, AttachmentCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a Attachment.
     * @param {AttachmentDeleteArgs} args - Arguments to delete one Attachment.
     * @example
     * // Delete one Attachment
     * const Attachment = await prisma.attachment.delete({
     *   where: {
     *     // ... filter to delete one Attachment
     *   }
     * })
     * 
    **/
    delete<T extends AttachmentDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, AttachmentDeleteArgs<ExtArgs>>
    ): Prisma__AttachmentClient<$Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Attachment.
     * @param {AttachmentUpdateArgs} args - Arguments to update one Attachment.
     * @example
     * // Update one Attachment
     * const attachment = await prisma.attachment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends AttachmentUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, AttachmentUpdateArgs<ExtArgs>>
    ): Prisma__AttachmentClient<$Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Attachments.
     * @param {AttachmentDeleteManyArgs} args - Arguments to filter Attachments to delete.
     * @example
     * // Delete a few Attachments
     * const { count } = await prisma.attachment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends AttachmentDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AttachmentDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Attachments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttachmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Attachments
     * const attachment = await prisma.attachment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends AttachmentUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, AttachmentUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Attachment.
     * @param {AttachmentUpsertArgs} args - Arguments to update or create a Attachment.
     * @example
     * // Update or create a Attachment
     * const attachment = await prisma.attachment.upsert({
     *   create: {
     *     // ... data to create a Attachment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Attachment we want to update
     *   }
     * })
    **/
    upsert<T extends AttachmentUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, AttachmentUpsertArgs<ExtArgs>>
    ): Prisma__AttachmentClient<$Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Attachments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttachmentCountArgs} args - Arguments to filter Attachments to count.
     * @example
     * // Count the number of Attachments
     * const count = await prisma.attachment.count({
     *   where: {
     *     // ... the filter for the Attachments we want to count
     *   }
     * })
    **/
    count<T extends AttachmentCountArgs>(
      args?: Subset<T, AttachmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AttachmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Attachment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttachmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AttachmentAggregateArgs>(args: Subset<T, AttachmentAggregateArgs>): Prisma.PrismaPromise<GetAttachmentAggregateType<T>>

    /**
     * Group by Attachment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttachmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AttachmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AttachmentGroupByArgs['orderBy'] }
        : { orderBy?: AttachmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AttachmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAttachmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Attachment model
   */
  readonly fields: AttachmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Attachment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AttachmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    complaint<T extends Attachment$complaintArgs<ExtArgs> = {}>(args?: Subset<T, Attachment$complaintArgs<ExtArgs>>): Prisma__ComplaintClient<$Result.GetResult<Prisma.$ComplaintPayload<ExtArgs>, T, 'findUniqueOrThrow'> | null, null, ExtArgs>;

    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the Attachment model
   */ 
  interface AttachmentFieldRefs {
    readonly id: FieldRef<"Attachment", 'String'>
    readonly complaintId: FieldRef<"Attachment", 'String'>
    readonly userId: FieldRef<"Attachment", 'String'>
    readonly filename: FieldRef<"Attachment", 'String'>
    readonly cloudinaryId: FieldRef<"Attachment", 'String'>
    readonly url: FieldRef<"Attachment", 'String'>
    readonly thumbnailUrl: FieldRef<"Attachment", 'String'>
    readonly mimeType: FieldRef<"Attachment", 'String'>
    readonly size: FieldRef<"Attachment", 'Int'>
    readonly createdAt: FieldRef<"Attachment", 'DateTime'>
    readonly updatedAt: FieldRef<"Attachment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Attachment findUnique
   */
  export type AttachmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttachmentInclude<ExtArgs> | null
    /**
     * Filter, which Attachment to fetch.
     */
    where: AttachmentWhereUniqueInput
  }

  /**
   * Attachment findUniqueOrThrow
   */
  export type AttachmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttachmentInclude<ExtArgs> | null
    /**
     * Filter, which Attachment to fetch.
     */
    where: AttachmentWhereUniqueInput
  }

  /**
   * Attachment findFirst
   */
  export type AttachmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttachmentInclude<ExtArgs> | null
    /**
     * Filter, which Attachment to fetch.
     */
    where?: AttachmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attachments to fetch.
     */
    orderBy?: AttachmentOrderByWithRelationInput | AttachmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Attachments.
     */
    cursor?: AttachmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attachments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attachments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Attachments.
     */
    distinct?: AttachmentScalarFieldEnum | AttachmentScalarFieldEnum[]
  }

  /**
   * Attachment findFirstOrThrow
   */
  export type AttachmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttachmentInclude<ExtArgs> | null
    /**
     * Filter, which Attachment to fetch.
     */
    where?: AttachmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attachments to fetch.
     */
    orderBy?: AttachmentOrderByWithRelationInput | AttachmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Attachments.
     */
    cursor?: AttachmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attachments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attachments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Attachments.
     */
    distinct?: AttachmentScalarFieldEnum | AttachmentScalarFieldEnum[]
  }

  /**
   * Attachment findMany
   */
  export type AttachmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttachmentInclude<ExtArgs> | null
    /**
     * Filter, which Attachments to fetch.
     */
    where?: AttachmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attachments to fetch.
     */
    orderBy?: AttachmentOrderByWithRelationInput | AttachmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Attachments.
     */
    cursor?: AttachmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attachments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attachments.
     */
    skip?: number
    distinct?: AttachmentScalarFieldEnum | AttachmentScalarFieldEnum[]
  }

  /**
   * Attachment create
   */
  export type AttachmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttachmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Attachment.
     */
    data: XOR<AttachmentCreateInput, AttachmentUncheckedCreateInput>
  }

  /**
   * Attachment createMany
   */
  export type AttachmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Attachments.
     */
    data: AttachmentCreateManyInput | AttachmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Attachment createManyAndReturn
   */
  export type AttachmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Attachments.
     */
    data: AttachmentCreateManyInput | AttachmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttachmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Attachment update
   */
  export type AttachmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttachmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Attachment.
     */
    data: XOR<AttachmentUpdateInput, AttachmentUncheckedUpdateInput>
    /**
     * Choose, which Attachment to update.
     */
    where: AttachmentWhereUniqueInput
  }

  /**
   * Attachment updateMany
   */
  export type AttachmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Attachments.
     */
    data: XOR<AttachmentUpdateManyMutationInput, AttachmentUncheckedUpdateManyInput>
    /**
     * Filter which Attachments to update
     */
    where?: AttachmentWhereInput
  }

  /**
   * Attachment upsert
   */
  export type AttachmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttachmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Attachment to update in case it exists.
     */
    where: AttachmentWhereUniqueInput
    /**
     * In case the Attachment found by the `where` argument doesn't exist, create a new Attachment with this data.
     */
    create: XOR<AttachmentCreateInput, AttachmentUncheckedCreateInput>
    /**
     * In case the Attachment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AttachmentUpdateInput, AttachmentUncheckedUpdateInput>
  }

  /**
   * Attachment delete
   */
  export type AttachmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttachmentInclude<ExtArgs> | null
    /**
     * Filter which Attachment to delete.
     */
    where: AttachmentWhereUniqueInput
  }

  /**
   * Attachment deleteMany
   */
  export type AttachmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Attachments to delete
     */
    where?: AttachmentWhereInput
  }

  /**
   * Attachment.complaint
   */
  export type Attachment$complaintArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Complaint
     */
    select?: ComplaintSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplaintInclude<ExtArgs> | null
    where?: ComplaintWhereInput
  }

  /**
   * Attachment without action
   */
  export type AttachmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttachmentInclude<ExtArgs> | null
  }


  /**
   * Model StatusHistory
   */

  export type AggregateStatusHistory = {
    _count: StatusHistoryCountAggregateOutputType | null
    _min: StatusHistoryMinAggregateOutputType | null
    _max: StatusHistoryMaxAggregateOutputType | null
  }

  export type StatusHistoryMinAggregateOutputType = {
    id: string | null
    complaintId: string | null
    fromStatus: $Enums.ComplaintStatus | null
    toStatus: $Enums.ComplaintStatus | null
    changedById: string | null
    comment: string | null
    createdAt: Date | null
  }

  export type StatusHistoryMaxAggregateOutputType = {
    id: string | null
    complaintId: string | null
    fromStatus: $Enums.ComplaintStatus | null
    toStatus: $Enums.ComplaintStatus | null
    changedById: string | null
    comment: string | null
    createdAt: Date | null
  }

  export type StatusHistoryCountAggregateOutputType = {
    id: number
    complaintId: number
    fromStatus: number
    toStatus: number
    changedById: number
    comment: number
    createdAt: number
    _all: number
  }


  export type StatusHistoryMinAggregateInputType = {
    id?: true
    complaintId?: true
    fromStatus?: true
    toStatus?: true
    changedById?: true
    comment?: true
    createdAt?: true
  }

  export type StatusHistoryMaxAggregateInputType = {
    id?: true
    complaintId?: true
    fromStatus?: true
    toStatus?: true
    changedById?: true
    comment?: true
    createdAt?: true
  }

  export type StatusHistoryCountAggregateInputType = {
    id?: true
    complaintId?: true
    fromStatus?: true
    toStatus?: true
    changedById?: true
    comment?: true
    createdAt?: true
    _all?: true
  }

  export type StatusHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StatusHistory to aggregate.
     */
    where?: StatusHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StatusHistories to fetch.
     */
    orderBy?: StatusHistoryOrderByWithRelationInput | StatusHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StatusHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StatusHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StatusHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StatusHistories
    **/
    _count?: true | StatusHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StatusHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StatusHistoryMaxAggregateInputType
  }

  export type GetStatusHistoryAggregateType<T extends StatusHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateStatusHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStatusHistory[P]>
      : GetScalarType<T[P], AggregateStatusHistory[P]>
  }




  export type StatusHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StatusHistoryWhereInput
    orderBy?: StatusHistoryOrderByWithAggregationInput | StatusHistoryOrderByWithAggregationInput[]
    by: StatusHistoryScalarFieldEnum[] | StatusHistoryScalarFieldEnum
    having?: StatusHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StatusHistoryCountAggregateInputType | true
    _min?: StatusHistoryMinAggregateInputType
    _max?: StatusHistoryMaxAggregateInputType
  }

  export type StatusHistoryGroupByOutputType = {
    id: string
    complaintId: string
    fromStatus: $Enums.ComplaintStatus
    toStatus: $Enums.ComplaintStatus
    changedById: string
    comment: string | null
    createdAt: Date
    _count: StatusHistoryCountAggregateOutputType | null
    _min: StatusHistoryMinAggregateOutputType | null
    _max: StatusHistoryMaxAggregateOutputType | null
  }

  type GetStatusHistoryGroupByPayload<T extends StatusHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StatusHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StatusHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StatusHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], StatusHistoryGroupByOutputType[P]>
        }
      >
    >


  export type StatusHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    complaintId?: boolean
    fromStatus?: boolean
    toStatus?: boolean
    changedById?: boolean
    comment?: boolean
    createdAt?: boolean
    complaint?: boolean | ComplaintDefaultArgs<ExtArgs>
    changedBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["statusHistory"]>

  export type StatusHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    complaintId?: boolean
    fromStatus?: boolean
    toStatus?: boolean
    changedById?: boolean
    comment?: boolean
    createdAt?: boolean
    complaint?: boolean | ComplaintDefaultArgs<ExtArgs>
    changedBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["statusHistory"]>

  export type StatusHistorySelectScalar = {
    id?: boolean
    complaintId?: boolean
    fromStatus?: boolean
    toStatus?: boolean
    changedById?: boolean
    comment?: boolean
    createdAt?: boolean
  }

  export type StatusHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    complaint?: boolean | ComplaintDefaultArgs<ExtArgs>
    changedBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type StatusHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    complaint?: boolean | ComplaintDefaultArgs<ExtArgs>
    changedBy?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $StatusHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StatusHistory"
    objects: {
      complaint: Prisma.$ComplaintPayload<ExtArgs>
      changedBy: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      complaintId: string
      fromStatus: $Enums.ComplaintStatus
      toStatus: $Enums.ComplaintStatus
      changedById: string
      comment: string | null
      createdAt: Date
    }, ExtArgs["result"]["statusHistory"]>
    composites: {}
  }

  type StatusHistoryGetPayload<S extends boolean | null | undefined | StatusHistoryDefaultArgs> = $Result.GetResult<Prisma.$StatusHistoryPayload, S>

  type StatusHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<StatusHistoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: StatusHistoryCountAggregateInputType | true
    }

  export interface StatusHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StatusHistory'], meta: { name: 'StatusHistory' } }
    /**
     * Find zero or one StatusHistory that matches the filter.
     * @param {StatusHistoryFindUniqueArgs} args - Arguments to find a StatusHistory
     * @example
     * // Get one StatusHistory
     * const statusHistory = await prisma.statusHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends StatusHistoryFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, StatusHistoryFindUniqueArgs<ExtArgs>>
    ): Prisma__StatusHistoryClient<$Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one StatusHistory that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {StatusHistoryFindUniqueOrThrowArgs} args - Arguments to find a StatusHistory
     * @example
     * // Get one StatusHistory
     * const statusHistory = await prisma.statusHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends StatusHistoryFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, StatusHistoryFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__StatusHistoryClient<$Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first StatusHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatusHistoryFindFirstArgs} args - Arguments to find a StatusHistory
     * @example
     * // Get one StatusHistory
     * const statusHistory = await prisma.statusHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends StatusHistoryFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, StatusHistoryFindFirstArgs<ExtArgs>>
    ): Prisma__StatusHistoryClient<$Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first StatusHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatusHistoryFindFirstOrThrowArgs} args - Arguments to find a StatusHistory
     * @example
     * // Get one StatusHistory
     * const statusHistory = await prisma.statusHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends StatusHistoryFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, StatusHistoryFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__StatusHistoryClient<$Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more StatusHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatusHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StatusHistories
     * const statusHistories = await prisma.statusHistory.findMany()
     * 
     * // Get first 10 StatusHistories
     * const statusHistories = await prisma.statusHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const statusHistoryWithIdOnly = await prisma.statusHistory.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends StatusHistoryFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, StatusHistoryFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a StatusHistory.
     * @param {StatusHistoryCreateArgs} args - Arguments to create a StatusHistory.
     * @example
     * // Create one StatusHistory
     * const StatusHistory = await prisma.statusHistory.create({
     *   data: {
     *     // ... data to create a StatusHistory
     *   }
     * })
     * 
    **/
    create<T extends StatusHistoryCreateArgs<ExtArgs>>(
      args: SelectSubset<T, StatusHistoryCreateArgs<ExtArgs>>
    ): Prisma__StatusHistoryClient<$Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many StatusHistories.
     * @param {StatusHistoryCreateManyArgs} args - Arguments to create many StatusHistories.
     * @example
     * // Create many StatusHistories
     * const statusHistory = await prisma.statusHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends StatusHistoryCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, StatusHistoryCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StatusHistories and returns the data saved in the database.
     * @param {StatusHistoryCreateManyAndReturnArgs} args - Arguments to create many StatusHistories.
     * @example
     * // Create many StatusHistories
     * const statusHistory = await prisma.statusHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StatusHistories and only return the `id`
     * const statusHistoryWithIdOnly = await prisma.statusHistory.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends StatusHistoryCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, StatusHistoryCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a StatusHistory.
     * @param {StatusHistoryDeleteArgs} args - Arguments to delete one StatusHistory.
     * @example
     * // Delete one StatusHistory
     * const StatusHistory = await prisma.statusHistory.delete({
     *   where: {
     *     // ... filter to delete one StatusHistory
     *   }
     * })
     * 
    **/
    delete<T extends StatusHistoryDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, StatusHistoryDeleteArgs<ExtArgs>>
    ): Prisma__StatusHistoryClient<$Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one StatusHistory.
     * @param {StatusHistoryUpdateArgs} args - Arguments to update one StatusHistory.
     * @example
     * // Update one StatusHistory
     * const statusHistory = await prisma.statusHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends StatusHistoryUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, StatusHistoryUpdateArgs<ExtArgs>>
    ): Prisma__StatusHistoryClient<$Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more StatusHistories.
     * @param {StatusHistoryDeleteManyArgs} args - Arguments to filter StatusHistories to delete.
     * @example
     * // Delete a few StatusHistories
     * const { count } = await prisma.statusHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends StatusHistoryDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, StatusHistoryDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StatusHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatusHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StatusHistories
     * const statusHistory = await prisma.statusHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends StatusHistoryUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, StatusHistoryUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one StatusHistory.
     * @param {StatusHistoryUpsertArgs} args - Arguments to update or create a StatusHistory.
     * @example
     * // Update or create a StatusHistory
     * const statusHistory = await prisma.statusHistory.upsert({
     *   create: {
     *     // ... data to create a StatusHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StatusHistory we want to update
     *   }
     * })
    **/
    upsert<T extends StatusHistoryUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, StatusHistoryUpsertArgs<ExtArgs>>
    ): Prisma__StatusHistoryClient<$Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of StatusHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatusHistoryCountArgs} args - Arguments to filter StatusHistories to count.
     * @example
     * // Count the number of StatusHistories
     * const count = await prisma.statusHistory.count({
     *   where: {
     *     // ... the filter for the StatusHistories we want to count
     *   }
     * })
    **/
    count<T extends StatusHistoryCountArgs>(
      args?: Subset<T, StatusHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StatusHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StatusHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatusHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StatusHistoryAggregateArgs>(args: Subset<T, StatusHistoryAggregateArgs>): Prisma.PrismaPromise<GetStatusHistoryAggregateType<T>>

    /**
     * Group by StatusHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatusHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StatusHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StatusHistoryGroupByArgs['orderBy'] }
        : { orderBy?: StatusHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StatusHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStatusHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StatusHistory model
   */
  readonly fields: StatusHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StatusHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StatusHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    complaint<T extends ComplaintDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ComplaintDefaultArgs<ExtArgs>>): Prisma__ComplaintClient<$Result.GetResult<Prisma.$ComplaintPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    changedBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the StatusHistory model
   */ 
  interface StatusHistoryFieldRefs {
    readonly id: FieldRef<"StatusHistory", 'String'>
    readonly complaintId: FieldRef<"StatusHistory", 'String'>
    readonly fromStatus: FieldRef<"StatusHistory", 'ComplaintStatus'>
    readonly toStatus: FieldRef<"StatusHistory", 'ComplaintStatus'>
    readonly changedById: FieldRef<"StatusHistory", 'String'>
    readonly comment: FieldRef<"StatusHistory", 'String'>
    readonly createdAt: FieldRef<"StatusHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StatusHistory findUnique
   */
  export type StatusHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusHistory
     */
    select?: StatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StatusHistoryInclude<ExtArgs> | null
    /**
     * Filter, which StatusHistory to fetch.
     */
    where: StatusHistoryWhereUniqueInput
  }

  /**
   * StatusHistory findUniqueOrThrow
   */
  export type StatusHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusHistory
     */
    select?: StatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StatusHistoryInclude<ExtArgs> | null
    /**
     * Filter, which StatusHistory to fetch.
     */
    where: StatusHistoryWhereUniqueInput
  }

  /**
   * StatusHistory findFirst
   */
  export type StatusHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusHistory
     */
    select?: StatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StatusHistoryInclude<ExtArgs> | null
    /**
     * Filter, which StatusHistory to fetch.
     */
    where?: StatusHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StatusHistories to fetch.
     */
    orderBy?: StatusHistoryOrderByWithRelationInput | StatusHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StatusHistories.
     */
    cursor?: StatusHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StatusHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StatusHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StatusHistories.
     */
    distinct?: StatusHistoryScalarFieldEnum | StatusHistoryScalarFieldEnum[]
  }

  /**
   * StatusHistory findFirstOrThrow
   */
  export type StatusHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusHistory
     */
    select?: StatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StatusHistoryInclude<ExtArgs> | null
    /**
     * Filter, which StatusHistory to fetch.
     */
    where?: StatusHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StatusHistories to fetch.
     */
    orderBy?: StatusHistoryOrderByWithRelationInput | StatusHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StatusHistories.
     */
    cursor?: StatusHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StatusHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StatusHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StatusHistories.
     */
    distinct?: StatusHistoryScalarFieldEnum | StatusHistoryScalarFieldEnum[]
  }

  /**
   * StatusHistory findMany
   */
  export type StatusHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusHistory
     */
    select?: StatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StatusHistoryInclude<ExtArgs> | null
    /**
     * Filter, which StatusHistories to fetch.
     */
    where?: StatusHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StatusHistories to fetch.
     */
    orderBy?: StatusHistoryOrderByWithRelationInput | StatusHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StatusHistories.
     */
    cursor?: StatusHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StatusHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StatusHistories.
     */
    skip?: number
    distinct?: StatusHistoryScalarFieldEnum | StatusHistoryScalarFieldEnum[]
  }

  /**
   * StatusHistory create
   */
  export type StatusHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusHistory
     */
    select?: StatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StatusHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a StatusHistory.
     */
    data: XOR<StatusHistoryCreateInput, StatusHistoryUncheckedCreateInput>
  }

  /**
   * StatusHistory createMany
   */
  export type StatusHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StatusHistories.
     */
    data: StatusHistoryCreateManyInput | StatusHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StatusHistory createManyAndReturn
   */
  export type StatusHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusHistory
     */
    select?: StatusHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many StatusHistories.
     */
    data: StatusHistoryCreateManyInput | StatusHistoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StatusHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StatusHistory update
   */
  export type StatusHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusHistory
     */
    select?: StatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StatusHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a StatusHistory.
     */
    data: XOR<StatusHistoryUpdateInput, StatusHistoryUncheckedUpdateInput>
    /**
     * Choose, which StatusHistory to update.
     */
    where: StatusHistoryWhereUniqueInput
  }

  /**
   * StatusHistory updateMany
   */
  export type StatusHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StatusHistories.
     */
    data: XOR<StatusHistoryUpdateManyMutationInput, StatusHistoryUncheckedUpdateManyInput>
    /**
     * Filter which StatusHistories to update
     */
    where?: StatusHistoryWhereInput
  }

  /**
   * StatusHistory upsert
   */
  export type StatusHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusHistory
     */
    select?: StatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StatusHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the StatusHistory to update in case it exists.
     */
    where: StatusHistoryWhereUniqueInput
    /**
     * In case the StatusHistory found by the `where` argument doesn't exist, create a new StatusHistory with this data.
     */
    create: XOR<StatusHistoryCreateInput, StatusHistoryUncheckedCreateInput>
    /**
     * In case the StatusHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StatusHistoryUpdateInput, StatusHistoryUncheckedUpdateInput>
  }

  /**
   * StatusHistory delete
   */
  export type StatusHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusHistory
     */
    select?: StatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StatusHistoryInclude<ExtArgs> | null
    /**
     * Filter which StatusHistory to delete.
     */
    where: StatusHistoryWhereUniqueInput
  }

  /**
   * StatusHistory deleteMany
   */
  export type StatusHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StatusHistories to delete
     */
    where?: StatusHistoryWhereInput
  }

  /**
   * StatusHistory without action
   */
  export type StatusHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusHistory
     */
    select?: StatusHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StatusHistoryInclude<ExtArgs> | null
  }


  /**
   * Model Upvote
   */

  export type AggregateUpvote = {
    _count: UpvoteCountAggregateOutputType | null
    _min: UpvoteMinAggregateOutputType | null
    _max: UpvoteMaxAggregateOutputType | null
  }

  export type UpvoteMinAggregateOutputType = {
    complaintId: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type UpvoteMaxAggregateOutputType = {
    complaintId: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type UpvoteCountAggregateOutputType = {
    complaintId: number
    userId: number
    createdAt: number
    _all: number
  }


  export type UpvoteMinAggregateInputType = {
    complaintId?: true
    userId?: true
    createdAt?: true
  }

  export type UpvoteMaxAggregateInputType = {
    complaintId?: true
    userId?: true
    createdAt?: true
  }

  export type UpvoteCountAggregateInputType = {
    complaintId?: true
    userId?: true
    createdAt?: true
    _all?: true
  }

  export type UpvoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Upvote to aggregate.
     */
    where?: UpvoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Upvotes to fetch.
     */
    orderBy?: UpvoteOrderByWithRelationInput | UpvoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UpvoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Upvotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Upvotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Upvotes
    **/
    _count?: true | UpvoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UpvoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UpvoteMaxAggregateInputType
  }

  export type GetUpvoteAggregateType<T extends UpvoteAggregateArgs> = {
        [P in keyof T & keyof AggregateUpvote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUpvote[P]>
      : GetScalarType<T[P], AggregateUpvote[P]>
  }




  export type UpvoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UpvoteWhereInput
    orderBy?: UpvoteOrderByWithAggregationInput | UpvoteOrderByWithAggregationInput[]
    by: UpvoteScalarFieldEnum[] | UpvoteScalarFieldEnum
    having?: UpvoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UpvoteCountAggregateInputType | true
    _min?: UpvoteMinAggregateInputType
    _max?: UpvoteMaxAggregateInputType
  }

  export type UpvoteGroupByOutputType = {
    complaintId: string
    userId: string
    createdAt: Date
    _count: UpvoteCountAggregateOutputType | null
    _min: UpvoteMinAggregateOutputType | null
    _max: UpvoteMaxAggregateOutputType | null
  }

  type GetUpvoteGroupByPayload<T extends UpvoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UpvoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UpvoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UpvoteGroupByOutputType[P]>
            : GetScalarType<T[P], UpvoteGroupByOutputType[P]>
        }
      >
    >


  export type UpvoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    complaintId?: boolean
    userId?: boolean
    createdAt?: boolean
    complaint?: boolean | ComplaintDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["upvote"]>

  export type UpvoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    complaintId?: boolean
    userId?: boolean
    createdAt?: boolean
    complaint?: boolean | ComplaintDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["upvote"]>

  export type UpvoteSelectScalar = {
    complaintId?: boolean
    userId?: boolean
    createdAt?: boolean
  }

  export type UpvoteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    complaint?: boolean | ComplaintDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UpvoteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    complaint?: boolean | ComplaintDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UpvotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Upvote"
    objects: {
      complaint: Prisma.$ComplaintPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      complaintId: string
      userId: string
      createdAt: Date
    }, ExtArgs["result"]["upvote"]>
    composites: {}
  }

  type UpvoteGetPayload<S extends boolean | null | undefined | UpvoteDefaultArgs> = $Result.GetResult<Prisma.$UpvotePayload, S>

  type UpvoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UpvoteFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UpvoteCountAggregateInputType | true
    }

  export interface UpvoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Upvote'], meta: { name: 'Upvote' } }
    /**
     * Find zero or one Upvote that matches the filter.
     * @param {UpvoteFindUniqueArgs} args - Arguments to find a Upvote
     * @example
     * // Get one Upvote
     * const upvote = await prisma.upvote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UpvoteFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, UpvoteFindUniqueArgs<ExtArgs>>
    ): Prisma__UpvoteClient<$Result.GetResult<Prisma.$UpvotePayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Upvote that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UpvoteFindUniqueOrThrowArgs} args - Arguments to find a Upvote
     * @example
     * // Get one Upvote
     * const upvote = await prisma.upvote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UpvoteFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UpvoteFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__UpvoteClient<$Result.GetResult<Prisma.$UpvotePayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Upvote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UpvoteFindFirstArgs} args - Arguments to find a Upvote
     * @example
     * // Get one Upvote
     * const upvote = await prisma.upvote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UpvoteFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, UpvoteFindFirstArgs<ExtArgs>>
    ): Prisma__UpvoteClient<$Result.GetResult<Prisma.$UpvotePayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Upvote that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UpvoteFindFirstOrThrowArgs} args - Arguments to find a Upvote
     * @example
     * // Get one Upvote
     * const upvote = await prisma.upvote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends UpvoteFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UpvoteFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__UpvoteClient<$Result.GetResult<Prisma.$UpvotePayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Upvotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UpvoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Upvotes
     * const upvotes = await prisma.upvote.findMany()
     * 
     * // Get first 10 Upvotes
     * const upvotes = await prisma.upvote.findMany({ take: 10 })
     * 
     * // Only select the `complaintId`
     * const upvoteWithComplaintIdOnly = await prisma.upvote.findMany({ select: { complaintId: true } })
     * 
    **/
    findMany<T extends UpvoteFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UpvoteFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UpvotePayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Upvote.
     * @param {UpvoteCreateArgs} args - Arguments to create a Upvote.
     * @example
     * // Create one Upvote
     * const Upvote = await prisma.upvote.create({
     *   data: {
     *     // ... data to create a Upvote
     *   }
     * })
     * 
    **/
    create<T extends UpvoteCreateArgs<ExtArgs>>(
      args: SelectSubset<T, UpvoteCreateArgs<ExtArgs>>
    ): Prisma__UpvoteClient<$Result.GetResult<Prisma.$UpvotePayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Upvotes.
     * @param {UpvoteCreateManyArgs} args - Arguments to create many Upvotes.
     * @example
     * // Create many Upvotes
     * const upvote = await prisma.upvote.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends UpvoteCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UpvoteCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Upvotes and returns the data saved in the database.
     * @param {UpvoteCreateManyAndReturnArgs} args - Arguments to create many Upvotes.
     * @example
     * // Create many Upvotes
     * const upvote = await prisma.upvote.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Upvotes and only return the `complaintId`
     * const upvoteWithComplaintIdOnly = await prisma.upvote.createManyAndReturn({ 
     *   select: { complaintId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends UpvoteCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, UpvoteCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UpvotePayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a Upvote.
     * @param {UpvoteDeleteArgs} args - Arguments to delete one Upvote.
     * @example
     * // Delete one Upvote
     * const Upvote = await prisma.upvote.delete({
     *   where: {
     *     // ... filter to delete one Upvote
     *   }
     * })
     * 
    **/
    delete<T extends UpvoteDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, UpvoteDeleteArgs<ExtArgs>>
    ): Prisma__UpvoteClient<$Result.GetResult<Prisma.$UpvotePayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Upvote.
     * @param {UpvoteUpdateArgs} args - Arguments to update one Upvote.
     * @example
     * // Update one Upvote
     * const upvote = await prisma.upvote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UpvoteUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, UpvoteUpdateArgs<ExtArgs>>
    ): Prisma__UpvoteClient<$Result.GetResult<Prisma.$UpvotePayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Upvotes.
     * @param {UpvoteDeleteManyArgs} args - Arguments to filter Upvotes to delete.
     * @example
     * // Delete a few Upvotes
     * const { count } = await prisma.upvote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UpvoteDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UpvoteDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Upvotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UpvoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Upvotes
     * const upvote = await prisma.upvote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UpvoteUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, UpvoteUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Upvote.
     * @param {UpvoteUpsertArgs} args - Arguments to update or create a Upvote.
     * @example
     * // Update or create a Upvote
     * const upvote = await prisma.upvote.upsert({
     *   create: {
     *     // ... data to create a Upvote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Upvote we want to update
     *   }
     * })
    **/
    upsert<T extends UpvoteUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, UpvoteUpsertArgs<ExtArgs>>
    ): Prisma__UpvoteClient<$Result.GetResult<Prisma.$UpvotePayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Upvotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UpvoteCountArgs} args - Arguments to filter Upvotes to count.
     * @example
     * // Count the number of Upvotes
     * const count = await prisma.upvote.count({
     *   where: {
     *     // ... the filter for the Upvotes we want to count
     *   }
     * })
    **/
    count<T extends UpvoteCountArgs>(
      args?: Subset<T, UpvoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UpvoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Upvote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UpvoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UpvoteAggregateArgs>(args: Subset<T, UpvoteAggregateArgs>): Prisma.PrismaPromise<GetUpvoteAggregateType<T>>

    /**
     * Group by Upvote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UpvoteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UpvoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UpvoteGroupByArgs['orderBy'] }
        : { orderBy?: UpvoteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UpvoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUpvoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Upvote model
   */
  readonly fields: UpvoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Upvote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UpvoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    complaint<T extends ComplaintDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ComplaintDefaultArgs<ExtArgs>>): Prisma__ComplaintClient<$Result.GetResult<Prisma.$ComplaintPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the Upvote model
   */ 
  interface UpvoteFieldRefs {
    readonly complaintId: FieldRef<"Upvote", 'String'>
    readonly userId: FieldRef<"Upvote", 'String'>
    readonly createdAt: FieldRef<"Upvote", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Upvote findUnique
   */
  export type UpvoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Upvote
     */
    select?: UpvoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UpvoteInclude<ExtArgs> | null
    /**
     * Filter, which Upvote to fetch.
     */
    where: UpvoteWhereUniqueInput
  }

  /**
   * Upvote findUniqueOrThrow
   */
  export type UpvoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Upvote
     */
    select?: UpvoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UpvoteInclude<ExtArgs> | null
    /**
     * Filter, which Upvote to fetch.
     */
    where: UpvoteWhereUniqueInput
  }

  /**
   * Upvote findFirst
   */
  export type UpvoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Upvote
     */
    select?: UpvoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UpvoteInclude<ExtArgs> | null
    /**
     * Filter, which Upvote to fetch.
     */
    where?: UpvoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Upvotes to fetch.
     */
    orderBy?: UpvoteOrderByWithRelationInput | UpvoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Upvotes.
     */
    cursor?: UpvoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Upvotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Upvotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Upvotes.
     */
    distinct?: UpvoteScalarFieldEnum | UpvoteScalarFieldEnum[]
  }

  /**
   * Upvote findFirstOrThrow
   */
  export type UpvoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Upvote
     */
    select?: UpvoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UpvoteInclude<ExtArgs> | null
    /**
     * Filter, which Upvote to fetch.
     */
    where?: UpvoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Upvotes to fetch.
     */
    orderBy?: UpvoteOrderByWithRelationInput | UpvoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Upvotes.
     */
    cursor?: UpvoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Upvotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Upvotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Upvotes.
     */
    distinct?: UpvoteScalarFieldEnum | UpvoteScalarFieldEnum[]
  }

  /**
   * Upvote findMany
   */
  export type UpvoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Upvote
     */
    select?: UpvoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UpvoteInclude<ExtArgs> | null
    /**
     * Filter, which Upvotes to fetch.
     */
    where?: UpvoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Upvotes to fetch.
     */
    orderBy?: UpvoteOrderByWithRelationInput | UpvoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Upvotes.
     */
    cursor?: UpvoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Upvotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Upvotes.
     */
    skip?: number
    distinct?: UpvoteScalarFieldEnum | UpvoteScalarFieldEnum[]
  }

  /**
   * Upvote create
   */
  export type UpvoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Upvote
     */
    select?: UpvoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UpvoteInclude<ExtArgs> | null
    /**
     * The data needed to create a Upvote.
     */
    data: XOR<UpvoteCreateInput, UpvoteUncheckedCreateInput>
  }

  /**
   * Upvote createMany
   */
  export type UpvoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Upvotes.
     */
    data: UpvoteCreateManyInput | UpvoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Upvote createManyAndReturn
   */
  export type UpvoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Upvote
     */
    select?: UpvoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Upvotes.
     */
    data: UpvoteCreateManyInput | UpvoteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UpvoteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Upvote update
   */
  export type UpvoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Upvote
     */
    select?: UpvoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UpvoteInclude<ExtArgs> | null
    /**
     * The data needed to update a Upvote.
     */
    data: XOR<UpvoteUpdateInput, UpvoteUncheckedUpdateInput>
    /**
     * Choose, which Upvote to update.
     */
    where: UpvoteWhereUniqueInput
  }

  /**
   * Upvote updateMany
   */
  export type UpvoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Upvotes.
     */
    data: XOR<UpvoteUpdateManyMutationInput, UpvoteUncheckedUpdateManyInput>
    /**
     * Filter which Upvotes to update
     */
    where?: UpvoteWhereInput
  }

  /**
   * Upvote upsert
   */
  export type UpvoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Upvote
     */
    select?: UpvoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UpvoteInclude<ExtArgs> | null
    /**
     * The filter to search for the Upvote to update in case it exists.
     */
    where: UpvoteWhereUniqueInput
    /**
     * In case the Upvote found by the `where` argument doesn't exist, create a new Upvote with this data.
     */
    create: XOR<UpvoteCreateInput, UpvoteUncheckedCreateInput>
    /**
     * In case the Upvote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UpvoteUpdateInput, UpvoteUncheckedUpdateInput>
  }

  /**
   * Upvote delete
   */
  export type UpvoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Upvote
     */
    select?: UpvoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UpvoteInclude<ExtArgs> | null
    /**
     * Filter which Upvote to delete.
     */
    where: UpvoteWhereUniqueInput
  }

  /**
   * Upvote deleteMany
   */
  export type UpvoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Upvotes to delete
     */
    where?: UpvoteWhereInput
  }

  /**
   * Upvote without action
   */
  export type UpvoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Upvote
     */
    select?: UpvoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UpvoteInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    name: 'name',
    phone: 'phone',
    role: 'role',
    avatar: 'avatar',
    emailVerified: 'emailVerified',
    failedLoginAttempts: 'failedLoginAttempts',
    lockedUntil: 'lockedUntil',
    lastLoginAt: 'lastLoginAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ComplaintScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    category: 'category',
    status: 'status',
    location: 'location',
    priority: 'priority',
    userId: 'userId',
    assignedToId: 'assignedToId',
    resolvedAt: 'resolvedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type ComplaintScalarFieldEnum = (typeof ComplaintScalarFieldEnum)[keyof typeof ComplaintScalarFieldEnum]


  export const AttachmentScalarFieldEnum: {
    id: 'id',
    complaintId: 'complaintId',
    userId: 'userId',
    filename: 'filename',
    cloudinaryId: 'cloudinaryId',
    url: 'url',
    thumbnailUrl: 'thumbnailUrl',
    mimeType: 'mimeType',
    size: 'size',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AttachmentScalarFieldEnum = (typeof AttachmentScalarFieldEnum)[keyof typeof AttachmentScalarFieldEnum]


  export const StatusHistoryScalarFieldEnum: {
    id: 'id',
    complaintId: 'complaintId',
    fromStatus: 'fromStatus',
    toStatus: 'toStatus',
    changedById: 'changedById',
    comment: 'comment',
    createdAt: 'createdAt'
  };

  export type StatusHistoryScalarFieldEnum = (typeof StatusHistoryScalarFieldEnum)[keyof typeof StatusHistoryScalarFieldEnum]


  export const UpvoteScalarFieldEnum: {
    complaintId: 'complaintId',
    userId: 'userId',
    createdAt: 'createdAt'
  };

  export type UpvoteScalarFieldEnum = (typeof UpvoteScalarFieldEnum)[keyof typeof UpvoteScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'ComplaintCategory'
   */
  export type EnumComplaintCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ComplaintCategory'>
    


  /**
   * Reference to a field of type 'ComplaintCategory[]'
   */
  export type ListEnumComplaintCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ComplaintCategory[]'>
    


  /**
   * Reference to a field of type 'ComplaintStatus'
   */
  export type EnumComplaintStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ComplaintStatus'>
    


  /**
   * Reference to a field of type 'ComplaintStatus[]'
   */
  export type ListEnumComplaintStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ComplaintStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    avatar?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    failedLoginAttempts?: IntFilter<"User"> | number
    lockedUntil?: DateTimeNullableFilter<"User"> | Date | string | null
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    complaints?: ComplaintListRelationFilter
    assignedComplaints?: ComplaintListRelationFilter
    attachments?: AttachmentListRelationFilter
    statusHistories?: StatusHistoryListRelationFilter
    upvotes?: UpvoteListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    role?: SortOrder
    avatar?: SortOrderInput | SortOrder
    emailVerified?: SortOrderInput | SortOrder
    failedLoginAttempts?: SortOrder
    lockedUntil?: SortOrderInput | SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    complaints?: ComplaintOrderByRelationAggregateInput
    assignedComplaints?: ComplaintOrderByRelationAggregateInput
    attachments?: AttachmentOrderByRelationAggregateInput
    statusHistories?: StatusHistoryOrderByRelationAggregateInput
    upvotes?: UpvoteOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    avatar?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    failedLoginAttempts?: IntFilter<"User"> | number
    lockedUntil?: DateTimeNullableFilter<"User"> | Date | string | null
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    complaints?: ComplaintListRelationFilter
    assignedComplaints?: ComplaintListRelationFilter
    attachments?: AttachmentListRelationFilter
    statusHistories?: StatusHistoryListRelationFilter
    upvotes?: UpvoteListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    role?: SortOrder
    avatar?: SortOrderInput | SortOrder
    emailVerified?: SortOrderInput | SortOrder
    failedLoginAttempts?: SortOrder
    lockedUntil?: SortOrderInput | SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    emailVerified?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    failedLoginAttempts?: IntWithAggregatesFilter<"User"> | number
    lockedUntil?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type ComplaintWhereInput = {
    AND?: ComplaintWhereInput | ComplaintWhereInput[]
    OR?: ComplaintWhereInput[]
    NOT?: ComplaintWhereInput | ComplaintWhereInput[]
    id?: StringFilter<"Complaint"> | string
    title?: StringFilter<"Complaint"> | string
    description?: StringFilter<"Complaint"> | string
    category?: EnumComplaintCategoryFilter<"Complaint"> | $Enums.ComplaintCategory
    status?: EnumComplaintStatusFilter<"Complaint"> | $Enums.ComplaintStatus
    location?: JsonNullableFilter<"Complaint">
    priority?: IntFilter<"Complaint"> | number
    userId?: StringFilter<"Complaint"> | string
    assignedToId?: StringNullableFilter<"Complaint"> | string | null
    resolvedAt?: DateTimeNullableFilter<"Complaint"> | Date | string | null
    createdAt?: DateTimeFilter<"Complaint"> | Date | string
    updatedAt?: DateTimeFilter<"Complaint"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Complaint"> | Date | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    assignedTo?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    attachments?: AttachmentListRelationFilter
    statusHistory?: StatusHistoryListRelationFilter
    upvotes?: UpvoteListRelationFilter
  }

  export type ComplaintOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    status?: SortOrder
    location?: SortOrderInput | SortOrder
    priority?: SortOrder
    userId?: SortOrder
    assignedToId?: SortOrderInput | SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    assignedTo?: UserOrderByWithRelationInput
    attachments?: AttachmentOrderByRelationAggregateInput
    statusHistory?: StatusHistoryOrderByRelationAggregateInput
    upvotes?: UpvoteOrderByRelationAggregateInput
  }

  export type ComplaintWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ComplaintWhereInput | ComplaintWhereInput[]
    OR?: ComplaintWhereInput[]
    NOT?: ComplaintWhereInput | ComplaintWhereInput[]
    title?: StringFilter<"Complaint"> | string
    description?: StringFilter<"Complaint"> | string
    category?: EnumComplaintCategoryFilter<"Complaint"> | $Enums.ComplaintCategory
    status?: EnumComplaintStatusFilter<"Complaint"> | $Enums.ComplaintStatus
    location?: JsonNullableFilter<"Complaint">
    priority?: IntFilter<"Complaint"> | number
    userId?: StringFilter<"Complaint"> | string
    assignedToId?: StringNullableFilter<"Complaint"> | string | null
    resolvedAt?: DateTimeNullableFilter<"Complaint"> | Date | string | null
    createdAt?: DateTimeFilter<"Complaint"> | Date | string
    updatedAt?: DateTimeFilter<"Complaint"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Complaint"> | Date | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    assignedTo?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    attachments?: AttachmentListRelationFilter
    statusHistory?: StatusHistoryListRelationFilter
    upvotes?: UpvoteListRelationFilter
  }, "id">

  export type ComplaintOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    status?: SortOrder
    location?: SortOrderInput | SortOrder
    priority?: SortOrder
    userId?: SortOrder
    assignedToId?: SortOrderInput | SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: ComplaintCountOrderByAggregateInput
    _avg?: ComplaintAvgOrderByAggregateInput
    _max?: ComplaintMaxOrderByAggregateInput
    _min?: ComplaintMinOrderByAggregateInput
    _sum?: ComplaintSumOrderByAggregateInput
  }

  export type ComplaintScalarWhereWithAggregatesInput = {
    AND?: ComplaintScalarWhereWithAggregatesInput | ComplaintScalarWhereWithAggregatesInput[]
    OR?: ComplaintScalarWhereWithAggregatesInput[]
    NOT?: ComplaintScalarWhereWithAggregatesInput | ComplaintScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Complaint"> | string
    title?: StringWithAggregatesFilter<"Complaint"> | string
    description?: StringWithAggregatesFilter<"Complaint"> | string
    category?: EnumComplaintCategoryWithAggregatesFilter<"Complaint"> | $Enums.ComplaintCategory
    status?: EnumComplaintStatusWithAggregatesFilter<"Complaint"> | $Enums.ComplaintStatus
    location?: JsonNullableWithAggregatesFilter<"Complaint">
    priority?: IntWithAggregatesFilter<"Complaint"> | number
    userId?: StringWithAggregatesFilter<"Complaint"> | string
    assignedToId?: StringNullableWithAggregatesFilter<"Complaint"> | string | null
    resolvedAt?: DateTimeNullableWithAggregatesFilter<"Complaint"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Complaint"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Complaint"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Complaint"> | Date | string | null
  }

  export type AttachmentWhereInput = {
    AND?: AttachmentWhereInput | AttachmentWhereInput[]
    OR?: AttachmentWhereInput[]
    NOT?: AttachmentWhereInput | AttachmentWhereInput[]
    id?: StringFilter<"Attachment"> | string
    complaintId?: StringNullableFilter<"Attachment"> | string | null
    userId?: StringFilter<"Attachment"> | string
    filename?: StringFilter<"Attachment"> | string
    cloudinaryId?: StringNullableFilter<"Attachment"> | string | null
    url?: StringFilter<"Attachment"> | string
    thumbnailUrl?: StringNullableFilter<"Attachment"> | string | null
    mimeType?: StringFilter<"Attachment"> | string
    size?: IntFilter<"Attachment"> | number
    createdAt?: DateTimeFilter<"Attachment"> | Date | string
    updatedAt?: DateTimeFilter<"Attachment"> | Date | string
    complaint?: XOR<ComplaintNullableRelationFilter, ComplaintWhereInput> | null
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type AttachmentOrderByWithRelationInput = {
    id?: SortOrder
    complaintId?: SortOrderInput | SortOrder
    userId?: SortOrder
    filename?: SortOrder
    cloudinaryId?: SortOrderInput | SortOrder
    url?: SortOrder
    thumbnailUrl?: SortOrderInput | SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    complaint?: ComplaintOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type AttachmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AttachmentWhereInput | AttachmentWhereInput[]
    OR?: AttachmentWhereInput[]
    NOT?: AttachmentWhereInput | AttachmentWhereInput[]
    complaintId?: StringNullableFilter<"Attachment"> | string | null
    userId?: StringFilter<"Attachment"> | string
    filename?: StringFilter<"Attachment"> | string
    cloudinaryId?: StringNullableFilter<"Attachment"> | string | null
    url?: StringFilter<"Attachment"> | string
    thumbnailUrl?: StringNullableFilter<"Attachment"> | string | null
    mimeType?: StringFilter<"Attachment"> | string
    size?: IntFilter<"Attachment"> | number
    createdAt?: DateTimeFilter<"Attachment"> | Date | string
    updatedAt?: DateTimeFilter<"Attachment"> | Date | string
    complaint?: XOR<ComplaintNullableRelationFilter, ComplaintWhereInput> | null
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type AttachmentOrderByWithAggregationInput = {
    id?: SortOrder
    complaintId?: SortOrderInput | SortOrder
    userId?: SortOrder
    filename?: SortOrder
    cloudinaryId?: SortOrderInput | SortOrder
    url?: SortOrder
    thumbnailUrl?: SortOrderInput | SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AttachmentCountOrderByAggregateInput
    _avg?: AttachmentAvgOrderByAggregateInput
    _max?: AttachmentMaxOrderByAggregateInput
    _min?: AttachmentMinOrderByAggregateInput
    _sum?: AttachmentSumOrderByAggregateInput
  }

  export type AttachmentScalarWhereWithAggregatesInput = {
    AND?: AttachmentScalarWhereWithAggregatesInput | AttachmentScalarWhereWithAggregatesInput[]
    OR?: AttachmentScalarWhereWithAggregatesInput[]
    NOT?: AttachmentScalarWhereWithAggregatesInput | AttachmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Attachment"> | string
    complaintId?: StringNullableWithAggregatesFilter<"Attachment"> | string | null
    userId?: StringWithAggregatesFilter<"Attachment"> | string
    filename?: StringWithAggregatesFilter<"Attachment"> | string
    cloudinaryId?: StringNullableWithAggregatesFilter<"Attachment"> | string | null
    url?: StringWithAggregatesFilter<"Attachment"> | string
    thumbnailUrl?: StringNullableWithAggregatesFilter<"Attachment"> | string | null
    mimeType?: StringWithAggregatesFilter<"Attachment"> | string
    size?: IntWithAggregatesFilter<"Attachment"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Attachment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Attachment"> | Date | string
  }

  export type StatusHistoryWhereInput = {
    AND?: StatusHistoryWhereInput | StatusHistoryWhereInput[]
    OR?: StatusHistoryWhereInput[]
    NOT?: StatusHistoryWhereInput | StatusHistoryWhereInput[]
    id?: StringFilter<"StatusHistory"> | string
    complaintId?: StringFilter<"StatusHistory"> | string
    fromStatus?: EnumComplaintStatusFilter<"StatusHistory"> | $Enums.ComplaintStatus
    toStatus?: EnumComplaintStatusFilter<"StatusHistory"> | $Enums.ComplaintStatus
    changedById?: StringFilter<"StatusHistory"> | string
    comment?: StringNullableFilter<"StatusHistory"> | string | null
    createdAt?: DateTimeFilter<"StatusHistory"> | Date | string
    complaint?: XOR<ComplaintRelationFilter, ComplaintWhereInput>
    changedBy?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type StatusHistoryOrderByWithRelationInput = {
    id?: SortOrder
    complaintId?: SortOrder
    fromStatus?: SortOrder
    toStatus?: SortOrder
    changedById?: SortOrder
    comment?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    complaint?: ComplaintOrderByWithRelationInput
    changedBy?: UserOrderByWithRelationInput
  }

  export type StatusHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StatusHistoryWhereInput | StatusHistoryWhereInput[]
    OR?: StatusHistoryWhereInput[]
    NOT?: StatusHistoryWhereInput | StatusHistoryWhereInput[]
    complaintId?: StringFilter<"StatusHistory"> | string
    fromStatus?: EnumComplaintStatusFilter<"StatusHistory"> | $Enums.ComplaintStatus
    toStatus?: EnumComplaintStatusFilter<"StatusHistory"> | $Enums.ComplaintStatus
    changedById?: StringFilter<"StatusHistory"> | string
    comment?: StringNullableFilter<"StatusHistory"> | string | null
    createdAt?: DateTimeFilter<"StatusHistory"> | Date | string
    complaint?: XOR<ComplaintRelationFilter, ComplaintWhereInput>
    changedBy?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type StatusHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    complaintId?: SortOrder
    fromStatus?: SortOrder
    toStatus?: SortOrder
    changedById?: SortOrder
    comment?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: StatusHistoryCountOrderByAggregateInput
    _max?: StatusHistoryMaxOrderByAggregateInput
    _min?: StatusHistoryMinOrderByAggregateInput
  }

  export type StatusHistoryScalarWhereWithAggregatesInput = {
    AND?: StatusHistoryScalarWhereWithAggregatesInput | StatusHistoryScalarWhereWithAggregatesInput[]
    OR?: StatusHistoryScalarWhereWithAggregatesInput[]
    NOT?: StatusHistoryScalarWhereWithAggregatesInput | StatusHistoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StatusHistory"> | string
    complaintId?: StringWithAggregatesFilter<"StatusHistory"> | string
    fromStatus?: EnumComplaintStatusWithAggregatesFilter<"StatusHistory"> | $Enums.ComplaintStatus
    toStatus?: EnumComplaintStatusWithAggregatesFilter<"StatusHistory"> | $Enums.ComplaintStatus
    changedById?: StringWithAggregatesFilter<"StatusHistory"> | string
    comment?: StringNullableWithAggregatesFilter<"StatusHistory"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"StatusHistory"> | Date | string
  }

  export type UpvoteWhereInput = {
    AND?: UpvoteWhereInput | UpvoteWhereInput[]
    OR?: UpvoteWhereInput[]
    NOT?: UpvoteWhereInput | UpvoteWhereInput[]
    complaintId?: StringFilter<"Upvote"> | string
    userId?: StringFilter<"Upvote"> | string
    createdAt?: DateTimeFilter<"Upvote"> | Date | string
    complaint?: XOR<ComplaintRelationFilter, ComplaintWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type UpvoteOrderByWithRelationInput = {
    complaintId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    complaint?: ComplaintOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type UpvoteWhereUniqueInput = Prisma.AtLeast<{
    complaintId_userId?: UpvoteComplaintIdUserIdCompoundUniqueInput
    AND?: UpvoteWhereInput | UpvoteWhereInput[]
    OR?: UpvoteWhereInput[]
    NOT?: UpvoteWhereInput | UpvoteWhereInput[]
    complaintId?: StringFilter<"Upvote"> | string
    userId?: StringFilter<"Upvote"> | string
    createdAt?: DateTimeFilter<"Upvote"> | Date | string
    complaint?: XOR<ComplaintRelationFilter, ComplaintWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "complaintId_userId">

  export type UpvoteOrderByWithAggregationInput = {
    complaintId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    _count?: UpvoteCountOrderByAggregateInput
    _max?: UpvoteMaxOrderByAggregateInput
    _min?: UpvoteMinOrderByAggregateInput
  }

  export type UpvoteScalarWhereWithAggregatesInput = {
    AND?: UpvoteScalarWhereWithAggregatesInput | UpvoteScalarWhereWithAggregatesInput[]
    OR?: UpvoteScalarWhereWithAggregatesInput[]
    NOT?: UpvoteScalarWhereWithAggregatesInput | UpvoteScalarWhereWithAggregatesInput[]
    complaintId?: StringWithAggregatesFilter<"Upvote"> | string
    userId?: StringWithAggregatesFilter<"Upvote"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Upvote"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    password: string
    name: string
    phone?: string | null
    role?: $Enums.UserRole
    avatar?: string | null
    emailVerified?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    complaints?: ComplaintCreateNestedManyWithoutUserInput
    assignedComplaints?: ComplaintCreateNestedManyWithoutAssignedToInput
    attachments?: AttachmentCreateNestedManyWithoutUserInput
    statusHistories?: StatusHistoryCreateNestedManyWithoutChangedByInput
    upvotes?: UpvoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    password: string
    name: string
    phone?: string | null
    role?: $Enums.UserRole
    avatar?: string | null
    emailVerified?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    complaints?: ComplaintUncheckedCreateNestedManyWithoutUserInput
    assignedComplaints?: ComplaintUncheckedCreateNestedManyWithoutAssignedToInput
    attachments?: AttachmentUncheckedCreateNestedManyWithoutUserInput
    statusHistories?: StatusHistoryUncheckedCreateNestedManyWithoutChangedByInput
    upvotes?: UpvoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    complaints?: ComplaintUpdateManyWithoutUserNestedInput
    assignedComplaints?: ComplaintUpdateManyWithoutAssignedToNestedInput
    attachments?: AttachmentUpdateManyWithoutUserNestedInput
    statusHistories?: StatusHistoryUpdateManyWithoutChangedByNestedInput
    upvotes?: UpvoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    complaints?: ComplaintUncheckedUpdateManyWithoutUserNestedInput
    assignedComplaints?: ComplaintUncheckedUpdateManyWithoutAssignedToNestedInput
    attachments?: AttachmentUncheckedUpdateManyWithoutUserNestedInput
    statusHistories?: StatusHistoryUncheckedUpdateManyWithoutChangedByNestedInput
    upvotes?: UpvoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    password: string
    name: string
    phone?: string | null
    role?: $Enums.UserRole
    avatar?: string | null
    emailVerified?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ComplaintCreateInput = {
    id?: string
    title: string
    description: string
    category: $Enums.ComplaintCategory
    status?: $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: number
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutComplaintsInput
    assignedTo?: UserCreateNestedOneWithoutAssignedComplaintsInput
    attachments?: AttachmentCreateNestedManyWithoutComplaintInput
    statusHistory?: StatusHistoryCreateNestedManyWithoutComplaintInput
    upvotes?: UpvoteCreateNestedManyWithoutComplaintInput
  }

  export type ComplaintUncheckedCreateInput = {
    id?: string
    title: string
    description: string
    category: $Enums.ComplaintCategory
    status?: $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: number
    userId: string
    assignedToId?: string | null
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    attachments?: AttachmentUncheckedCreateNestedManyWithoutComplaintInput
    statusHistory?: StatusHistoryUncheckedCreateNestedManyWithoutComplaintInput
    upvotes?: UpvoteUncheckedCreateNestedManyWithoutComplaintInput
  }

  export type ComplaintUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumComplaintCategoryFieldUpdateOperationsInput | $Enums.ComplaintCategory
    status?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutComplaintsNestedInput
    assignedTo?: UserUpdateOneWithoutAssignedComplaintsNestedInput
    attachments?: AttachmentUpdateManyWithoutComplaintNestedInput
    statusHistory?: StatusHistoryUpdateManyWithoutComplaintNestedInput
    upvotes?: UpvoteUpdateManyWithoutComplaintNestedInput
  }

  export type ComplaintUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumComplaintCategoryFieldUpdateOperationsInput | $Enums.ComplaintCategory
    status?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attachments?: AttachmentUncheckedUpdateManyWithoutComplaintNestedInput
    statusHistory?: StatusHistoryUncheckedUpdateManyWithoutComplaintNestedInput
    upvotes?: UpvoteUncheckedUpdateManyWithoutComplaintNestedInput
  }

  export type ComplaintCreateManyInput = {
    id?: string
    title: string
    description: string
    category: $Enums.ComplaintCategory
    status?: $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: number
    userId: string
    assignedToId?: string | null
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type ComplaintUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumComplaintCategoryFieldUpdateOperationsInput | $Enums.ComplaintCategory
    status?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ComplaintUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumComplaintCategoryFieldUpdateOperationsInput | $Enums.ComplaintCategory
    status?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AttachmentCreateInput = {
    id?: string
    filename: string
    cloudinaryId?: string | null
    url: string
    thumbnailUrl?: string | null
    mimeType: string
    size: number
    createdAt?: Date | string
    updatedAt?: Date | string
    complaint?: ComplaintCreateNestedOneWithoutAttachmentsInput
    user: UserCreateNestedOneWithoutAttachmentsInput
  }

  export type AttachmentUncheckedCreateInput = {
    id?: string
    complaintId?: string | null
    userId: string
    filename: string
    cloudinaryId?: string | null
    url: string
    thumbnailUrl?: string | null
    mimeType: string
    size: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AttachmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    cloudinaryId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    complaint?: ComplaintUpdateOneWithoutAttachmentsNestedInput
    user?: UserUpdateOneRequiredWithoutAttachmentsNestedInput
  }

  export type AttachmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    complaintId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    cloudinaryId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttachmentCreateManyInput = {
    id?: string
    complaintId?: string | null
    userId: string
    filename: string
    cloudinaryId?: string | null
    url: string
    thumbnailUrl?: string | null
    mimeType: string
    size: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AttachmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    cloudinaryId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttachmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    complaintId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    cloudinaryId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StatusHistoryCreateInput = {
    id?: string
    fromStatus: $Enums.ComplaintStatus
    toStatus: $Enums.ComplaintStatus
    comment?: string | null
    createdAt?: Date | string
    complaint: ComplaintCreateNestedOneWithoutStatusHistoryInput
    changedBy: UserCreateNestedOneWithoutStatusHistoriesInput
  }

  export type StatusHistoryUncheckedCreateInput = {
    id?: string
    complaintId: string
    fromStatus: $Enums.ComplaintStatus
    toStatus: $Enums.ComplaintStatus
    changedById: string
    comment?: string | null
    createdAt?: Date | string
  }

  export type StatusHistoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromStatus?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    toStatus?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    complaint?: ComplaintUpdateOneRequiredWithoutStatusHistoryNestedInput
    changedBy?: UserUpdateOneRequiredWithoutStatusHistoriesNestedInput
  }

  export type StatusHistoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    complaintId?: StringFieldUpdateOperationsInput | string
    fromStatus?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    toStatus?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    changedById?: StringFieldUpdateOperationsInput | string
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StatusHistoryCreateManyInput = {
    id?: string
    complaintId: string
    fromStatus: $Enums.ComplaintStatus
    toStatus: $Enums.ComplaintStatus
    changedById: string
    comment?: string | null
    createdAt?: Date | string
  }

  export type StatusHistoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromStatus?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    toStatus?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StatusHistoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    complaintId?: StringFieldUpdateOperationsInput | string
    fromStatus?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    toStatus?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    changedById?: StringFieldUpdateOperationsInput | string
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UpvoteCreateInput = {
    createdAt?: Date | string
    complaint: ComplaintCreateNestedOneWithoutUpvotesInput
    user: UserCreateNestedOneWithoutUpvotesInput
  }

  export type UpvoteUncheckedCreateInput = {
    complaintId: string
    userId: string
    createdAt?: Date | string
  }

  export type UpvoteUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    complaint?: ComplaintUpdateOneRequiredWithoutUpvotesNestedInput
    user?: UserUpdateOneRequiredWithoutUpvotesNestedInput
  }

  export type UpvoteUncheckedUpdateInput = {
    complaintId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UpvoteCreateManyInput = {
    complaintId: string
    userId: string
    createdAt?: Date | string
  }

  export type UpvoteUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UpvoteUncheckedUpdateManyInput = {
    complaintId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ComplaintListRelationFilter = {
    every?: ComplaintWhereInput
    some?: ComplaintWhereInput
    none?: ComplaintWhereInput
  }

  export type AttachmentListRelationFilter = {
    every?: AttachmentWhereInput
    some?: AttachmentWhereInput
    none?: AttachmentWhereInput
  }

  export type StatusHistoryListRelationFilter = {
    every?: StatusHistoryWhereInput
    some?: StatusHistoryWhereInput
    none?: StatusHistoryWhereInput
  }

  export type UpvoteListRelationFilter = {
    every?: UpvoteWhereInput
    some?: UpvoteWhereInput
    none?: UpvoteWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ComplaintOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AttachmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StatusHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UpvoteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
    emailVerified?: SortOrder
    failedLoginAttempts?: SortOrder
    lockedUntil?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    failedLoginAttempts?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
    emailVerified?: SortOrder
    failedLoginAttempts?: SortOrder
    lockedUntil?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
    emailVerified?: SortOrder
    failedLoginAttempts?: SortOrder
    lockedUntil?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    failedLoginAttempts?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumComplaintCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.ComplaintCategory | EnumComplaintCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ComplaintCategory[] | ListEnumComplaintCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ComplaintCategory[] | ListEnumComplaintCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumComplaintCategoryFilter<$PrismaModel> | $Enums.ComplaintCategory
  }

  export type EnumComplaintStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ComplaintStatus | EnumComplaintStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ComplaintStatus[] | ListEnumComplaintStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ComplaintStatus[] | ListEnumComplaintStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumComplaintStatusFilter<$PrismaModel> | $Enums.ComplaintStatus
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type ComplaintCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    status?: SortOrder
    location?: SortOrder
    priority?: SortOrder
    userId?: SortOrder
    assignedToId?: SortOrder
    resolvedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type ComplaintAvgOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type ComplaintMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    userId?: SortOrder
    assignedToId?: SortOrder
    resolvedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type ComplaintMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    userId?: SortOrder
    assignedToId?: SortOrder
    resolvedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type ComplaintSumOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type EnumComplaintCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ComplaintCategory | EnumComplaintCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ComplaintCategory[] | ListEnumComplaintCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ComplaintCategory[] | ListEnumComplaintCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumComplaintCategoryWithAggregatesFilter<$PrismaModel> | $Enums.ComplaintCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumComplaintCategoryFilter<$PrismaModel>
    _max?: NestedEnumComplaintCategoryFilter<$PrismaModel>
  }

  export type EnumComplaintStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ComplaintStatus | EnumComplaintStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ComplaintStatus[] | ListEnumComplaintStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ComplaintStatus[] | ListEnumComplaintStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumComplaintStatusWithAggregatesFilter<$PrismaModel> | $Enums.ComplaintStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumComplaintStatusFilter<$PrismaModel>
    _max?: NestedEnumComplaintStatusFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type ComplaintNullableRelationFilter = {
    is?: ComplaintWhereInput | null
    isNot?: ComplaintWhereInput | null
  }

  export type AttachmentCountOrderByAggregateInput = {
    id?: SortOrder
    complaintId?: SortOrder
    userId?: SortOrder
    filename?: SortOrder
    cloudinaryId?: SortOrder
    url?: SortOrder
    thumbnailUrl?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AttachmentAvgOrderByAggregateInput = {
    size?: SortOrder
  }

  export type AttachmentMaxOrderByAggregateInput = {
    id?: SortOrder
    complaintId?: SortOrder
    userId?: SortOrder
    filename?: SortOrder
    cloudinaryId?: SortOrder
    url?: SortOrder
    thumbnailUrl?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AttachmentMinOrderByAggregateInput = {
    id?: SortOrder
    complaintId?: SortOrder
    userId?: SortOrder
    filename?: SortOrder
    cloudinaryId?: SortOrder
    url?: SortOrder
    thumbnailUrl?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AttachmentSumOrderByAggregateInput = {
    size?: SortOrder
  }

  export type ComplaintRelationFilter = {
    is?: ComplaintWhereInput
    isNot?: ComplaintWhereInput
  }

  export type StatusHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    complaintId?: SortOrder
    fromStatus?: SortOrder
    toStatus?: SortOrder
    changedById?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type StatusHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    complaintId?: SortOrder
    fromStatus?: SortOrder
    toStatus?: SortOrder
    changedById?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type StatusHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    complaintId?: SortOrder
    fromStatus?: SortOrder
    toStatus?: SortOrder
    changedById?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type UpvoteComplaintIdUserIdCompoundUniqueInput = {
    complaintId: string
    userId: string
  }

  export type UpvoteCountOrderByAggregateInput = {
    complaintId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type UpvoteMaxOrderByAggregateInput = {
    complaintId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type UpvoteMinOrderByAggregateInput = {
    complaintId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type ComplaintCreateNestedManyWithoutUserInput = {
    create?: XOR<ComplaintCreateWithoutUserInput, ComplaintUncheckedCreateWithoutUserInput> | ComplaintCreateWithoutUserInput[] | ComplaintUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ComplaintCreateOrConnectWithoutUserInput | ComplaintCreateOrConnectWithoutUserInput[]
    createMany?: ComplaintCreateManyUserInputEnvelope
    connect?: ComplaintWhereUniqueInput | ComplaintWhereUniqueInput[]
  }

  export type ComplaintCreateNestedManyWithoutAssignedToInput = {
    create?: XOR<ComplaintCreateWithoutAssignedToInput, ComplaintUncheckedCreateWithoutAssignedToInput> | ComplaintCreateWithoutAssignedToInput[] | ComplaintUncheckedCreateWithoutAssignedToInput[]
    connectOrCreate?: ComplaintCreateOrConnectWithoutAssignedToInput | ComplaintCreateOrConnectWithoutAssignedToInput[]
    createMany?: ComplaintCreateManyAssignedToInputEnvelope
    connect?: ComplaintWhereUniqueInput | ComplaintWhereUniqueInput[]
  }

  export type AttachmentCreateNestedManyWithoutUserInput = {
    create?: XOR<AttachmentCreateWithoutUserInput, AttachmentUncheckedCreateWithoutUserInput> | AttachmentCreateWithoutUserInput[] | AttachmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AttachmentCreateOrConnectWithoutUserInput | AttachmentCreateOrConnectWithoutUserInput[]
    createMany?: AttachmentCreateManyUserInputEnvelope
    connect?: AttachmentWhereUniqueInput | AttachmentWhereUniqueInput[]
  }

  export type StatusHistoryCreateNestedManyWithoutChangedByInput = {
    create?: XOR<StatusHistoryCreateWithoutChangedByInput, StatusHistoryUncheckedCreateWithoutChangedByInput> | StatusHistoryCreateWithoutChangedByInput[] | StatusHistoryUncheckedCreateWithoutChangedByInput[]
    connectOrCreate?: StatusHistoryCreateOrConnectWithoutChangedByInput | StatusHistoryCreateOrConnectWithoutChangedByInput[]
    createMany?: StatusHistoryCreateManyChangedByInputEnvelope
    connect?: StatusHistoryWhereUniqueInput | StatusHistoryWhereUniqueInput[]
  }

  export type UpvoteCreateNestedManyWithoutUserInput = {
    create?: XOR<UpvoteCreateWithoutUserInput, UpvoteUncheckedCreateWithoutUserInput> | UpvoteCreateWithoutUserInput[] | UpvoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UpvoteCreateOrConnectWithoutUserInput | UpvoteCreateOrConnectWithoutUserInput[]
    createMany?: UpvoteCreateManyUserInputEnvelope
    connect?: UpvoteWhereUniqueInput | UpvoteWhereUniqueInput[]
  }

  export type ComplaintUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ComplaintCreateWithoutUserInput, ComplaintUncheckedCreateWithoutUserInput> | ComplaintCreateWithoutUserInput[] | ComplaintUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ComplaintCreateOrConnectWithoutUserInput | ComplaintCreateOrConnectWithoutUserInput[]
    createMany?: ComplaintCreateManyUserInputEnvelope
    connect?: ComplaintWhereUniqueInput | ComplaintWhereUniqueInput[]
  }

  export type ComplaintUncheckedCreateNestedManyWithoutAssignedToInput = {
    create?: XOR<ComplaintCreateWithoutAssignedToInput, ComplaintUncheckedCreateWithoutAssignedToInput> | ComplaintCreateWithoutAssignedToInput[] | ComplaintUncheckedCreateWithoutAssignedToInput[]
    connectOrCreate?: ComplaintCreateOrConnectWithoutAssignedToInput | ComplaintCreateOrConnectWithoutAssignedToInput[]
    createMany?: ComplaintCreateManyAssignedToInputEnvelope
    connect?: ComplaintWhereUniqueInput | ComplaintWhereUniqueInput[]
  }

  export type AttachmentUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AttachmentCreateWithoutUserInput, AttachmentUncheckedCreateWithoutUserInput> | AttachmentCreateWithoutUserInput[] | AttachmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AttachmentCreateOrConnectWithoutUserInput | AttachmentCreateOrConnectWithoutUserInput[]
    createMany?: AttachmentCreateManyUserInputEnvelope
    connect?: AttachmentWhereUniqueInput | AttachmentWhereUniqueInput[]
  }

  export type StatusHistoryUncheckedCreateNestedManyWithoutChangedByInput = {
    create?: XOR<StatusHistoryCreateWithoutChangedByInput, StatusHistoryUncheckedCreateWithoutChangedByInput> | StatusHistoryCreateWithoutChangedByInput[] | StatusHistoryUncheckedCreateWithoutChangedByInput[]
    connectOrCreate?: StatusHistoryCreateOrConnectWithoutChangedByInput | StatusHistoryCreateOrConnectWithoutChangedByInput[]
    createMany?: StatusHistoryCreateManyChangedByInputEnvelope
    connect?: StatusHistoryWhereUniqueInput | StatusHistoryWhereUniqueInput[]
  }

  export type UpvoteUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UpvoteCreateWithoutUserInput, UpvoteUncheckedCreateWithoutUserInput> | UpvoteCreateWithoutUserInput[] | UpvoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UpvoteCreateOrConnectWithoutUserInput | UpvoteCreateOrConnectWithoutUserInput[]
    createMany?: UpvoteCreateManyUserInputEnvelope
    connect?: UpvoteWhereUniqueInput | UpvoteWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ComplaintUpdateManyWithoutUserNestedInput = {
    create?: XOR<ComplaintCreateWithoutUserInput, ComplaintUncheckedCreateWithoutUserInput> | ComplaintCreateWithoutUserInput[] | ComplaintUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ComplaintCreateOrConnectWithoutUserInput | ComplaintCreateOrConnectWithoutUserInput[]
    upsert?: ComplaintUpsertWithWhereUniqueWithoutUserInput | ComplaintUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ComplaintCreateManyUserInputEnvelope
    set?: ComplaintWhereUniqueInput | ComplaintWhereUniqueInput[]
    disconnect?: ComplaintWhereUniqueInput | ComplaintWhereUniqueInput[]
    delete?: ComplaintWhereUniqueInput | ComplaintWhereUniqueInput[]
    connect?: ComplaintWhereUniqueInput | ComplaintWhereUniqueInput[]
    update?: ComplaintUpdateWithWhereUniqueWithoutUserInput | ComplaintUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ComplaintUpdateManyWithWhereWithoutUserInput | ComplaintUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ComplaintScalarWhereInput | ComplaintScalarWhereInput[]
  }

  export type ComplaintUpdateManyWithoutAssignedToNestedInput = {
    create?: XOR<ComplaintCreateWithoutAssignedToInput, ComplaintUncheckedCreateWithoutAssignedToInput> | ComplaintCreateWithoutAssignedToInput[] | ComplaintUncheckedCreateWithoutAssignedToInput[]
    connectOrCreate?: ComplaintCreateOrConnectWithoutAssignedToInput | ComplaintCreateOrConnectWithoutAssignedToInput[]
    upsert?: ComplaintUpsertWithWhereUniqueWithoutAssignedToInput | ComplaintUpsertWithWhereUniqueWithoutAssignedToInput[]
    createMany?: ComplaintCreateManyAssignedToInputEnvelope
    set?: ComplaintWhereUniqueInput | ComplaintWhereUniqueInput[]
    disconnect?: ComplaintWhereUniqueInput | ComplaintWhereUniqueInput[]
    delete?: ComplaintWhereUniqueInput | ComplaintWhereUniqueInput[]
    connect?: ComplaintWhereUniqueInput | ComplaintWhereUniqueInput[]
    update?: ComplaintUpdateWithWhereUniqueWithoutAssignedToInput | ComplaintUpdateWithWhereUniqueWithoutAssignedToInput[]
    updateMany?: ComplaintUpdateManyWithWhereWithoutAssignedToInput | ComplaintUpdateManyWithWhereWithoutAssignedToInput[]
    deleteMany?: ComplaintScalarWhereInput | ComplaintScalarWhereInput[]
  }

  export type AttachmentUpdateManyWithoutUserNestedInput = {
    create?: XOR<AttachmentCreateWithoutUserInput, AttachmentUncheckedCreateWithoutUserInput> | AttachmentCreateWithoutUserInput[] | AttachmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AttachmentCreateOrConnectWithoutUserInput | AttachmentCreateOrConnectWithoutUserInput[]
    upsert?: AttachmentUpsertWithWhereUniqueWithoutUserInput | AttachmentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AttachmentCreateManyUserInputEnvelope
    set?: AttachmentWhereUniqueInput | AttachmentWhereUniqueInput[]
    disconnect?: AttachmentWhereUniqueInput | AttachmentWhereUniqueInput[]
    delete?: AttachmentWhereUniqueInput | AttachmentWhereUniqueInput[]
    connect?: AttachmentWhereUniqueInput | AttachmentWhereUniqueInput[]
    update?: AttachmentUpdateWithWhereUniqueWithoutUserInput | AttachmentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AttachmentUpdateManyWithWhereWithoutUserInput | AttachmentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AttachmentScalarWhereInput | AttachmentScalarWhereInput[]
  }

  export type StatusHistoryUpdateManyWithoutChangedByNestedInput = {
    create?: XOR<StatusHistoryCreateWithoutChangedByInput, StatusHistoryUncheckedCreateWithoutChangedByInput> | StatusHistoryCreateWithoutChangedByInput[] | StatusHistoryUncheckedCreateWithoutChangedByInput[]
    connectOrCreate?: StatusHistoryCreateOrConnectWithoutChangedByInput | StatusHistoryCreateOrConnectWithoutChangedByInput[]
    upsert?: StatusHistoryUpsertWithWhereUniqueWithoutChangedByInput | StatusHistoryUpsertWithWhereUniqueWithoutChangedByInput[]
    createMany?: StatusHistoryCreateManyChangedByInputEnvelope
    set?: StatusHistoryWhereUniqueInput | StatusHistoryWhereUniqueInput[]
    disconnect?: StatusHistoryWhereUniqueInput | StatusHistoryWhereUniqueInput[]
    delete?: StatusHistoryWhereUniqueInput | StatusHistoryWhereUniqueInput[]
    connect?: StatusHistoryWhereUniqueInput | StatusHistoryWhereUniqueInput[]
    update?: StatusHistoryUpdateWithWhereUniqueWithoutChangedByInput | StatusHistoryUpdateWithWhereUniqueWithoutChangedByInput[]
    updateMany?: StatusHistoryUpdateManyWithWhereWithoutChangedByInput | StatusHistoryUpdateManyWithWhereWithoutChangedByInput[]
    deleteMany?: StatusHistoryScalarWhereInput | StatusHistoryScalarWhereInput[]
  }

  export type UpvoteUpdateManyWithoutUserNestedInput = {
    create?: XOR<UpvoteCreateWithoutUserInput, UpvoteUncheckedCreateWithoutUserInput> | UpvoteCreateWithoutUserInput[] | UpvoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UpvoteCreateOrConnectWithoutUserInput | UpvoteCreateOrConnectWithoutUserInput[]
    upsert?: UpvoteUpsertWithWhereUniqueWithoutUserInput | UpvoteUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UpvoteCreateManyUserInputEnvelope
    set?: UpvoteWhereUniqueInput | UpvoteWhereUniqueInput[]
    disconnect?: UpvoteWhereUniqueInput | UpvoteWhereUniqueInput[]
    delete?: UpvoteWhereUniqueInput | UpvoteWhereUniqueInput[]
    connect?: UpvoteWhereUniqueInput | UpvoteWhereUniqueInput[]
    update?: UpvoteUpdateWithWhereUniqueWithoutUserInput | UpvoteUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UpvoteUpdateManyWithWhereWithoutUserInput | UpvoteUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UpvoteScalarWhereInput | UpvoteScalarWhereInput[]
  }

  export type ComplaintUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ComplaintCreateWithoutUserInput, ComplaintUncheckedCreateWithoutUserInput> | ComplaintCreateWithoutUserInput[] | ComplaintUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ComplaintCreateOrConnectWithoutUserInput | ComplaintCreateOrConnectWithoutUserInput[]
    upsert?: ComplaintUpsertWithWhereUniqueWithoutUserInput | ComplaintUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ComplaintCreateManyUserInputEnvelope
    set?: ComplaintWhereUniqueInput | ComplaintWhereUniqueInput[]
    disconnect?: ComplaintWhereUniqueInput | ComplaintWhereUniqueInput[]
    delete?: ComplaintWhereUniqueInput | ComplaintWhereUniqueInput[]
    connect?: ComplaintWhereUniqueInput | ComplaintWhereUniqueInput[]
    update?: ComplaintUpdateWithWhereUniqueWithoutUserInput | ComplaintUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ComplaintUpdateManyWithWhereWithoutUserInput | ComplaintUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ComplaintScalarWhereInput | ComplaintScalarWhereInput[]
  }

  export type ComplaintUncheckedUpdateManyWithoutAssignedToNestedInput = {
    create?: XOR<ComplaintCreateWithoutAssignedToInput, ComplaintUncheckedCreateWithoutAssignedToInput> | ComplaintCreateWithoutAssignedToInput[] | ComplaintUncheckedCreateWithoutAssignedToInput[]
    connectOrCreate?: ComplaintCreateOrConnectWithoutAssignedToInput | ComplaintCreateOrConnectWithoutAssignedToInput[]
    upsert?: ComplaintUpsertWithWhereUniqueWithoutAssignedToInput | ComplaintUpsertWithWhereUniqueWithoutAssignedToInput[]
    createMany?: ComplaintCreateManyAssignedToInputEnvelope
    set?: ComplaintWhereUniqueInput | ComplaintWhereUniqueInput[]
    disconnect?: ComplaintWhereUniqueInput | ComplaintWhereUniqueInput[]
    delete?: ComplaintWhereUniqueInput | ComplaintWhereUniqueInput[]
    connect?: ComplaintWhereUniqueInput | ComplaintWhereUniqueInput[]
    update?: ComplaintUpdateWithWhereUniqueWithoutAssignedToInput | ComplaintUpdateWithWhereUniqueWithoutAssignedToInput[]
    updateMany?: ComplaintUpdateManyWithWhereWithoutAssignedToInput | ComplaintUpdateManyWithWhereWithoutAssignedToInput[]
    deleteMany?: ComplaintScalarWhereInput | ComplaintScalarWhereInput[]
  }

  export type AttachmentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AttachmentCreateWithoutUserInput, AttachmentUncheckedCreateWithoutUserInput> | AttachmentCreateWithoutUserInput[] | AttachmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AttachmentCreateOrConnectWithoutUserInput | AttachmentCreateOrConnectWithoutUserInput[]
    upsert?: AttachmentUpsertWithWhereUniqueWithoutUserInput | AttachmentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AttachmentCreateManyUserInputEnvelope
    set?: AttachmentWhereUniqueInput | AttachmentWhereUniqueInput[]
    disconnect?: AttachmentWhereUniqueInput | AttachmentWhereUniqueInput[]
    delete?: AttachmentWhereUniqueInput | AttachmentWhereUniqueInput[]
    connect?: AttachmentWhereUniqueInput | AttachmentWhereUniqueInput[]
    update?: AttachmentUpdateWithWhereUniqueWithoutUserInput | AttachmentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AttachmentUpdateManyWithWhereWithoutUserInput | AttachmentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AttachmentScalarWhereInput | AttachmentScalarWhereInput[]
  }

  export type StatusHistoryUncheckedUpdateManyWithoutChangedByNestedInput = {
    create?: XOR<StatusHistoryCreateWithoutChangedByInput, StatusHistoryUncheckedCreateWithoutChangedByInput> | StatusHistoryCreateWithoutChangedByInput[] | StatusHistoryUncheckedCreateWithoutChangedByInput[]
    connectOrCreate?: StatusHistoryCreateOrConnectWithoutChangedByInput | StatusHistoryCreateOrConnectWithoutChangedByInput[]
    upsert?: StatusHistoryUpsertWithWhereUniqueWithoutChangedByInput | StatusHistoryUpsertWithWhereUniqueWithoutChangedByInput[]
    createMany?: StatusHistoryCreateManyChangedByInputEnvelope
    set?: StatusHistoryWhereUniqueInput | StatusHistoryWhereUniqueInput[]
    disconnect?: StatusHistoryWhereUniqueInput | StatusHistoryWhereUniqueInput[]
    delete?: StatusHistoryWhereUniqueInput | StatusHistoryWhereUniqueInput[]
    connect?: StatusHistoryWhereUniqueInput | StatusHistoryWhereUniqueInput[]
    update?: StatusHistoryUpdateWithWhereUniqueWithoutChangedByInput | StatusHistoryUpdateWithWhereUniqueWithoutChangedByInput[]
    updateMany?: StatusHistoryUpdateManyWithWhereWithoutChangedByInput | StatusHistoryUpdateManyWithWhereWithoutChangedByInput[]
    deleteMany?: StatusHistoryScalarWhereInput | StatusHistoryScalarWhereInput[]
  }

  export type UpvoteUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UpvoteCreateWithoutUserInput, UpvoteUncheckedCreateWithoutUserInput> | UpvoteCreateWithoutUserInput[] | UpvoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UpvoteCreateOrConnectWithoutUserInput | UpvoteCreateOrConnectWithoutUserInput[]
    upsert?: UpvoteUpsertWithWhereUniqueWithoutUserInput | UpvoteUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UpvoteCreateManyUserInputEnvelope
    set?: UpvoteWhereUniqueInput | UpvoteWhereUniqueInput[]
    disconnect?: UpvoteWhereUniqueInput | UpvoteWhereUniqueInput[]
    delete?: UpvoteWhereUniqueInput | UpvoteWhereUniqueInput[]
    connect?: UpvoteWhereUniqueInput | UpvoteWhereUniqueInput[]
    update?: UpvoteUpdateWithWhereUniqueWithoutUserInput | UpvoteUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UpvoteUpdateManyWithWhereWithoutUserInput | UpvoteUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UpvoteScalarWhereInput | UpvoteScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutComplaintsInput = {
    create?: XOR<UserCreateWithoutComplaintsInput, UserUncheckedCreateWithoutComplaintsInput>
    connectOrCreate?: UserCreateOrConnectWithoutComplaintsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAssignedComplaintsInput = {
    create?: XOR<UserCreateWithoutAssignedComplaintsInput, UserUncheckedCreateWithoutAssignedComplaintsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAssignedComplaintsInput
    connect?: UserWhereUniqueInput
  }

  export type AttachmentCreateNestedManyWithoutComplaintInput = {
    create?: XOR<AttachmentCreateWithoutComplaintInput, AttachmentUncheckedCreateWithoutComplaintInput> | AttachmentCreateWithoutComplaintInput[] | AttachmentUncheckedCreateWithoutComplaintInput[]
    connectOrCreate?: AttachmentCreateOrConnectWithoutComplaintInput | AttachmentCreateOrConnectWithoutComplaintInput[]
    createMany?: AttachmentCreateManyComplaintInputEnvelope
    connect?: AttachmentWhereUniqueInput | AttachmentWhereUniqueInput[]
  }

  export type StatusHistoryCreateNestedManyWithoutComplaintInput = {
    create?: XOR<StatusHistoryCreateWithoutComplaintInput, StatusHistoryUncheckedCreateWithoutComplaintInput> | StatusHistoryCreateWithoutComplaintInput[] | StatusHistoryUncheckedCreateWithoutComplaintInput[]
    connectOrCreate?: StatusHistoryCreateOrConnectWithoutComplaintInput | StatusHistoryCreateOrConnectWithoutComplaintInput[]
    createMany?: StatusHistoryCreateManyComplaintInputEnvelope
    connect?: StatusHistoryWhereUniqueInput | StatusHistoryWhereUniqueInput[]
  }

  export type UpvoteCreateNestedManyWithoutComplaintInput = {
    create?: XOR<UpvoteCreateWithoutComplaintInput, UpvoteUncheckedCreateWithoutComplaintInput> | UpvoteCreateWithoutComplaintInput[] | UpvoteUncheckedCreateWithoutComplaintInput[]
    connectOrCreate?: UpvoteCreateOrConnectWithoutComplaintInput | UpvoteCreateOrConnectWithoutComplaintInput[]
    createMany?: UpvoteCreateManyComplaintInputEnvelope
    connect?: UpvoteWhereUniqueInput | UpvoteWhereUniqueInput[]
  }

  export type AttachmentUncheckedCreateNestedManyWithoutComplaintInput = {
    create?: XOR<AttachmentCreateWithoutComplaintInput, AttachmentUncheckedCreateWithoutComplaintInput> | AttachmentCreateWithoutComplaintInput[] | AttachmentUncheckedCreateWithoutComplaintInput[]
    connectOrCreate?: AttachmentCreateOrConnectWithoutComplaintInput | AttachmentCreateOrConnectWithoutComplaintInput[]
    createMany?: AttachmentCreateManyComplaintInputEnvelope
    connect?: AttachmentWhereUniqueInput | AttachmentWhereUniqueInput[]
  }

  export type StatusHistoryUncheckedCreateNestedManyWithoutComplaintInput = {
    create?: XOR<StatusHistoryCreateWithoutComplaintInput, StatusHistoryUncheckedCreateWithoutComplaintInput> | StatusHistoryCreateWithoutComplaintInput[] | StatusHistoryUncheckedCreateWithoutComplaintInput[]
    connectOrCreate?: StatusHistoryCreateOrConnectWithoutComplaintInput | StatusHistoryCreateOrConnectWithoutComplaintInput[]
    createMany?: StatusHistoryCreateManyComplaintInputEnvelope
    connect?: StatusHistoryWhereUniqueInput | StatusHistoryWhereUniqueInput[]
  }

  export type UpvoteUncheckedCreateNestedManyWithoutComplaintInput = {
    create?: XOR<UpvoteCreateWithoutComplaintInput, UpvoteUncheckedCreateWithoutComplaintInput> | UpvoteCreateWithoutComplaintInput[] | UpvoteUncheckedCreateWithoutComplaintInput[]
    connectOrCreate?: UpvoteCreateOrConnectWithoutComplaintInput | UpvoteCreateOrConnectWithoutComplaintInput[]
    createMany?: UpvoteCreateManyComplaintInputEnvelope
    connect?: UpvoteWhereUniqueInput | UpvoteWhereUniqueInput[]
  }

  export type EnumComplaintCategoryFieldUpdateOperationsInput = {
    set?: $Enums.ComplaintCategory
  }

  export type EnumComplaintStatusFieldUpdateOperationsInput = {
    set?: $Enums.ComplaintStatus
  }

  export type UserUpdateOneRequiredWithoutComplaintsNestedInput = {
    create?: XOR<UserCreateWithoutComplaintsInput, UserUncheckedCreateWithoutComplaintsInput>
    connectOrCreate?: UserCreateOrConnectWithoutComplaintsInput
    upsert?: UserUpsertWithoutComplaintsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutComplaintsInput, UserUpdateWithoutComplaintsInput>, UserUncheckedUpdateWithoutComplaintsInput>
  }

  export type UserUpdateOneWithoutAssignedComplaintsNestedInput = {
    create?: XOR<UserCreateWithoutAssignedComplaintsInput, UserUncheckedCreateWithoutAssignedComplaintsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAssignedComplaintsInput
    upsert?: UserUpsertWithoutAssignedComplaintsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAssignedComplaintsInput, UserUpdateWithoutAssignedComplaintsInput>, UserUncheckedUpdateWithoutAssignedComplaintsInput>
  }

  export type AttachmentUpdateManyWithoutComplaintNestedInput = {
    create?: XOR<AttachmentCreateWithoutComplaintInput, AttachmentUncheckedCreateWithoutComplaintInput> | AttachmentCreateWithoutComplaintInput[] | AttachmentUncheckedCreateWithoutComplaintInput[]
    connectOrCreate?: AttachmentCreateOrConnectWithoutComplaintInput | AttachmentCreateOrConnectWithoutComplaintInput[]
    upsert?: AttachmentUpsertWithWhereUniqueWithoutComplaintInput | AttachmentUpsertWithWhereUniqueWithoutComplaintInput[]
    createMany?: AttachmentCreateManyComplaintInputEnvelope
    set?: AttachmentWhereUniqueInput | AttachmentWhereUniqueInput[]
    disconnect?: AttachmentWhereUniqueInput | AttachmentWhereUniqueInput[]
    delete?: AttachmentWhereUniqueInput | AttachmentWhereUniqueInput[]
    connect?: AttachmentWhereUniqueInput | AttachmentWhereUniqueInput[]
    update?: AttachmentUpdateWithWhereUniqueWithoutComplaintInput | AttachmentUpdateWithWhereUniqueWithoutComplaintInput[]
    updateMany?: AttachmentUpdateManyWithWhereWithoutComplaintInput | AttachmentUpdateManyWithWhereWithoutComplaintInput[]
    deleteMany?: AttachmentScalarWhereInput | AttachmentScalarWhereInput[]
  }

  export type StatusHistoryUpdateManyWithoutComplaintNestedInput = {
    create?: XOR<StatusHistoryCreateWithoutComplaintInput, StatusHistoryUncheckedCreateWithoutComplaintInput> | StatusHistoryCreateWithoutComplaintInput[] | StatusHistoryUncheckedCreateWithoutComplaintInput[]
    connectOrCreate?: StatusHistoryCreateOrConnectWithoutComplaintInput | StatusHistoryCreateOrConnectWithoutComplaintInput[]
    upsert?: StatusHistoryUpsertWithWhereUniqueWithoutComplaintInput | StatusHistoryUpsertWithWhereUniqueWithoutComplaintInput[]
    createMany?: StatusHistoryCreateManyComplaintInputEnvelope
    set?: StatusHistoryWhereUniqueInput | StatusHistoryWhereUniqueInput[]
    disconnect?: StatusHistoryWhereUniqueInput | StatusHistoryWhereUniqueInput[]
    delete?: StatusHistoryWhereUniqueInput | StatusHistoryWhereUniqueInput[]
    connect?: StatusHistoryWhereUniqueInput | StatusHistoryWhereUniqueInput[]
    update?: StatusHistoryUpdateWithWhereUniqueWithoutComplaintInput | StatusHistoryUpdateWithWhereUniqueWithoutComplaintInput[]
    updateMany?: StatusHistoryUpdateManyWithWhereWithoutComplaintInput | StatusHistoryUpdateManyWithWhereWithoutComplaintInput[]
    deleteMany?: StatusHistoryScalarWhereInput | StatusHistoryScalarWhereInput[]
  }

  export type UpvoteUpdateManyWithoutComplaintNestedInput = {
    create?: XOR<UpvoteCreateWithoutComplaintInput, UpvoteUncheckedCreateWithoutComplaintInput> | UpvoteCreateWithoutComplaintInput[] | UpvoteUncheckedCreateWithoutComplaintInput[]
    connectOrCreate?: UpvoteCreateOrConnectWithoutComplaintInput | UpvoteCreateOrConnectWithoutComplaintInput[]
    upsert?: UpvoteUpsertWithWhereUniqueWithoutComplaintInput | UpvoteUpsertWithWhereUniqueWithoutComplaintInput[]
    createMany?: UpvoteCreateManyComplaintInputEnvelope
    set?: UpvoteWhereUniqueInput | UpvoteWhereUniqueInput[]
    disconnect?: UpvoteWhereUniqueInput | UpvoteWhereUniqueInput[]
    delete?: UpvoteWhereUniqueInput | UpvoteWhereUniqueInput[]
    connect?: UpvoteWhereUniqueInput | UpvoteWhereUniqueInput[]
    update?: UpvoteUpdateWithWhereUniqueWithoutComplaintInput | UpvoteUpdateWithWhereUniqueWithoutComplaintInput[]
    updateMany?: UpvoteUpdateManyWithWhereWithoutComplaintInput | UpvoteUpdateManyWithWhereWithoutComplaintInput[]
    deleteMany?: UpvoteScalarWhereInput | UpvoteScalarWhereInput[]
  }

  export type AttachmentUncheckedUpdateManyWithoutComplaintNestedInput = {
    create?: XOR<AttachmentCreateWithoutComplaintInput, AttachmentUncheckedCreateWithoutComplaintInput> | AttachmentCreateWithoutComplaintInput[] | AttachmentUncheckedCreateWithoutComplaintInput[]
    connectOrCreate?: AttachmentCreateOrConnectWithoutComplaintInput | AttachmentCreateOrConnectWithoutComplaintInput[]
    upsert?: AttachmentUpsertWithWhereUniqueWithoutComplaintInput | AttachmentUpsertWithWhereUniqueWithoutComplaintInput[]
    createMany?: AttachmentCreateManyComplaintInputEnvelope
    set?: AttachmentWhereUniqueInput | AttachmentWhereUniqueInput[]
    disconnect?: AttachmentWhereUniqueInput | AttachmentWhereUniqueInput[]
    delete?: AttachmentWhereUniqueInput | AttachmentWhereUniqueInput[]
    connect?: AttachmentWhereUniqueInput | AttachmentWhereUniqueInput[]
    update?: AttachmentUpdateWithWhereUniqueWithoutComplaintInput | AttachmentUpdateWithWhereUniqueWithoutComplaintInput[]
    updateMany?: AttachmentUpdateManyWithWhereWithoutComplaintInput | AttachmentUpdateManyWithWhereWithoutComplaintInput[]
    deleteMany?: AttachmentScalarWhereInput | AttachmentScalarWhereInput[]
  }

  export type StatusHistoryUncheckedUpdateManyWithoutComplaintNestedInput = {
    create?: XOR<StatusHistoryCreateWithoutComplaintInput, StatusHistoryUncheckedCreateWithoutComplaintInput> | StatusHistoryCreateWithoutComplaintInput[] | StatusHistoryUncheckedCreateWithoutComplaintInput[]
    connectOrCreate?: StatusHistoryCreateOrConnectWithoutComplaintInput | StatusHistoryCreateOrConnectWithoutComplaintInput[]
    upsert?: StatusHistoryUpsertWithWhereUniqueWithoutComplaintInput | StatusHistoryUpsertWithWhereUniqueWithoutComplaintInput[]
    createMany?: StatusHistoryCreateManyComplaintInputEnvelope
    set?: StatusHistoryWhereUniqueInput | StatusHistoryWhereUniqueInput[]
    disconnect?: StatusHistoryWhereUniqueInput | StatusHistoryWhereUniqueInput[]
    delete?: StatusHistoryWhereUniqueInput | StatusHistoryWhereUniqueInput[]
    connect?: StatusHistoryWhereUniqueInput | StatusHistoryWhereUniqueInput[]
    update?: StatusHistoryUpdateWithWhereUniqueWithoutComplaintInput | StatusHistoryUpdateWithWhereUniqueWithoutComplaintInput[]
    updateMany?: StatusHistoryUpdateManyWithWhereWithoutComplaintInput | StatusHistoryUpdateManyWithWhereWithoutComplaintInput[]
    deleteMany?: StatusHistoryScalarWhereInput | StatusHistoryScalarWhereInput[]
  }

  export type UpvoteUncheckedUpdateManyWithoutComplaintNestedInput = {
    create?: XOR<UpvoteCreateWithoutComplaintInput, UpvoteUncheckedCreateWithoutComplaintInput> | UpvoteCreateWithoutComplaintInput[] | UpvoteUncheckedCreateWithoutComplaintInput[]
    connectOrCreate?: UpvoteCreateOrConnectWithoutComplaintInput | UpvoteCreateOrConnectWithoutComplaintInput[]
    upsert?: UpvoteUpsertWithWhereUniqueWithoutComplaintInput | UpvoteUpsertWithWhereUniqueWithoutComplaintInput[]
    createMany?: UpvoteCreateManyComplaintInputEnvelope
    set?: UpvoteWhereUniqueInput | UpvoteWhereUniqueInput[]
    disconnect?: UpvoteWhereUniqueInput | UpvoteWhereUniqueInput[]
    delete?: UpvoteWhereUniqueInput | UpvoteWhereUniqueInput[]
    connect?: UpvoteWhereUniqueInput | UpvoteWhereUniqueInput[]
    update?: UpvoteUpdateWithWhereUniqueWithoutComplaintInput | UpvoteUpdateWithWhereUniqueWithoutComplaintInput[]
    updateMany?: UpvoteUpdateManyWithWhereWithoutComplaintInput | UpvoteUpdateManyWithWhereWithoutComplaintInput[]
    deleteMany?: UpvoteScalarWhereInput | UpvoteScalarWhereInput[]
  }

  export type ComplaintCreateNestedOneWithoutAttachmentsInput = {
    create?: XOR<ComplaintCreateWithoutAttachmentsInput, ComplaintUncheckedCreateWithoutAttachmentsInput>
    connectOrCreate?: ComplaintCreateOrConnectWithoutAttachmentsInput
    connect?: ComplaintWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAttachmentsInput = {
    create?: XOR<UserCreateWithoutAttachmentsInput, UserUncheckedCreateWithoutAttachmentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAttachmentsInput
    connect?: UserWhereUniqueInput
  }

  export type ComplaintUpdateOneWithoutAttachmentsNestedInput = {
    create?: XOR<ComplaintCreateWithoutAttachmentsInput, ComplaintUncheckedCreateWithoutAttachmentsInput>
    connectOrCreate?: ComplaintCreateOrConnectWithoutAttachmentsInput
    upsert?: ComplaintUpsertWithoutAttachmentsInput
    disconnect?: ComplaintWhereInput | boolean
    delete?: ComplaintWhereInput | boolean
    connect?: ComplaintWhereUniqueInput
    update?: XOR<XOR<ComplaintUpdateToOneWithWhereWithoutAttachmentsInput, ComplaintUpdateWithoutAttachmentsInput>, ComplaintUncheckedUpdateWithoutAttachmentsInput>
  }

  export type UserUpdateOneRequiredWithoutAttachmentsNestedInput = {
    create?: XOR<UserCreateWithoutAttachmentsInput, UserUncheckedCreateWithoutAttachmentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAttachmentsInput
    upsert?: UserUpsertWithoutAttachmentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAttachmentsInput, UserUpdateWithoutAttachmentsInput>, UserUncheckedUpdateWithoutAttachmentsInput>
  }

  export type ComplaintCreateNestedOneWithoutStatusHistoryInput = {
    create?: XOR<ComplaintCreateWithoutStatusHistoryInput, ComplaintUncheckedCreateWithoutStatusHistoryInput>
    connectOrCreate?: ComplaintCreateOrConnectWithoutStatusHistoryInput
    connect?: ComplaintWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutStatusHistoriesInput = {
    create?: XOR<UserCreateWithoutStatusHistoriesInput, UserUncheckedCreateWithoutStatusHistoriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutStatusHistoriesInput
    connect?: UserWhereUniqueInput
  }

  export type ComplaintUpdateOneRequiredWithoutStatusHistoryNestedInput = {
    create?: XOR<ComplaintCreateWithoutStatusHistoryInput, ComplaintUncheckedCreateWithoutStatusHistoryInput>
    connectOrCreate?: ComplaintCreateOrConnectWithoutStatusHistoryInput
    upsert?: ComplaintUpsertWithoutStatusHistoryInput
    connect?: ComplaintWhereUniqueInput
    update?: XOR<XOR<ComplaintUpdateToOneWithWhereWithoutStatusHistoryInput, ComplaintUpdateWithoutStatusHistoryInput>, ComplaintUncheckedUpdateWithoutStatusHistoryInput>
  }

  export type UserUpdateOneRequiredWithoutStatusHistoriesNestedInput = {
    create?: XOR<UserCreateWithoutStatusHistoriesInput, UserUncheckedCreateWithoutStatusHistoriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutStatusHistoriesInput
    upsert?: UserUpsertWithoutStatusHistoriesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutStatusHistoriesInput, UserUpdateWithoutStatusHistoriesInput>, UserUncheckedUpdateWithoutStatusHistoriesInput>
  }

  export type ComplaintCreateNestedOneWithoutUpvotesInput = {
    create?: XOR<ComplaintCreateWithoutUpvotesInput, ComplaintUncheckedCreateWithoutUpvotesInput>
    connectOrCreate?: ComplaintCreateOrConnectWithoutUpvotesInput
    connect?: ComplaintWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutUpvotesInput = {
    create?: XOR<UserCreateWithoutUpvotesInput, UserUncheckedCreateWithoutUpvotesInput>
    connectOrCreate?: UserCreateOrConnectWithoutUpvotesInput
    connect?: UserWhereUniqueInput
  }

  export type ComplaintUpdateOneRequiredWithoutUpvotesNestedInput = {
    create?: XOR<ComplaintCreateWithoutUpvotesInput, ComplaintUncheckedCreateWithoutUpvotesInput>
    connectOrCreate?: ComplaintCreateOrConnectWithoutUpvotesInput
    upsert?: ComplaintUpsertWithoutUpvotesInput
    connect?: ComplaintWhereUniqueInput
    update?: XOR<XOR<ComplaintUpdateToOneWithWhereWithoutUpvotesInput, ComplaintUpdateWithoutUpvotesInput>, ComplaintUncheckedUpdateWithoutUpvotesInput>
  }

  export type UserUpdateOneRequiredWithoutUpvotesNestedInput = {
    create?: XOR<UserCreateWithoutUpvotesInput, UserUncheckedCreateWithoutUpvotesInput>
    connectOrCreate?: UserCreateOrConnectWithoutUpvotesInput
    upsert?: UserUpsertWithoutUpvotesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUpvotesInput, UserUpdateWithoutUpvotesInput>, UserUncheckedUpdateWithoutUpvotesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumComplaintCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.ComplaintCategory | EnumComplaintCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ComplaintCategory[] | ListEnumComplaintCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ComplaintCategory[] | ListEnumComplaintCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumComplaintCategoryFilter<$PrismaModel> | $Enums.ComplaintCategory
  }

  export type NestedEnumComplaintStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ComplaintStatus | EnumComplaintStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ComplaintStatus[] | ListEnumComplaintStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ComplaintStatus[] | ListEnumComplaintStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumComplaintStatusFilter<$PrismaModel> | $Enums.ComplaintStatus
  }

  export type NestedEnumComplaintCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ComplaintCategory | EnumComplaintCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ComplaintCategory[] | ListEnumComplaintCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ComplaintCategory[] | ListEnumComplaintCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumComplaintCategoryWithAggregatesFilter<$PrismaModel> | $Enums.ComplaintCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumComplaintCategoryFilter<$PrismaModel>
    _max?: NestedEnumComplaintCategoryFilter<$PrismaModel>
  }

  export type NestedEnumComplaintStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ComplaintStatus | EnumComplaintStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ComplaintStatus[] | ListEnumComplaintStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ComplaintStatus[] | ListEnumComplaintStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumComplaintStatusWithAggregatesFilter<$PrismaModel> | $Enums.ComplaintStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumComplaintStatusFilter<$PrismaModel>
    _max?: NestedEnumComplaintStatusFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ComplaintCreateWithoutUserInput = {
    id?: string
    title: string
    description: string
    category: $Enums.ComplaintCategory
    status?: $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: number
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    assignedTo?: UserCreateNestedOneWithoutAssignedComplaintsInput
    attachments?: AttachmentCreateNestedManyWithoutComplaintInput
    statusHistory?: StatusHistoryCreateNestedManyWithoutComplaintInput
    upvotes?: UpvoteCreateNestedManyWithoutComplaintInput
  }

  export type ComplaintUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    description: string
    category: $Enums.ComplaintCategory
    status?: $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: number
    assignedToId?: string | null
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    attachments?: AttachmentUncheckedCreateNestedManyWithoutComplaintInput
    statusHistory?: StatusHistoryUncheckedCreateNestedManyWithoutComplaintInput
    upvotes?: UpvoteUncheckedCreateNestedManyWithoutComplaintInput
  }

  export type ComplaintCreateOrConnectWithoutUserInput = {
    where: ComplaintWhereUniqueInput
    create: XOR<ComplaintCreateWithoutUserInput, ComplaintUncheckedCreateWithoutUserInput>
  }

  export type ComplaintCreateManyUserInputEnvelope = {
    data: ComplaintCreateManyUserInput | ComplaintCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ComplaintCreateWithoutAssignedToInput = {
    id?: string
    title: string
    description: string
    category: $Enums.ComplaintCategory
    status?: $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: number
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutComplaintsInput
    attachments?: AttachmentCreateNestedManyWithoutComplaintInput
    statusHistory?: StatusHistoryCreateNestedManyWithoutComplaintInput
    upvotes?: UpvoteCreateNestedManyWithoutComplaintInput
  }

  export type ComplaintUncheckedCreateWithoutAssignedToInput = {
    id?: string
    title: string
    description: string
    category: $Enums.ComplaintCategory
    status?: $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: number
    userId: string
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    attachments?: AttachmentUncheckedCreateNestedManyWithoutComplaintInput
    statusHistory?: StatusHistoryUncheckedCreateNestedManyWithoutComplaintInput
    upvotes?: UpvoteUncheckedCreateNestedManyWithoutComplaintInput
  }

  export type ComplaintCreateOrConnectWithoutAssignedToInput = {
    where: ComplaintWhereUniqueInput
    create: XOR<ComplaintCreateWithoutAssignedToInput, ComplaintUncheckedCreateWithoutAssignedToInput>
  }

  export type ComplaintCreateManyAssignedToInputEnvelope = {
    data: ComplaintCreateManyAssignedToInput | ComplaintCreateManyAssignedToInput[]
    skipDuplicates?: boolean
  }

  export type AttachmentCreateWithoutUserInput = {
    id?: string
    filename: string
    cloudinaryId?: string | null
    url: string
    thumbnailUrl?: string | null
    mimeType: string
    size: number
    createdAt?: Date | string
    updatedAt?: Date | string
    complaint?: ComplaintCreateNestedOneWithoutAttachmentsInput
  }

  export type AttachmentUncheckedCreateWithoutUserInput = {
    id?: string
    complaintId?: string | null
    filename: string
    cloudinaryId?: string | null
    url: string
    thumbnailUrl?: string | null
    mimeType: string
    size: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AttachmentCreateOrConnectWithoutUserInput = {
    where: AttachmentWhereUniqueInput
    create: XOR<AttachmentCreateWithoutUserInput, AttachmentUncheckedCreateWithoutUserInput>
  }

  export type AttachmentCreateManyUserInputEnvelope = {
    data: AttachmentCreateManyUserInput | AttachmentCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type StatusHistoryCreateWithoutChangedByInput = {
    id?: string
    fromStatus: $Enums.ComplaintStatus
    toStatus: $Enums.ComplaintStatus
    comment?: string | null
    createdAt?: Date | string
    complaint: ComplaintCreateNestedOneWithoutStatusHistoryInput
  }

  export type StatusHistoryUncheckedCreateWithoutChangedByInput = {
    id?: string
    complaintId: string
    fromStatus: $Enums.ComplaintStatus
    toStatus: $Enums.ComplaintStatus
    comment?: string | null
    createdAt?: Date | string
  }

  export type StatusHistoryCreateOrConnectWithoutChangedByInput = {
    where: StatusHistoryWhereUniqueInput
    create: XOR<StatusHistoryCreateWithoutChangedByInput, StatusHistoryUncheckedCreateWithoutChangedByInput>
  }

  export type StatusHistoryCreateManyChangedByInputEnvelope = {
    data: StatusHistoryCreateManyChangedByInput | StatusHistoryCreateManyChangedByInput[]
    skipDuplicates?: boolean
  }

  export type UpvoteCreateWithoutUserInput = {
    createdAt?: Date | string
    complaint: ComplaintCreateNestedOneWithoutUpvotesInput
  }

  export type UpvoteUncheckedCreateWithoutUserInput = {
    complaintId: string
    createdAt?: Date | string
  }

  export type UpvoteCreateOrConnectWithoutUserInput = {
    where: UpvoteWhereUniqueInput
    create: XOR<UpvoteCreateWithoutUserInput, UpvoteUncheckedCreateWithoutUserInput>
  }

  export type UpvoteCreateManyUserInputEnvelope = {
    data: UpvoteCreateManyUserInput | UpvoteCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ComplaintUpsertWithWhereUniqueWithoutUserInput = {
    where: ComplaintWhereUniqueInput
    update: XOR<ComplaintUpdateWithoutUserInput, ComplaintUncheckedUpdateWithoutUserInput>
    create: XOR<ComplaintCreateWithoutUserInput, ComplaintUncheckedCreateWithoutUserInput>
  }

  export type ComplaintUpdateWithWhereUniqueWithoutUserInput = {
    where: ComplaintWhereUniqueInput
    data: XOR<ComplaintUpdateWithoutUserInput, ComplaintUncheckedUpdateWithoutUserInput>
  }

  export type ComplaintUpdateManyWithWhereWithoutUserInput = {
    where: ComplaintScalarWhereInput
    data: XOR<ComplaintUpdateManyMutationInput, ComplaintUncheckedUpdateManyWithoutUserInput>
  }

  export type ComplaintScalarWhereInput = {
    AND?: ComplaintScalarWhereInput | ComplaintScalarWhereInput[]
    OR?: ComplaintScalarWhereInput[]
    NOT?: ComplaintScalarWhereInput | ComplaintScalarWhereInput[]
    id?: StringFilter<"Complaint"> | string
    title?: StringFilter<"Complaint"> | string
    description?: StringFilter<"Complaint"> | string
    category?: EnumComplaintCategoryFilter<"Complaint"> | $Enums.ComplaintCategory
    status?: EnumComplaintStatusFilter<"Complaint"> | $Enums.ComplaintStatus
    location?: JsonNullableFilter<"Complaint">
    priority?: IntFilter<"Complaint"> | number
    userId?: StringFilter<"Complaint"> | string
    assignedToId?: StringNullableFilter<"Complaint"> | string | null
    resolvedAt?: DateTimeNullableFilter<"Complaint"> | Date | string | null
    createdAt?: DateTimeFilter<"Complaint"> | Date | string
    updatedAt?: DateTimeFilter<"Complaint"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Complaint"> | Date | string | null
  }

  export type ComplaintUpsertWithWhereUniqueWithoutAssignedToInput = {
    where: ComplaintWhereUniqueInput
    update: XOR<ComplaintUpdateWithoutAssignedToInput, ComplaintUncheckedUpdateWithoutAssignedToInput>
    create: XOR<ComplaintCreateWithoutAssignedToInput, ComplaintUncheckedCreateWithoutAssignedToInput>
  }

  export type ComplaintUpdateWithWhereUniqueWithoutAssignedToInput = {
    where: ComplaintWhereUniqueInput
    data: XOR<ComplaintUpdateWithoutAssignedToInput, ComplaintUncheckedUpdateWithoutAssignedToInput>
  }

  export type ComplaintUpdateManyWithWhereWithoutAssignedToInput = {
    where: ComplaintScalarWhereInput
    data: XOR<ComplaintUpdateManyMutationInput, ComplaintUncheckedUpdateManyWithoutAssignedToInput>
  }

  export type AttachmentUpsertWithWhereUniqueWithoutUserInput = {
    where: AttachmentWhereUniqueInput
    update: XOR<AttachmentUpdateWithoutUserInput, AttachmentUncheckedUpdateWithoutUserInput>
    create: XOR<AttachmentCreateWithoutUserInput, AttachmentUncheckedCreateWithoutUserInput>
  }

  export type AttachmentUpdateWithWhereUniqueWithoutUserInput = {
    where: AttachmentWhereUniqueInput
    data: XOR<AttachmentUpdateWithoutUserInput, AttachmentUncheckedUpdateWithoutUserInput>
  }

  export type AttachmentUpdateManyWithWhereWithoutUserInput = {
    where: AttachmentScalarWhereInput
    data: XOR<AttachmentUpdateManyMutationInput, AttachmentUncheckedUpdateManyWithoutUserInput>
  }

  export type AttachmentScalarWhereInput = {
    AND?: AttachmentScalarWhereInput | AttachmentScalarWhereInput[]
    OR?: AttachmentScalarWhereInput[]
    NOT?: AttachmentScalarWhereInput | AttachmentScalarWhereInput[]
    id?: StringFilter<"Attachment"> | string
    complaintId?: StringNullableFilter<"Attachment"> | string | null
    userId?: StringFilter<"Attachment"> | string
    filename?: StringFilter<"Attachment"> | string
    cloudinaryId?: StringNullableFilter<"Attachment"> | string | null
    url?: StringFilter<"Attachment"> | string
    thumbnailUrl?: StringNullableFilter<"Attachment"> | string | null
    mimeType?: StringFilter<"Attachment"> | string
    size?: IntFilter<"Attachment"> | number
    createdAt?: DateTimeFilter<"Attachment"> | Date | string
    updatedAt?: DateTimeFilter<"Attachment"> | Date | string
  }

  export type StatusHistoryUpsertWithWhereUniqueWithoutChangedByInput = {
    where: StatusHistoryWhereUniqueInput
    update: XOR<StatusHistoryUpdateWithoutChangedByInput, StatusHistoryUncheckedUpdateWithoutChangedByInput>
    create: XOR<StatusHistoryCreateWithoutChangedByInput, StatusHistoryUncheckedCreateWithoutChangedByInput>
  }

  export type StatusHistoryUpdateWithWhereUniqueWithoutChangedByInput = {
    where: StatusHistoryWhereUniqueInput
    data: XOR<StatusHistoryUpdateWithoutChangedByInput, StatusHistoryUncheckedUpdateWithoutChangedByInput>
  }

  export type StatusHistoryUpdateManyWithWhereWithoutChangedByInput = {
    where: StatusHistoryScalarWhereInput
    data: XOR<StatusHistoryUpdateManyMutationInput, StatusHistoryUncheckedUpdateManyWithoutChangedByInput>
  }

  export type StatusHistoryScalarWhereInput = {
    AND?: StatusHistoryScalarWhereInput | StatusHistoryScalarWhereInput[]
    OR?: StatusHistoryScalarWhereInput[]
    NOT?: StatusHistoryScalarWhereInput | StatusHistoryScalarWhereInput[]
    id?: StringFilter<"StatusHistory"> | string
    complaintId?: StringFilter<"StatusHistory"> | string
    fromStatus?: EnumComplaintStatusFilter<"StatusHistory"> | $Enums.ComplaintStatus
    toStatus?: EnumComplaintStatusFilter<"StatusHistory"> | $Enums.ComplaintStatus
    changedById?: StringFilter<"StatusHistory"> | string
    comment?: StringNullableFilter<"StatusHistory"> | string | null
    createdAt?: DateTimeFilter<"StatusHistory"> | Date | string
  }

  export type UpvoteUpsertWithWhereUniqueWithoutUserInput = {
    where: UpvoteWhereUniqueInput
    update: XOR<UpvoteUpdateWithoutUserInput, UpvoteUncheckedUpdateWithoutUserInput>
    create: XOR<UpvoteCreateWithoutUserInput, UpvoteUncheckedCreateWithoutUserInput>
  }

  export type UpvoteUpdateWithWhereUniqueWithoutUserInput = {
    where: UpvoteWhereUniqueInput
    data: XOR<UpvoteUpdateWithoutUserInput, UpvoteUncheckedUpdateWithoutUserInput>
  }

  export type UpvoteUpdateManyWithWhereWithoutUserInput = {
    where: UpvoteScalarWhereInput
    data: XOR<UpvoteUpdateManyMutationInput, UpvoteUncheckedUpdateManyWithoutUserInput>
  }

  export type UpvoteScalarWhereInput = {
    AND?: UpvoteScalarWhereInput | UpvoteScalarWhereInput[]
    OR?: UpvoteScalarWhereInput[]
    NOT?: UpvoteScalarWhereInput | UpvoteScalarWhereInput[]
    complaintId?: StringFilter<"Upvote"> | string
    userId?: StringFilter<"Upvote"> | string
    createdAt?: DateTimeFilter<"Upvote"> | Date | string
  }

  export type UserCreateWithoutComplaintsInput = {
    id?: string
    email: string
    password: string
    name: string
    phone?: string | null
    role?: $Enums.UserRole
    avatar?: string | null
    emailVerified?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    assignedComplaints?: ComplaintCreateNestedManyWithoutAssignedToInput
    attachments?: AttachmentCreateNestedManyWithoutUserInput
    statusHistories?: StatusHistoryCreateNestedManyWithoutChangedByInput
    upvotes?: UpvoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutComplaintsInput = {
    id?: string
    email: string
    password: string
    name: string
    phone?: string | null
    role?: $Enums.UserRole
    avatar?: string | null
    emailVerified?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    assignedComplaints?: ComplaintUncheckedCreateNestedManyWithoutAssignedToInput
    attachments?: AttachmentUncheckedCreateNestedManyWithoutUserInput
    statusHistories?: StatusHistoryUncheckedCreateNestedManyWithoutChangedByInput
    upvotes?: UpvoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutComplaintsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutComplaintsInput, UserUncheckedCreateWithoutComplaintsInput>
  }

  export type UserCreateWithoutAssignedComplaintsInput = {
    id?: string
    email: string
    password: string
    name: string
    phone?: string | null
    role?: $Enums.UserRole
    avatar?: string | null
    emailVerified?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    complaints?: ComplaintCreateNestedManyWithoutUserInput
    attachments?: AttachmentCreateNestedManyWithoutUserInput
    statusHistories?: StatusHistoryCreateNestedManyWithoutChangedByInput
    upvotes?: UpvoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAssignedComplaintsInput = {
    id?: string
    email: string
    password: string
    name: string
    phone?: string | null
    role?: $Enums.UserRole
    avatar?: string | null
    emailVerified?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    complaints?: ComplaintUncheckedCreateNestedManyWithoutUserInput
    attachments?: AttachmentUncheckedCreateNestedManyWithoutUserInput
    statusHistories?: StatusHistoryUncheckedCreateNestedManyWithoutChangedByInput
    upvotes?: UpvoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAssignedComplaintsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAssignedComplaintsInput, UserUncheckedCreateWithoutAssignedComplaintsInput>
  }

  export type AttachmentCreateWithoutComplaintInput = {
    id?: string
    filename: string
    cloudinaryId?: string | null
    url: string
    thumbnailUrl?: string | null
    mimeType: string
    size: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAttachmentsInput
  }

  export type AttachmentUncheckedCreateWithoutComplaintInput = {
    id?: string
    userId: string
    filename: string
    cloudinaryId?: string | null
    url: string
    thumbnailUrl?: string | null
    mimeType: string
    size: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AttachmentCreateOrConnectWithoutComplaintInput = {
    where: AttachmentWhereUniqueInput
    create: XOR<AttachmentCreateWithoutComplaintInput, AttachmentUncheckedCreateWithoutComplaintInput>
  }

  export type AttachmentCreateManyComplaintInputEnvelope = {
    data: AttachmentCreateManyComplaintInput | AttachmentCreateManyComplaintInput[]
    skipDuplicates?: boolean
  }

  export type StatusHistoryCreateWithoutComplaintInput = {
    id?: string
    fromStatus: $Enums.ComplaintStatus
    toStatus: $Enums.ComplaintStatus
    comment?: string | null
    createdAt?: Date | string
    changedBy: UserCreateNestedOneWithoutStatusHistoriesInput
  }

  export type StatusHistoryUncheckedCreateWithoutComplaintInput = {
    id?: string
    fromStatus: $Enums.ComplaintStatus
    toStatus: $Enums.ComplaintStatus
    changedById: string
    comment?: string | null
    createdAt?: Date | string
  }

  export type StatusHistoryCreateOrConnectWithoutComplaintInput = {
    where: StatusHistoryWhereUniqueInput
    create: XOR<StatusHistoryCreateWithoutComplaintInput, StatusHistoryUncheckedCreateWithoutComplaintInput>
  }

  export type StatusHistoryCreateManyComplaintInputEnvelope = {
    data: StatusHistoryCreateManyComplaintInput | StatusHistoryCreateManyComplaintInput[]
    skipDuplicates?: boolean
  }

  export type UpvoteCreateWithoutComplaintInput = {
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutUpvotesInput
  }

  export type UpvoteUncheckedCreateWithoutComplaintInput = {
    userId: string
    createdAt?: Date | string
  }

  export type UpvoteCreateOrConnectWithoutComplaintInput = {
    where: UpvoteWhereUniqueInput
    create: XOR<UpvoteCreateWithoutComplaintInput, UpvoteUncheckedCreateWithoutComplaintInput>
  }

  export type UpvoteCreateManyComplaintInputEnvelope = {
    data: UpvoteCreateManyComplaintInput | UpvoteCreateManyComplaintInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutComplaintsInput = {
    update: XOR<UserUpdateWithoutComplaintsInput, UserUncheckedUpdateWithoutComplaintsInput>
    create: XOR<UserCreateWithoutComplaintsInput, UserUncheckedCreateWithoutComplaintsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutComplaintsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutComplaintsInput, UserUncheckedUpdateWithoutComplaintsInput>
  }

  export type UserUpdateWithoutComplaintsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    assignedComplaints?: ComplaintUpdateManyWithoutAssignedToNestedInput
    attachments?: AttachmentUpdateManyWithoutUserNestedInput
    statusHistories?: StatusHistoryUpdateManyWithoutChangedByNestedInput
    upvotes?: UpvoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutComplaintsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    assignedComplaints?: ComplaintUncheckedUpdateManyWithoutAssignedToNestedInput
    attachments?: AttachmentUncheckedUpdateManyWithoutUserNestedInput
    statusHistories?: StatusHistoryUncheckedUpdateManyWithoutChangedByNestedInput
    upvotes?: UpvoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutAssignedComplaintsInput = {
    update: XOR<UserUpdateWithoutAssignedComplaintsInput, UserUncheckedUpdateWithoutAssignedComplaintsInput>
    create: XOR<UserCreateWithoutAssignedComplaintsInput, UserUncheckedCreateWithoutAssignedComplaintsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAssignedComplaintsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAssignedComplaintsInput, UserUncheckedUpdateWithoutAssignedComplaintsInput>
  }

  export type UserUpdateWithoutAssignedComplaintsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    complaints?: ComplaintUpdateManyWithoutUserNestedInput
    attachments?: AttachmentUpdateManyWithoutUserNestedInput
    statusHistories?: StatusHistoryUpdateManyWithoutChangedByNestedInput
    upvotes?: UpvoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAssignedComplaintsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    complaints?: ComplaintUncheckedUpdateManyWithoutUserNestedInput
    attachments?: AttachmentUncheckedUpdateManyWithoutUserNestedInput
    statusHistories?: StatusHistoryUncheckedUpdateManyWithoutChangedByNestedInput
    upvotes?: UpvoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AttachmentUpsertWithWhereUniqueWithoutComplaintInput = {
    where: AttachmentWhereUniqueInput
    update: XOR<AttachmentUpdateWithoutComplaintInput, AttachmentUncheckedUpdateWithoutComplaintInput>
    create: XOR<AttachmentCreateWithoutComplaintInput, AttachmentUncheckedCreateWithoutComplaintInput>
  }

  export type AttachmentUpdateWithWhereUniqueWithoutComplaintInput = {
    where: AttachmentWhereUniqueInput
    data: XOR<AttachmentUpdateWithoutComplaintInput, AttachmentUncheckedUpdateWithoutComplaintInput>
  }

  export type AttachmentUpdateManyWithWhereWithoutComplaintInput = {
    where: AttachmentScalarWhereInput
    data: XOR<AttachmentUpdateManyMutationInput, AttachmentUncheckedUpdateManyWithoutComplaintInput>
  }

  export type StatusHistoryUpsertWithWhereUniqueWithoutComplaintInput = {
    where: StatusHistoryWhereUniqueInput
    update: XOR<StatusHistoryUpdateWithoutComplaintInput, StatusHistoryUncheckedUpdateWithoutComplaintInput>
    create: XOR<StatusHistoryCreateWithoutComplaintInput, StatusHistoryUncheckedCreateWithoutComplaintInput>
  }

  export type StatusHistoryUpdateWithWhereUniqueWithoutComplaintInput = {
    where: StatusHistoryWhereUniqueInput
    data: XOR<StatusHistoryUpdateWithoutComplaintInput, StatusHistoryUncheckedUpdateWithoutComplaintInput>
  }

  export type StatusHistoryUpdateManyWithWhereWithoutComplaintInput = {
    where: StatusHistoryScalarWhereInput
    data: XOR<StatusHistoryUpdateManyMutationInput, StatusHistoryUncheckedUpdateManyWithoutComplaintInput>
  }

  export type UpvoteUpsertWithWhereUniqueWithoutComplaintInput = {
    where: UpvoteWhereUniqueInput
    update: XOR<UpvoteUpdateWithoutComplaintInput, UpvoteUncheckedUpdateWithoutComplaintInput>
    create: XOR<UpvoteCreateWithoutComplaintInput, UpvoteUncheckedCreateWithoutComplaintInput>
  }

  export type UpvoteUpdateWithWhereUniqueWithoutComplaintInput = {
    where: UpvoteWhereUniqueInput
    data: XOR<UpvoteUpdateWithoutComplaintInput, UpvoteUncheckedUpdateWithoutComplaintInput>
  }

  export type UpvoteUpdateManyWithWhereWithoutComplaintInput = {
    where: UpvoteScalarWhereInput
    data: XOR<UpvoteUpdateManyMutationInput, UpvoteUncheckedUpdateManyWithoutComplaintInput>
  }

  export type ComplaintCreateWithoutAttachmentsInput = {
    id?: string
    title: string
    description: string
    category: $Enums.ComplaintCategory
    status?: $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: number
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutComplaintsInput
    assignedTo?: UserCreateNestedOneWithoutAssignedComplaintsInput
    statusHistory?: StatusHistoryCreateNestedManyWithoutComplaintInput
    upvotes?: UpvoteCreateNestedManyWithoutComplaintInput
  }

  export type ComplaintUncheckedCreateWithoutAttachmentsInput = {
    id?: string
    title: string
    description: string
    category: $Enums.ComplaintCategory
    status?: $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: number
    userId: string
    assignedToId?: string | null
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    statusHistory?: StatusHistoryUncheckedCreateNestedManyWithoutComplaintInput
    upvotes?: UpvoteUncheckedCreateNestedManyWithoutComplaintInput
  }

  export type ComplaintCreateOrConnectWithoutAttachmentsInput = {
    where: ComplaintWhereUniqueInput
    create: XOR<ComplaintCreateWithoutAttachmentsInput, ComplaintUncheckedCreateWithoutAttachmentsInput>
  }

  export type UserCreateWithoutAttachmentsInput = {
    id?: string
    email: string
    password: string
    name: string
    phone?: string | null
    role?: $Enums.UserRole
    avatar?: string | null
    emailVerified?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    complaints?: ComplaintCreateNestedManyWithoutUserInput
    assignedComplaints?: ComplaintCreateNestedManyWithoutAssignedToInput
    statusHistories?: StatusHistoryCreateNestedManyWithoutChangedByInput
    upvotes?: UpvoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAttachmentsInput = {
    id?: string
    email: string
    password: string
    name: string
    phone?: string | null
    role?: $Enums.UserRole
    avatar?: string | null
    emailVerified?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    complaints?: ComplaintUncheckedCreateNestedManyWithoutUserInput
    assignedComplaints?: ComplaintUncheckedCreateNestedManyWithoutAssignedToInput
    statusHistories?: StatusHistoryUncheckedCreateNestedManyWithoutChangedByInput
    upvotes?: UpvoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAttachmentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAttachmentsInput, UserUncheckedCreateWithoutAttachmentsInput>
  }

  export type ComplaintUpsertWithoutAttachmentsInput = {
    update: XOR<ComplaintUpdateWithoutAttachmentsInput, ComplaintUncheckedUpdateWithoutAttachmentsInput>
    create: XOR<ComplaintCreateWithoutAttachmentsInput, ComplaintUncheckedCreateWithoutAttachmentsInput>
    where?: ComplaintWhereInput
  }

  export type ComplaintUpdateToOneWithWhereWithoutAttachmentsInput = {
    where?: ComplaintWhereInput
    data: XOR<ComplaintUpdateWithoutAttachmentsInput, ComplaintUncheckedUpdateWithoutAttachmentsInput>
  }

  export type ComplaintUpdateWithoutAttachmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumComplaintCategoryFieldUpdateOperationsInput | $Enums.ComplaintCategory
    status?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutComplaintsNestedInput
    assignedTo?: UserUpdateOneWithoutAssignedComplaintsNestedInput
    statusHistory?: StatusHistoryUpdateManyWithoutComplaintNestedInput
    upvotes?: UpvoteUpdateManyWithoutComplaintNestedInput
  }

  export type ComplaintUncheckedUpdateWithoutAttachmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumComplaintCategoryFieldUpdateOperationsInput | $Enums.ComplaintCategory
    status?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statusHistory?: StatusHistoryUncheckedUpdateManyWithoutComplaintNestedInput
    upvotes?: UpvoteUncheckedUpdateManyWithoutComplaintNestedInput
  }

  export type UserUpsertWithoutAttachmentsInput = {
    update: XOR<UserUpdateWithoutAttachmentsInput, UserUncheckedUpdateWithoutAttachmentsInput>
    create: XOR<UserCreateWithoutAttachmentsInput, UserUncheckedCreateWithoutAttachmentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAttachmentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAttachmentsInput, UserUncheckedUpdateWithoutAttachmentsInput>
  }

  export type UserUpdateWithoutAttachmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    complaints?: ComplaintUpdateManyWithoutUserNestedInput
    assignedComplaints?: ComplaintUpdateManyWithoutAssignedToNestedInput
    statusHistories?: StatusHistoryUpdateManyWithoutChangedByNestedInput
    upvotes?: UpvoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAttachmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    complaints?: ComplaintUncheckedUpdateManyWithoutUserNestedInput
    assignedComplaints?: ComplaintUncheckedUpdateManyWithoutAssignedToNestedInput
    statusHistories?: StatusHistoryUncheckedUpdateManyWithoutChangedByNestedInput
    upvotes?: UpvoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ComplaintCreateWithoutStatusHistoryInput = {
    id?: string
    title: string
    description: string
    category: $Enums.ComplaintCategory
    status?: $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: number
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutComplaintsInput
    assignedTo?: UserCreateNestedOneWithoutAssignedComplaintsInput
    attachments?: AttachmentCreateNestedManyWithoutComplaintInput
    upvotes?: UpvoteCreateNestedManyWithoutComplaintInput
  }

  export type ComplaintUncheckedCreateWithoutStatusHistoryInput = {
    id?: string
    title: string
    description: string
    category: $Enums.ComplaintCategory
    status?: $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: number
    userId: string
    assignedToId?: string | null
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    attachments?: AttachmentUncheckedCreateNestedManyWithoutComplaintInput
    upvotes?: UpvoteUncheckedCreateNestedManyWithoutComplaintInput
  }

  export type ComplaintCreateOrConnectWithoutStatusHistoryInput = {
    where: ComplaintWhereUniqueInput
    create: XOR<ComplaintCreateWithoutStatusHistoryInput, ComplaintUncheckedCreateWithoutStatusHistoryInput>
  }

  export type UserCreateWithoutStatusHistoriesInput = {
    id?: string
    email: string
    password: string
    name: string
    phone?: string | null
    role?: $Enums.UserRole
    avatar?: string | null
    emailVerified?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    complaints?: ComplaintCreateNestedManyWithoutUserInput
    assignedComplaints?: ComplaintCreateNestedManyWithoutAssignedToInput
    attachments?: AttachmentCreateNestedManyWithoutUserInput
    upvotes?: UpvoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutStatusHistoriesInput = {
    id?: string
    email: string
    password: string
    name: string
    phone?: string | null
    role?: $Enums.UserRole
    avatar?: string | null
    emailVerified?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    complaints?: ComplaintUncheckedCreateNestedManyWithoutUserInput
    assignedComplaints?: ComplaintUncheckedCreateNestedManyWithoutAssignedToInput
    attachments?: AttachmentUncheckedCreateNestedManyWithoutUserInput
    upvotes?: UpvoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutStatusHistoriesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutStatusHistoriesInput, UserUncheckedCreateWithoutStatusHistoriesInput>
  }

  export type ComplaintUpsertWithoutStatusHistoryInput = {
    update: XOR<ComplaintUpdateWithoutStatusHistoryInput, ComplaintUncheckedUpdateWithoutStatusHistoryInput>
    create: XOR<ComplaintCreateWithoutStatusHistoryInput, ComplaintUncheckedCreateWithoutStatusHistoryInput>
    where?: ComplaintWhereInput
  }

  export type ComplaintUpdateToOneWithWhereWithoutStatusHistoryInput = {
    where?: ComplaintWhereInput
    data: XOR<ComplaintUpdateWithoutStatusHistoryInput, ComplaintUncheckedUpdateWithoutStatusHistoryInput>
  }

  export type ComplaintUpdateWithoutStatusHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumComplaintCategoryFieldUpdateOperationsInput | $Enums.ComplaintCategory
    status?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutComplaintsNestedInput
    assignedTo?: UserUpdateOneWithoutAssignedComplaintsNestedInput
    attachments?: AttachmentUpdateManyWithoutComplaintNestedInput
    upvotes?: UpvoteUpdateManyWithoutComplaintNestedInput
  }

  export type ComplaintUncheckedUpdateWithoutStatusHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumComplaintCategoryFieldUpdateOperationsInput | $Enums.ComplaintCategory
    status?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attachments?: AttachmentUncheckedUpdateManyWithoutComplaintNestedInput
    upvotes?: UpvoteUncheckedUpdateManyWithoutComplaintNestedInput
  }

  export type UserUpsertWithoutStatusHistoriesInput = {
    update: XOR<UserUpdateWithoutStatusHistoriesInput, UserUncheckedUpdateWithoutStatusHistoriesInput>
    create: XOR<UserCreateWithoutStatusHistoriesInput, UserUncheckedCreateWithoutStatusHistoriesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutStatusHistoriesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutStatusHistoriesInput, UserUncheckedUpdateWithoutStatusHistoriesInput>
  }

  export type UserUpdateWithoutStatusHistoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    complaints?: ComplaintUpdateManyWithoutUserNestedInput
    assignedComplaints?: ComplaintUpdateManyWithoutAssignedToNestedInput
    attachments?: AttachmentUpdateManyWithoutUserNestedInput
    upvotes?: UpvoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutStatusHistoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    complaints?: ComplaintUncheckedUpdateManyWithoutUserNestedInput
    assignedComplaints?: ComplaintUncheckedUpdateManyWithoutAssignedToNestedInput
    attachments?: AttachmentUncheckedUpdateManyWithoutUserNestedInput
    upvotes?: UpvoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ComplaintCreateWithoutUpvotesInput = {
    id?: string
    title: string
    description: string
    category: $Enums.ComplaintCategory
    status?: $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: number
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutComplaintsInput
    assignedTo?: UserCreateNestedOneWithoutAssignedComplaintsInput
    attachments?: AttachmentCreateNestedManyWithoutComplaintInput
    statusHistory?: StatusHistoryCreateNestedManyWithoutComplaintInput
  }

  export type ComplaintUncheckedCreateWithoutUpvotesInput = {
    id?: string
    title: string
    description: string
    category: $Enums.ComplaintCategory
    status?: $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: number
    userId: string
    assignedToId?: string | null
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    attachments?: AttachmentUncheckedCreateNestedManyWithoutComplaintInput
    statusHistory?: StatusHistoryUncheckedCreateNestedManyWithoutComplaintInput
  }

  export type ComplaintCreateOrConnectWithoutUpvotesInput = {
    where: ComplaintWhereUniqueInput
    create: XOR<ComplaintCreateWithoutUpvotesInput, ComplaintUncheckedCreateWithoutUpvotesInput>
  }

  export type UserCreateWithoutUpvotesInput = {
    id?: string
    email: string
    password: string
    name: string
    phone?: string | null
    role?: $Enums.UserRole
    avatar?: string | null
    emailVerified?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    complaints?: ComplaintCreateNestedManyWithoutUserInput
    assignedComplaints?: ComplaintCreateNestedManyWithoutAssignedToInput
    attachments?: AttachmentCreateNestedManyWithoutUserInput
    statusHistories?: StatusHistoryCreateNestedManyWithoutChangedByInput
  }

  export type UserUncheckedCreateWithoutUpvotesInput = {
    id?: string
    email: string
    password: string
    name: string
    phone?: string | null
    role?: $Enums.UserRole
    avatar?: string | null
    emailVerified?: Date | string | null
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    complaints?: ComplaintUncheckedCreateNestedManyWithoutUserInput
    assignedComplaints?: ComplaintUncheckedCreateNestedManyWithoutAssignedToInput
    attachments?: AttachmentUncheckedCreateNestedManyWithoutUserInput
    statusHistories?: StatusHistoryUncheckedCreateNestedManyWithoutChangedByInput
  }

  export type UserCreateOrConnectWithoutUpvotesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUpvotesInput, UserUncheckedCreateWithoutUpvotesInput>
  }

  export type ComplaintUpsertWithoutUpvotesInput = {
    update: XOR<ComplaintUpdateWithoutUpvotesInput, ComplaintUncheckedUpdateWithoutUpvotesInput>
    create: XOR<ComplaintCreateWithoutUpvotesInput, ComplaintUncheckedCreateWithoutUpvotesInput>
    where?: ComplaintWhereInput
  }

  export type ComplaintUpdateToOneWithWhereWithoutUpvotesInput = {
    where?: ComplaintWhereInput
    data: XOR<ComplaintUpdateWithoutUpvotesInput, ComplaintUncheckedUpdateWithoutUpvotesInput>
  }

  export type ComplaintUpdateWithoutUpvotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumComplaintCategoryFieldUpdateOperationsInput | $Enums.ComplaintCategory
    status?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutComplaintsNestedInput
    assignedTo?: UserUpdateOneWithoutAssignedComplaintsNestedInput
    attachments?: AttachmentUpdateManyWithoutComplaintNestedInput
    statusHistory?: StatusHistoryUpdateManyWithoutComplaintNestedInput
  }

  export type ComplaintUncheckedUpdateWithoutUpvotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumComplaintCategoryFieldUpdateOperationsInput | $Enums.ComplaintCategory
    status?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attachments?: AttachmentUncheckedUpdateManyWithoutComplaintNestedInput
    statusHistory?: StatusHistoryUncheckedUpdateManyWithoutComplaintNestedInput
  }

  export type UserUpsertWithoutUpvotesInput = {
    update: XOR<UserUpdateWithoutUpvotesInput, UserUncheckedUpdateWithoutUpvotesInput>
    create: XOR<UserCreateWithoutUpvotesInput, UserUncheckedCreateWithoutUpvotesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUpvotesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUpvotesInput, UserUncheckedUpdateWithoutUpvotesInput>
  }

  export type UserUpdateWithoutUpvotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    complaints?: ComplaintUpdateManyWithoutUserNestedInput
    assignedComplaints?: ComplaintUpdateManyWithoutAssignedToNestedInput
    attachments?: AttachmentUpdateManyWithoutUserNestedInput
    statusHistories?: StatusHistoryUpdateManyWithoutChangedByNestedInput
  }

  export type UserUncheckedUpdateWithoutUpvotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    complaints?: ComplaintUncheckedUpdateManyWithoutUserNestedInput
    assignedComplaints?: ComplaintUncheckedUpdateManyWithoutAssignedToNestedInput
    attachments?: AttachmentUncheckedUpdateManyWithoutUserNestedInput
    statusHistories?: StatusHistoryUncheckedUpdateManyWithoutChangedByNestedInput
  }

  export type ComplaintCreateManyUserInput = {
    id?: string
    title: string
    description: string
    category: $Enums.ComplaintCategory
    status?: $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: number
    assignedToId?: string | null
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type ComplaintCreateManyAssignedToInput = {
    id?: string
    title: string
    description: string
    category: $Enums.ComplaintCategory
    status?: $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: number
    userId: string
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type AttachmentCreateManyUserInput = {
    id?: string
    complaintId?: string | null
    filename: string
    cloudinaryId?: string | null
    url: string
    thumbnailUrl?: string | null
    mimeType: string
    size: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StatusHistoryCreateManyChangedByInput = {
    id?: string
    complaintId: string
    fromStatus: $Enums.ComplaintStatus
    toStatus: $Enums.ComplaintStatus
    comment?: string | null
    createdAt?: Date | string
  }

  export type UpvoteCreateManyUserInput = {
    complaintId: string
    createdAt?: Date | string
  }

  export type ComplaintUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumComplaintCategoryFieldUpdateOperationsInput | $Enums.ComplaintCategory
    status?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    assignedTo?: UserUpdateOneWithoutAssignedComplaintsNestedInput
    attachments?: AttachmentUpdateManyWithoutComplaintNestedInput
    statusHistory?: StatusHistoryUpdateManyWithoutComplaintNestedInput
    upvotes?: UpvoteUpdateManyWithoutComplaintNestedInput
  }

  export type ComplaintUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumComplaintCategoryFieldUpdateOperationsInput | $Enums.ComplaintCategory
    status?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attachments?: AttachmentUncheckedUpdateManyWithoutComplaintNestedInput
    statusHistory?: StatusHistoryUncheckedUpdateManyWithoutComplaintNestedInput
    upvotes?: UpvoteUncheckedUpdateManyWithoutComplaintNestedInput
  }

  export type ComplaintUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumComplaintCategoryFieldUpdateOperationsInput | $Enums.ComplaintCategory
    status?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ComplaintUpdateWithoutAssignedToInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumComplaintCategoryFieldUpdateOperationsInput | $Enums.ComplaintCategory
    status?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutComplaintsNestedInput
    attachments?: AttachmentUpdateManyWithoutComplaintNestedInput
    statusHistory?: StatusHistoryUpdateManyWithoutComplaintNestedInput
    upvotes?: UpvoteUpdateManyWithoutComplaintNestedInput
  }

  export type ComplaintUncheckedUpdateWithoutAssignedToInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumComplaintCategoryFieldUpdateOperationsInput | $Enums.ComplaintCategory
    status?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attachments?: AttachmentUncheckedUpdateManyWithoutComplaintNestedInput
    statusHistory?: StatusHistoryUncheckedUpdateManyWithoutComplaintNestedInput
    upvotes?: UpvoteUncheckedUpdateManyWithoutComplaintNestedInput
  }

  export type ComplaintUncheckedUpdateManyWithoutAssignedToInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumComplaintCategoryFieldUpdateOperationsInput | $Enums.ComplaintCategory
    status?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    location?: NullableJsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AttachmentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    cloudinaryId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    complaint?: ComplaintUpdateOneWithoutAttachmentsNestedInput
  }

  export type AttachmentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    complaintId?: NullableStringFieldUpdateOperationsInput | string | null
    filename?: StringFieldUpdateOperationsInput | string
    cloudinaryId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttachmentUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    complaintId?: NullableStringFieldUpdateOperationsInput | string | null
    filename?: StringFieldUpdateOperationsInput | string
    cloudinaryId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StatusHistoryUpdateWithoutChangedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromStatus?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    toStatus?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    complaint?: ComplaintUpdateOneRequiredWithoutStatusHistoryNestedInput
  }

  export type StatusHistoryUncheckedUpdateWithoutChangedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    complaintId?: StringFieldUpdateOperationsInput | string
    fromStatus?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    toStatus?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StatusHistoryUncheckedUpdateManyWithoutChangedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    complaintId?: StringFieldUpdateOperationsInput | string
    fromStatus?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    toStatus?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UpvoteUpdateWithoutUserInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    complaint?: ComplaintUpdateOneRequiredWithoutUpvotesNestedInput
  }

  export type UpvoteUncheckedUpdateWithoutUserInput = {
    complaintId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UpvoteUncheckedUpdateManyWithoutUserInput = {
    complaintId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttachmentCreateManyComplaintInput = {
    id?: string
    userId: string
    filename: string
    cloudinaryId?: string | null
    url: string
    thumbnailUrl?: string | null
    mimeType: string
    size: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StatusHistoryCreateManyComplaintInput = {
    id?: string
    fromStatus: $Enums.ComplaintStatus
    toStatus: $Enums.ComplaintStatus
    changedById: string
    comment?: string | null
    createdAt?: Date | string
  }

  export type UpvoteCreateManyComplaintInput = {
    userId: string
    createdAt?: Date | string
  }

  export type AttachmentUpdateWithoutComplaintInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    cloudinaryId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAttachmentsNestedInput
  }

  export type AttachmentUncheckedUpdateWithoutComplaintInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    cloudinaryId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttachmentUncheckedUpdateManyWithoutComplaintInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    cloudinaryId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StatusHistoryUpdateWithoutComplaintInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromStatus?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    toStatus?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    changedBy?: UserUpdateOneRequiredWithoutStatusHistoriesNestedInput
  }

  export type StatusHistoryUncheckedUpdateWithoutComplaintInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromStatus?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    toStatus?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    changedById?: StringFieldUpdateOperationsInput | string
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StatusHistoryUncheckedUpdateManyWithoutComplaintInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromStatus?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    toStatus?: EnumComplaintStatusFieldUpdateOperationsInput | $Enums.ComplaintStatus
    changedById?: StringFieldUpdateOperationsInput | string
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UpvoteUpdateWithoutComplaintInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutUpvotesNestedInput
  }

  export type UpvoteUncheckedUpdateWithoutComplaintInput = {
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UpvoteUncheckedUpdateManyWithoutComplaintInput = {
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ComplaintCountOutputTypeDefaultArgs instead
     */
    export type ComplaintCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ComplaintCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ComplaintDefaultArgs instead
     */
    export type ComplaintArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ComplaintDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AttachmentDefaultArgs instead
     */
    export type AttachmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AttachmentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use StatusHistoryDefaultArgs instead
     */
    export type StatusHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = StatusHistoryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UpvoteDefaultArgs instead
     */
    export type UpvoteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UpvoteDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}