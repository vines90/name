export type NameType = 'formal' | 'nickname' | 'english';

export interface UserInputs {
  gender: 'male' | 'female' | 'neutral';
  birthYear: number;
  surname: string;
  fatherName: string;
  motherName: string;
  preferredElements: string[];
  desiredProfession: string;
  nameInspiration: string;
}

export interface CardConfig {
  icon: JSX.Element;
  title: string;
  description: string;
  gradient: string;
}