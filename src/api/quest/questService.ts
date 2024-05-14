import {ResponseStatus, ServiceResponse} from "@/common/models/serviceResponse";
import {GetQuestRewardResponse, Quest} from "@/api/quest/questModel";
import {logger} from "@/server";
import {StatusCodes} from "http-status-codes";
import {userRepository} from "@/api/user/userRepository";
import {questRepository} from "@/api/quest/questRepository";

export const questService = {

    findAll: async (playerId: number): Promise<ServiceResponse<Quest[] | null>> => {
        try{
            const player = await userRepository.findByPlayerIdAsync(playerId);
            if (!player) {
                return new ServiceResponse(ResponseStatus.Failed, 'Player not found', null, StatusCodes.NOT_FOUND);
            }
            
            const result = await questRepository.findAllAsync(playerId)
            if (!result) {
                return new ServiceResponse(ResponseStatus.Failed, 'Quests not found', null, StatusCodes.NOT_FOUND);
            }

            return new ServiceResponse<Quest[]>(
                ResponseStatus.Success,
                'quests found ' + result.length,
                result,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = `Error finding all quests for player $${playerId}: $${(ex as Error).message}`;
            logger.error(errorMessage);
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    },

    updateOne: async (playerId: number, questId: number, newProgress: number): Promise<ServiceResponse<Quest[] | null>> => {
        try{
            const player = await userRepository.findByPlayerIdAsync(playerId);
            if (!player) {
                return new ServiceResponse(ResponseStatus.Failed, 'Player not found', null, StatusCodes.NOT_FOUND);
            }

            const updateResult = await questRepository.updateProgressAsync(questId, playerId, newProgress);
            if (!updateResult) {
                return new ServiceResponse(ResponseStatus.Failed, 'Can not update quest', null, StatusCodes.NOT_FOUND);
            }
            
            const result = await questRepository.findAllAsync(playerId)
            if (!result) {
                return new ServiceResponse(ResponseStatus.Failed, 'Quests not found', null, StatusCodes.NOT_FOUND);
            }

            return new ServiceResponse<Quest[]>(
                ResponseStatus.Success,
                'quests found ' + result.length,
                result,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = `Error finding all quests for user $${playerId}: $${(ex as Error).message}`;
            logger.error(errorMessage);
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    },

    getReward: async (playerId: number, questId: number): Promise<ServiceResponse<GetQuestRewardResponse | null>> => {
        try{
            const player = await userRepository.findByPlayerIdAsync(playerId);
            if (!player) {
                return new ServiceResponse(ResponseStatus.Failed, 'Player not found', null, StatusCodes.NOT_FOUND);
            }

            const newPlayerScoreResult = await questRepository.setRewardedAsync(questId, playerId);
            if (!newPlayerScoreResult) {
                return new ServiceResponse(ResponseStatus.Failed, 'Can not get reward', null, StatusCodes.NOT_FOUND);
            }

            const result = await questRepository.findAllAsync(playerId)
            if (!result) {
                return new ServiceResponse(ResponseStatus.Failed, 'Quests not found', null, StatusCodes.NOT_FOUND);
            }

            return new ServiceResponse<GetQuestRewardResponse>(
                ResponseStatus.Success,
                'quests found ' + result.length,
                {
                    quests: result,
                    newPlayerScore: newPlayerScoreResult
                },
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = `Error finding all quests for user $${playerId}: $${(ex as Error).message}`;
            logger.error(errorMessage);
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    },
}