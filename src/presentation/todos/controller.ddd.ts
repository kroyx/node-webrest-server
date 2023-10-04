import { Request, Response } from 'express';
import { prisma } from '../../data/postgres';
import { TodoRepository } from '../../domain';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';

export class TodosController {

  // * DI
  constructor(
      private readonly repository: TodoRepository,
  ) {}

  public getTodos = async (req: Request, res: Response) => {
    const todos = await this.repository.findAll();
    res.json(todos);
  };

  public getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      return res.status(400).json({
        error: `ID not valid, it must be a number`
      });
    }

    try {
      const todo = await this.repository.findById(id);
      res.json(todo);
    } catch (error) {
      return res.status(404).json({
        error
      });
    }
  };

  public createTodo = async (req: Request, res: Response) => {
    const [ error, createTodoDto ] = CreateTodoDto.create(req.body);
    if (error) return res.status(400).json({ error });

    const todo = await this.repository.create(createTodoDto!);

    res.json({
      todo
    });
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [ error, updateTodoDto ] = UpdateTodoDto.create({ ...req.body, id });

    if (error) {
      return res.status(400).json({ error });
    }

    try {
      const todo = await this.repository.updateById(updateTodoDto!);
      res.json(todo);
    } catch (error) {
      res.status(404).json({
        error
      });
    }
  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res.status(400).json({
        error: 'ID not valid, it must be a number'
      });
    }

    try {
      const todo = await this.repository.deleteById(id);
      res.json(todo);
    } catch (error) {
      return res.status(404).json({
        error
      });
    }
  };
}