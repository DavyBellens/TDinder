import swipeDb from '../domain/data-access/swipe.db';
import { Swipe } from '../domain/model/swipe';
import { AuthenticatedToken, SwipeInput, SwipeResponse } from '../types';
import matchService from './match.service';

const createSwipe = async (swipeInput: SwipeInput, auth: AuthenticatedToken): Promise<SwipeResponse> => {
    const id = auth.id as unknown as number;
    const { swipeeId, direction } = swipeInput;
    Swipe.validate(id, swipeeId, direction);
    if (await swipeDb.getSwipeByIds(id, swipeeId)) throw new Error('You already swiped this person');
    const isMatch = await swipeDb.getSwipeByIds(swipeeId, id);
    if (isMatch) {
        await swipeDb.createSwipe(id, swipeeId, direction);
        return { object: await matchService.match(id, swipeeId, auth), isMatch: true };
    } else {
        return { object: await swipeDb.createSwipe(id, swipeeId, direction), isMatch: false };
    }
};

const getAllSwipes = async (swiperId: number): Promise<Swipe[]> => {
    return await swipeDb.getAllSwipes(swiperId);
};

const getSwipeByIds = async (swiperId: number, swipeeId: number): Promise<Swipe> => {
    return await swipeDb.getSwipeByIds(swiperId, swipeeId);
};

export default { createSwipe, getAllSwipes, getSwipeByIds };
