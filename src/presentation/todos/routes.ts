import { Router } from 'express';
import {
  TodoDatasourceImpl
} from '../../infrastructure/datasources/todo.datasource.impl';
import {
  TodoRepositoryImpl
} from '../../infrastructure/repositories/todo.repository.impl';
import { TodosController } from './controller';

export class TodoRoutes {
  static get routes(): Router {
    const router = Router();

    const todoDatasource = new TodoDatasourceImpl();
    const todoRepository = new TodoRepositoryImpl(todoDatasource);
    const todosController = new TodosController(todoRepository);

    router.get('/', todosController.getTodos);
    router.get('/:id', todosController.getTodoById);
    router.post('/', todosController.createTodo);
    router.put('/:id', todosController.updateTodo);
    router.delete('/:id', todosController.deleteTodo);

    return router;
  }
}