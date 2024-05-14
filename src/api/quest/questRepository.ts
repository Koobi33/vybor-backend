import {Quest} from "@/api/quest/questModel";

const pool = require('@/common/db');

export const questRepository = {
    findAllAsync: async (id: number): Promise<Quest[]> => {
        try {
            const query = `SELECT *
                           FROM quests q
                                    LEFT JOIN players_quests pq ON q.quest_id = pq.quest_id AND pq.player_id = $1
                           WHERE pq.quest_id IS NOT NULL`;

            const queryResult = await pool.query(query, [id]);

            return queryResult.rows.map(row => {
                return {
                    questId: row.quest_id,
                    mechanic: row.mechanic,
                    type: row.type,
                    progress: row.progress,
                    maxProgress: row.max_progress,
                    nextUpdate: row.update_time,
                    reward: row.reward,
                    isRewarded: row.is_rewarded,
                    params: row.params as object, 
                };
            });
        } catch (error) {
            console.error('Error fetching quests:', error);
            throw error;
        }
    },

    updateProgressAsync: async (questId: number, playerId: number, newProgress: number): Promise<boolean> => {
        try {
            const query = `
                update players_quests
                set
                    progress = $1
                where 
                    quest_id = $2 and player_id = $3 and progress < $1
                returning *`;

            const queryResult = await pool.query(query, [
                newProgress,
                questId,
                playerId
            ]);

            return !!queryResult.rows.length;
        } catch (error) {
            console.error('Error fetching quests:', error);
            throw error;
        }
    },

    setRewardedAsync: async (questId: number, playerId: number): Promise<number | null> => {
        try {
            const query = `
                with rewarded_players as (
                    update players_quests pq
                    set is_rewarded = true
                    from quests q
                    where pq.quest_id = q.quest_id
                        and pq.progress >= q.max_progress
                        and pq.is_rewarded = false
                        and pq.player_id = $1
                        and pq.quest_id = $2
                    returning pq.player_id, q.reward
                )
                update players p
                set score = score + rp.reward
                from rewarded_players rp
                where p.id = rp.player_id
                returning *;
            `;

            const queryResult = await pool.query(query, [
                playerId,
                questId
            ]);

            return queryResult.rows.length ? queryResult.rows[0].score : null;
        } catch (error) {
            console.error('Error fetching quests:', error);
            throw error;
        }
    },
}