import {SET_ALERT,REMOVE_ALERT} from '../actions/types';
const initialState=[]

export default function(state=initialState,action){
    const {payload,type} =action;
    switch(type){
        case SET_ALERT:
            return [...state,payload];
        case REMOVE_ALERT:
            return state.filter(x => x.id!==payload);
        default:
            return state;
        

    }
}