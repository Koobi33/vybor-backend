import { User } from '@/api/user/userModel';
import { InitDataParsed } from '@tma.js/sdk';

const pool = require('@/common/db');

export const MAX_USER_ENERGY: number = 5;
export const FREE_QUESTION_TIMEOUT_SECONDS: number = 60 * 60 * 24 * 3;

export const userRepository = {
  findAllAsync: async (): Promise<User[]> => {
    try {
      //RETURNS LEADERBOARD - users with connected wallets
      const query = `select * from users u
          left join players p on u.id = p.user_id
          where p.user_id is not null and p.wallet not null`;

      const queryResult = await pool.query(query);

      const res = queryResult.rows.map((row: any) => {
        return {
          id: row.user_id,
          playerId: row.id,
          isModerator: row.is_moderator,
          name: row.name,
          score: row.score,
          multiplier: row.current_strick,
          wallet: row.wallet_id,
          locale: row.locale,
          energy: row.energy,
          maxEnergy: MAX_USER_ENERGY,
          fillEnergyTime: row.fill_energy_time,
          nextFreeQuestionTime: row.next_free_question_time,
          availableQuestions: row.available_questions,
        };
      });
      return res.sort((a: User, b: User) => b.score - a.score);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  findByIdAsync: async (id: number): Promise<User | null> => {
    //TODO: fix
    try {
      const query = `select * from users u
                     left join players p on u.id = p.user_id
                     where p.user_id is not null and p.id = $1`;

      const result = await pool.query(query, [id]);

      return result.rows.length
        ? {
            id: result.rows[0].user_id,
            playerId: result.rows[0].id,
            tg_id: result.rows[0].tg_id,
            isModerator: result.rows[0].is_moderator,
            name: result.rows[0].name,
            score: result.rows[0].score,
            multiplier: result.rows[0].current_strick,
            wallet: result.rows[0].wallet_id,
            locale: result.rows[0].locale,
            energy: result.rows[0].energy,
            maxEnergy: MAX_USER_ENERGY,
            fillEnergyTime: result.rows[0].fill_energy_time,
            nextFreeQuestionTime: result.rows[0].next_free_question_time,
            availableQuestions: result.rows[0].available_questions,
          }
        : null;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },
  findByTgIdAsync: async (tgId: number): Promise<User | null> => {
    try {
      const query = `select * from users u
                   left join players p on u.id = p.user_id
                   where p.user_id is not null and u.tg_id = $1`;

      const result = await pool.query(query, [tgId]);

      return result.rows.length
        ? {
            id: result.rows[0].user_id,
            playerId: result.rows[0].id,
            tg_id: result.rows[0].tg_id,
            isModerator: result.rows[0].is_moderator,
            name: result.rows[0].name,
            score: result.rows[0].score,
            multiplier: result.rows[0].current_strick,
            wallet: result.rows[0].wallet_id,
            locale: result.rows[0].locale,
            energy: result.rows[0].energy,
            maxEnergy: MAX_USER_ENERGY,
            fillEnergyTime: result.rows[0].fill_energy_time,
            nextFreeQuestionTime: result.rows[0].next_free_question_time,
            availableQuestions: result.rows[0].available_questions,
          }
        : null;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  addOneAsync: async (data: User): Promise<User | null> => {
    const query = `
        with newUserId as(
            insert into users(tg_id, tg_id_hash, wallet_id) values($1, $2, $3) returning id
        )
        insert into players (user_id, score, coins, energy, is_wallet_connected, is_moderator, next_free_question_time,
                             available_questions, fill_energy_time, locale, current_strick, name)
        select id, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
        from newUserId;`;

    const selectQuery = `
        select * from users u
            left join players p on u.id = p.user_id
            where p.user_id is not null
            order by u.id desc
            limit 1;`;

    await pool.query(query, [
      data.tg_id,
      'tg_id_hash', //todo tgHash
      data.wallet,
      data.score,
      0,
      data.energy,
      data.wallet != null, //todo wallet
      false,
      data.nextFreeQuestionTime,
      data.availableQuestions,
      data.fillEnergyTime,
      data.locale,
      data.multiplier,
      data.name,
    ]);

    const result = await pool.query(selectQuery);

    return result.rows.length
      ? {
          id: result.rows[0].user_id,
          playerId: result.rows[0].id,
          tg_id: result.rows[0].tg_id,
          isModerator: result.rows[0].is_moderator,
          name: result.rows[0].name,
          score: result.rows[0].score,
          multiplier: result.rows[0].current_strick,
          wallet: result.rows[0].wallet_id,
          locale: result.rows[0].locale,
          energy: result.rows[0].energy,
          maxEnergy: MAX_USER_ENERGY,
          fillEnergyTime: result.rows[0].fill_energy_time,
          nextFreeQuestionTime: result.rows[0].next_free_question_time,
          availableQuestions: result.rows[0].available_questions,
        }
      : null;
  },

  updateOneAsync: async (id: number, user: User, tgData: InitDataParsed): Promise<User | null> => {
    try {
      const queryUser = `
            update users 
            set 
                tg_id = $1, 
                tg_id_hash = $2, 
                wallet_id = $3
            where id = $4`;

      const debug_user = await pool.query(queryUser, [
        String(tgData?.user?.id!),
        'tg_id_hash', //todo tgHash
        user.wallet,
        user.id,
      ]);

      const queryPlayer = `
            update players 
            set 
                score = $1, 
                energy = $2, 
                is_wallet_connected = $3,
                is_moderator = $4,
                next_free_question_time = $5,
                available_questions = $6,
                fill_energy_time = $7,
                locale = $8,
                current_strick = $9,
                name = $10
            where id = $11`;

      const debug_player = await pool.query(queryPlayer, [
        user.score,
        user.energy,
        user.wallet != null, //todo wallet
        user.id == 0,
        user.nextFreeQuestionTime,
        user.availableQuestions,
        user.fillEnergyTime,
        user.locale,
        user.multiplier,
        user.name,
        id,
      ]);

      const query = `select * from users u
                     left join players p on u.id = p.user_id
                     where p.user_id is not null and p.id = $1`;

      const result = await pool.query(query, [id]);

      return result.rows.length
        ? {
            id: result.rows[0].user_id,
            playerId: result.rows[0].id,
            tg_id: result.rows[0].tg_id,
            isModerator: result.rows[0].is_moderator,
            name: result.rows[0].name,
            score: result.rows[0].score,
            multiplier: result.rows[0].current_strick,
            wallet: result.rows[0].wallet_id,
            locale: result.rows[0].locale,
            energy: result.rows[0].energy,
            maxEnergy: MAX_USER_ENERGY,
            fillEnergyTime: result.rows[0].fill_energy_time,
            nextFreeQuestionTime: result.rows[0].next_free_question_time,
            availableQuestions: result.rows[0].available_questions,
          }
        : null;
    } catch (error) {
      // Handling errors
      console.error('Error updating question:', error);
      throw error;
    }
  },
};
