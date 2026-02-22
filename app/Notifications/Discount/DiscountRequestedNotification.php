<?php

namespace App\Notifications\Discount;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\ReservationDiscountRequest;

class DiscountRequestedNotification extends Notification
{
    use Queueable;

    public function __construct(public ReservationDiscountRequest $discountRequest) {}

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Discount Requested')
            ->line('A discount has been requested for reservation.')
            ->action('View Discount Request', url('/discount-requests/' . $this->discountRequest->id));
    }

    public function toArray($notifiable)
    {
        return [
            'discount_request_id' => $this->discountRequest->id,
            'reservation_id' => $this->discountRequest->reservation_id,
            'message' => 'A discount has been requested.',
        ];
    }
}
