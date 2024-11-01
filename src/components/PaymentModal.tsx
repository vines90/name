import React from 'react';
import { PaymentPlan, PaymentModalProps } from '../types';

const PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: 'basic',
    price: 20,
    viewCount: 20,
    description: '解锁20次名字查看'
  },
  {
    id: 'premium',
    price: 50,
    viewCount: 70,
    description: '解锁70次名字查看'
  },
  {
    id: 'unlimited',
    price: 100,
    viewCount: 'unlimited',
    description: '无限次查看名字'
  }
];

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSelectPlan }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">解锁更多名字</h3>
          <p className="text-gray-600 mt-2">选择合适的套餐以继续查看更多名字解读</p>
        </div>

        <div className="space-y-4">
          {PAYMENT_PLANS.map((plan) => (
            <div
              key={plan.id}
              className="border rounded-lg p-4 hover:border-purple-500 cursor-pointer transition-colors"
              onClick={() => onSelectPlan(plan)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-lg">¥{plan.price}</h4>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                  选择
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full text-gray-600 hover:text-gray-800"
        >
          暂不需要
        </button>
      </div>
    </div>
  );
};

export default PaymentModal; 