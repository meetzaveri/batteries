import AppConstants from '../constants';

const initialAppState = {};

function getAppFunction(state = initialAppState, action) {
	switch (action.type) {
		case AppConstants.APP.FUNCTIONS.CREATE:
			return {
				...state,
				isCreating: true,
				success: false,
				error: false,
			};
		case AppConstants.APP.FUNCTIONS.CREATE_SUCCESS:
			return {
				isCreating: false,
				success: true,
				error: false,
				results: [...(state.results || []), { enabled: true, function: action.payload }],
			};
		case AppConstants.APP.FUNCTIONS.CREATE_ERROR:
			return {
				...state,
				isCreating: false,
				success: false,
				error: action.error && action.error.message,
			};
		case AppConstants.APP.FUNCTIONS.GET:
			return {
				isFetching: true,
				success: false,
				error: false,
			};
		case AppConstants.APP.FUNCTIONS.GET_SUCCESS:
			return {
				isFetching: false,
				success: true,
				error: false,
				results: [...action.payload],
			};
		case AppConstants.APP.FUNCTIONS.GET_ERROR:
			return {
				isFetching: false,
				success: false,
				error: action.payload,
			};
		case AppConstants.APP.FUNCTIONS.UPDATE: {
			const updatedResults = state.results.map((item) => {
				if (item.function.service === action.payload.name) {
					const triggerUpdation = !!action.payload.isTrigger;

					return {
						...item,
						triggerUpdation,
						isToggling: !triggerUpdation,
					};
				}
				return item;
			});

			return {
				...state,
				results: updatedResults,
			};
		}
		case AppConstants.APP.FUNCTIONS.UPDATE_SUCCESS: {
			const updatedResults = state.results.map((item) => {
				if (item.function.service === action.meta.name) {
					return {
						...action.payload[action.meta.name],
						triggerUpdation: false,
						isToggling: false,
						error: null,
					};
				}
				return item;
			});

			return { ...state, results: updatedResults };
		}
		case AppConstants.APP.FUNCTIONS.UPDATE_ERROR: {
			const updatedResults = state.results.map((item) => {
				if (item.function.service === action.meta.name) {
					return {
						...item,
						triggerUpdation: false,
						isToggling: false,
						error: action.error && action.error.message,
					};
				}
				return item;
			});

			return { ...state, results: updatedResults };
		}
		case AppConstants.APP.FUNCTIONS.INVOKE:
			return {
				...state,
				isInvoking: true,
				success: false,
				error: false,
				invokeResults: null,
			};
		case AppConstants.APP.FUNCTIONS.INVOKE_SUCCESS:
			return {
				...state,
				isInvoking: false,
				success: true,
				error: false,
				invokeResults: action.payload,
			};
		case AppConstants.APP.FUNCTIONS.INVOKE_ERROR:
			return {
				...state,
				isInvoking: false,
				success: false,
				error: action.error,
				invokeResults: null,
			};
		default:
			return state;
	}
}

export default getAppFunction;
