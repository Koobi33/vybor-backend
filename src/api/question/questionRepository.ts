import {PlayersQuestion, Question} from '@/api/question/questionModel';

const pool = require('@/common/db');

export const questionRepository = {
  findAllAsync: async (id: number): Promise<Question[]> => {
    try {
      const query = `SELECT * FROM questions q
          LEFT JOIN players_question pq ON q.id = pq.question_id AND pq.player_id = $1
          WHERE pq.question_id IS NULL`;

      const queryResult = await pool.query(query, [id]);
      
      return queryResult.rows.map(row => {
        return {
          id: row.id,
          locale: row.label_locale,
          author: row.player_author_id,
          option1: {
            title: row.a1_locale,
            votes: row.a1_selection_count,
            img: row.a1_image_url,
          },
          option2: {
            title: row.a2_locale,
            votes: row.a2_selection_count,
            img: row.a2_image_url,
          }
        };
      });
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  findByIdAsync: async (id: number): Promise<Question | null> => {
    try {
      const query = 'select * from questions where id = $1';
      
      const result = await pool.query(query, [id]);
      
      return result.rows.length 
          ? {
            id: result.rows[0].id,
            locale: result.rows[0].label_locale,
            author: result.rows[0].player_author_id,
            option1: {
              title: result.rows[0].a1_locale,
              votes: result.rows[0].a1_selection_count,
              img: result.rows[0].a1_image_url,
            },
            option2: {
              title: result.rows[0].a2_locale,
              votes: result.rows[0].a2_selection_count,
              img: result.rows[0].a2_image_url,
            }
          } 
          : null;
    } catch (error) {
      console.error(`Error fetching question with ID ${id}:`, error);
      throw error;
    }
  },
  addOneAsync: async (question: Question): Promise<Question | null> => {
    try {
      const query = `
          insert into 
          questions(player_author_id, label_locale, a1_locale, a1_selection_count, a1_image_url, a2_locale, a2_selection_count, a2_image_url)
          values($1, $2, $3, $4, $5, $6, $7, $8) 
          returning *`;

      const result = await pool.query(query, [question.author, question.locale, question.option1.title, question.option1.votes, question.option1.img, question.option2.title, question.option2.votes, question.option2.img]);
      
      return result.rows.length
          ? {
            id: result.rows[0].id,
            locale: result.rows[0].label_locale,
            author: result.rows[0].player_author_id,
            option1: {
              title: result.rows[0].a1_locale,
              votes: result.rows[0].a1_selection_count,
              img: result.rows[0].a1_image_url,
            },
            option2: {
              title: result.rows[0].a2_locale,
              votes: result.rows[0].a2_selection_count,
              img: result.rows[0].a2_image_url,
            }
          }
          : null;
    } catch (error) {
      // Handling errors
      console.error('Error adding question:', error);
      throw error;
    }
  },
  updateOneAsync: async (question: Question): Promise<Question | null> => {
    try {
      const query = `
      update questions 
      set 
        label_locale = $1, 
        a1_locale = $2, 
        a1_selection_count = $3, 
        a1_image_url = $4, 
        a2_locale = $5, 
        a2_selection_count = $6, 
        a2_image_url = $7
      where 
        id = $8 
      returning *`;
      
      const result = await pool.query(query, [
        question.locale,
        question.option1.title,
        question.option1.votes,
        question.option1.img,
        question.option2.title,
        question.option2.votes,
        question.option2.img,
        question.id
      ]);
      
      return result.rows.length
          ? {
            id: result.rows[0].id,
            locale: result.rows[0].label_locale,
            author: result.rows[0].player_author_id,
            option1: {
              title: result.rows[0].a1_locale,
              votes: result.rows[0].a1_selection_count,
              img: result.rows[0].a1_image_url,
            },
            option2: {
              title: result.rows[0].a2_locale,
              votes: result.rows[0].a2_selection_count,
              img: result.rows[0].a2_image_url,
            }
          }
          : null;
    } catch (error) {
      // Handling errors
      console.error('Error updating question:', error);
      throw error;
    }
  },

   createNewPlayersQuestion: async (playerId: number, questionId: number): Promise<PlayersQuestion | null> => {
      try {
          const query = `
              insert into players_question(player_id, question_id)
              values ($1, $2)
              returning *`;

          const result = await pool.query(query, [playerId, questionId]);

          return result.rows.length
              ? {
                  playerId: result.rows[0].player_id,
                  questionId: result.rows[0].question_id,
              }
              : null;
      } catch (error) {
          // Handling errors
          console.error('Error adding players question:', error);
          throw error;
      }
  },
};
