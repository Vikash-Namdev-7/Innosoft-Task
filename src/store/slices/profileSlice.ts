import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PersonalInfoState {
  username: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  otp: string;
  email: string;
  dialCode: string;
  country: string;
}

export interface PasswordState {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  showOldPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
}

export interface ProfileFeedback {
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface ProfileState {
  activeTab: 'personal' | 'password';
  personalInfo: PersonalInfoState;
  password: PasswordState;
  feedback: ProfileFeedback | null;
  isLoading: boolean;
}

const initialPersonalInfo: PersonalInfoState = {
  username: '',
  firstname: '',
  lastname: '',
  phoneNumber: '',
  otp: '',
  email: '',
  dialCode: '+91',
  country: 'India',
};

const initialPassword: PasswordState = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
  showOldPassword: false,
  showNewPassword: false,
  showConfirmPassword: false,
};

const initialState: ProfileState = {
  activeTab: 'personal',
  personalInfo: initialPersonalInfo,
  password: initialPassword,
  feedback: null,
  isLoading: false,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<'personal' | 'password'>) => {
      state.activeTab = action.payload;
    },

    setPersonalField: (
      state,
      action: PayloadAction<{
        field: keyof PersonalInfoState;
        value: string;
      }>
    ) => {
      const { field, value } = action.payload;
      state.personalInfo[field] = value;
    },

    setPersonalInfo: (
      state,
      action: PayloadAction<Partial<PersonalInfoState>>
    ) => {
      state.personalInfo = {
        ...state.personalInfo,
        ...action.payload,
      };
    },

    setPasswordField: (
      state,
      action: PayloadAction<{
        field: 'oldPassword' | 'newPassword' | 'confirmPassword';
        value: string;
      }>
    ) => {
      const { field, value } = action.payload;
      state.password[field] = value;
    },

    togglePasswordVisibility: (
      state,
      action: PayloadAction<'old' | 'new' | 'confirm'>
    ) => {
      if (action.payload === 'old') {
        state.password.showOldPassword = !state.password.showOldPassword;
      } else if (action.payload === 'new') {
        state.password.showNewPassword = !state.password.showNewPassword;
      } else if (action.payload === 'confirm') {
        state.password.showConfirmPassword = !state.password.showConfirmPassword;
      }
    },

    resetPersonalForm: (state) => {
      state.personalInfo.firstname = '';
      state.personalInfo.lastname = '';
      state.personalInfo.phoneNumber = '';
      state.personalInfo.otp = '';
      state.personalInfo.email = '';
      state.feedback = {
        message: 'Personal info fields have been reset.',
        type: 'info',
      };
    },

    resetPasswordForm: (state) => {
      state.password.oldPassword = '';
      state.password.newPassword = '';
      state.password.confirmPassword = '';
      state.feedback = {
        message: 'Password fields have been reset.',
        type: 'info',
      };
    },

    sendOtp: (state) => {
      if (!state.personalInfo.phoneNumber.trim()) {
        state.feedback = {
          message: 'Please enter a valid phone number first.',
          type: 'error',
        };
        return;
      }
      state.feedback = {
        message: 'OTP sent successfully to your phone number!',
        type: 'success',
      };
    },

    savePersonalInfo: (state) => {
      state.feedback = {
        message: 'Profile changes saved successfully!',
        type: 'success',
      };
    },

    updatePassword: (state) => {
      const { oldPassword, newPassword, confirmPassword } = state.password;
      if (!oldPassword || !newPassword || !confirmPassword) {
        state.feedback = {
          message: 'Please fill in all password fields.',
          type: 'error',
        };
        return;
      }
      if (newPassword !== confirmPassword) {
        state.feedback = {
          message: 'New Password and Confirm Password do not match.',
          type: 'error',
        };
        return;
      }
      state.password.oldPassword = '';
      state.password.newPassword = '';
      state.password.confirmPassword = '';
      state.feedback = {
        message: 'Password updated successfully!',
        type: 'success',
      };
    },

    setFeedback: (state, action: PayloadAction<ProfileFeedback | null>) => {
      state.feedback = action.payload;
    },

    clearFeedback: (state) => {
      state.feedback = null;
    },
  },
});

export const {
  setActiveTab,
  setPersonalField,
  setPersonalInfo,
  setPasswordField,
  togglePasswordVisibility,
  resetPersonalForm,
  resetPasswordForm,
  sendOtp,
  savePersonalInfo,
  updatePassword,
  setFeedback,
  clearFeedback,
} = profileSlice.actions;

export default profileSlice.reducer;

