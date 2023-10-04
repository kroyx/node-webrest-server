import request from 'supertest';
import { prisma } from '../../../src/data/postgres';
import { testServer } from '../../test-server';

describe('Todo route testing', () => {

  const todo1 = { text: 'Hola Mundo 1' };
  const todo2 = { text: 'Hola Mundo 2' };

  beforeAll(async () => {
    await testServer.start();
  });

  afterAll(() => {
    testServer.close();
  });

  beforeEach(async () => {
    await prisma.todo.deleteMany();
  });

  test('should return TODOs api/todos', async () => {
    await prisma.todo.createMany({
      data: [ todo1, todo2 ],
    });
    const { body } = await request(testServer.app)
        .get('/api/todos')
        .expect(200);

    expect(body).toBeInstanceOf(Array);
    expect(body).toHaveLength(2);
    expect(body[0].text).toBe(todo1.text);
    expect(body[1].text).toBe(todo2.text);
    expect(body[0].completedAt).toBeNull();
  });

  test('should return a TODO api/todos/:id', async () => {

    const newTodo = await prisma.todo.create({
      data: todo1
    });

    const { body } = await request(testServer.app)
        .get(`/api/todos/${ newTodo.id }`)
        .expect(200);

    expect(body).toBeInstanceOf(Object);
    expect(body).toEqual(expect.objectContaining({
      id: newTodo.id,
      text: todo1.text,
      completedAt: newTodo.completedAt
    }));
  });

  test('should return a 404 NotFound api/todos/:id', async () => {
    const id: number = 999;
    const { body } = await request(testServer.app)
        .get(`/api/todos/${ id }`)
        .expect(404);

    expect(body).toEqual({
      error: `Todo with id ${ id } not found`
    });
  });

  test('should return a new Todo api/todos', async () => {
    const { body } = await request(testServer.app)
        .post('/api/todos')
        .send(todo1)
        .expect(201);

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo1.text,
      completedAt: null,
    });
  });

  test('should return an error if text is not present api/todos', async () => {
    const { body } = await request(testServer.app)
        .post('/api/todos')
        .send({})
        .expect(400);

    expect(body).toEqual({
      error: '"Text" property is required'
    });
  });

  test('should return an error if text is empty api/todos', async () => {
    const { body } = await request(testServer.app)
        .post('/api/todos')
        .send({ text: '' })
        .expect(400);

    expect(body).toEqual({
      error: '"Text" property is required'
    });
  });

  test('should return an updated Todo api/todos/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 });
    const updatedTodo = {
      text: 'Hola mundo UPDATE',
      completedAt: '2023-10-04',
    };
    const { body } = await request(testServer.app)
        .put(`/api/todos/${ todo.id }`)
        .send(updatedTodo)
        .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: updatedTodo.text,
      completedAt: '2023-10-04T00:00:00.000Z',
    });
  });

  test('should return 404 if Todo not found', async () => {
    const todoId = 999;
    const updatedTodo = {
      text: 'Hola mundo UPDATE',
      completedAt: '2023-10-04',
    };
    const { body } = await request(testServer.app)
        .put(`/api/todos/${ todoId }`)
        .send(updatedTodo)
        .expect(404);

    expect(body).toEqual({
      error: `Todo with id ${ todoId } not found`
    })
  });

  test('should return an updated Todo with only the date changed', async () => {
    const todo = await prisma.todo.create({ data: todo1 });
    const updatedTodo = {
      completedAt: '2023-10-04',
    };
    const { body } = await request(testServer.app)
        .put(`/api/todos/${ todo.id }`)
        .send(updatedTodo)
        .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: todo.text,
      completedAt: '2023-10-04T00:00:00.000Z',
    })
  });

  test('should delete a Todo api/delete/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 });
    const { body } = await request(testServer.app)
        .delete(`/api/todos/${ todo.id }`)
        .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: todo.text,
      completedAt: todo.completedAt
    })
  });

  test('should return error when deleting a Todo that does not exist api/delete/:id', async () => {
    const todoId = 999;
    const { body } = await request(testServer.app)
        .delete(`/api/todos/${ todoId }`)
        .expect(404);

    expect(body).toEqual({
      error: `Todo with id ${ todoId } not found`
    });
  });
});