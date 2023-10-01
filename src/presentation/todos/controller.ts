import { Request, Response } from 'express';

export class TodosController {

  private todos = [
    { id: 1, text: 'Buy milk', completedAt: new Date() },
    { id: 2, text: 'Buy bread', completedAt: null },
    { id: 3, text: 'Buy butter', completedAt: new Date() },
  ];
  private nextId: number = this.todos.length + 1;

  // * DI
  constructor() {}

  public getTodos = (req: Request, res: Response) => {
    res.json(this.todos);
  };

  public getTodoById = (req: Request, res: Response) => {
    const idTodo = +req.params.id;

    if (isNaN(idTodo)) {
      return res.status(400).json({
        error: `ID not valid, it must be a number`
      });
    }

    const todo = this.todos.find(todo => todo.id === idTodo);

    if (!todo) {
      return res.status(404).json({
        error: `Todo with id ${ idTodo } not found`
      });
    }

    res.json(todo);
  };

  public createTodo = (req: Request, res: Response) => {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Text property is required'
      });
    }

    const todo = {
      id: this.nextId++,
      text,
      completedAt: null
    };
    this.todos.push(todo);
    res.json({
      message: 'Success on creating Todo',
      todo
    });
  };

  public updateTodo = (req: Request, res: Response) => {
    const idTodo = +req.params.id;
    const { text, completedAt } = req.body;

    if (isNaN(idTodo)) {
      return res.status(400).json({
        error: 'ID not valid, it must be a number'
      });
    }

    const todo = this.todos.find(todoMember => todoMember.id === idTodo);
    if (!todo) {
      return res.status(404).json({
        error: `Todo with id ${ idTodo } not found`
      });
    }

    todo.text = text;
    (completedAt === 'null')
        ? todo.completedAt = null
        : todo.completedAt = new Date(completedAt ?? todo.completedAt);

    res.json(todo);
  };

  public deleteTodo = (req: Request, res: Response) => {
    const idTodo = +req.params.id;

    if (isNaN(idTodo)) {
      return res.status(400).json({
        error: 'ID not valid, it must be a number'
      });
    }

    const todo = this.todos.find(todoMember => todoMember.id === idTodo);
    if (!todo) {
      return res.status(404).json({
        error: `Todo with id ${ idTodo } not found`
      });
    }

    this.todos = this.todos.filter(todo => todo.id !== idTodo);
    // this.todos.splice(this.todos.indexOf(todo), 1);
    res.json(todo);
  };
}