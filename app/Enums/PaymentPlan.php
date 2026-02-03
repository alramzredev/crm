<?php

namespace App\Enums;

enum PaymentPlan: string
{
    case CASH = 'cash';
    case INSTALLMENT = 'installment';
    case MORTGAGE = 'mortgage';

    public function label(): string
    {
        return match($this) {
            self::CASH => 'Cash',
            self::INSTALLMENT => 'Installment',
            self::MORTGAGE => 'Mortgage',
        };
    }
}
