import { CreateMemoRequest, DeleteMemoRequest } from './type';
import { ddb, TableName } from '../../common/dynamodb';
import { Handler } from '../../common/express';
import { DeleteCommand, PutCommand, QueryCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { runJob } from 'common/jobs';

export const createMemo: Handler = async (req, res) => {
  const request = req.body as CreateMemoRequest;
  const userId = res.locals.userId as string;
  const now = Date.now()
  const item = {
    PK: pk(userId),
    SK: now.toString(),
    name: request.name,
    type: request.type,
    status: request.status,
    details: request.details,
    createdAt: now,
  };
  const response = await ddb.send(
    new PutCommand({
      TableName,
      Item: item,
    }),
  );

  return item;
};

export const getMemos: Handler = async (req, res) => {
  const userId = res.locals.userId as string;
  const memos = await ddb.send(
    new QueryCommand({
      TableName,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': pk(userId),
      },
      ScanIndexForward: false,
    }),
  );

  return { memos: memos.Items ?? [] };
};

export const getMemo: Handler = async (req, res) => {
  const userId = res.locals.userId as string;
  const memo = await ddb.send(
    new GetCommand({
      TableName,
      Key: {
        PK: pk(userId),
        SK: req.params.sk,
      },
    }),
  );

  return memo.Item;
};

export const deleteMemo: Handler = async (req, res) => {
  const userId = res.locals.userId as string;
  const request = req.body as DeleteMemoRequest;
  await ddb.send(
    new DeleteCommand({
      TableName,
      Key: {
        PK: pk(userId),
        SK: request.sk,
      },
    }),
  );

  return {};
};

export const runSampleJob: Handler = async (req, res) => {
  const userId = res.locals.userId as string;
  await runJob(userId, {
    jobType: 'sample',
    payload: {},
  });
};

const pk = (userId: string) => `MEMO#${userId};`;
