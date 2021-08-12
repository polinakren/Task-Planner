export class Task {
  constructor(
    public assigneeType: string,
    public assigneeId: number,
    public start: string,
    public end: string,
    public title: string,
    public description: string,
    public status: string,
    public id: number,
    ) {}
}
