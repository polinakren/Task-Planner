export class UsersInfo{
  constructor(
    public team: string,
    public assignee: string,
    public status: string,
    public title: string,
    public description: string,
    public dateStr: string,
    public dateEnd: string,
    public duration: number
  ){}
}
