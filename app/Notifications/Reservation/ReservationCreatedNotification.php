<?php

namespace App\Notifications\Reservation;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Reservation;
use Illuminate\Support\Facades\Http;

class ReservationCreatedNotification extends Notification
{
    use Queueable;

    public function __construct(public Reservation $reservation) {}

    public function via($notifiable)
    {
        return ['database', 'mail', 'whatsapp', 'sms'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('New Reservation Created')
            ->line('A new reservation has been created.')
            ->action('View Reservation', url('/reservations/' . $this->reservation->id));
    }

    public function toArray($notifiable)
    {
        return [
            'reservation_id' => $this->reservation->id,
            'reservation_code' => $this->reservation->reservation_code,
            'message' => 'A new reservation has been created.',
        ];
    }

    public function toWhatsApp($notifiable)
    {
        return [
            'phone' => $notifiable->phone,
            'message' => 'A new reservation has been created. Reservation code: ' . $this->reservation->reservation_code,
        ];
    }

     public function toSms($notifiable)
    {
        $phone = $notifiable->phone;
        $message = 'A new reservation has been created. Code: ' . $this->reservation->reservation_code;

        // Example HTTP call to SMS provider (adjust URL and params as needed)
        Http::post('https://api.yoursmsprovider.com/send', [
            'to' => $phone,
            'message' => $message,
            // 'api_key' => config('services.sms.api_key'), // if needed
        ]);

        return [
            'phone' => $phone,
            'message' => $message,
        ];
    }
}
