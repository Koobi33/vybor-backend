import { User } from '@/api/user/userModel';

export const users: User[] = [
  {
    id: 124,
    name: 'Alice',
    locale: 'ru',
    score: 10,
    energy: 5,
    maxEnergy: 5,
    createdQuestions: [],
    answeredQuestions: [],
    wallet: null,
    multiplier: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 123,
    name: 'Bob',
    locale: 'ru',
    score: 20,
    energy: 5,
    maxEnergy: 5,
    createdQuestions: [],
    answeredQuestions: [],
    wallet: null,
    multiplier: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const userRepository = {
  findAllAsync: async (): Promise<User[]> => {
    return users.sort((a, b) => b.score - a.score);
  },

  findByIdAsync: async (id: number): Promise<User | null> => {
    return users.find((user) => user.id === id) || null;
  },

  addOneAsync: async (data: User): Promise<User | null> => {
    users.push(data);
    return users.find((user) => user.id === data.id) || null;
  },

  updateOneAsync: async (user: User): Promise<User | null> => {
    users.forEach((element, index) => {
      if (element.id === user.id) {
        users[index] = user;
      }
    });
    return users.find((el) => el.id === user.id) || null;
  },
};
