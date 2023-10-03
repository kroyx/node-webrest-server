import { Request, Response } from 'express';
import { prisma } from '../../data/postgres';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';

export class TodosController {

  // * DI
  constructor() {}

  public getTodos = async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany();
    res.json(todos);
  };

  public getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res.status(400).json({
        error: `ID not valid, it must be a number`
      });
    }

    const todo = await prisma.todo.findUnique({
      where: { id }
    });

    if (!todo) {
      return res.status(404).json({
        error: `Todo with id ${ id } not found`
      });
    }

    res.json(todo);
  };

  public createTodo = async (req: Request, res: Response) => {
    const [ error, createTodoDto ] = CreateTodoDto.create(req.body);
    if (error) return res.status(400).json({ error });

    const todo = await prisma.todo.create({
      data: createTodoDto!
    });

    res.json({
      todo
    });
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [ error, updateTodoDto ] = UpdateTodoDto.create(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    try {
      const todo = await prisma.todo.update({
        where: { id },
        data: updateTodoDto!.values
      });
      res.json(todo);
    } catch (error) {
      res.status(404).json({
        error: `Todo with id ${ id } not found`
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
      const todo = await prisma.todo.delete({
        where: { id }
      });
      res.json(todo);
    } catch (error) {
      return res.status(404).json({
        error: `Todo with id ${ id } not found`
      });
    }
  };
}