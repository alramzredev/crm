<?php

namespace App\Enums;

enum ReservationStatus: string
{
    case DRAFT = 'draft';
    case ACTIVE = 'active';
    case CONFIRMED = 'confirmed';
    case EXPIRED = 'expired';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match($this) {
            self::DRAFT => 'Draft',
            self::ACTIVE => 'Active',
            self::CONFIRMED => 'Confirmed',
            self::EXPIRED => 'Expired',
            self::CANCELLED => 'Cancelled',
        };
    }
}
