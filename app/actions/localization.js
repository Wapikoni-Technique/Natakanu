import { createAction } from 'redux-actions';

export const LOCALIZATION_LANGUAGE_CHANGED = "LOCALIZATION_LANGUAGE_CHANGED"

export const changeLanguage = createAction(LOCALIZATION_LANGUAGE_CHANGED, (language) => {
	return  {
		language
	}
})
