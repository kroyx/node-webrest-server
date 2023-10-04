
export class TodoEntity {

  constructor(
      public id: number,
      public text: string,
      public completedAt?: Date | null,
  ) {}

  get isCompleted() {
    return !!this.completedAt;
  }

  static fromObject(object: {[key: string]: any}): TodoEntity {
    const { id, text, completedAt } = object;

    if (!id) throw '"Id" field is required';
    if (!text) throw '"Text" field is required';

    let newCompletedAt;
    if (completedAt) {
      newCompletedAt = new Date(completedAt);
      if (isNaN(newCompletedAt.valueOf())) throw '"CompletedAt" field is not a valid date';
    }
    return new TodoEntity(id, text, completedAt);
  }
}