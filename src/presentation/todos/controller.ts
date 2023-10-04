import { Request, Response } from 'express';
import {
  CreateTodo,
  CreateTodoDto,
  CustomError,
  DeleteTodo,
  GetTodo,
  GetTodos,
  TodoRepository,
  UpdateTodo,
  UpdateTodoDto
} from '../../domain';

export class TodosController {

  // * DI
  constructor(
      private readonly repository: TodoRepository,
  ) {}

  public getTodos = (req: Request, res: Response) => {
    new GetTodos(this.repository)
        .execute()
        .then(todo => res.json(todo))
        .catch(error => this.handleError(res, error));
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
        .catch(error => this.handleError(res, error));
  };

  public createTodo = async (req: Request, res: Response) => {
    const [ error, createTodoDto ] = CreateTodoDto.create(req.body);
    if (error) return res.status(400).json({ error });

    new CreateTodo(this.repository)
        .execute(createTodoDto!)
        .then(todo => res.status(201).json(todo))
        .catch(error => this.handleError(res, error));
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [ error, updateTodoDto ] = UpdateTodoDto.create({ ...req.body, id });

    if (error) {
      return res.status(400).json({ error });
    }

    new UpdateTodo(this.repository)
        .execute(updateTodoDto!)
        .then(todo => res.json(todo))
        .catch(error => this.handleError(res, error));
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
        .catch(error => this.handleError(res, error));
  };

  private handleError = (res: Response, error: unknown) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({
      error: 'Internal Server Error - check logs'
    });
  };
}