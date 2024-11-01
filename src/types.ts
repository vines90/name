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
  nameLength: 1 | 2;
  generation: string;
  mbti: string;
}

export interface CardConfig {
  icon: JSX.Element;
  title: string;
  description: string;
  gradient: string;
}

export interface NameData {
  formal: string;
  meaning: string;
  nickname: string;
  english: string;
  origin: {
    fiveElements: string;
    allusion: string;
    implication: string;
  };
}

export interface PaymentPlan {
  id: string;
  price: number;
  viewCount: number | 'unlimited';
  description: string;
}

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: PaymentPlan) => void;
}