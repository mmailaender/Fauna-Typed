export const TopLevelInterfaces = `export interface PromisifyExecMethods<T> {
    exec: () => Promise<T>;
  }

  export interface ExecMethods<T> {
    exec: () => T;
  }
  
  export interface CreateMethods<T> extends PromisifyExecMethods<T> {}
  
  export interface WhereMethods<T> extends ExecMethods<PaginateData<T>> {}
  
  export interface FirstMethods<T> extends ExecMethods<T> {}

  export interface DeleteMethods<T> extends PromisifyExecMethods<T> {}

  export interface UpdateMethods<T> extends PromisifyExecMethods<T> {}
  
  export interface AllMethods<T>
    extends ExecMethods<PaginateData<T>> {
    first: () => FirstMethods<T>;
    where: (inputCondition: (data: T) => boolean) => WhereMethods<T>;
  }
  
  export interface PaginateData<T> {
    data: T[];
    after?: string | null | undefined;
    before?: string | null | undefined;
  }

  export interface ByIdMethods<T, U> extends PromisifyExecMethods<T> {
    update: (input: U) => UpdateMethods<T>;
    delete: () => DeleteMethods<T>;
  }
  \n`;

export const createTypedefsMethods = (key: string): string =>
  `export interface ${key}Methods {
  all: () => AllMethods<${key}>;
  create: (input: ${key}Input) => CreateMethods<${key}>;
  byId: (id: string) => ByIdMethods<${key}, ${key}Input>
}\n\n`;
