import axios from 'axios';

const loadItems = () => {
    return dispatch => {
        return axios.get("http://localhost:3001/items")
            .then(response => {
                console.log(response.data);
                dispatch({ type: "ACTION_TYPE", item: response.data });
            });
    };
};

const actionFunction = (data) => {
    return { type: "ACTION_TYPE", data };
};

export { loadItems, actionFunction };