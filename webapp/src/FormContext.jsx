import React, { createContext, useContext, useReducer } from 'react';
import { initFormState } from './initialStates';

const initialState = {
  formState: initFormState,
  formSubmissions: [],
  counts: {},
};

const FormContext = createContext();

export const useFormContext = () => useContext(FormContext);

const formReducer = (state, action) => {
  switch (action.type) {
    case 'SUBMIT_FORM':
      return {
        ...state,
        formSubmissions: [...state.formSubmissions, action.payload.formState],
      };
    case 'UPDATE_COUNT':
      return {
        ...state,
        counts: {
          ...state.counts,
          [action.payload.key]: (state.counts[action.payload.key] || 0) + 1,
        },
      };
    default:
      return state;
  }
};
export const FormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const submitForm = (formState) => {
    const selectedValues = Object.values(formState).map((field) => field.value);
    const key = selectedValues.join('-');

    dispatch({
      type: 'SUBMIT_FORM',
      payload: {
        formState,
        key, // Remove this line
      },
    });

    dispatch({
      type: 'UPDATE_COUNT',
      payload: {
        key,
      },
    });
  };

  return (
    <FormContext.Provider value={{ state, submitForm }}>
      {children}
    </FormContext.Provider>
  );
};
