//import { v4 as uuidv4 } from 'uuid';

import {Question, QuestionSchema} from '@/api/question/questionModel';

const pool = require('@/common/db');

export const questions: Question[] = [
  {
    id: 1,
    locale: 'ru',
    author: 0,
    option1: {
      title: 'Переродиться царем в древние времена',
      votes: 75,
      img: 'https://lh7-us.googleusercontent.com/sheets/APBGjhbNtOegczFJ80VATFp05huHcaT9dTOKuxJBnWdUkv0fy27-G3BeVgynE7i0ihMbz2OqDWZYBxaehOYO4_CXZ9VQL2t6pmJP0xkAfz4X5Qf1M4LFEbV2KeIoyb9R2gHcr-vBb5srK3FBXmp1s-ZAUBuhX443q9wzmfpyZ-LHEOVYZXMaeZV3zwAyM7sBKGC-ucgWZrEH4Y6qVPWyvNE-dPIY_BN8a5I0YyIB6uO-MwqDBdX8_PuAlw1Jehx8L6meV3xNnYlL2rCU350z_VSjgAKK2nQL5JRZ925nVeibR6l7tN_G4IlIvvFt7pl0N5M6wfdbeeZKbhOTneueoCanlc0xgfCRROdUQcljSYKUaSveFUs8LbBUZogr2RfxVPJCG3_yr9Vx0lxp0K0SFGJw9gzo9btR2UbkbMi2g2IN7Wqj_wPz6ZxSFI5oq-MZvrFjJBDSp3l2r1-CZ-jiPw_SXPM7T5WWPL9YpfRM_dssOA6D8OCH4JttaKqzL7o7-cGbp91dik9TSTr4z9pr5-XFHEOfvtj0RtgKjg1Q12YkUbyxRLwyaLRrfPkz61ixE_Wdv0nIr6bTzqUY_f6VPNi4QxSRuBOLBjwOzrEh_lUnlhJLZA2QRU-_QuZQoeq4MFYYxuRwLeCsPCP5R4rnHWkLDR1MhMAXhquTw973lCd3PPtdMdLxRspGx8qd66KfEi1wfYX6fdW_mgw2xwXO_dcoc2-H1zOVqOTqFPBdAQzqi-wmVNYT1vPr2ciL1PnXGmhdWJ0NEBn3HSY33tBrlOegx6bDGZDSAXbQywMuiswq_Flx2zhTTNFUkwpj5xp_z-AQbE1BkJEUTuaRHibJ_pHz124k3j0pmgW_KzaYDQeKaJazXcZczAmEKGDw5-kqe4s6Axofg9BkCBNFF4V019w5T8wzAvxiGzdetPDO5xgTl0aSFnwB3q_7qifoILTEVnlZxJG0zJXFVd81sjjBZ6Jdu50SQU88HyalpHD8vBWiT1Zbe4UwLBV2Hp1ld20Sd1o_0ELwtg9mFqBKEgeJxzbHTxl433IkmmCtPUIoPIbysyDf7YJnzXkWRdM=w156-h72',
    },
    option2: {
      title: 'Переродиться нищим в будущем',
      votes: 25,
      img: 'https://lh7-us.googleusercontent.com/sheets/APBGjhZIyRytg7cBYLCwR4W_DXhQzWpcNhSqvEIIekNiuukkxSPIVXy68fgYzS-HWO8QFnIzgn210mzu3MApl66FNhNWvKVdZAJJPU6fdZ8CT76c94F5_JI0LIKZtPWVTrzKBIoaGEkXpqTq0b41ZromFIVzr343uKSLhz228xgTYjKa1TgUvZognMK6BX5KKmAuu0twm6kyKHJ5UjdUhaxqeojP9hKA4aD9P6SdaxuhyKIcFYre6_r4vg8PNm1XFIcv9_xhw13DeZnbOaDUPYUbL0t_BNKdd-rdRKJMiMg0BGkyQbC27IUaorLfw-OsBfyy3bHJSCcfOyxgPfOoUQd6l1uis1s233605qC3a2UTodmvon7T2c3A8-_rTfxAO-Wzr6_R26R16sORei7iylt2OCJRKBXDblnElp6sc0rI0CKC3zfxF_DrR9uf37aznDjqaWTrkODQetDzV4QMuNNXXYpDsaCmoxMO8z78WyKTDCj5eW5fhPf1dJXWcKEuY5dSzTD3Q1cQa0U1UbTuI_Xb5-F7oBzqsLqCx24CopmfA8kHtj-EJ2bu0kHZTuSaxoo7IlTFMEcLNCc9deZAnm2w5N4KynOkdX5auAVZU2jKsUqMOPSyUV4kkX6S9lBWBo0QiWO506irTonJOxI9Wm_jqhE1-lumqbtapBTyjj8K7iNkUFN_leD1kcnHWrgHZ0_QjtX2sE22-djuOkC21ZxwW3pKeDxskZucqebgpe0qQqHaVBr7j-0l8T8_PsPH7twvYpDBfG9_jRfNmfqBaMMdB-M6QPYsP53gfsD0-jshDrBTikoGKm-Y_Y7fxoesx4WHXR5_wRzUpK7eAss5wWzloU9f_RztZbZZ8yun5FfeAmmnul_uyI1FI4YfvmkMBXdICj9YjDqITUYjV79swn4F74mAh_9WWxGrr_2mrRC0gdFaVDJPmLVghx3-zFi849JBOAHcRMdkbnrwguDvwHV4lCixnRvSX8aBac_nsOy8gFgRRI6dK_jJoyN2qL5wOuGUrlwGmDyi6qh-Ei7RGWmObjt1fBRi6UpVuDrstffj0T85DYdm1xdfHD0=w167-h72',
    },
  },
  {
    id: 2,
    locale: 'ru',
    author: 0,
    option1: {
      title: 'Курабье',
      votes: 60,
      img: 'https://lh7-us.googleusercontent.com/sheets/APBGjhbNtOegczFJ80VATFp05huHcaT9dTOKuxJBnWdUkv0fy27-G3BeVgynE7i0ihMbz2OqDWZYBxaehOYO4_CXZ9VQL2t6pmJP0xkAfz4X5Qf1M4LFEbV2KeIoyb9R2gHcr-vBb5srK3FBXmp1s-ZAUBuhX443q9wzmfpyZ-LHEOVYZXMaeZV3zwAyM7sBKGC-ucgWZrEH4Y6qVPWyvNE-dPIY_BN8a5I0YyIB6uO-MwqDBdX8_PuAlw1Jehx8L6meV3xNnYlL2rCU350z_VSjgAKK2nQL5JRZ925nVeibR6l7tN_G4IlIvvFt7pl0N5M6wfdbeeZKbhOTneueoCanlc0xgfCRROdUQcljSYKUaSveFUs8LbBUZogr2RfxVPJCG3_yr9Vx0lxp0K0SFGJw9gzo9btR2UbkbMi2g2IN7Wqj_wPz6ZxSFI5oq-MZvrFjJBDSp3l2r1-CZ-jiPw_SXPM7T5WWPL9YpfRM_dssOA6D8OCH4JttaKqzL7o7-cGbp91dik9TSTr4z9pr5-XFHEOfvtj0RtgKjg1Q12YkUbyxRLwyaLRrfPkz61ixE_Wdv0nIr6bTzqUY_f6VPNi4QxSRuBOLBjwOzrEh_lUnlhJLZA2QRU-_QuZQoeq4MFYYxuRwLeCsPCP5R4rnHWkLDR1MhMAXhquTw973lCd3PPtdMdLxRspGx8qd66KfEi1wfYX6fdW_mgw2xwXO_dcoc2-H1zOVqOTqFPBdAQzqi-wmVNYT1vPr2ciL1PnXGmhdWJ0NEBn3HSY33tBrlOegx6bDGZDSAXbQywMuiswq_Flx2zhTTNFUkwpj5xp_z-AQbE1BkJEUTuaRHibJ_pHz124k3j0pmgW_KzaYDQeKaJazXcZczAmEKGDw5-kqe4s6Axofg9BkCBNFF4V019w5T8wzAvxiGzdetPDO5xgTl0aSFnwB3q_7qifoILTEVnlZxJG0zJXFVd81sjjBZ6Jdu50SQU88HyalpHD8vBWiT1Zbe4UwLBV2Hp1ld20Sd1o_0ELwtg9mFqBKEgeJxzbHTxl433IkmmCtPUIoPIbysyDf7YJnzXkWRdM=w156-h72',
    },
    option2: {
      title: 'Птичье молоко',
      votes: 40,
      img: 'https://lh7-us.googleusercontent.com/sheets/APBGjhZIyRytg7cBYLCwR4W_DXhQzWpcNhSqvEIIekNiuukkxSPIVXy68fgYzS-HWO8QFnIzgn210mzu3MApl66FNhNWvKVdZAJJPU6fdZ8CT76c94F5_JI0LIKZtPWVTrzKBIoaGEkXpqTq0b41ZromFIVzr343uKSLhz228xgTYjKa1TgUvZognMK6BX5KKmAuu0twm6kyKHJ5UjdUhaxqeojP9hKA4aD9P6SdaxuhyKIcFYre6_r4vg8PNm1XFIcv9_xhw13DeZnbOaDUPYUbL0t_BNKdd-rdRKJMiMg0BGkyQbC27IUaorLfw-OsBfyy3bHJSCcfOyxgPfOoUQd6l1uis1s233605qC3a2UTodmvon7T2c3A8-_rTfxAO-Wzr6_R26R16sORei7iylt2OCJRKBXDblnElp6sc0rI0CKC3zfxF_DrR9uf37aznDjqaWTrkODQetDzV4QMuNNXXYpDsaCmoxMO8z78WyKTDCj5eW5fhPf1dJXWcKEuY5dSzTD3Q1cQa0U1UbTuI_Xb5-F7oBzqsLqCx24CopmfA8kHtj-EJ2bu0kHZTuSaxoo7IlTFMEcLNCc9deZAnm2w5N4KynOkdX5auAVZU2jKsUqMOPSyUV4kkX6S9lBWBo0QiWO506irTonJOxI9Wm_jqhE1-lumqbtapBTyjj8K7iNkUFN_leD1kcnHWrgHZ0_QjtX2sE22-djuOkC21ZxwW3pKeDxskZucqebgpe0qQqHaVBr7j-0l8T8_PsPH7twvYpDBfG9_jRfNmfqBaMMdB-M6QPYsP53gfsD0-jshDrBTikoGKm-Y_Y7fxoesx4WHXR5_wRzUpK7eAss5wWzloU9f_RztZbZZ8yun5FfeAmmnul_uyI1FI4YfvmkMBXdICj9YjDqITUYjV79swn4F74mAh_9WWxGrr_2mrRC0gdFaVDJPmLVghx3-zFi849JBOAHcRMdkbnrwguDvwHV4lCixnRvSX8aBac_nsOy8gFgRRI6dK_jJoyN2qL5wOuGUrlwGmDyi6qh-Ei7RGWmObjt1fBRi6UpVuDrstffj0T85DYdm1xdfHD0=w167-h72',
    },
  },
  {
    id: 3,
    locale: 'ru',
    author: 0,
    option1: {
      title: 'Ананас',
      votes: 15,
      img: 'https://lh7-us.googleusercontent.com/sheets/APBGjhbNtOegczFJ80VATFp05huHcaT9dTOKuxJBnWdUkv0fy27-G3BeVgynE7i0ihMbz2OqDWZYBxaehOYO4_CXZ9VQL2t6pmJP0xkAfz4X5Qf1M4LFEbV2KeIoyb9R2gHcr-vBb5srK3FBXmp1s-ZAUBuhX443q9wzmfpyZ-LHEOVYZXMaeZV3zwAyM7sBKGC-ucgWZrEH4Y6qVPWyvNE-dPIY_BN8a5I0YyIB6uO-MwqDBdX8_PuAlw1Jehx8L6meV3xNnYlL2rCU350z_VSjgAKK2nQL5JRZ925nVeibR6l7tN_G4IlIvvFt7pl0N5M6wfdbeeZKbhOTneueoCanlc0xgfCRROdUQcljSYKUaSveFUs8LbBUZogr2RfxVPJCG3_yr9Vx0lxp0K0SFGJw9gzo9btR2UbkbMi2g2IN7Wqj_wPz6ZxSFI5oq-MZvrFjJBDSp3l2r1-CZ-jiPw_SXPM7T5WWPL9YpfRM_dssOA6D8OCH4JttaKqzL7o7-cGbp91dik9TSTr4z9pr5-XFHEOfvtj0RtgKjg1Q12YkUbyxRLwyaLRrfPkz61ixE_Wdv0nIr6bTzqUY_f6VPNi4QxSRuBOLBjwOzrEh_lUnlhJLZA2QRU-_QuZQoeq4MFYYxuRwLeCsPCP5R4rnHWkLDR1MhMAXhquTw973lCd3PPtdMdLxRspGx8qd66KfEi1wfYX6fdW_mgw2xwXO_dcoc2-H1zOVqOTqFPBdAQzqi-wmVNYT1vPr2ciL1PnXGmhdWJ0NEBn3HSY33tBrlOegx6bDGZDSAXbQywMuiswq_Flx2zhTTNFUkwpj5xp_z-AQbE1BkJEUTuaRHibJ_pHz124k3j0pmgW_KzaYDQeKaJazXcZczAmEKGDw5-kqe4s6Axofg9BkCBNFF4V019w5T8wzAvxiGzdetPDO5xgTl0aSFnwB3q_7qifoILTEVnlZxJG0zJXFVd81sjjBZ6Jdu50SQU88HyalpHD8vBWiT1Zbe4UwLBV2Hp1ld20Sd1o_0ELwtg9mFqBKEgeJxzbHTxl433IkmmCtPUIoPIbysyDf7YJnzXkWRdM=w156-h72',
    },
    option2: {
      title: 'Ганжубас',
      votes: 85,
      img: 'https://lh7-us.googleusercontent.com/sheets/APBGjhZIyRytg7cBYLCwR4W_DXhQzWpcNhSqvEIIekNiuukkxSPIVXy68fgYzS-HWO8QFnIzgn210mzu3MApl66FNhNWvKVdZAJJPU6fdZ8CT76c94F5_JI0LIKZtPWVTrzKBIoaGEkXpqTq0b41ZromFIVzr343uKSLhz228xgTYjKa1TgUvZognMK6BX5KKmAuu0twm6kyKHJ5UjdUhaxqeojP9hKA4aD9P6SdaxuhyKIcFYre6_r4vg8PNm1XFIcv9_xhw13DeZnbOaDUPYUbL0t_BNKdd-rdRKJMiMg0BGkyQbC27IUaorLfw-OsBfyy3bHJSCcfOyxgPfOoUQd6l1uis1s233605qC3a2UTodmvon7T2c3A8-_rTfxAO-Wzr6_R26R16sORei7iylt2OCJRKBXDblnElp6sc0rI0CKC3zfxF_DrR9uf37aznDjqaWTrkODQetDzV4QMuNNXXYpDsaCmoxMO8z78WyKTDCj5eW5fhPf1dJXWcKEuY5dSzTD3Q1cQa0U1UbTuI_Xb5-F7oBzqsLqCx24CopmfA8kHtj-EJ2bu0kHZTuSaxoo7IlTFMEcLNCc9deZAnm2w5N4KynOkdX5auAVZU2jKsUqMOPSyUV4kkX6S9lBWBo0QiWO506irTonJOxI9Wm_jqhE1-lumqbtapBTyjj8K7iNkUFN_leD1kcnHWrgHZ0_QjtX2sE22-djuOkC21ZxwW3pKeDxskZucqebgpe0qQqHaVBr7j-0l8T8_PsPH7twvYpDBfG9_jRfNmfqBaMMdB-M6QPYsP53gfsD0-jshDrBTikoGKm-Y_Y7fxoesx4WHXR5_wRzUpK7eAss5wWzloU9f_RztZbZZ8yun5FfeAmmnul_uyI1FI4YfvmkMBXdICj9YjDqITUYjV79swn4F74mAh_9WWxGrr_2mrRC0gdFaVDJPmLVghx3-zFi849JBOAHcRMdkbnrwguDvwHV4lCixnRvSX8aBac_nsOy8gFgRRI6dK_jJoyN2qL5wOuGUrlwGmDyi6qh-Ei7RGWmObjt1fBRi6UpVuDrstffj0T85DYdm1xdfHD0=w167-h72',
    },
    //createdAt: new Date(),
    //updatedAt: new Date(),
  },
];

export const questionRepository = {
  findAllAsync: async (): Promise<Question[]> => {
    //return questions;
    try {
      const query = 'select * from questions';

      const queryResult = await pool.query(query);

      const questions = queryResult.rows.map(row => ({
        id: row.id,
        author: row.player_author_id,
        locale: row.label_locale,
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
      }));

      questions.forEach(question => {
        QuestionSchema.parse(question);
      });
      
      return questions;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  findByIdAsync: async (id: string): Promise<Question | null> => {
    //return questions.find((question) => question.id === id) || null;
    try {
      const query = 'select * from questions where id = $1';
      
      const result = await pool.query(query, [id]);
      
      return result.rows.length ? result.rows[0] : null;
    } catch (error) {
      console.error(`Error fetching question with ID ${id}:`, error);
      throw error;
    }
  },
  addOneAsync: async (question: Question): Promise<Question | null> => {
    /*questions.push(question);
    return questions.find((el) => el.id === question.id) || null;*/
    try {
      const query = `
          insert into 
          questions(player_author_id, label_locale, a1_locale, a1_selection_count, a1_image_url, a2_locale, a2_selection_count, a2_image_url)
          values($1, $2, $3, $4, $5, $6, $7, $8) 
          returning *`;

      const result = await pool.query(query, [question.author, question.locale, question.option1.title, question.option1.votes, question.option1.img, question.option2.title, question.option2.votes, question.option2.img]);
      
      return result.rows.length ? result.rows[0] : null;
    } catch (error) {
      // Handling errors
      console.error('Error adding question:', error);
      throw error;
    }
  },
  updateOneAsync: async (question: Question): Promise<Question | null> => {
    /*questions.forEach((element, index) => {
      if (element.id === question.id) {
        questions[index] = question;
      }
    });
    return questions.find((el) => el.id === question.id) || null;*/
    try {
      // Query to update an existing question in the database
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

      // Using a Promise to execute the query with the provided question data
      const result = await pool.query(query, [
        question.locale,
        question.option1.title,
        question.option1.votes,
        question.option1.img,
        question.option1.title,
        question.option1.votes,
        question.option1.img,
        question.id
      ]);

      // If the question was successfully updated, return it
      // Otherwise, return null
      return result.rows.length ? result.rows[0] : null;
    } catch (error) {
      // Handling errors
      console.error('Error updating question:', error);
      throw error;
    }
  },
};
