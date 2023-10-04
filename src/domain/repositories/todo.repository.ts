import { CreateTodoDto, UpdateTodoDto } from '../dtos';
import { TodoEntity } from '../entities/todo.entity';

export abstract class TodoRepository {

  abstract findAll(): Promise<TodoEntity[]>;

  abstract findById(id: number): Promise<TodoEntity>;

  abstract create(createTodoDto: CreateTodoDto): Promise<TodoEntity>;

  abstract updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity>;

  abstract deleteById(id: number): Promise<TodoEntity>;
}