import { Request, Response } from 'express';
import {
  CreateTodo,
  DeleteTodo,
  GetTodo,
  GetTodos,
  TodoRepository,
  UpdateTodo
} from '../../domain';
import { CreateTodoDto, UpdateTodoDto } from '../../domain';

export class TodosController {

  // * DI
  constructor(
      private readonly repository: TodoRepository,
  ) {}

  public getTodos = (req: Request, res: Response) => {
    new GetTodos(this.repository)
        .execute()
        .then(todo => res.json(todo))
        .catch(error => res.status(400).json(error));
  };

  public getTodoById = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      return res.status(400).json({
        error: `ID not valid, it must be a number`
      });
    }

    new GetTodo(this.repository)
        .execute(id)
        .then(todo => res.json(todo))
        .catch(error => res.status(400).json(error));
  };

  public createTodo = async (req: Request, res: Response) => {
    const [ error, createTodoDto ] = CreateTodoDto.create(req.body);
    if (error) return res.status(400).json({ error });

    new CreateTodo(this.repository)
        .execute(createTodoDto!)
        .then(todo => res.json(todo))
        .catch(error => res.status(400).json(error));
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [ error, updateTodoDto ] = UpdateTodoDto.create({ ...req.body, id });

    if (error) {
      return res.status(400).json({ error });
    }

    new UpdateTodo(this.repository)
        .execute(updateTodoDto!)
        .catch(error => res.status(400).json(error));
  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res.status(400).json({
        error: 'ID not valid, it must be a number'
      });
    }

    new DeleteTodo(this.repository)
        .execute(id)
        .then(todo => res.json(todo))
        .catch(error => res.status(400).json(error));
  };
}