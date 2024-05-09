export type CreateMemoRequest = {
  name: string;
  type: string;
  status: string;
  details: number;
}

export type DeleteMemoRequest = {
  sk: string;
}
